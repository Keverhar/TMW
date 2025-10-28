import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PartyPopper } from "lucide-react";

interface Block8ReceptionProps {
  firstDance: string;
  motherSonDance: string;
  specialDances: string;
  toastGivers: string;
  beveragePreferences: string;
  horsDoeuvresPreferences: string;
  sendOffStyle: string;
  receptionSpecialRequests: string;
  onChange: (field: string, value: string) => void;
}

export default function Block8Reception({
  firstDance,
  motherSonDance,
  specialDances,
  toastGivers,
  beveragePreferences,
  horsDoeuvresPreferences,
  sendOffStyle,
  receptionSpecialRequests,
  onChange
}: Block8ReceptionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Reception Preferences</h2>
        <p className="text-muted-foreground">
          Let's plan the celebration! From toasts and dances to beverages and send-offs, this is where the party comes to life.
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
          <CardTitle>Beverages & Hors d'oeuvres</CardTitle>
          <CardDescription>Share your preferences for refreshments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="beverage-preferences">Beverage Preferences</Label>
            <Textarea
              id="beverage-preferences"
              data-testid="input-beverage-preferences"
              placeholder="Any specific beverage requests or preferences?"
              value={beveragePreferences}
              onChange={(e) => onChange('beveragePreferences', e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Optional BYOB bar setup available ($400) - we'll guide you through licensing and provide setup/server
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hors-doeuvres-preferences">Hors d'oeuvres Preferences</Label>
            <Textarea
              id="hors-doeuvres-preferences"
              data-testid="input-hors-doeuvres-preferences"
              placeholder="Any dietary restrictions or preferences for appetizers?"
              value={horsDoeuvresPreferences}
              onChange={(e) => onChange('horsDoeuvresPreferences', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send-Off Style</CardTitle>
          <CardDescription>How would you like to make your exit?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="send-off-style">Send-Off Preferences</Label>
            <Textarea
              id="send-off-style"
              data-testid="input-send-off-style"
              placeholder="Sparklers, bubbles, rose petals, or something else? Describe your vision..."
              value={sendOffStyle}
              onChange={(e) => onChange('sendOffStyle', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reception Special Requests</CardTitle>
          <CardDescription>Any other details or special touches for your reception?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            data-testid="input-reception-special-requests"
            placeholder="Share any additional preferences or special requests..."
            value={receptionSpecialRequests}
            onChange={(e) => onChange('receptionSpecialRequests', e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
