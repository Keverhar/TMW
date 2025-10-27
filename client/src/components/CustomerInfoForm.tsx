import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoFormProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

export default function CustomerInfoForm({
  name,
  email,
  phone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}: CustomerInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Contact Information</CardTitle>
        <CardDescription>We'll use this to send your booking confirmation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customer-name" className="text-base">
            Full Name *
          </Label>
          <Input
            id="customer-name"
            placeholder="John & Jane Doe"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            data-testid="input-customer-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-email" className="text-base">
            Email Address *
          </Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            data-testid="input-customer-email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-phone" className="text-base">
            Phone Number *
          </Label>
          <Input
            id="customer-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
            data-testid="input-customer-phone"
          />
        </div>
      </CardContent>
    </Card>
  );
}
