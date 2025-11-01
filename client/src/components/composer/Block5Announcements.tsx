import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Mic, Sparkles, Lock } from "lucide-react";

interface Block5AnnouncementsProps {
  grandIntroduction: string;
  fatherDaughterDanceAnnouncement: string;
  toastsSpeechesAnnouncement: string;
  guestCallouts: string;
  vibeCheck: string;
  announcementsCompletionStatus: string;
  onChange: (field: string, value: string) => void;
  readOnly?: boolean;
}

const vibeOptions = [
  {
    value: "warm-romantic",
    label: "Warm & Romantic",
    description: "Heartfelt, emotional, and deeply personal"
  },
  {
    value: "lively-celebratory",
    label: "Lively & Celebratory",
    description: "High-energy, joyful, and interactive"
  },
  {
    value: "simple-unobtrusive",
    label: "Simple & Unobtrusive",
    description: "Seamless, minimal, and understated"
  }
];

export default function Block5Announcements({
  grandIntroduction,
  fatherDaughterDanceAnnouncement,
  toastsSpeechesAnnouncement,
  guestCallouts,
  vibeCheck,
  announcementsCompletionStatus,
  onChange,
  readOnly = false
}: Block5AnnouncementsProps) {
  const allRequiredFieldsFilled = grandIntroduction && fatherDaughterDanceAnnouncement && toastsSpeechesAnnouncement && vibeCheck;
  const someFieldsEmpty = !grandIntroduction || !fatherDaughterDanceAnnouncement || !toastsSpeechesAnnouncement || !vibeCheck;

  const handleCompletionStatusChange = (status: string) => {
    if (announcementsCompletionStatus === status) {
      onChange('announcementsCompletionStatus', '');
    } else {
      onChange('announcementsCompletionStatus', status);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Announcements & Special Moments</h2>
        <p className="text-muted-foreground">
          Words create memories — shape exactly how those moments sound and feel.
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
            <Mic className="h-5 w-5" />
            <CardTitle>Grand Introduction</CardTitle>
          </div>
          <CardDescription>How would you like to be introduced as newlyweds when you enter your reception?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grand-introduction">Your Preferred Introduction</Label>
            <Textarea
              id="grand-introduction"
              data-testid="input-grand-introduction"
              placeholder='Example: "Please welcome for the very first time, Mr. and Mrs. James Carter!"'
              value={grandIntroduction}
              onChange={(e) => onChange('grandIntroduction', e.target.value)}
              rows={3}
              disabled={readOnly}
            />
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Examples:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "Please welcome for the very first time, Mr. and Mrs. James Carter!"</li>
              <li>• "Let's hear it for the newlyweds — Taylor and Morgan!"</li>
              <li>• "Give a warm welcome to the stars of the day, Alex and Jordan!"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Moments & Announcements</CardTitle>
          <CardDescription>Personalize the way your emcee announces your milestone moments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="father-daughter-dance-announcement">Father-Daughter Dance</Label>
            <Textarea
              id="father-daughter-dance-announcement"
              data-testid="input-father-daughter-dance-announcement"
              placeholder="How would you like this moment announced?"
              value={fatherDaughterDanceAnnouncement}
              onChange={(e) => onChange('fatherDaughterDanceAnnouncement', e.target.value)}
              rows={2}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toasts-speeches-announcement">Toasts & Speeches</Label>
            <Textarea
              id="toasts-speeches-announcement"
              data-testid="input-toasts-speeches-announcement"
              placeholder="Any specific instructions for introducing toasts?"
              value={toastsSpeechesAnnouncement}
              onChange={(e) => onChange('toastsSpeechesAnnouncement', e.target.value)}
              rows={2}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-callouts">Guest Callouts (Optional)</Label>
            <Textarea
              id="guest-callouts"
              data-testid="input-guest-callouts"
              placeholder="Any special guests you'd like the emcee to acknowledge?"
              value={guestCallouts}
              onChange={(e) => onChange('guestCallouts', e.target.value)}
              rows={2}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle>Vibe Check – Make Sure It Feels Right</CardTitle>
          </div>
          <CardDescription>This guides how your emcee speaks, how transitions feel, and how the whole celebration flows</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={vibeCheck} onValueChange={(value) => onChange('vibeCheck', value)} disabled={readOnly}>
            {vibeOptions.map((vibe) => (
              <div key={vibe.value} className="flex items-start space-x-2 p-3 rounded-md hover-elevate">
                <RadioGroupItem value={vibe.value} id={`vibe-${vibe.value}`} data-testid={`radio-vibe-${vibe.value}`} className="mt-1" disabled={readOnly} />
                <Label htmlFor={`vibe-${vibe.value}`} className="flex-1 cursor-pointer">
                  <span className="font-medium block">{vibe.label}</span>
                  <span className="text-sm text-muted-foreground">{vibe.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Announcements Selection Status</CardTitle>
          <CardDescription>Let us know if you're ready to move forward or need more time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="announcements-all-done"
              data-testid="checkbox-announcements-all-done"
              checked={announcementsCompletionStatus === 'all-done'}
              onCheckedChange={() => handleCompletionStatusChange('all-done')}
              disabled={readOnly || !allRequiredFieldsFilled}
            />
            <Label htmlFor="announcements-all-done" className={`cursor-pointer font-medium ${!allRequiredFieldsFilled ? 'opacity-50' : ''}`}>
              All done (for now)
            </Label>
          </div>
          
          {!allRequiredFieldsFilled && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="announcements-finish-later"
                data-testid="checkbox-announcements-finish-later"
                checked={announcementsCompletionStatus === 'finish-later'}
                onCheckedChange={() => handleCompletionStatusChange('finish-later')}
                disabled={readOnly}
              />
              <Label htmlFor="announcements-finish-later" className="cursor-pointer font-medium">
                We'll finish this later
              </Label>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
