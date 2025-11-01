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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'affirm' | 'ach'>('card');
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
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'affirm' | 'ach')}>
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
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate">
                <RadioGroupItem value="ach" id="ach" data-testid="radio-payment-ach" />
                <div className="flex-1">
                  <Label htmlFor="ach" className="cursor-pointer">
                    <div className="mb-2">
                      <span className="font-semibold">Pay by ACH (Bank Transfer)</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>- Simple and secure: pay directly from your bank account using your routing and account number.</p>
                      <p>- Funds take 2–3 days to clear, but your date is secured once payment is received.</p>
                      <p className="font-medium text-foreground">- Special savings: Receive a $100 discount on your wedding package when you choose ACH.</p>
                    </div>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate">
                <RadioGroupItem value="echeck" id="echeck" data-testid="radio-payment-echeck" />
                <div className="flex-1">
                  <Label htmlFor="echeck" className="cursor-pointer">
                    <div className="mb-2">
                      <span className="font-semibold">Pay by E-Check</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>- Electronic check payment processed directly from your bank account.</p>
                      <p>- Similar to ACH with secure verification and quick processing.</p>
                      <p className="font-medium text-foreground">- Special savings: Receive a $100 discount on your wedding package when you choose E-Check.</p>
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

            {paymentMethod === 'ach' && (
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
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Your bank information is encrypted and secure. Payment will be processed within 2-3 business days.
                  </AlertDescription>
                </Alert>
              </div>
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
