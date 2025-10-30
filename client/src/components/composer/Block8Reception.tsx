import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PartyPopper, Info } from "lucide-react";

interface Block8ReceptionProps {
  firstDance: string;
  motherSonDance: string;
  specialDances: string;
  toastGivers: string;
  beveragePreferences: string;
  receptionSpecialRequests: string;
  receptionSpecialRequestsNA: boolean;
  receptionCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
}

export default function Block8Reception({
  firstDance,
  motherSonDance,
  specialDances,
  toastGivers,
  beveragePreferences,
  receptionSpecialRequests,
  receptionSpecialRequestsNA,
  receptionCompletionStatus,
  onChange
}: Block8ReceptionProps) {
  const isSpecialRequestsFilled = receptionSpecialRequestsNA || receptionSpecialRequests;

  const allRequiredFieldsFilled = firstDance && motherSonDance && specialDances && 
    toastGivers && beveragePreferences && isSpecialRequestsFilled;

  const someFieldsEmpty = !firstDance || !motherSonDance || !specialDances || 
    !toastGivers || !beveragePreferences || !isSpecialRequestsFilled;

  const handleCompletionStatusChange = (status: string) => {
    if (receptionCompletionStatus === status) {
      onChange('receptionCompletionStatus', '');
    } else {
      onChange('receptionCompletionStatus', status);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Reception Preferences</h2>
        <p className="text-muted-foreground">
          Let's plan the celebration! From toasts and dances to beverages, this is where the party comes to life.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5" />
            <CardTitle>Toasts & Dances</CardTitle>
          </div>
          <CardDescription>Plan your special dances and who will give toasts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first-dance">First Dance</Label>
            <Textarea
              id="first-dance"
              data-testid="input-first-dance"
              placeholder="Any special instructions or preferences for your first dance?"
              value={firstDance}
              onChange={(e) => onChange('firstDance', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mother-son-dance">Mother-Son Dance</Label>
            <Textarea
              id="mother-son-dance"
              data-testid="input-mother-son-dance"
              placeholder="Will you have a mother-son dance? Any special details?"
              value={motherSonDance}
              onChange={(e) => onChange('motherSonDance', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-dances">Other Special Dances</Label>
            <Textarea
              id="special-dances"
              data-testid="input-special-dances"
              placeholder="Any other special dances (bride-son, grandparents, etc.)?"
              value={specialDances}
              onChange={(e) => onChange('specialDances', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toast-givers">Toast Givers</Label>
            <Textarea
              id="toast-givers"
              data-testid="input-toast-givers"
              placeholder="Who will be giving toasts? (Names and order)"
              value={toastGivers}
              onChange={(e) => onChange('toastGivers', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beverages</CardTitle>
          <CardDescription>Share your preferences for refreshments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Beverage Preferences</Label>
            <RadioGroup value={beveragePreferences} onValueChange={(value) => onChange('beveragePreferences', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alcoholic" id="beverage-alcoholic" data-testid="radio-beverage-alcoholic" />
                <Label htmlFor="beverage-alcoholic" className="cursor-pointer">Alcoholic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-alcoholic" id="beverage-non-alcoholic" data-testid="radio-beverage-non-alcoholic" />
                <Label htmlFor="beverage-non-alcoholic" className="cursor-pointer">Non Alcoholic</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Optional BYOB bar setup available ($400) - we'll guide you through licensing and provide setup/server
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reception Special Requests</CardTitle>
          <CardDescription>Any other details or special touches for your reception?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            data-testid="input-reception-special-requests"
            placeholder="Share any additional preferences or special requests..."
            value={receptionSpecialRequests}
            onChange={(e) => onChange('receptionSpecialRequests', e.target.value)}
            rows={3}
            disabled={receptionSpecialRequestsNA}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reception-special-requests-na"
              data-testid="checkbox-reception-special-requests-na"
              checked={receptionSpecialRequestsNA}
              onCheckedChange={(checked) => {
                onChange('receptionSpecialRequestsNA', checked as boolean);
                if (checked) {
                  onChange('receptionSpecialRequests', '');
                }
              }}
            />
            <Label htmlFor="reception-special-requests-na" className="cursor-pointer">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reception Planning Status</CardTitle>
          <CardDescription>Let us know if you're ready to move forward or need more time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {allRequiredFieldsFilled && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reception-all-done"
                data-testid="checkbox-reception-all-done"
                checked={receptionCompletionStatus === 'all-done'}
                onCheckedChange={() => handleCompletionStatusChange('all-done')}
              />
              <Label htmlFor="reception-all-done" className="cursor-pointer font-medium">
                All done (for now)
              </Label>
            </div>
          )}
          
          {someFieldsEmpty && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reception-finish-later"
                data-testid="checkbox-reception-finish-later"
                checked={receptionCompletionStatus === 'finish-later'}
                onCheckedChange={() => handleCompletionStatusChange('finish-later')}
              />
              <Label htmlFor="reception-finish-later" className="cursor-pointer font-medium">
                We'll finish this later
              </Label>
            </div>
          )}

          <div className="flex gap-2 items-start bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Required for payment:</strong> Please check one of the completion status boxes above before proceeding.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
