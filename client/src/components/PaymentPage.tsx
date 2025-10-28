import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentPageProps {
  totalAmount: number;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export default function PaymentPage({ totalAmount, onPaymentComplete, onBack }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'affirm'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold mb-2">Payment</h2>
        <p className="text-muted-foreground">Complete your booking securely</p>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-accent/50">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-2xl">Amount Due</CardTitle>
            <div className="text-3xl font-bold text-primary">
              ${(totalAmount / 100).toFixed(2)}
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Payment Method</CardTitle>
            <CardDescription>Choose how you'd like to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'affirm')}>
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate">
                <RadioGroupItem value="card" id="card" data-testid="radio-payment-card" />
                <div className="flex-1">
                  <Label htmlFor="card" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Credit or Debit Card</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, American Express, or Discover</p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate">
                <RadioGroupItem value="affirm" id="affirm" data-testid="radio-payment-affirm" />
                <div className="flex-1">
                  <Label htmlFor="affirm" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-[#0FA0EA]">affirm</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pay over time with flexible monthly payments
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">As low as ${((totalAmount / 100) / 12).toFixed(2)}/month at 0% APR</p>
                      <p className="text-muted-foreground">• No hidden fees</p>
                      <p className="text-muted-foreground">• Easy application process</p>
                      <p className="text-muted-foreground">• Instant decision</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {paymentMethod === 'affirm' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You'll be redirected to Affirm to complete your application and finalize your payment plan. 
                  Your booking will be confirmed once approved.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {paymentMethod === 'card' && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Card Information</CardTitle>
              <CardDescription>Enter your card details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                    data-testid="input-card-number"
                  />
                  <CreditCard className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                    data-testid="input-expiry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    required
                    data-testid="input-cvv"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="John Doe"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  required
                  data-testid="input-name-on-card"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            data-testid="button-back-to-review"
          >
            Back to Review
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isProcessing}
            data-testid="button-complete-payment"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>Complete Payment - ${(totalAmount / 100).toFixed(2)}</>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </form>
    </div>
  );
}
