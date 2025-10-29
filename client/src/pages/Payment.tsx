import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover, SiPaypal } from "react-icons/si";
import type { WeddingComposer } from "@shared/schema";

export default function Payment() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/payment/:composerId");
  const composerId = params?.composerId;
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "affirm">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: composer, isLoading } = useQuery<WeddingComposer>({
    queryKey: ["/api/wedding-composers", composerId],
    enabled: !!composerId,
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return;
      }

      const cleanedCardNumber = cardNumber.replace(/\s/g, "");
      if (cleanedCardNumber.length !== 16) {
        toast({
          title: "Invalid card number",
          description: "Card number must be 16 digits.",
          variant: "destructive",
        });
        return;
      }

      if (cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "CVV must be at least 3 digits.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment successful!",
        description: "Your wedding booking has been confirmed.",
      });
      setLocation(`/confirmation/${composerId}`);
    }, 2000);
  };

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

  if (!composer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Booking Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Unable to find your wedding booking details.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-return-home">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif mb-2">Secure Payment</h1>
          <p className="text-muted-foreground">Complete your wedding booking</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Your payment information is secure and encrypted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                      <div className="flex items-center space-x-2 p-3 border rounded-md hover-elevate">
                        <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <span>Credit or Debit Card</span>
                          </div>
                        </Label>
                        <div className="flex gap-2">
                          <SiVisa className="h-6 w-6 text-blue-600" />
                          <SiMastercard className="h-6 w-6 text-orange-600" />
                          <SiAmericanexpress className="h-6 w-6 text-blue-500" />
                          <SiDiscover className="h-6 w-6 text-orange-500" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-3 border rounded-md hover-elevate">
                        <RadioGroupItem value="paypal" id="paypal" data-testid="radio-paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer flex items-center gap-3">
                          <SiPaypal className="h-6 w-6 text-blue-600" />
                          <span>PayPal</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-3 border rounded-md hover-elevate">
                        <RadioGroupItem value="affirm" id="affirm" data-testid="radio-affirm" />
                        <Label htmlFor="affirm" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded">
                            affirm
                          </div>
                          <span className="text-sm text-muted-foreground">Pay over time</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          data-testid="input-card-number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          data-testid="input-card-name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            data-testid="input-expiry"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={handleCvvChange}
                            type="password"
                            data-testid="input-cvv"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="p-6 bg-muted rounded-md text-center space-y-2">
                      <SiPaypal className="h-12 w-12 mx-auto text-blue-600" />
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to PayPal to complete your payment
                      </p>
                    </div>
                  )}

                  {paymentMethod === "affirm" && (
                    <div className="p-6 bg-muted rounded-md text-center space-y-2">
                      <div className="px-4 py-2 bg-blue-600 text-white text-xl font-bold rounded inline-block">
                        affirm
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to Affirm to set up your payment plan
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                    data-testid="button-complete-payment"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${(composer.totalPrice / 100).toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Event Type</p>
                  <p className="text-sm text-muted-foreground">{composer.eventType}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {composer.preferredDate} at {composer.timeSlot}
                  </p>
                </div>

                {composer.ceremonyScript && (
                  <div>
                    <p className="text-sm font-medium">Ceremony Style</p>
                    <p className="text-sm text-muted-foreground">{composer.ceremonyScript}</p>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${(composer.totalPrice / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${(composer.totalPrice / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Secure SSL Encryption</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/composer")}
            data-testid="button-back-to-composer"
          >
            Back to Wedding Composer
          </Button>
        </div>
      </div>
    </div>
  );
}
