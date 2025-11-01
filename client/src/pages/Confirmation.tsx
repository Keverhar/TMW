import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Calendar, Mail, Phone, Heart, DollarSign, LogOut } from "lucide-react";
import type { WeddingComposer } from "@shared/schema";

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/confirmation/:composerId");
  const composerId = params?.composerId;

  const handleLogoutAndHome = () => {
    localStorage.removeItem("user");
    setLocation("/");
  };

  const { data: composer, isLoading } = useQuery<WeddingComposer>({
    queryKey: ["/api/wedding-composers", composerId],
    enabled: !!composerId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <CardTitle className="font-serif text-2xl">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Retrieving your booking details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-serif mb-2">Congratulations!</h1>
          <p className="text-xl text-muted-foreground">Your wedding celebration is officially booked!</p>
        </div>

        {composer && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Confirmation</CardTitle>
                <CardDescription>Your wedding is reserved and confirmed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Event Type</p>
                    <p className="text-sm text-muted-foreground">
                      {composer.eventType === 'modest-elopement' ? 'Modest Elopement' :
                       composer.eventType === 'vow-renewal' ? 'Vow Renewal' :
                       composer.eventType === 'modest-wedding' ? 'Modest Wedding' :
                       composer.eventType === 'other' ? 'Other Event' :
                       composer.eventType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Event Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {composer.preferredDate || "To be determined"} at {composer.timeSlot || "TBD"}
                      {(composer.eventType === 'modest-wedding' || composer.eventType === 'other') && 
                        " (Bride can arrive 30 minutes before the start time.)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="font-medium mb-2">Payment Summary</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Package:</span>
                        <span className="text-foreground">${((composer.basePackagePrice || 0) / 100).toFixed(2)}</span>
                      </div>
                      {composer.photoBookAddon && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Photo Book ({composer.photoBookQuantity || 1}x):</span>
                          <span className="text-foreground">${(((composer.photoBookPrice || 0) * (composer.photoBookQuantity || 1)) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {composer.extraTimeAddon && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Extra Time:</span>
                          <span className="text-foreground">${((composer.extraTimePrice || 0) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {composer.byobBarAddon && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">BYOB Bar:</span>
                          <span className="text-foreground">${((composer.byobBarPrice || 0) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {composer.rehearsalAddon && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rehearsal:</span>
                          <span className="text-foreground">${((composer.rehearsalPrice || 0) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {(composer.paymentMethod === 'ach' && (composer.achDiscountAmount || 0) > 0) && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>ACH Discount:</span>
                          <span>-${((composer.achDiscountAmount || 0) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      {(composer.paymentMethod === 'affirm' && (composer.affirmDiscountAmount || 0) > 0) && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Affirm Discount:</span>
                          <span>-${((composer.affirmDiscountAmount || 0) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-1 mt-1"></div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="text-foreground">${((composer.totalPrice || 0) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span className="text-foreground">$0.00</span>
                      </div>
                      <div className="border-t pt-1 mt-1"></div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${((composer.totalPrice || 0) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid:</span>
                        <span className="text-foreground">${((composer.amountPaid || 0) / 100).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-1 mt-1"></div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Balance Due:</span>
                        <span>${(((composer.totalPrice || 0) - (composer.amountPaid || 0)) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      Sent to {composer.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {composer.customerPhone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
                <CardDescription>Here's what to expect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Check Your Email</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a detailed confirmation email with all your wedding composer selections.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Edit Anytime</p>
                    <p className="text-sm text-muted-foreground">
                      You can update your selections in the Wedding Composer up until 7 days before your event.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">We'll Handle the Rest</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will begin preparing everything for your special day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 items-center pt-6">
              <Button onClick={() => {
                // Force reload by navigating to home first, then to composer
                window.location.href = "/composer";
              }} size="lg" className="w-full max-w-md" data-testid="button-return-composer">
                Return to Wedding Composer
              </Button>
              <Button onClick={handleLogoutAndHome} variant="outline" size="lg" className="w-full max-w-md" data-testid="button-logout-home">
                <LogOut className="h-4 w-4 mr-2" />
                Logout and Return Home
              </Button>
            </div>
          </div>
        )}

        {!composer && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Confirmed!</CardTitle>
              <CardDescription>Your payment has been successfully processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Thank you for booking with The Wedding Composer. You'll receive a confirmation email shortly with all the details of your celebration.
              </p>
              <Button onClick={() => setLocation("/")} className="w-full" data-testid="button-return-home">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
