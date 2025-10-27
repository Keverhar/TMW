import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@shared/schema";

export default function Confirmation() {
  const [, navigate] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const canceled = searchParams.get('canceled');

  const { data: verificationData, isLoading } = useQuery<{ status: string; booking?: Booking }>({
    queryKey: ['/api/verify-payment', sessionId],
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'pending' ? 2000 : false;
    },
  });

  useEffect(() => {
    if (!sessionId && !canceled) {
      navigate('/booking');
    }
  }, [sessionId, canceled, navigate]);

  if (canceled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <XCircle className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">Booking Canceled</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              Your booking was canceled. No charges were made to your card.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/booking">
                <Button className="w-full" data-testid="button-try-again">
                  Try Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full" data-testid="button-home">
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || verificationData?.status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <CardTitle className="font-serif text-2xl">Processing Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const booking = verificationData?.booking;

  if (!booking || verificationData?.status !== 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              We couldn't process your payment. Please try again or contact us for assistance.
            </p>
            <Link href="/booking">
              <Button className="w-full" data-testid="button-try-again">
                Try Again
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto py-12">
        <Card>
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif text-3xl md:text-4xl mb-2">
              Booking Confirmed!
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Your wedding ceremony has been successfully booked
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-semibold mb-4">Booking Details</h3>
                <div className="grid gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-medium font-mono text-sm" data-testid="text-booking-id">
                      {booking.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-medium">{booking.weddingType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {new Date(booking.weddingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {booking.weddingTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-semibold text-lg text-primary" data-testid="text-total-paid">
                      ${(booking.totalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-6 space-y-2">
                <h4 className="font-semibold">What's Next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ A confirmation email has been sent to {booking.customerEmail}</li>
                  <li>✓ We'll contact you within 24 hours to finalize details</li>
                  <li>✓ Save this booking ID for your records</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full" data-testid="button-home">
                    Return Home
                  </Button>
                </Link>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-print"
                >
                  Print Confirmation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
