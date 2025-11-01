import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
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

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "affirm" | "ach" | undefined>(undefined);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: composer, isLoading } = useQuery<WeddingComposer>({
    queryKey: ["/api/wedding-composers", composerId],
    enabled: !!composerId,
  });

  // Handle payment method change and save to database
  const handlePaymentMethodChange = async (method: "card" | "paypal" | "affirm" | "ach") => {
    setPaymentMethod(method);
    
    // Save the payment method to the database immediately
    if (composerId) {
      try {
        const paymentMethodValue = method === 'card' ? 'credit_card' : method;
        await fetch(`/api/wedding-composers/${composerId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethod: paymentMethodValue }),
        });
        
        // Invalidate the query cache to refresh composer data
        queryClient.invalidateQueries({ queryKey: ["/api/wedding-composers", composerId] });
      } catch (error) {
        console.error('Error saving payment method:', error);
      }
    }
  };

  // Calculate balance due (total - amount already paid) with ACH or Affirm discount if applicable
  const calculateTotalPrice = () => {
    if (!composer) return 0;
    const balanceDue = composer.totalPrice - (composer.amountPaid || 0);
    const achDiscount = paymentMethod === 'ach' ? (composer.achDiscountAmount || 0) : 0;
    const affirmDiscount = paymentMethod === 'affirm' ? (composer.affirmDiscountAmount || 0) : 0;
    return balanceDue - achDiscount - affirmDiscount;
  };

  const displayTotal = calculateTotalPrice();

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

    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

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

    // Simulate payment processing and update payment status
    setTimeout(async () => {
      try {
        // Fetch the LATEST composer data to ensure amount_paid is current
        const latestResponse = await fetch(`/api/wedding-composers/${composerId}`);
        const latestComposer = await latestResponse.json();
        
        // Calculate discount amount from stored values
        const discountAmount = paymentMethod === 'ach' ? (latestComposer.achDiscountAmount || 0) : 
                              paymentMethod === 'affirm' ? (latestComposer.affirmDiscountAmount || 0) : 0;
        
        // Calculate the amount being paid (with discounts applied)
        const paymentAmount = displayTotal;
        const currentAmountPaid = latestComposer?.amountPaid || 0;
        const newAmountPaid = currentAmountPaid + paymentAmount;
        
        // Reduce total price by discount amount (so balance calculation remains correct)
        const currentTotalPrice = latestComposer?.totalPrice || 0;
        const newTotalPrice = currentTotalPrice - discountAmount;
        
        // Update payment status to completed, add to amount paid, and adjust total price for discount
        await fetch(`/api/wedding-composers/${composerId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentStatus: 'completed',
            amountPaid: newAmountPaid,
            totalPrice: newTotalPrice
          }),
        });
        
        toast({
          title: "Payment successful!",
          description: "Your wedding booking has been confirmed.",
        });
        setLocation(`/confirmation/${composerId}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Payment successful but there was an error updating your booking.",
          variant: "destructive",
        });
        setLocation(`/confirmation/${composerId}`);
      }
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
    <div className="min-h-screen bg-background">
      {/* Non-closeable placeholder notice */}
      <div className="fixed top-4 right-4 z-[100] max-w-xs" data-testid="notice-placeholder">
        <div className="bg-amber-500/90 dark:bg-amber-600/90 backdrop-blur-sm text-white p-4 rounded-md shadow-lg border-2 border-amber-600 dark:border-amber-500">
          <p className="text-sm font-semibold leading-tight">
            This is a placeholder page and does not process payments. Enter gibberish to view the results.
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold">The Wedding Composer</h2>
              <p className="text-sm text-muted-foreground">Secure Payment</p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-muted-foreground">Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
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
                    <RadioGroup value={paymentMethod} onValueChange={(value: any) => handlePaymentMethodChange(value)}>
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

                      <div className="flex items-start space-x-2 p-3 border rounded-md hover-elevate">
                        <RadioGroupItem value="affirm" id="affirm" data-testid="radio-affirm" className="mt-1" />
                        <Label htmlFor="affirm" className="flex-1 cursor-pointer">
                          <div className="mb-2">
                            <span className="font-semibold">Pay Over Time with Affirm</span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>- Flexible: split your $5,000 wedding into smaller monthly payments.</p>
                            <p>- Quick decision, no late fees, and clear terms.</p>
                            <p>- Trusted brand used by millions.</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2 p-3 border rounded-md hover-elevate">
                        <RadioGroupItem value="ach" id="ach" data-testid="radio-ach" className="mt-1" />
                        <Label htmlFor="ach" className="flex-1 cursor-pointer">
                          <div className="mb-2">
                            <span className="font-semibold">Pay by ACH (Bank Transfer)</span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>- Simple and secure: pay directly from your bank account using your routing and account number.</p>
                            <p>- Funds take 2–3 days to clear, but your date is secured once payment is received.</p>
                            <p className="font-medium text-foreground">- **Special savings: Receive a $50 discount on your wedding package when you choose ACH.**</p>
                          </div>
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

                  {paymentMethod === "ach" && (
                    <div className="p-6 bg-muted rounded-md space-y-4">
                      <p className="text-sm font-semibold text-center">Bank Account Information</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            placeholder="9 digits"
                            maxLength={9}
                            data-testid="input-routing-number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            placeholder="Account number"
                            data-testid="input-account-number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountName">Name on Account</Label>
                          <Input
                            id="accountName"
                            placeholder="Account holder name"
                            data-testid="input-account-name"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Your bank information is encrypted and secure. Payment will be processed within 2-3 business days.
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
                    ) : paymentMethod ? (
                      `Pay $${(displayTotal / 100).toFixed(2)}`
                    ) : (
                      "Select Payment Method"
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
                    <span>Package</span>
                    <span>${((composer.basePackagePrice || 0) / 100).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400" data-testid="row-payment-discount">
                    <span>{paymentMethod === 'ach' ? 'ACH' : paymentMethod === 'affirm' ? 'Affirm' : 'Payment'} Discount</span>
                    <span data-testid="text-payment-discount">{(paymentMethod === 'ach' ? (composer.achDiscountAmount || 0) : paymentMethod === 'affirm' ? (composer.affirmDiscountAmount || 0) : 0) > 0 ? '-' : ''}${((paymentMethod === 'ach' ? (composer.achDiscountAmount || 0) : paymentMethod === 'affirm' ? (composer.affirmDiscountAmount || 0) : 0) / 100).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="flex justify-between text-sm" data-testid="row-subtotal">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">${((composer.basePackagePrice || 0) / 100).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm" data-testid="row-tax">
                    <span>Tax</span>
                    <span data-testid="text-tax">$0.00</span>
                  </div>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="flex justify-between text-sm font-semibold" data-testid="row-total">
                    <span>Total</span>
                    <span data-testid="text-total">${(((composer.basePackagePrice || 0) - (paymentMethod === 'ach' ? (composer.achDiscountAmount || 0) : paymentMethod === 'affirm' ? (composer.affirmDiscountAmount || 0) : 0)) / 100).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm" data-testid="row-amount-paid">
                    <span>Amount Paid</span>
                    <span data-testid="text-amount-paid">${((composer.amountPaid || 0) / 100).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="flex justify-between text-sm" data-testid="row-balance-due">
                    <span>Balance Due</span>
                    <span data-testid="text-balance-due">${((composer.totalPrice - (composer.amountPaid || 0)) / 100).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Due Now</span>
                    <span className="text-primary">${(displayTotal / 100).toFixed(2)}</span>
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
