import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertWeddingComposerSchema, insertUserSchema } from "@shared/schema";
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
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Get user's wedding composers
      const composers = await storage.getWeddingComposersByUserId(user.id);
      const latestComposer = composers.length > 0 
        ? composers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
        : null;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        composer: latestComposer
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

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

  // Wedding Composer Routes
  
  // Create a new wedding composer (draft)
  app.post("/api/wedding-composers", async (req, res) => {
    try {
      const validatedData = insertWeddingComposerSchema.parse(req.body);
      const composer = await storage.createWeddingComposer(validatedData);
      res.json(composer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all wedding composers for a user
  app.get("/api/wedding-composers/by-user", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const composers = await storage.getWeddingComposersByUserId(userId);
      res.json(composers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a wedding composer by ID
  app.get("/api/wedding-composers/:id", async (req, res) => {
    try {
      const composer = await storage.getWeddingComposer(req.params.id);
      if (!composer) {
        return res.status(404).json({ message: "Wedding composer not found" });
      }
      res.json(composer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update a wedding composer (save progress)
  app.patch("/api/wedding-composers/:id", async (req, res) => {
    try {
      const composer = await storage.updateWeddingComposer(req.params.id, req.body);
      if (!composer) {
        return res.status(404).json({ message: "Wedding composer not found" });
      }
      res.json(composer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Availability Routes - Prevent double-booking
  
  // Get all booked date/time slots
  app.get("/api/availability/booked-slots", async (req, res) => {
    try {
      const bookedSlots = await storage.getBookedDateTimeSlots();
      res.json(bookedSlots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Check if a specific date/time slot is available
  app.post("/api/availability/check", async (req, res) => {
    try {
      const { date, timeSlot, composerId } = req.body;
      
      if (!date || !timeSlot) {
        return res.status(400).json({ message: "Date and timeSlot are required" });
      }
      
      const isAvailable = await storage.checkDateTimeAvailability(date, timeSlot, composerId);
      res.json({ available: isAvailable });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create Stripe checkout session for a wedding composer
  app.post("/api/wedding-composers/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    try {
      const { composerId } = req.body;
      
      const composer = await storage.getWeddingComposer(composerId);
      if (!composer) {
        return res.status(404).json({ message: "Wedding composer not found" });
      }

      // Check if date/time slot is still available (prevent double-booking)
      if (composer.preferredDate && composer.timeSlot) {
        const isAvailable = await storage.checkDateTimeAvailability(
          composer.preferredDate,
          composer.timeSlot,
          composerId
        );
        
        if (!isAvailable) {
          return res.status(409).json({
            message: "This date and time slot has already been booked. Please select a different date or time."
          });
        }
      }

      const eventDate = composer.preferredDate || "TBD";
      const eventTime = composer.timeSlot || "TBD";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${composer.eventType} Package`,
                description: `The Wedding Composer - ${eventDate} at ${eventTime}`,
              },
              unit_amount: composer.totalPrice,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}&composer_id=${composerId}`,
        cancel_url: `${req.headers.origin}/composer?canceled=true`,
        customer_email: composer.customerEmail,
        metadata: {
          composerId: composer.id,
        },
      });

      await storage.updateWeddingComposerPaymentStatus(
        composerId,
        'pending',
        session.id
      );

      res.json({ sessionId: session.id });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Webhook for wedding composer payments
  app.post("/api/wedding-composers/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    const sig = req.headers['stripe-signature'];
    
    let event;
    try {
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
      const composerId = session.metadata?.composerId;

      if (composerId) {
        await storage.updateWeddingComposerPaymentStatus(
          composerId,
          'completed',
          session.id,
          session.payment_intent as string
        );
      }
    }

    res.json({ received: true });
  });

  // Verify payment status for a wedding composer
  app.get("/api/wedding-composers/verify-payment/:sessionId", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not configured" });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      
      if (session.metadata?.composerId) {
        const composer = await storage.getWeddingComposer(session.metadata.composerId);
        
        if (composer && session.payment_status === 'paid') {
          await storage.updateWeddingComposerPaymentStatus(
            composer.id,
            'completed',
            session.id,
            session.payment_intent as string
          );
          
          res.json({ 
            status: 'success',
            composer: await storage.getWeddingComposer(composer.id)
          });
        } else {
          res.json({ status: 'pending' });
        }
      } else {
        res.status(404).json({ message: 'Wedding composer not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
