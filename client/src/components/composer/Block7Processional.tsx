import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Info, Lock } from "lucide-react";

interface Block7ProcessionalProps {
  walkingDownAisle: string;
  escortName: string;
  ringBearerIncluded: string;
  ringBearerFlowerGirl: string;
  ringBearerOrganizer: string;
  honoredGuestEscorts: string;
  honoredGuestEscortsNA: boolean;
  brideSideFrontRow: string;
  brideSideFrontRowNA: boolean;
  groomSideFrontRow: string;
  groomSideFrontRowNA: boolean;
  framedPhotos: string;
  framedPhotosNA: boolean;
  specialSeatingNeeds: string;
  specialSeatingNeedsNA: boolean;
  processionalSpecialInstructions: string;
  processionalSpecialInstructionsNA: boolean;
  processionalCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
  readOnly?: boolean;
}

export default function Block7Processional({
  walkingDownAisle,
  escortName,
  ringBearerIncluded,
  ringBearerFlowerGirl,
  ringBearerOrganizer,
  honoredGuestEscorts,
  honoredGuestEscortsNA,
  brideSideFrontRow,
  brideSideFrontRowNA,
  groomSideFrontRow,
  groomSideFrontRowNA,
  framedPhotos,
  framedPhotosNA,
  specialSeatingNeeds,
  specialSeatingNeedsNA,
  processionalSpecialInstructions,
  processionalSpecialInstructionsNA,
  processionalCompletionStatus,
  onChange,
  readOnly = false
}: Block7ProcessionalProps) {
  // Determine if all required fields are filled - "undecided" does not count as filled
  const isWalkingDownAisleFilled = walkingDownAisle && walkingDownAisle !== 'undecided';
  const isRingBearerFilled = ringBearerIncluded === 'no' || (ringBearerIncluded === 'yes' && ringBearerFlowerGirl && ringBearerOrganizer);
  const isEscortFilled = walkingDownAisle !== 'with-someone' || (walkingDownAisle === 'with-someone' && escortName);
  const isHonoredGuestsFilled = honoredGuestEscortsNA || honoredGuestEscorts;
  const isBrideSideFilled = brideSideFrontRowNA || brideSideFrontRow;
  const isGroomSideFilled = groomSideFrontRowNA || groomSideFrontRow;
  const isFramedPhotosFilled = framedPhotosNA || framedPhotos;
  const isSpecialSeatingFilled = specialSeatingNeedsNA || specialSeatingNeeds;
  const isSpecialInstructionsFilled = processionalSpecialInstructionsNA || processionalSpecialInstructions;

  const allRequiredFieldsFilled = isWalkingDownAisleFilled && isEscortFilled && isRingBearerFilled && 
    isHonoredGuestsFilled && isBrideSideFilled && isGroomSideFilled && isFramedPhotosFilled && 
    isSpecialSeatingFilled && isSpecialInstructionsFilled;

  const someFieldsEmpty = !isWalkingDownAisleFilled || !isEscortFilled || !isRingBearerFilled || 
    !isHonoredGuestsFilled || !isBrideSideFilled || !isGroomSideFilled || !isFramedPhotosFilled || 
    !isSpecialSeatingFilled || !isSpecialInstructionsFilled;

  const handleCompletionStatusChange = (status: string) => {
    if (processionalCompletionStatus === status) {
      onChange('processionalCompletionStatus', '');
    } else {
      onChange('processionalCompletionStatus', status);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Ceremony Processional & Seating Planner</h2>
        <p className="text-muted-foreground">
          Make sure everyone is in the right place at the right time — calmly, beautifully, and without the need for a formal rehearsal.
        </p>
      </div>

      {readOnly && (
        <div className="flex gap-3 items-center bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="font-medium text-amber-900 dark:text-amber-100">Available with the Full Modest Wedding Package</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Walking Down the Aisle</CardTitle>
          </div>
          <CardDescription>Who will walk you down the aisle?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={walkingDownAisle} onValueChange={(value) => onChange('walkingDownAisle', value)} disabled={readOnly}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="walk-solo" data-testid="radio-walk-solo" />
              <Label htmlFor="walk-solo" className="cursor-pointer">I'll walk solo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="with-someone" id="walk-with-someone" data-testid="radio-walk-with-someone" />
              <Label htmlFor="walk-with-someone" className="cursor-pointer">Yes, with someone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="undecided" id="walk-undecided" data-testid="radio-walk-undecided" />
              <Label htmlFor="walk-undecided" className="cursor-pointer">Undecided</Label>
            </div>
          </RadioGroup>

          {walkingDownAisle === 'with-someone' && (
            <div className="space-y-2">
              <Label htmlFor="escort-name">Name of Escort</Label>
              <Input
                id="escort-name"
                data-testid="input-escort-name"
                placeholder="Name & relationship (e.g., 'Father, John Smith')"
                value={escortName}
                onChange={(e) => onChange('escortName', e.target.value)}
                disabled={readOnly}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ring Bearer or Flower Child</CardTitle>
          <CardDescription>Will you include a ring bearer or flower child in your ceremony?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={ringBearerIncluded} onValueChange={(value) => onChange('ringBearerIncluded', value)} disabled={readOnly}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="ring-bearer-yes" data-testid="radio-ring-bearer-yes" />
              <Label htmlFor="ring-bearer-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="ring-bearer-no" data-testid="radio-ring-bearer-no" />
              <Label htmlFor="ring-bearer-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>

          {ringBearerIncluded === 'yes' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ring-bearer-flower-girl">Ring Bearer / Flower Child Details</Label>
                <Textarea
                  id="ring-bearer-flower-girl"
                  data-testid="input-ring-bearer-flower-girl"
                  placeholder="Name(s), ages, and any special notes"
                  value={ringBearerFlowerGirl}
                  onChange={(e) => onChange('ringBearerFlowerGirl', e.target.value)}
                  rows={2}
                  disabled={readOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ring-bearer-organizer">Organizer for Children</Label>
                <Textarea
                  id="ring-bearer-organizer"
                  data-testid="input-ring-bearer-organizer"
                  placeholder="Someone from your party to organize children and set pace (Name and any special notes)"
                  value={ringBearerOrganizer}
                  onChange={(e) => onChange('ringBearerOrganizer', e.target.value)}
                  rows={2}
                  disabled={readOnly}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Honored Guest Escorts</CardTitle>
          <CardDescription>Should wedding party members escort special guests to their seats?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            data-testid="input-honored-guest-escorts"
            placeholder='Example: "Groomsman escorts Mother of the Bride"'
            value={honoredGuestEscorts}
            onChange={(e) => onChange('honoredGuestEscorts', e.target.value)}
            rows={3}
            disabled={honoredGuestEscortsNA || readOnly}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="honored-guest-escorts-na"
              data-testid="checkbox-honored-guest-escorts-na"
              checked={honoredGuestEscortsNA}
              onCheckedChange={(checked) => {
                onChange('honoredGuestEscortsNA', checked as boolean);
                if (checked) {
                  onChange('honoredGuestEscorts', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="honored-guest-escorts-na" className="cursor-pointer">
              No - Guests can seat themselves
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reserved Front Row Seating</CardTitle>
          <CardDescription>Who should be seated in the front row on each side?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bride-side-front-row">Bride's Side Front Row</Label>
            <Textarea
              id="bride-side-front-row"
              data-testid="input-bride-side-front-row"
              placeholder="Names & relationships"
              value={brideSideFrontRow}
              onChange={(e) => onChange('brideSideFrontRow', e.target.value)}
              rows={2}
              disabled={brideSideFrontRowNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bride-side-front-row-na"
                data-testid="checkbox-bride-side-front-row-na"
                checked={brideSideFrontRowNA}
                onCheckedChange={(checked) => {
                  onChange('brideSideFrontRowNA', checked as boolean);
                  if (checked) {
                    onChange('brideSideFrontRow', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="bride-side-front-row-na" className="cursor-pointer">
                N/A
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groom-side-front-row">Groom's Side Front Row</Label>
            <Textarea
              id="groom-side-front-row"
              data-testid="input-groom-side-front-row"
              placeholder="Names & relationships"
              value={groomSideFrontRow}
              onChange={(e) => onChange('groomSideFrontRow', e.target.value)}
              rows={2}
              disabled={groomSideFrontRowNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="groom-side-front-row-na"
                data-testid="checkbox-groom-side-front-row-na"
                checked={groomSideFrontRowNA}
                onCheckedChange={(checked) => {
                  onChange('groomSideFrontRowNA', checked as boolean);
                  if (checked) {
                    onChange('groomSideFrontRow', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="groom-side-front-row-na" className="cursor-pointer">
                N/A
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="framed-photos">Framed Photos of Honor</Label>
            <Textarea
              id="framed-photos"
              data-testid="input-framed-photos"
              placeholder="Family members not able to attend (names, relationships, and who will be responsible for photos)"
              value={framedPhotos}
              onChange={(e) => onChange('framedPhotos', e.target.value)}
              rows={2}
              disabled={framedPhotosNA || readOnly}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="framed-photos-na"
                data-testid="checkbox-framed-photos-na"
                checked={framedPhotosNA}
                onCheckedChange={(checked) => {
                  onChange('framedPhotosNA', checked as boolean);
                  if (checked) {
                    onChange('framedPhotos', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="framed-photos-na" className="cursor-pointer">
                N/A
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Seating or Mobility Needs</CardTitle>
          <CardDescription>Do you have any guests who need special seating arrangements or assistance?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            data-testid="input-special-seating-needs"
            placeholder="Names or instructions"
            value={specialSeatingNeeds}
            onChange={(e) => onChange('specialSeatingNeeds', e.target.value)}
            rows={2}
            disabled={specialSeatingNeedsNA || readOnly}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="special-seating-needs-na"
              data-testid="checkbox-special-seating-needs-na"
              checked={specialSeatingNeedsNA}
              onCheckedChange={(checked) => {
                onChange('specialSeatingNeedsNA', checked as boolean);
                if (checked) {
                  onChange('specialSeatingNeeds', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="special-seating-needs-na" className="cursor-pointer">
              N/A
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Instructions & Notes</CardTitle>
          <CardDescription>Any additional details about your processional, guest seating, or ceremony flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            data-testid="input-processional-special-instructions"
            placeholder="Share any additional preferences or details..."
            value={processionalSpecialInstructions}
            onChange={(e) => onChange('processionalSpecialInstructions', e.target.value)}
            rows={3}
            disabled={processionalSpecialInstructionsNA || readOnly}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="processional-special-instructions-na"
              data-testid="checkbox-processional-special-instructions-na"
              checked={processionalSpecialInstructionsNA}
              onCheckedChange={(checked) => {
                onChange('processionalSpecialInstructionsNA', checked as boolean);
                if (checked) {
                  onChange('processionalSpecialInstructions', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="processional-special-instructions-na" className="cursor-pointer">
              N/A
            </Label>
          </div>

          <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Our staff and your groomsmen will ensure every honored guest is guided smoothly and comfortably to their seats — no stress, no formal rehearsal required.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processional Planning Status</CardTitle>
          <CardDescription>Let us know if you're ready to move forward or need more time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="processional-all-done"
              data-testid="checkbox-processional-all-done"
              checked={processionalCompletionStatus === 'all-done'}
              onCheckedChange={() => handleCompletionStatusChange('all-done')}
              disabled={readOnly || !allRequiredFieldsFilled}
            />
            <Label htmlFor="processional-all-done" className={`cursor-pointer font-medium ${!allRequiredFieldsFilled ? 'opacity-50' : ''}`}>
              All done (for now)
            </Label>
          </div>
          
          {!allRequiredFieldsFilled && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="processional-finish-later"
                data-testid="checkbox-processional-finish-later"
                checked={processionalCompletionStatus === 'finish-later'}
                onCheckedChange={() => handleCompletionStatusChange('finish-later')}
                disabled={readOnly}
              />
              <Label htmlFor="processional-finish-later" className="cursor-pointer font-medium">
                We'll finish this later
              </Label>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
