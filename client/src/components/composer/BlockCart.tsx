import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, FileText, Info, CreditCard } from "lucide-react";

interface BlockCartProps {
  eventType: string;
  basePackagePrice: number;
  photoBookAddon: boolean;
  photoBookQuantity: number;
  extraTimeAddon: boolean;
  byobBarAddon: boolean;
  rehearsalAddon: boolean;
  photoBookPrice: number;
  extraTimePrice: number;
  byobBarPrice: number;
  rehearsalPrice: number;
  paymentMethod: string;
  achDiscountAmount: number;
  affirmDiscountAmount: number;
  amountPaid: number;
  termsAccepted: boolean;
  onChange: (field: string, value: string | boolean | number) => void;
  preferredDate: string;
  timeSlot: string;
}

export default function BlockCart({
  eventType,
  basePackagePrice,
  photoBookAddon,
  photoBookQuantity,
  extraTimeAddon,
  byobBarAddon,
  rehearsalAddon,
  photoBookPrice,
  extraTimePrice,
  byobBarPrice,
  rehearsalPrice,
  paymentMethod,
  achDiscountAmount,
  affirmDiscountAmount,
  amountPaid,
  termsAccepted,
  onChange,
  preferredDate,
  timeSlot,
}: BlockCartProps) {
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  
  // Payment form state
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

  // Check if Extra Time addon is eligible (Saturday at 6:00 PM)
  const isExtraTimeEligible = () => {
    if (!preferredDate || !timeSlot) return false;
    const date = new Date(preferredDate + 'T12:00:00');
    const isSaturday = date.getDay() === 6;
    const is6PM = timeSlot === '6pm-9pm' || timeSlot === '6pm';
    return isSaturday && is6PM;
  };

  const addons = [
    { key: 'photoBookAddon', label: 'Photo Book', price: photoBookPrice, available: true, hasQuantity: true, enabled: true },
    { key: 'extraTimeAddon', label: 'Extra Time Block (Saturday 6PM only)', price: extraTimePrice, available: eventType === 'modest-wedding', hasQuantity: false, enabled: isExtraTimeEligible() },
    { key: 'byobBarAddon', label: 'BYOB Bar Setup', price: byobBarPrice, available: eventType === 'modest-wedding', hasQuantity: false, enabled: true },
    { key: 'rehearsalAddon', label: 'Rehearsal Hour', price: rehearsalPrice, available: true, hasQuantity: false, enabled: true }
  ];

  const formatPackageName = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const selectedAddons = addons.filter(addon => 
    addon.available && (addon.key === 'photoBookAddon' ? photoBookAddon :
                       addon.key === 'extraTimeAddon' ? extraTimeAddon :
                       addon.key === 'byobBarAddon' ? byobBarAddon :
                       rehearsalAddon)
  );

  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    if (addon.key === 'photoBookAddon' && addon.hasQuantity) {
      return sum + (addon.price * photoBookQuantity);
    }
    return sum + addon.price;
  }, 0);

  const discount = paymentMethod === 'ach' ? achDiscountAmount : 
                   paymentMethod === 'affirm' ? affirmDiscountAmount : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <CardTitle>Your Cart</CardTitle>
          </div>
          <CardDescription>Review your booking and proceed to payment</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Booking Summary</CardTitle>
          </div>
          <CardDescription>Review your selections before proceeding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{formatPackageName(eventType)}</span>
              <span>${(basePackagePrice / 100).toFixed(2)}</span>
            </div>

            {selectedAddons.map(addon => {
              const price = addon.key === 'photoBookAddon' && addon.hasQuantity 
                ? addon.price * photoBookQuantity 
                : addon.price;
              const label = addon.key === 'photoBookAddon' && photoBookQuantity > 1
                ? `${addon.label} (×${photoBookQuantity})`
                : addon.label;
              return (
                <div key={addon.key} className="flex justify-between">
                  <span>{label}</span>
                  <span>${(price / 100).toFixed(2)}</span>
                </div>
              );
            })}

            <div className="flex justify-between text-green-600 dark:text-green-400" data-testid="row-payment-discount">
              <span>{paymentMethod === 'ach' ? 'ACH' : paymentMethod === 'affirm' ? 'Affirm' : 'Payment'} Discount</span>
              <span data-testid="text-payment-discount">{discount > 0 ? '-' : ''}${(discount / 100).toFixed(2)}</span>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-between" data-testid="row-subtotal">
              <span>Subtotal</span>
              <span data-testid="text-subtotal">${((basePackagePrice + addonsTotal) / 100).toFixed(2)}</span>
            </div>

            <div className="flex justify-between" data-testid="row-tax">
              <span>Tax</span>
              <span data-testid="text-tax">$0.00</span>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-between font-semibold" data-testid="row-total">
              <span>Total</span>
              <span data-testid="text-total">${((basePackagePrice + addonsTotal - discount) / 100).toFixed(2)}</span>
            </div>

            <div className="flex justify-between" data-testid="row-amount-paid">
              <span>Amount Paid</span>
              <span data-testid="text-amount-paid">${(amountPaid / 100).toFixed(2)}</span>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-between font-semibold text-lg" data-testid="row-balance-due">
              <span>Balance Due</span>
              <span data-testid="text-balance-due">${((basePackagePrice + addonsTotal - discount - amountPaid) / 100).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Policies</CardTitle>
          <CardDescription>Please review and agree to the following policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-md text-sm space-y-2">
            <p className="font-medium">Refund & Cancellation Policy:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>100% refund if canceled within 3 days of making your payment</li>
              <li>50% refund if canceled more than 30 days before your wedding</li>
              <li>Non-refundable within 30 days of your event</li>
              <li>Rescheduling available up to 14 days in advance (subject to availability)</li>
            </ul>

            <p className="font-medium mt-3">Final Changes:</p>
            <p className="text-muted-foreground">
              You may update any selection in your Wedding Composer up to 7 days before your event. Within 7 days, you can still call our team for late-arising issues.
            </p>

            <p className="font-medium mt-3">Reservation Confirmation:</p>
            <p className="text-muted-foreground">
              Your date and time are not confirmed until payment is processed. Once confirmed, your reservation is locked and removed from public availability.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms-accepted"
              data-testid="checkbox-terms-accepted"
              checked={termsAccepted}
              onCheckedChange={(checked) => onChange('termsAccepted', checked as boolean)}
            />
            <Label htmlFor="terms-accepted" className="cursor-pointer text-sm">
              I have read and I agree to <button type="button" onClick={() => setShowTermsDialog(true)} className="text-primary underline hover:no-underline">The Modest Wedding's Terms & Conditions</button>, including the <button type="button" onClick={() => setShowRefundDialog(true)} className="text-primary underline hover:no-underline">Refund and Cancellation Policy</button>, and understand that my selected date will be reserved only after full payment has been processed. All requests for refunds and cancellations must be made through email at Support@TheModestWedding.com.
            </Label>
          </div>

          <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              After completing payment, you'll receive a confirmation email with a printable summary of all your Wedding Composer selections.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you'd like to pay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={(value) => onChange('paymentMethod', value)}>
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate">
              <RadioGroupItem value="credit_card" id="credit_card" data-testid="radio-payment-card" />
              <div className="flex-1">
                <Label htmlFor="credit_card" className="cursor-pointer">
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
                    <p>- Flexible: split your wedding cost into smaller monthly payments.</p>
                    <p>- Quick decision, no late fees, and clear terms.</p>
                    <p>- Trusted brand used by millions.</p>
                    <p className="font-medium text-foreground">- Special savings: Receive a ${(affirmDiscountAmount / 100).toFixed(2)} discount on your wedding package when you choose Affirm.</p>
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
                    <p className="font-medium text-foreground">- Special savings: Receive a ${(achDiscountAmount / 100).toFixed(2)} discount on your wedding package when you choose ACH.</p>
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

      {paymentMethod === 'credit_card' && (
        <Card>
          <CardHeader>
            <CardTitle>Card Information</CardTitle>
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

      {/* Terms & Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>The Modest Wedding Service Agreement</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. These are placeholder terms and conditions.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Policy Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Refund & Cancellation Policy</DialogTitle>
            <DialogDescription>Details about refunds and cancellations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. These are placeholder refund policy details.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
