import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";

interface Block13TheCoupleProps {
  customerName: string;
  customerName2: string;
  customerEmail: string;
  customerPhone: string;
  smsConsent: boolean;
  mailingAddress: string;
  onChange: (field: string, value: string | boolean) => void;
}

export default function Block13TheCouple({
  customerName,
  customerName2,
  customerEmail,
  customerPhone,
  smsConsent,
  mailingAddress,
  onChange,
}: Block13TheCoupleProps) {
  const [hasLoadedDefaults, setHasLoadedDefaults] = useState(false);

  useEffect(() => {
    if (!hasLoadedDefaults) {
      setHasLoadedDefaults(true);
      
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        
        // Load user account data to use as defaults for billing information
        fetch(`/api/users/${user.id}`)
          .then(res => res.ok ? res.json() : null)
          .then(userData => {
            if (userData) {
              // Only set defaults if the fields are currently empty
              if (!customerEmail && user.email) {
                onChange('customerEmail', user.email);
              }
              if (!customerPhone && userData.primaryPhone) {
                onChange('customerPhone', userData.primaryPhone);
              }
              if (!mailingAddress && userData.street) {
                // Build formatted address from account data
                const addressParts = [
                  userData.street,
                  userData.aptNumber,
                  `${userData.city}, ${userData.state} ${userData.zip}`
                ].filter(Boolean);
                onChange('mailingAddress', addressParts.join('\n'));
              }
            }
          })
          .catch(err => console.error('Error loading account defaults:', err));
      }
    }
  }, [hasLoadedDefaults, customerEmail, customerPhone, mailingAddress, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">The Couple</h2>
        <p className="text-muted-foreground">
          Tell us about yourselves so we can personalize your celebration. Billing information is pre-filled from your account but can be changed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Contact Information</CardTitle>
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
    </div>
  );
}
