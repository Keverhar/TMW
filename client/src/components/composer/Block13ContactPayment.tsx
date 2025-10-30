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
  onChange: (field: string, value: string | boolean | number) => void;
  eventType: string;
  basePackagePrice: number;
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
  onChange,
  eventType,
  basePackagePrice
}: Block13ContactPaymentProps) {
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showByobDialog, setShowByobDialog] = useState(false);
  
  const isSimplifiedFlow = eventType === 'modest-elopement' || eventType === 'vow-renewal';
  const addons = [
    { key: 'photoBookAddon', label: 'Photo Book', price: 30000, available: true, hasQuantity: true },
    { key: 'extraTimeAddon', label: 'Extra Time Block (Saturday 6PM only)', price: 100000, available: eventType === 'modest-wedding', hasQuantity: false },
    { key: 'byobBarAddon', label: 'BYOB Bar Setup', price: 40000, available: eventType === 'modest-wedding', hasQuantity: false },
    { key: 'rehearsalAddon', label: 'Rehearsal Hour', price: 15000, available: true, hasQuantity: false }
  ];
  
  const handleByobChange = (checked: boolean) => {
    if (checked) {
      setShowByobDialog(true);
    } else {
      onChange('byobBarAddon', false);
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
  
  // Apply ACH discount if payment method is ACH
  const achDiscount = paymentMethod === 'ach' ? 5000 : 0; // $50 discount in cents
  const totalPrice = basePackagePrice + addonsTotal - achDiscount;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Contact & Payment Information</h2>
        <p className="text-muted-foreground">
          Final step! Once we have your information and payment, we'll lock in your reservation and send you a confirmation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Client Contact Details</CardTitle>
          </div>
          <CardDescription>We'll use this information for communication and confirmation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Couple's Names *</Label>
            <Input
              id="customer-name"
              data-testid="input-customer-name"
              placeholder="First person's name"
              value={customerName}
              onChange={(e) => onChange('customerName', e.target.value)}
              required
            />
            <Input
              id="customer-name-2"
              data-testid="input-customer-name-2"
              placeholder="Second person's name"
              value={customerName2}
              onChange={(e) => onChange('customerName2', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-email">Email Address *</Label>
            <Input
              id="customer-email"
              data-testid="input-customer-email"
              type="email"
              placeholder="your.email@example.com"
              value={customerEmail}
              onChange={(e) => onChange('customerEmail', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone Number (Optional)</Label>
            <Input
              id="customer-phone"
              data-testid="input-customer-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={customerPhone}
              onChange={(e) => onChange('customerPhone', e.target.value)}
            />
            <div className="flex items-start space-x-2">
              <Checkbox
                id="sms-consent"
                data-testid="checkbox-sms-consent"
                checked={smsConsent}
                onCheckedChange={(checked) => onChange('smsConsent', checked as boolean)}
              />
              <Label htmlFor="sms-consent" className="cursor-pointer text-sm">
                Check here to allow SMS/Text Messages about your event. Carrier charges may apply.
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mailing-address">Mailing Address (for photo book delivery, if selected)</Label>
            <Textarea
              id="mailing-address"
              data-testid="input-mailing-address"
              placeholder="Street address, city, state, ZIP"
              value={mailingAddress}
              onChange={(e) => onChange('mailingAddress', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {!isSimplifiedFlow && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <CardTitle>Add-Ons (Optional)</CardTitle>
            </div>
            <CardDescription>Enhance your celebration with these optional add-ons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {addons.filter(addon => addon.available).map((addon) => (
              <div key={addon.key} className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={addon.key}
                      data-testid={`checkbox-${addon.key}`}
                      checked={addon.key === 'photoBookAddon' ? photoBookAddon :
                              addon.key === 'extraTimeAddon' ? extraTimeAddon :
                              addon.key === 'byobBarAddon' ? byobBarAddon :
                              rehearsalAddon}
                      onCheckedChange={(checked) => {
                        if (addon.key === 'byobBarAddon') {
                          handleByobChange(checked as boolean);
                        } else {
                          onChange(addon.key, checked as boolean);
                        }
                      }}
                    />
                    <Label htmlFor={addon.key} className="cursor-pointer">
                      {addon.label}
                    </Label>
                  </div>
                  <Badge variant="secondary">${(addon.price / 100).toFixed(2)}</Badge>
                </div>
                {addon.key === 'photoBookAddon' && photoBookAddon && (
                  <div className="ml-6 flex items-center gap-2">
                    <Label htmlFor="photo-book-quantity" className="text-sm">Quantity:</Label>
                    <Select value={String(photoBookQuantity)} onValueChange={(value) => onChange('photoBookQuantity', parseInt(value))}>
                      <SelectTrigger className="w-20" id="photo-book-quantity" data-testid="select-photo-book-quantity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      Total: ${((addon.price * photoBookQuantity) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
              <span>Package:</span>
              <span className="font-medium">{eventType}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span className="font-medium">${(basePackagePrice / 100).toFixed(2)}</span>
            </div>

            {selectedAddons.length > 0 && (
              <>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Add-Ons:</p>
                  {selectedAddons.map(addon => {
                    const price = addon.key === 'photoBookAddon' && addon.hasQuantity 
                      ? addon.price * photoBookQuantity 
                      : addon.price;
                    const label = addon.key === 'photoBookAddon' && photoBookQuantity > 1
                      ? `${addon.label} (×${photoBookQuantity})`
                      : addon.label;
                    return (
                      <div key={addon.key} className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span>${(price / 100).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {achDiscount > 0 && (
              <div className="flex justify-between pt-2 border-t text-sm text-green-600 dark:text-green-400">
                <span>ACH Payment Discount:</span>
                <span>-${(achDiscount / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t text-lg font-semibold">
              <span>Total:</span>
              <span className="text-yellow-400 font-bold">${(totalPrice / 100).toFixed(2)}</span>
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
    </div>
  );
}
