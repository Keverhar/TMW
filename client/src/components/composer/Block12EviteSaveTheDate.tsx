import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Mail, Download, Share2, Sparkles, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Block12EviteSaveTheDateProps {
  eviteDesignStyle: string;
  eviteHeaderText: string;
  eviteBodyText: string;
  eviteRsvpOption: string;
  eviteRsvpCustomLink: string;
  eviteDesignNoSpecialRequests: boolean;
  eviteWordingNoSpecialRequests: boolean;
  eviteRsvpNoSpecialRequests: boolean;
  eviteCompletionStatus: string;
  onChange: (field: string, value: string | boolean) => void;
  customerName: string;
  customerName2: string;
  preferredDate: string;
  timeSlot: string;
  readOnly?: boolean;
}

const designTemplates = [
  {
    id: 'classic-script',
    name: 'Classic Script',
    description: 'Elegant serif fonts with romantic flourishes',
    preview: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950',
    textColor: 'text-rose-900 dark:text-rose-100'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean lines and contemporary sans-serif',
    preview: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900',
    textColor: 'text-slate-900 dark:text-slate-100'
  },
  {
    id: 'garden-romance',
    name: 'Garden Romance',
    description: 'Botanical elements with soft pastels',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
    textColor: 'text-green-900 dark:text-green-100'
  },
  {
    id: 'elegant-black-white',
    name: 'Elegant Black & White',
    description: 'Timeless monochrome sophistication',
    preview: 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-black',
    textColor: 'text-black dark:text-white'
  },
  {
    id: 'boho-neutrals',
    name: 'Boho Neutrals',
    description: 'Earthy tones with organic textures',
    preview: 'bg-gradient-to-br from-amber-50 to-stone-50 dark:from-amber-950 dark:to-stone-950',
    textColor: 'text-amber-900 dark:text-amber-100'
  }
];

const rsvpOptions = [
  { id: 'formal_invitation_to_follow', label: 'Formal invitation to follow' },
  { id: 'rsvp_info_to_come', label: 'RSVP info to come' },
  { id: 'custom_link', label: 'Direct guests to RSVP link (enter URL below)' }
];

