import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, User, FileText, Info } from "lucide-react";

interface Block13ContactPaymentProps {
  customerName: string;
  customerName2: string;
  customerEmail: string;
  customerPhone: string;
  smsConsent: boolean;
  mailingAddress: string;
  paymentMethod: string;
  termsAccepted: boolean;
  photoBookAddon: boolean;
  extraTimeAddon: boolean;
  byobBarAddon: boolean;
  rehearsalAddon: boolean;
  photoBookQuantity?: number;
  photoBookPrice: number;
  extraTimePrice: number;
  byobBarPrice: number;
  rehearsalPrice: number;
  achDiscountAmount: number;
  affirmDiscountAmount: number;
  onChange: (field: string, value: string | boolean | number) => void;
  eventType: string;
  basePackagePrice: number;
  amountPaid: number;
  preferredDate: string;
  timeSlot: string;
}

export default function Block13ContactPayment({
  customerName,
  customerName2,
  customerEmail,
  customerPhone,
  smsConsent,
  mailingAddress,
  paymentMethod,
  termsAccepted,
  photoBookAddon,
  extraTimeAddon,
  byobBarAddon,
  rehearsalAddon,
  photoBookQuantity = 1,
  photoBookPrice,
  extraTimePrice,
  byobBarPrice,
  rehearsalPrice,
  achDiscountAmount,
  affirmDiscountAmount,
  onChange,
  eventType,
  basePackagePrice,
  amountPaid,
  preferredDate,
  timeSlot
}: Block13ContactPaymentProps) {
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showByobDialog, setShowByobDialog] = useState(false);
  const [showImmutabilityWarning, setShowImmutabilityWarning] = useState(false);
  
  const isSimplifiedFlow = eventType === 'modest-elopement' || eventType === 'vow-renewal';
  
  // Check if Extra Time addon is eligible (Saturday at 6:00 PM)
  const isExtraTimeEligible = () => {
    if (!preferredDate || !timeSlot) return false;
    
    // Parse the date to check if it's a Saturday
    // Add time component to ensure correct timezone parsing
    const date = new Date(preferredDate + 'T12:00:00');
    const isSaturday = date.getDay() === 6;
    
    // Check if time is 6:00 PM (value is "6pm-9pm" for modest weddings)
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
  
  const handleByobChange = (checked: boolean) => {
    if (checked) {
      setShowByobDialog(true);
    } else {
      onChange('byobBarAddon', false);
    }
  };

  const handleTermsChange = (checked: boolean) => {
    if (checked && !termsAccepted) {
      // Show warning dialog when user tries to accept terms
      setShowImmutabilityWarning(true);
    } else {
      // Allow unchecking without warning
      onChange('termsAccepted', checked as boolean);
    }
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
  
  // Apply ACH/E-Check/Affirm discount if payment method is ACH, E-Check, or Affirm
  const discount = paymentMethod === 'ach' || paymentMethod === 'echeck' ? achDiscountAmount : 
                   paymentMethod === 'affirm' ? affirmDiscountAmount : 0;
  const totalPrice = basePackagePrice + addonsTotal - discount;

  console.log('Block13 - Payment Method:', paymentMethod, 'ACH Discount Amount:', achDiscountAmount, 'Affirm Discount Amount:', affirmDiscountAmount, 'Calculated Discount:', discount);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Cart</h2>
        <p className="text-muted-foreground">
          Final step! Once we have your information and payment, we'll lock in your reservation and send you a confirmation.
        </p>
      </div>

      {!eventType ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Booking Summary</CardTitle>
            </div>
            <CardDescription>Review your selections before proceeding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No booking selected</p>
              <p className="text-sm mt-2">Select an event type to see your cart</p>
            </div>
          </CardContent>
        </Card>
      ) : (
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

              <div className="border-t my-2"></div>

              <div className="flex justify-between" data-testid="row-subtotal">
                <span>Subtotal</span>
                <span data-testid="text-subtotal">${((basePackagePrice + addonsTotal) / 100).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-green-600 dark:text-green-400" data-testid="row-payment-discount">
                <span>{paymentMethod === 'ach' ? 'ACH' : paymentMethod === 'echeck' ? 'E-Check' : paymentMethod === 'affirm' ? 'Affirm' : 'Payment'} Discount</span>
                <span data-testid="text-payment-discount">{discount > 0 ? '-' : ''}${(discount / 100).toFixed(2)}</span>
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
      )}

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
              onCheckedChange={handleTermsChange}
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

      {/* Terms & Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>The Modest Wedding Service Agreement</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund & Cancellation Policy Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Refund and Cancellation Policy</DialogTitle>
            <DialogDescription>Understanding your refund and cancellation rights</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* BYOB Legal Agreement Dialog */}
      <Dialog open={showByobDialog} onOpenChange={(open) => {
        setShowByobDialog(open);
        if (!open && !byobBarAddon) {
          // Dialog was closed without accepting
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>BYOB Bar Setup - Legal Agreement</DialogTitle>
            <DialogDescription>Please review and accept this agreement to proceed</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm max-h-[50vh] overflow-y-auto">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowByobDialog(false);
                onChange('byobBarAddon', false);
              }}
              className="px-4 py-2 text-sm border rounded-md hover-elevate"
            >
              Decline
            </button>
            <button
              onClick={() => {
                setShowByobDialog(false);
                onChange('byobBarAddon', true);
              }}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover-elevate"
            >
              Accept & Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Immutability Warning Dialog */}
      <Dialog open={showImmutabilityWarning} onOpenChange={setShowImmutabilityWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-600 dark:text-amber-500">Important Notice</DialogTitle>
            <DialogDescription>Please read carefully before proceeding</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                Once payment has been made, the following selections cannot be changed:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
                <li>Wedding Type (Package)</li>
                <li>Wedding Date</li>
                <li>Wedding Time</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              All other selections in your Wedding Composer can be updated up to 7 days before your event. If you need to change your wedding type, date, or time after payment, you will need to cancel and rebook (subject to our cancellation policy).
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowImmutabilityWarning(false)}
              className="px-4 py-2 text-sm border rounded-md hover-elevate"
              data-testid="button-cancel-warning"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                setShowImmutabilityWarning(false);
                onChange('termsAccepted', true);
              }}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover-elevate"
              data-testid="button-accept-warning"
            >
              I Understand
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
