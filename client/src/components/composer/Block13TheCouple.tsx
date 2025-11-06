import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Block13TheCoupleProps {
  person1Role: string;
  person1FullName: string;
  person1Pronouns: string;
  person1Email: string;
  person1Phone: string;
  person1AlternatePhone: string;
  person2Role: string;
  person2FullName: string;
  person2Pronouns: string;
  person2Email: string;
  person2Phone: string;
  smsConsent: boolean;
  onChange: (field: string, value: string | boolean) => void;
}

const roleOptions = [
  "Bride",
  "Groom",
  "Wife",
  "Husband",
  "Spouse",
  "Partner",
  "Other"
];

const pronounOptions = [
  "He/Him/His",
  "She/Her/Hers",
  "They/Them/Theirs",
  "Prefer not to say"
];

const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 3) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

export default function Block13TheCouple({
  person1Role,
  person1FullName,
  person1Pronouns,
  person1Email,
  person1Phone,
  person1AlternatePhone,
  person2Role,
  person2FullName,
  person2Pronouns,
  person2Email,
  person2Phone,
  smsConsent,
  onChange,
}: Block13TheCoupleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">The Couple</h2>
        <p className="text-muted-foreground">
          Tell us about yourselves so we can personalize your celebration.
        </p>
      </div>

      {/* Person 1 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="person1-role">Role *</Label>
            <Select 
              value={person1Role} 
              onValueChange={(value) => onChange('person1Role', value)}
            >
              <SelectTrigger id="person1-role" data-testid="select-person1-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="person1-full-name">Full Name *</Label>
            <Input
              id="person1-full-name"
              data-testid="input-person1-full-name"
              placeholder="First and last name"
              value={person1FullName}
              onChange={(e) => onChange('person1FullName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="person1-pronouns">Pronouns (Optional)</Label>
            <Select 
              value={person1Pronouns} 
              onValueChange={(value) => onChange('person1Pronouns', value)}
            >
              <SelectTrigger id="person1-pronouns" data-testid="select-person1-pronouns">
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                {pronounOptions.map((pronoun) => (
                  <SelectItem key={pronoun} value={pronoun}>
                    {pronoun}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="person1-email">Email *</Label>
            <Input
              id="person1-email"
              data-testid="input-person1-email"
              type="email"
              placeholder="your.email@example.com"
              value={person1Email}
              onChange={(e) => onChange('person1Email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="person1-phone">Phone *</Label>
            <Input
              id="person1-phone"
              data-testid="input-person1-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formatPhoneNumber(person1Phone)}
              onChange={(e) => onChange('person1Phone', formatPhoneNumber(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="person1-alternate-phone">Alternate Phone (Optional)</Label>
            <Input
              id="person1-alternate-phone"
              data-testid="input-person1-alternate-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formatPhoneNumber(person1AlternatePhone)}
              onChange={(e) => onChange('person1AlternatePhone', formatPhoneNumber(e.target.value))}
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
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
        </CardContent>
      </Card>

      {/* Person 2 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="person2-role">Role *</Label>
            <Select 
              value={person2Role} 
              onValueChange={(value) => onChange('person2Role', value)}
            >
              <SelectTrigger id="person2-role" data-testid="select-person2-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="person2-full-name">Full Name *</Label>
            <Input
              id="person2-full-name"
              data-testid="input-person2-full-name"
              placeholder="First and last name"
              value={person2FullName}
              onChange={(e) => onChange('person2FullName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="person2-pronouns">Pronouns (Optional)</Label>
            <Select 
              value={person2Pronouns} 
              onValueChange={(value) => onChange('person2Pronouns', value)}
            >
              <SelectTrigger id="person2-pronouns" data-testid="select-person2-pronouns">
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                {pronounOptions.map((pronoun) => (
                  <SelectItem key={pronoun} value={pronoun}>
                    {pronoun}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="person2-email">Email (Optional)</Label>
            <Input
              id="person2-email"
              data-testid="input-person2-email"
              type="email"
              placeholder="your.email@example.com"
              value={person2Email}
              onChange={(e) => onChange('person2Email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="person2-phone">Phone (Optional)</Label>
            <Input
              id="person2-phone"
              data-testid="input-person2-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formatPhoneNumber(person2Phone)}
              onChange={(e) => onChange('person2Phone', formatPhoneNumber(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