export default function Block12EviteSaveTheDate({
  eviteDesignStyle,
  eviteHeaderText,
  eviteBodyText,
  eviteRsvpOption,
  eviteRsvpCustomLink,
  eviteDesignNoSpecialRequests,
  eviteWordingNoSpecialRequests,
  eviteRsvpNoSpecialRequests,
  eviteCompletionStatus,
  onChange,
  customerName,
  customerName2,
  preferredDate,
  timeSlot,
  readOnly = false
}: Block12EviteSaveTheDateProps) {
  const { toast } = useToast();

  const selectedTemplate = designTemplates.find(t => t.id === eviteDesignStyle) || designTemplates[0];

  const hasDesignSelection = eviteDesignStyle || eviteDesignNoSpecialRequests;
  const hasWordingSelection = (eviteHeaderText && eviteBodyText) || eviteWordingNoSpecialRequests;
  const hasRsvpSelection = eviteRsvpOption || eviteRsvpNoSpecialRequests;
  const allCategoriesFilled = hasDesignSelection && hasWordingSelection && hasRsvpSelection;

  const generateDefaultBodyText = () => {
    const names = [customerName, customerName2].filter(n => n).join(' & ') || 'The Happy Couple';
    const dateStr = preferredDate ? new Date(preferredDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '[Date]';
    const timeStr = timeSlot || '[Time]';
    return `${names} are getting married!\n\nJoin us on ${dateStr} at ${timeStr}\nThe Modest Wedding Venue – Charlotte, NC\n\nFormal invitation to follow.`;
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your save-the-date design will be downloaded as an image.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: "A shareable link has been copied to your clipboard!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Evite & Save-the-Date</h2>
        <p className="text-muted-foreground">
          Create a beautiful save-the-date to share with your guests digitally or via text/email.
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
            <Sparkles className="h-5 w-5" />
            <CardTitle>1. Choose Your Design Style</CardTitle>
          </div>
          <CardDescription>Select from pre-designed templates with visual previews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {designTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => !eviteDesignNoSpecialRequests && !readOnly && onChange('eviteDesignStyle', template.id)}
                className={`cursor-pointer rounded-md border-2 transition-all hover-elevate ${
                  eviteDesignStyle === template.id && !eviteDesignNoSpecialRequests
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-border'
                } ${eviteDesignNoSpecialRequests || readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-testid={`design-template-${template.id}`}
              >
                <div className={`${template.preview} h-32 rounded-t-md flex items-center justify-center p-4`}>
                  <p className={`${template.textColor} text-center font-serif text-lg`}>
                    Save the Date
                  </p>
                </div>
                <div className="p-3 bg-card">
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="evite-design-no-special-requests"
              data-testid="checkbox-evite-design-no-special-requests"
              checked={eviteDesignNoSpecialRequests}
              onCheckedChange={(checked) => {
                onChange('eviteDesignNoSpecialRequests', checked as boolean);
                if (checked) onChange('eviteDesignStyle', '');
              }}
              disabled={readOnly}
            />
            <Label htmlFor="evite-design-no-special-requests" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>2. Customize Your Wording</CardTitle>
          </div>
          <CardDescription>Personalize the header and body text for your save-the-date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="evite-header-text">Header Text</Label>
            <Input
              id="evite-header-text"
              data-testid="input-evite-header-text"
              placeholder="e.g., Save the Date, We're Getting Married!, Formal Invitation"
              value={eviteHeaderText}
              onChange={(e) => onChange('eviteHeaderText', e.target.value)}
              disabled={readOnly || eviteWordingNoSpecialRequests}
            />
            <p className="text-xs text-muted-foreground">Examples: "Save the Date", "We're Getting Married!", "Formal Invitation"</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="evite-body-text">Body Text</Label>
              {!eviteWordingNoSpecialRequests && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange('eviteBodyText', generateDefaultBodyText())}
                  data-testid="button-auto-fill-body"
                >
                  Auto-fill with my info
                </Button>
              )}
            </div>
            <Textarea
              id="evite-body-text"
              data-testid="input-evite-body-text"
              placeholder="Include couple's names, date, time, and location..."
              value={eviteBodyText}
              onChange={(e) => onChange('eviteBodyText', e.target.value)}
              rows={5}
              disabled={readOnly || eviteWordingNoSpecialRequests}
            />
            <p className="text-xs text-muted-foreground">
              Example: "Maya & Elena are getting married! Join us on Saturday, September 6 at The Modest Wedding Venue – Charlotte, NC. Formal invitation to follow."
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="evite-wording-no-special-requests"
              data-testid="checkbox-evite-wording-no-special-requests"
              checked={eviteWordingNoSpecialRequests}
              onCheckedChange={(checked) => {
                onChange('eviteWordingNoSpecialRequests', checked as boolean);
                if (checked) {
                  onChange('eviteHeaderText', '');
                  onChange('eviteBodyText', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="evite-wording-no-special-requests" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            <CardTitle>3. Guest RSVP Link or Note</CardTitle>
          </div>
          <CardDescription>Choose how guests should respond</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={eviteRsvpOption}
            onValueChange={(value) => !eviteRsvpNoSpecialRequests && !readOnly && onChange('eviteRsvpOption', value)}
            disabled={readOnly || eviteRsvpNoSpecialRequests}
          >
            {rsvpOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  data-testid={`radio-rsvp-${option.id}`}
                  disabled={readOnly || eviteRsvpNoSpecialRequests}
                />
                <Label
                  htmlFor={option.id}
                  className={`cursor-pointer ${eviteRsvpNoSpecialRequests ? 'opacity-50' : ''}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {eviteRsvpOption === 'custom_link' && !eviteRsvpNoSpecialRequests && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="evite-rsvp-custom-link">RSVP Link URL</Label>
              <Input
                id="evite-rsvp-custom-link"
                data-testid="input-evite-rsvp-custom-link"
                placeholder="https://yourwebsite.com/rsvp"
                value={eviteRsvpCustomLink}
                onChange={(e) => onChange('eviteRsvpCustomLink', e.target.value)}
                type="url"
                disabled={readOnly}
              />
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="evite-rsvp-no-special-requests"
              data-testid="checkbox-evite-rsvp-no-special-requests"
              checked={eviteRsvpNoSpecialRequests}
              onCheckedChange={(checked) => {
                onChange('eviteRsvpNoSpecialRequests', checked as boolean);
                if (checked) {
                  onChange('eviteRsvpOption', '');
                  onChange('eviteRsvpCustomLink', '');
                }
              }}
              disabled={readOnly}
            />
            <Label htmlFor="evite-rsvp-no-special-requests" className="cursor-pointer text-sm">
              No special requests
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <CardTitle>4. Send or Download</CardTitle>
          </div>
          <CardDescription>Share your save-the-date with guests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {eviteDesignStyle && eviteHeaderText && eviteBodyText && (
            <div className={`${selectedTemplate.preview} rounded-md p-8 border-2 border-border`}>
              <div className={`${selectedTemplate.textColor} text-center space-y-4`}>
                <h3 className="text-2xl font-serif">{eviteHeaderText}</h3>
                <div className="whitespace-pre-line text-sm">{eviteBodyText}</div>
                {eviteRsvpOption === 'formal_invitation_to_follow' && (
                  <p className="text-xs italic">Formal invitation to follow</p>
                )}
                {eviteRsvpOption === 'rsvp_info_to_come' && (
                  <p className="text-xs italic">RSVP info to come</p>
                )}
                {eviteRsvpOption === 'custom_link' && eviteRsvpCustomLink && (
                  <p className="text-xs">RSVP: {eviteRsvpCustomLink}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              data-testid="button-download-evite"
              disabled={!eviteDesignStyle || !eviteHeaderText || !eviteBodyText}
            >
              <Download className="h-4 w-4 mr-2" />
              Download as Image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              data-testid="button-share-evite"
              disabled={!eviteDesignStyle || !eviteHeaderText || !eviteBodyText}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Generate Shareable Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Status</CardTitle>
          <CardDescription>
            {allCategoriesFilled
              ? "You've made selections in all categories. Are you ready to proceed?"
              : "Some categories haven't been filled yet. You can finish later if needed."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {allCategoriesFilled ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="evite-all-done"
                data-testid="checkbox-evite-all-done"
                checked={eviteCompletionStatus === 'all_done'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange('eviteCompletionStatus', 'all_done');
                  } else {
                    onChange('eviteCompletionStatus', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="evite-all-done" className="cursor-pointer">
                All done (for now) – I'm ready to proceed
              </Label>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="evite-finish-later"
                data-testid="checkbox-evite-finish-later"
                checked={eviteCompletionStatus === 'finish_later'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange('eviteCompletionStatus', 'finish_later');
                  } else {
                    onChange('eviteCompletionStatus', '');
                  }
                }}
                disabled={readOnly}
              />
              <Label htmlFor="evite-finish-later" className="cursor-pointer">
                We'll finish this later – I want to proceed for now
              </Label>
            </div>
          )}
          
          {!eviteCompletionStatus && (
            <p className="text-sm text-muted-foreground">
              * You must check this box to proceed to payment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
