import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Info } from "lucide-react";

interface Block11PersonalTouchesProps {
  freshFlorals: string;
  guestBook: string;
  cakeKnifeServiceSet: string;
  departureOrganizer: string;
  departureVehicle: string;
  personalTouchesSpecialInstructions: string;
  onChange: (field: string, value: string) => void;
}

export default function Block11PersonalTouches({
  freshFlorals,
  guestBook,
  cakeKnifeServiceSet,
  departureOrganizer,
  departureVehicle,
  personalTouchesSpecialInstructions,
  onChange
}: Block11PersonalTouchesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Special Personal Touches</h2>
        <p className="text-muted-foreground">
          Small personal details can make your celebration feel even more you. All items below are completely optional and no cost.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <CardTitle>Fresh Florals</CardTitle>
          </div>
          <CardDescription>Would you like to bring a fresh bridal bouquet or wedding party arrangements from your florist?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="fresh-florals">Floral Details</Label>
            <Textarea
              id="fresh-florals"
              data-testid="input-fresh-florals"
              placeholder="Florist name, delivery details, or special instructions. Or type 'No thanks' if keeping things simple."
              value={freshFlorals}
              onChange={(e) => onChange('freshFlorals', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              We'll receive deliveries directly from your florist, refrigerate them on arrival, and present them at the perfect time.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guest Book</CardTitle>
          <CardDescription>Will you be bringing a guest book for your celebration?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="guest-book">Guest Book Details</Label>
            <Textarea
              id="guest-book"
              data-testid="input-guest-book"
              placeholder="Any placement instructions or notes, or 'No thanks' if not bringing one"
              value={guestBook}
              onChange={(e) => onChange('guestBook', e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              We'll make sure it's displayed thoughtfully and ready for guests to sign. We provide a designated gift table and card box.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cake Knife & Service Set</CardTitle>
          <CardDescription>Would you like us to use a special cake knife or service set you're bringing?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="cake-knife-service-set">Cake Service Set Details</Label>
            <Textarea
              id="cake-knife-service-set"
              data-testid="input-cake-knife-service-set"
              placeholder="Where it will be delivered or who will bring it, or 'No thanks - please provide one' if you'd like us to provide an attractive service set"
              value={cakeKnifeServiceSet}
              onChange={(e) => onChange('cakeKnifeServiceSet', e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              We'll place your knife and server next to the cake display before the cake-cutting moment.
            </p>
          </div>
        </CardContent>
      </Card>

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
            />
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

      <Card>
        <CardHeader>
          <CardTitle>Departure Vehicle</CardTitle>
          <CardDescription>Are you planning a special send-off vehicle?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="departure-vehicle">Departure Vehicle Details</Label>
            <Textarea
              id="departure-vehicle"
              data-testid="input-departure-vehicle"
              placeholder="Classic car, limo, or black sedan? Include arrival time, company name, and pickup details. Or 'No thanks, we got this.'"
              value={departureVehicle}
              onChange={(e) => onChange('departureVehicle', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              If arranged, our team will help guide your guests outside and ensure your departure goes smoothly.
            </p>
          </div>
        </CardContent>
      </Card>

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
          />
        </CardContent>
      </Card>
    </div>
  );
}
