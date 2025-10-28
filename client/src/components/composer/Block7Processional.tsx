import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, Info } from "lucide-react";

interface Block7ProcessionalProps {
  walkingDownAisle: string;
  ringBearerFlowerGirl: string;
  ringBearerOrganizer: string;
  honoredGuestEscorts: string;
  brideSideFrontRow: string;
  groomSideFrontRow: string;
  framedPhotos: string;
  specialSeatingNeeds: string;
  processionalSpecialInstructions: string;
  onChange: (field: string, value: string) => void;
}

export default function Block7Processional({
  walkingDownAisle,
  ringBearerFlowerGirl,
  ringBearerOrganizer,
  honoredGuestEscorts,
  brideSideFrontRow,
  groomSideFrontRow,
  framedPhotos,
  specialSeatingNeeds,
  processionalSpecialInstructions,
  onChange
}: Block7ProcessionalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Ceremony Processional & Seating Planner</h2>
        <p className="text-muted-foreground">
          Make sure everyone is in the right place at the right time — calmly, beautifully, and without the need for a formal rehearsal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Walking Down the Aisle</CardTitle>
          </div>
          <CardDescription>Who will walk you down the aisle?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={walkingDownAisle} onValueChange={(value) => onChange('walkingDownAisle', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="walk-solo" data-testid="radio-walk-solo" />
              <Label htmlFor="walk-solo" className="cursor-pointer">I'll walk solo</Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="with-someone" id="walk-with-someone" data-testid="radio-walk-with-someone" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="walk-with-someone" className="cursor-pointer block mb-2">Yes, with someone</Label>
                {walkingDownAisle === 'with-someone' && (
                  <Textarea
                    data-testid="input-walking-down-aisle-details"
                    placeholder="Name & relationship (e.g., 'Father, John Smith')"
                    value={walkingDownAisle === 'with-someone' ? walkingDownAisle : ''}
                    onChange={(e) => onChange('walkingDownAisle', e.target.value)}
                    rows={2}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="undecided" id="walk-undecided" data-testid="radio-walk-undecided" />
              <Label htmlFor="walk-undecided" className="cursor-pointer">Undecided</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ring Bearer or Flower Girl</CardTitle>
          <CardDescription>Will you include a ring bearer or flower girl in your ceremony?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ring-bearer-flower-girl">Ring Bearer / Flower Girl Details</Label>
            <Textarea
              id="ring-bearer-flower-girl"
              data-testid="input-ring-bearer-flower-girl"
              placeholder="Name(s), ages, and any special notes, or 'No' if not applicable"
              value={ringBearerFlowerGirl}
              onChange={(e) => onChange('ringBearerFlowerGirl', e.target.value)}
              rows={2}
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
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Honored Guest Escorts</CardTitle>
          <CardDescription>Should wedding party members escort special guests to their seats?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            data-testid="input-honored-guest-escorts"
            placeholder='Example: "Groomsman escorts Mother of the Bride" or "No - guests can seat themselves"'
            value={honoredGuestEscorts}
            onChange={(e) => onChange('honoredGuestEscorts', e.target.value)}
            rows={3}
          />
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
            />
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
            />
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
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Seating or Mobility Needs</CardTitle>
          <CardDescription>Do you have any guests who need special seating arrangements or assistance?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            data-testid="input-special-seating-needs"
            placeholder="Names or instructions, or 'No' if not applicable"
            value={specialSeatingNeeds}
            onChange={(e) => onChange('specialSeatingNeeds', e.target.value)}
            rows={2}
          />
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
          />

          <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Our staff and your groomsmen will ensure every honored guest is guided smoothly and comfortably to their seats — no stress, no formal rehearsal required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
