import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import Stripe from "stripe";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not configured. Payment processing will not work.');
  console.warn('   Set STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY to enable payments.');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get a booking by ID
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create Stripe checkout session for a booking
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    try {
      const { bookingId } = req.body;
      
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${booking.weddingType} Wedding Package`,
                description: `The Modest Wedding - ${new Date(booking.weddingDate).toLocaleDateString()} at ${booking.weddingTime}`,
              },
              unit_amount: booking.totalPrice, // Already in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url: `${req.headers.origin}/booking?canceled=true`,
        customer_email: booking.customerEmail,
        metadata: {
          bookingId: booking.id,
        },
      });

      // Update booking with Stripe session ID
      await storage.updateBookingPaymentStatus(
        bookingId,
        'pending',
        session.id
      );

      res.json({ sessionId: session.id });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Webhook to handle Stripe payment completion
  // Note: /api/webhook uses express.raw middleware (configured in server/index.ts)
  app.post("/api/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    const sig = req.headers['stripe-signature'];
    
    let event;
    try {
      // req.body is a Buffer thanks to express.raw middleware
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await storage.updateBookingPaymentStatus(
          bookingId,
          'completed',
          session.id,
          session.payment_intent as string
        );
      }
    }

    res.json({ received: true });
  });

  // Verify payment status for a booking
  app.get("/api/verify-payment/:sessionId", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      
      if (session.metadata?.bookingId) {
        const booking = await storage.getBooking(session.metadata.bookingId);
        
        if (booking && session.payment_status === 'paid') {
          await storage.updateBookingPaymentStatus(
            booking.id,
            'completed',
            session.id,
            session.payment_intent as string
          );
          
          res.json({ 
            status: 'success',
            booking: await storage.getBooking(booking.id)
          });
        } else {
          res.json({ status: 'pending' });
        }
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
