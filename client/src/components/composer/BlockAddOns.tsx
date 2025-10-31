import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getAddonPrice } from "@shared/pricing";
import { ShoppingBag } from "lucide-react";

interface BlockAddOnsProps {
  photoBookAddon: boolean;
  photoBookQuantity: number;
  extraTimeAddon: boolean;
  byobBarAddon: boolean;
  rehearsalAddon: boolean;
  onChange: (field: string, value: string | number | boolean) => void;
  eventType: string;
}

export default function BlockAddOns({
  photoBookAddon,
  photoBookQuantity,
  extraTimeAddon,
  byobBarAddon,
  rehearsalAddon,
  onChange,
  eventType,
}: BlockAddOnsProps) {
  const isSimplifiedFlow = eventType === 'modest-elopement' || eventType === 'vow-renewal';
  
  const photoBookPrice = getAddonPrice('photoBook');
  const extraTimePrice = getAddonPrice('extraTime');
  const byobBarPrice = getAddonPrice('byobBar');
  const rehearsalPrice = getAddonPrice('rehearsal');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <CardTitle>Add-Ons</CardTitle>
          </div>
          <CardDescription>Enhance your celebration with these optional upgrades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Book Add-On */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Checkbox
                id="photo-book-addon"
                checked={photoBookAddon}
                onCheckedChange={(checked) => onChange('photoBookAddon', checked as boolean)}
                data-testid="checkbox-photo-book-addon"
              />
              <div className="flex-1">
                <Label htmlFor="photo-book-addon" className="cursor-pointer text-base font-medium">
                  Photo Book - ${(photoBookPrice / 100).toFixed(2)} each
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  A beautifully designed keepsake photo book of your special day
                </p>
              </div>
            </div>
            
            {photoBookAddon && (
              <div className="ml-7 space-y-2">
                <Label htmlFor="photo-book-quantity">Quantity</Label>
                <Input
                  id="photo-book-quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={photoBookQuantity}
                  onChange={(e) => onChange('photoBookQuantity', parseInt(e.target.value) || 1)}
                  className="w-24"
                  data-testid="input-photo-book-quantity"
                />
              </div>
            )}
          </div>

          {/* Extra Time Add-On - Only for Modest Wedding */}
          {!isSimplifiedFlow && (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="extra-time-addon"
                  checked={extraTimeAddon}
                  onCheckedChange={(checked) => onChange('extraTimeAddon', checked as boolean)}
                  data-testid="checkbox-extra-time-addon"
                />
                <div className="flex-1">
                  <Label htmlFor="extra-time-addon" className="cursor-pointer text-base font-medium">
                    Extra Time - ${(extraTimePrice / 100).toFixed(2)}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an additional hour to your celebration
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BYOB Bar Add-On - Only for Modest Wedding */}
          {!isSimplifiedFlow && (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="byob-bar-addon"
                  checked={byobBarAddon}
                  onCheckedChange={(checked) => onChange('byobBarAddon', checked as boolean)}
                  data-testid="checkbox-byob-bar-addon"
                />
                <div className="flex-1">
                  <Label htmlFor="byob-bar-addon" className="cursor-pointer text-base font-medium">
                    BYOB Bar Service - ${(byobBarPrice / 100).toFixed(2)}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professional bar service for your beverages (bring your own beverages)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rehearsal Add-On - Only for Modest Wedding */}
          {!isSimplifiedFlow && (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="rehearsal-addon"
                  checked={rehearsalAddon}
                  onCheckedChange={(checked) => onChange('rehearsalAddon', checked as boolean)}
                  data-testid="checkbox-rehearsal-addon"
                />
                <div className="flex-1">
                  <Label htmlFor="rehearsal-addon" className="cursor-pointer text-base font-medium">
                    Rehearsal - ${(rehearsalPrice / 100).toFixed(2)}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    A practice run-through the day before your wedding
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
