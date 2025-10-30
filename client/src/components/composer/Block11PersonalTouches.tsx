import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle2, AlertCircle, Lock } from "lucide-react";

interface Block11PersonalTouchesProps {
  freshFlorals: string;
  freshFloralsNA: boolean;
  guestBookChoice: string;
  guestBook: string;
  cakeKnifeChoice: string;
  cakeKnifeServiceSet: string;
  departureOrganizer: string;
  departureOrganizerTBD: boolean;
  departureVehicleChoice: string;
  departureVehicle: string;
  personalTouchesSpecialInstructions: string;
  personalTouchesSpecialInstructionsNA: boolean;
  personalTouchesCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
  readOnly?: boolean;
}

export default function Block11PersonalTouches({
  freshFlorals,
  freshFloralsNA,
  guestBookChoice,
  guestBook,
  cakeKnifeChoice,
  cakeKnifeServiceSet,
  departureOrganizer,
  departureOrganizerTBD,
  departureVehicleChoice,
  departureVehicle,
  personalTouchesSpecialInstructions,
  personalTouchesSpecialInstructionsNA,
  personalTouchesCompletionStatus,
  onChange,
  readOnly = false
}: Block11PersonalTouchesProps) {
  // Check if fields are filled
  const isFreshFloralsFilled = freshFloralsNA || freshFlorals.trim() !== '';
  const isGuestBookFilled = guestBookChoice !== '';
  const isCakeKnifeFilled = cakeKnifeChoice !== '';
  const isDepartureOrganizerFilled = departureOrganizerTBD || departureOrganizer.trim() !== '';
  const isDepartureVehicleFilled = departureVehicleChoice !== '' && (departureVehicleChoice === 'no' || departureVehicle.trim() !== '');
  const isSpecialInstructionsFilled = personalTouchesSpecialInstructionsNA || personalTouchesSpecialInstructions.trim() !== '';
  
  const allRequiredFieldsFilled = isFreshFloralsFilled && isGuestBookFilled && isCakeKnifeFilled && 
                                   isDepartureOrganizerFilled && isDepartureVehicleFilled && isSpecialInstructionsFilled;
  const someFieldsEmpty = !allRequiredFieldsFilled;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Special Personal Touches</h2>
        <p className="text-muted-foreground">
          Small personal details can make your celebration feel even more you. All items below are completely optional and no cost.
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

      {/* Fresh Florals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <CardTitle>Fresh Florals</CardTitle>
          </div>
          <CardDescription>Would you like to bring a fresh bridal bouquet or wedding party arrangements from your florist?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fresh-florals">Floral Details</Label>
            <Textarea
              id="fresh-florals"
              data-testid="input-fresh-florals"
              placeholder="Florist name, delivery details, or special instructions. Or type 'No thanks' if keeping things simple."
              value={freshFlorals}
              onChange={(e) => onChange('freshFlorals', e.target.value)}
              rows={3}
              disabled={freshFloralsNA || readOnly}
            />
            <p className="text-xs text-muted-foreground">
              We'll receive deliveries directly from your florist, refrigerate them on arrival, and present them at the perfect time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="fresh-florals-na"
              data-testid="checkbox-fresh-florals-na"
              checked={freshFloralsNA}
              onCheckedChange={(checked) => {
                onChange('freshFloralsNA', checked as boolean);
                if (checked) {
                  onChange('freshFlorals', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="fresh-florals-na" className="text-sm font-normal cursor-pointer">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Guest Book */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Book</CardTitle>
          <CardDescription>Will you be bringing a guest book for your celebration?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Badge
              variant={guestBookChoice === 'yes' ? 'default' : 'outline'}
              onClick={() => !readOnly && onChange('guestBookChoice', 'yes')}
              data-testid="badge-guest-book-yes"
              className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Yes
            </Badge>
            <Badge
              variant={guestBookChoice === 'no' ? 'default' : 'outline'}
              onClick={() => !readOnly && onChange('guestBookChoice', 'no')}
              data-testid="badge-guest-book-no"
              className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              No
            </Badge>
          </div>
          {guestBookChoice === 'yes' && (
            <p className="text-xs text-muted-foreground">
              OK. We'll make sure it's displayed thoughtfully and ready for guests to sign. We will provide a designated gift table and card box.
            </p>
          )}
          {guestBookChoice === 'no' && (
            <p className="text-xs text-muted-foreground">
              OK. If you change your mind it's no problem, just let us know and we'll make sure it's displayed thoughtfully and ready for guests to sign. We will provide a designated gift table and card box.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cake Knife & Service Set */}
      <Card>
        <CardHeader>
          <CardTitle>Cake Knife & Service Set</CardTitle>
          <CardDescription>Would you like us to use a special cake knife or service set you're bringing?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Badge
              variant={cakeKnifeChoice === 'yes' ? 'default' : 'outline'}
              onClick={() => !readOnly && onChange('cakeKnifeChoice', 'yes')}
              data-testid="badge-cake-knife-yes"
              className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Yes
            </Badge>
            <Badge
              variant={cakeKnifeChoice === 'no' ? 'default' : 'outline'}
              onClick={() => !readOnly && onChange('cakeKnifeChoice', 'no')}
              data-testid="badge-cake-knife-no"
              className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              No
            </Badge>
          </div>
          {cakeKnifeChoice === 'yes' && (
            <p className="text-xs text-muted-foreground">
              Great, we'll place your knife and server next to the cake display before the cake-cutting moment.
            </p>
          )}
          {cakeKnifeChoice === 'no' && (
            <p className="text-xs text-muted-foreground">
              No problem. If you change your mind just let us know and we'll place your knife and server next to the cake display before the cake-cutting moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Departure Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Departure Organization</CardTitle>
          <CardDescription>Important: Assign someone you trust to handle gifts and items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="departure-organizer">Departure Organizer</Label>
            <Textarea
              id="departure-organizer"
              data-testid="input-departure-organizer"
              placeholder="Name and relationship of the person who will sign on your behalf that you have received back all items belonging to you"
              value={departureOrganizer}
              onChange={(e) => onChange('departureOrganizer', e.target.value)}
              rows={2}
              disabled={departureOrganizerTBD || readOnly}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="departure-organizer-tbd"
              data-testid="checkbox-departure-organizer-tbd"
              checked={departureOrganizerTBD}
              onCheckedChange={(checked) => {
                onChange('departureOrganizerTBD', checked as boolean);
                if (checked) {
                  onChange('departureOrganizer', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="departure-organizer-tbd" className="text-sm font-normal cursor-pointer">
              To Be Decided Later
            </Label>
          </div>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Items to check before departure:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Bridal cabinet contents</li>
              <li>• To-go box for couple's car</li>
              <li>• Guest book (if brought)</li>
              <li>• Gifts and cards</li>
              <li>• Service set (if brought)</li>
              <li>• Florals (if brought)</li>
              <li>• Framed family photos (if brought)</li>
              <li>• Alcohol (if Optional BYOB bar is contracted)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Departure Vehicle */}
      <Card>
        <CardHeader>
          <CardTitle>Departure Vehicle</CardTitle>
          <CardDescription>Are you planning a special send-off vehicle?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant={departureVehicleChoice === 'yes' ? 'default' : 'outline'}
              onClick={() => {
                onChange('departureVehicleChoice', 'yes');
              }}
              data-testid="button-departure-vehicle-yes"
              className="flex-1"
              disabled={readOnly}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={departureVehicleChoice === 'no' ? 'default' : 'outline'}
              onClick={() => {
                onChange('departureVehicleChoice', 'no');
                onChange('departureVehicle', '');
              }}
              data-testid="button-departure-vehicle-no"
              className="flex-1"
              disabled={readOnly}
            >
              No
            </Button>
          </div>

          {departureVehicleChoice === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="departure-vehicle">Departure Vehicle Details</Label>
              <Textarea
                id="departure-vehicle"
                data-testid="input-departure-vehicle"
                placeholder="Classic car, limo, or black sedan? Include arrival time, company name, and pickup details."
                value={departureVehicle}
                onChange={(e) => onChange('departureVehicle', e.target.value)}
                rows={3}
                disabled={readOnly}
              />
              <p className="text-xs text-muted-foreground">
                If arranged, our team will help guide your guests outside and ensure your departure goes smoothly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Special Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Special Instructions</CardTitle>
          <CardDescription>Any other details or personal touches we should know about?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            data-testid="input-personal-touches-special-instructions"
            placeholder="Examples: 'We're bringing a memory table with framed photos,' 'Please place our custom signage near the guest book,' etc."
            value={personalTouchesSpecialInstructions}
            onChange={(e) => onChange('personalTouchesSpecialInstructions', e.target.value)}
            rows={3}
            disabled={personalTouchesSpecialInstructionsNA || readOnly}
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="personal-touches-special-instructions-na"
              data-testid="checkbox-personal-touches-special-instructions-na"
              checked={personalTouchesSpecialInstructionsNA}
              onCheckedChange={(checked) => {
                onChange('personalTouchesSpecialInstructionsNA', checked as boolean);
                if (checked) {
                  onChange('personalTouchesSpecialInstructions', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="personal-touches-special-instructions-na" className="text-sm font-normal cursor-pointer">
              No special instructions
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      {allRequiredFieldsFilled && (
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Great! Your personal touches planning is complete.</p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Please confirm your status to continue.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="personal-touches-complete-done"
                      data-testid="checkbox-personal-touches-complete-done"
                      checked={personalTouchesCompletionStatus === 'done'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onChange('personalTouchesCompletionStatus', 'done');
                        } else {
                          onChange('personalTouchesCompletionStatus', '');
                        }
                      }}
                      disabled={readOnly}
                    />
                    <Label htmlFor="personal-touches-complete-done" className="text-sm font-normal cursor-pointer">
                      All done (for now)
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="personal-touches-complete-later"
                      data-testid="checkbox-personal-touches-complete-later"
                      checked={personalTouchesCompletionStatus === 'later'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onChange('personalTouchesCompletionStatus', 'later');
                        } else {
                          onChange('personalTouchesCompletionStatus', '');
                        }
                      }}
                      disabled={readOnly}
                    />
                    <Label htmlFor="personal-touches-complete-later" className="text-sm font-normal cursor-pointer">
                      We'll finish this later
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {someFieldsEmpty && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">You're making progress!</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Some personal touches fields still need attention. Please confirm your status.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="personal-touches-incomplete-later"
                    data-testid="checkbox-personal-touches-incomplete-later"
                    checked={personalTouchesCompletionStatus === 'later'}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange('personalTouchesCompletionStatus', 'later');
                      } else {
                        onChange('personalTouchesCompletionStatus', '');
                      }
                    }}
                    disabled={readOnly}
                  />
                  <Label htmlFor="personal-touches-incomplete-later" className="text-sm font-normal cursor-pointer">
                    We'll finish this later
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
