import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles } from "lucide-react";

interface Block6CeremonyProps {
  ceremonyScript: string;
  unityCandle: boolean;
  sandCeremony: boolean;
  handfasting: boolean;
  guestReadingOrSong: string;
  guestReadingOrSongName: string;
  officiantPassage: string;
  includingChild: string;
  petInvolvement: string;
  ceremonySpecialRequests: string;
  onChange: (field: string, value: string | boolean) => void;
  showAddOns?: boolean;
}

const ceremonyScripts = [
  {
    value: "simple-modern",
    label: "Simple & Modern",
    icon: "✨",
    description: "A contemporary, heartfelt ceremony focused on love, partnership, and shared promises. Perfect for couples who want something simple, elegant, and deeply meaningful without traditional or religious language."
  },
  {
    value: "christian-traditional",
    label: "Christian Traditional",
    icon: "✝️",
    description: "A classic Christian ceremony rooted in scripture and sacred vows. Includes prayers, blessings, and a solemn tone centered on faith."
  },
  {
    value: "nature-harmony",
    label: "Nature & Harmony",
    icon: "🌿",
    description: "A poetic, nature-inspired ceremony that celebrates balance, growth, and the natural rhythms of love."
  },
  {
    value: "peace-love",
    label: "Peace & Love",
    icon: "☮️",
    description: "A gentle, heartfelt ceremony focused on compassion, connection, and shared humanity."
  }
];

export default function Block6Ceremony({
  ceremonyScript,
  unityCandle,
  sandCeremony,
  handfasting,
  guestReadingOrSong,
  guestReadingOrSongName,
  officiantPassage,
  includingChild,
  petInvolvement,
  ceremonySpecialRequests,
  onChange,
  showAddOns = true
}: Block6CeremonyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Ceremony Preferences</h2>
        <p className="text-muted-foreground">
          Your ceremony is the heart of your day — the part you'll remember most clearly years from now.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <CardTitle>Ceremony Script</CardTitle>
          </div>
          <CardDescription>Choose the words, mood, and meaning of the moment when you officially say "I do"</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={ceremonyScript} onValueChange={(value) => onChange('ceremonyScript', value)}>
            {ceremonyScripts.map((script) => (
              <div key={script.value} className="flex items-start space-x-2 p-4 rounded-md border hover-elevate">
                <RadioGroupItem value={script.value} id={`script-${script.value}`} data-testid={`radio-script-${script.value}`} className="mt-1" />
                <Label htmlFor={`script-${script.value}`} className="flex-1 cursor-pointer">
                  <span className="font-medium block text-lg">{script.icon} {script.label}</span>
                  <span className="text-sm text-muted-foreground block mt-1">{script.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optional Ceremony Elements</CardTitle>
          <CardDescription>Add meaningful rituals and traditions (all items must be provided by you)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="unity-candle"
              data-testid="checkbox-unity-candle"
              checked={unityCandle}
              onCheckedChange={(checked) => onChange('unityCandle', checked as boolean)}
            />
            <Label htmlFor="unity-candle" className="cursor-pointer">
              Unity Candle (we'll bring a unity candle set)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sand-ceremony"
              data-testid="checkbox-sand-ceremony"
              checked={sandCeremony}
              onCheckedChange={(checked) => onChange('sandCeremony', checked as boolean)}
            />
            <Label htmlFor="sand-ceremony" className="cursor-pointer">
              Sand Ceremony (we'll bring sand and vessels)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="handfasting"
              data-testid="checkbox-handfasting"
              checked={handfasting}
              onCheckedChange={(checked) => onChange('handfasting', checked as boolean)}
            />
            <Label htmlFor="handfasting" className="cursor-pointer">
              Handfasting (we'll bring a handfasting ribbon or cord)
            </Label>
          </div>
        </CardContent>
      </Card>

      {showAddOns && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Additional Ceremony Add-Ons</CardTitle>
            </div>
            <CardDescription>Personalize your ceremony with special touches (all completely optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest-reading-or-song">Singing, Reading or Poem by a Guest</Label>
              <Input
                id="guest-reading-or-song-name"
                data-testid="input-guest-reading-or-song-name"
                placeholder="Name of guest"
                value={guestReadingOrSongName}
                onChange={(e) => onChange('guestReadingOrSongName', e.target.value)}
              />
              <Textarea
                id="guest-reading-or-song"
                data-testid="input-guest-reading-or-song"
                placeholder="Please describe how you'd like them involved and when"
                value={guestReadingOrSong}
                onChange={(e) => onChange('guestReadingOrSong', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officiant-passage">Passage Reading by the Officiant</Label>
              <Textarea
                id="officiant-passage"
                data-testid="input-officiant-passage"
                placeholder="Upload or paste the passage here (10 minute max)"
                value={officiantPassage}
                onChange={(e) => onChange('officiantPassage', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="including-child">Including a Child or Children</Label>
              <Textarea
                id="including-child"
                data-testid="input-including-child"
                placeholder="Please describe how you'd like them involved (family vow, unity ritual, gift presentation, etc.)"
                value={includingChild}
                onChange={(e) => onChange('includingChild', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-involvement">Pet Involvement</Label>
              <Textarea
                id="pet-involvement"
                data-testid="input-pet-involvement"
                placeholder="Name, role, and handler details (Note: pets only allowed in chapel area, not reception)"
                value={petInvolvement}
                onChange={(e) => onChange('petInvolvement', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ceremony-special-requests">Other Special Requests</Label>
              <Textarea
                id="ceremony-special-requests"
                data-testid="input-ceremony-special-requests"
                placeholder="Any other details you'd like your officiant to include (max 400 characters)"
                value={ceremonySpecialRequests}
                onChange={(e) => onChange('ceremonySpecialRequests', e.target.value)}
                rows={2}
                maxLength={400}
              />
              <p className="text-xs text-muted-foreground">
                {ceremonySpecialRequests.length}/400 characters
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
