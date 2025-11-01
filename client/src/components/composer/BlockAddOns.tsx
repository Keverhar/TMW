import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAddonPrice } from "@shared/pricing";
import { ShoppingBag } from "lucide-react";

interface BlockAddOnsProps {
  photoBookAddon: boolean;
  photoBookQuantity: number;
  extraTimeAddon: boolean;
  byobBarAddon: boolean;
  rehearsalAddon: boolean;
  mailingAddress: string;
  onChange: (field: string, value: string | number | boolean) => void;
  eventType: string;
  preferredDate: string;
  timeSlot: string;
}

export default function BlockAddOns({
  photoBookAddon,
  photoBookQuantity,
  extraTimeAddon,
  byobBarAddon,
  rehearsalAddon,
  mailingAddress,
  onChange,
  eventType,
  preferredDate,
  timeSlot,
}: BlockAddOnsProps) {
  const [showByobDialog, setShowByobDialog] = useState(false);
  const isSimplifiedFlow = eventType === 'modest-elopement' || eventType === 'vow-renewal';
  
  // Check if Extra Time addon is eligible (Saturday at 6:00 PM)
  const isExtraTimeEligible = () => {
    if (!preferredDate || !timeSlot) return false;
    
    const date = new Date(preferredDate + 'T12:00:00');
    const isSaturday = date.getDay() === 6;
    const is6PM = timeSlot === '6pm-9pm' || timeSlot === '6pm';
    
    return isSaturday && is6PM;
  };
  
  const photoBookPrice = getAddonPrice('photoBook');
  const extraTimePrice = getAddonPrice('extraTime');
  const byobBarPrice = getAddonPrice('byobBar');
  const rehearsalPrice = getAddonPrice('rehearsal');

  const handleByobChange = (checked: boolean) => {
    if (checked) {
      setShowByobDialog(true);
    } else {
      onChange('byobBarAddon', false);
    }
  };

  const handleByobAccept = () => {
    onChange('byobBarAddon', true);
    setShowByobDialog(false);
  };

  const handleByobDecline = () => {
    onChange('byobBarAddon', false);
    setShowByobDialog(false);
  };

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
              <div className="ml-7 space-y-4">
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label htmlFor="mailing-address">
                    Mailing Address (for photo book delivery) *
                  </Label>
                  <Textarea
                    id="mailing-address"
                    data-testid="input-mailing-address"
                    placeholder="Street address, city, state, ZIP"
                    value={mailingAddress}
                    onChange={(e) => onChange('mailingAddress', e.target.value)}
                    rows={3}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Please provide a complete mailing address where your photo book will be delivered.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Extra Time Add-On - Only for Modest Wedding on Saturday at 6pm */}
          {!isSimplifiedFlow && (
            <div className={`space-y-3 p-4 border rounded-lg ${!isExtraTimeEligible() ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="extra-time-addon"
                  checked={extraTimeAddon}
                  disabled={!isExtraTimeEligible()}
                  onCheckedChange={(checked) => onChange('extraTimeAddon', checked as boolean)}
                  data-testid="checkbox-extra-time-addon"
                />
                <div className="flex-1">
                  <Label htmlFor="extra-time-addon" className={isExtraTimeEligible() ? "cursor-pointer text-base font-medium" : "cursor-not-allowed text-base font-medium"}>
                    Extra Time - ${(extraTimePrice / 100).toFixed(2)}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an additional hour to your celebration
                  </p>
                  {!isExtraTimeEligible() && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Only available on Saturday at 6:00 PM
                    </p>
                  )}
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
                  onCheckedChange={(checked) => handleByobChange(checked as boolean)}
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

      <Dialog open={showByobDialog} onOpenChange={setShowByobDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legal Stuff</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleByobDecline} data-testid="button-byob-decline">
              Decline
            </Button>
            <Button onClick={handleByobAccept} data-testid="button-byob-accept">
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
