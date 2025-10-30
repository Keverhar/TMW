import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PartyPopper, Info, Lock } from "lucide-react";

interface Block8ReceptionProps {
  firstDance: string;
  firstDanceNA: boolean;
  motherSonDance: string;
  motherSonDanceNA: boolean;
  specialDances: string;
  specialDancesNA: boolean;
  toastGivers: string;
  toastGiversNA: boolean;
  beveragePreferences: string;
  receptionSpecialRequests: string;
  receptionSpecialRequestsNA: boolean;
  receptionCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
  readOnly?: boolean;
}

export default function Block8Reception({
  firstDance,
  firstDanceNA,
  motherSonDance,
  motherSonDanceNA,
  specialDances,
  specialDancesNA,
  toastGivers,
  toastGiversNA,
  beveragePreferences,
  receptionSpecialRequests,
  receptionSpecialRequestsNA,
  receptionCompletionStatus,
  onChange,
  readOnly = false
}: Block8ReceptionProps) {
  const isFirstDanceFilled = firstDanceNA || firstDance;
  const isMotherSonDanceFilled = motherSonDanceNA || motherSonDance;
  const isSpecialDancesFilled = specialDancesNA || specialDances;
  const isToastGiversFilled = toastGiversNA || toastGivers;
  const isSpecialRequestsFilled = receptionSpecialRequestsNA || receptionSpecialRequests;

  const allRequiredFieldsFilled = isFirstDanceFilled && isMotherSonDanceFilled && 
    isSpecialDancesFilled && isToastGiversFilled && beveragePreferences && isSpecialRequestsFilled;

  const someFieldsEmpty = !isFirstDanceFilled || !isMotherSonDanceFilled || !isSpecialDancesFilled || 
    !isToastGiversFilled || !beveragePreferences || !isSpecialRequestsFilled;

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

      {readOnly && (
        <div className="flex gap-3 items-start bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">Available with Full Wedding Package</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              This section is included in our Saturday, Friday/Sunday wedding packages. You can view all options but selections are not available for Elopement and Vow Renewal packages.
            </p>
          </div>
        </div>
      )}

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
              disabled={firstDanceNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="first-dance-na"
                data-testid="checkbox-first-dance-na"
                checked={firstDanceNA}
                onCheckedChange={(checked) => {
                  onChange('firstDanceNA', checked as boolean);
                  if (checked) {
                    onChange('firstDance', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="first-dance-na" className="cursor-pointer text-sm">
                No Special Instructions
              </Label>
            </div>
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
              disabled={motherSonDanceNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mother-son-dance-na"
                data-testid="checkbox-mother-son-dance-na"
                checked={motherSonDanceNA}
                onCheckedChange={(checked) => {
                  onChange('motherSonDanceNA', checked as boolean);
                  if (checked) {
                    onChange('motherSonDance', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="mother-son-dance-na" className="cursor-pointer text-sm">
                No Special Instructions
              </Label>
            </div>
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
              disabled={specialDancesNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="special-dances-na"
                data-testid="checkbox-special-dances-na"
                checked={specialDancesNA}
                onCheckedChange={(checked) => {
                  onChange('specialDancesNA', checked as boolean);
                  if (checked) {
                    onChange('specialDances', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="special-dances-na" className="cursor-pointer text-sm">
                No Special Instructions
              </Label>
            </div>
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
              disabled={toastGiversNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="toast-givers-na"
                data-testid="checkbox-toast-givers-na"
                checked={toastGiversNA}
                onCheckedChange={(checked) => {
                  onChange('toastGiversNA', checked as boolean);
                  if (checked) {
                    onChange('toastGivers', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="toast-givers-na" className="cursor-pointer text-sm">
                No Introductions Needed
              </Label>
            </div>
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
            <RadioGroup value={beveragePreferences} onValueChange={(value) => onChange('beveragePreferences', value)} disabled={readOnly}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alcoholic" id="beverage-alcoholic" data-testid="radio-beverage-alcoholic" disabled={readOnly} />
                <Label htmlFor="beverage-alcoholic" className="cursor-pointer">Alcoholic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-alcoholic" id="beverage-non-alcoholic" data-testid="radio-beverage-non-alcoholic" disabled={readOnly} />
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
            disabled={receptionSpecialRequestsNA || readOnly}
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
              disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
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
