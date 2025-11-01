import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Sparkles, Eye, Lock, Info } from "lucide-react";
import { useState } from "react";

interface Block6CeremonyProps {
  ceremonyScript: string;
  vowChoices: string;
  unityCandle: boolean;
  sandCeremony: boolean;
  handfasting: boolean;
  guestReadingOrSongChoice: string;
  guestReadingOrSong: string;
  guestReadingOrSongName: string;
  officiantPassageChoice: string;
  officiantPassage: string;
  includingChildChoice: string;
  includingChild: string;
  childrenOrganizer: string;
  petInvolvementChoice: string;
  petPolicyAccepted: boolean;
  petInvolvement: string;
  ceremonySpecialRequests: string;
  onChange: (field: string, value: string | boolean) => void;
  showAddOns?: boolean;
  readOnly?: boolean;
  eventType: string;
}

const FULL_CEREMONY_SCRIPTS: Record<string, string> = {
  "christian-traditional": `Classic Church Ceremony Script

Welcome / Opening Words
Dearly beloved, 
We are gathered here today in the presence of God and these witnesses to join together [Bride's Name] and [Groom's Name] in holy matrimony. Marriage is an honorable estate, instituted of God, and is not to be entered into lightly, but reverently, and with deep commitment.

Presentation of the Bride (Optional)
Officiant may say: 
Who gives this woman to be married to this man? 
[Father/Mother/Family Member responds: I do or We do.]

Opening Prayer (Optional)
Let us pray. 
Heavenly Father, we ask your blessing on this union. May [Bride's Name] and [Groom's Name] know your presence in their marriage, your guidance in their decisions, and your grace in every season. Amen.

Scripture Reading (Optional)
Love is patient, love is kind (1 Corinthians 13:4-8) 
Officiant reads or invites guest reader.

Exchange of Vows
[Groom's Name], please repeat after me:
I, [Groom's Name], take you, [Bride's Name], to be my wedded wife, 
to have and to hold, from this day forward, 
for better or for worse, 
for richer or for poorer, 
in sickness and in health, 
to love and to cherish, 
until death do us part. 
This is my solemn vow before God.

[Bride's Name], please repeat after me:
I, [Bride's Name], take you, [Groom's Name], to be my wedded husband, 
to have and to hold, from this day forward, 
for better or for worse, 
for richer or for poorer, 
in sickness and in health, 
to love and to cherish, 
until death do us part. 
This is my solemn vow before God.

Exchange of Rings
May I have the rings? 
Officiant receives rings from attendant or ring bearer.
Let these rings be a symbol of your love and fidelity.

[Groom places ring on Bride's finger, repeating after Officiant]: 
With this ring, I thee wed. 
In the name of the Father, the Son, and the Holy Spirit.

[Bride places ring on Groom's finger, repeating after Officiant]: 
With this ring, I thee wed. 
In the name of the Father, the Son, and the Holy Spirit.

Optional Unity Ritual
If chosen: Unity candle, handfasting, etc. 
Officiant announces and leads ritual as pre-written by couple.

Pronouncement of Marriage
Having pledged your love and vows before God and these witnesses, by the authority vested in me by the state of North Carolina and under God, I now pronounce you husband and wife. 
You may kiss your bride.

Final Blessing (Optional)
May the Lord bless you and keep you; may His face shine upon you and give you peace. May your life together be long, full of joy, and grounded in love. Amen.

Recessional
Family and friends, it is my honor to present to you, for the first time 
Mr. and Mrs. [Last Name]! 
Cue music. Exit.`,

  "simple-modern": `Classic and Romantic Ceremony Script

Welcome / Opening Words
Dear family and friends, 
 
Today we are gathered in the spirit of joy and love to witness the union of [Bride's Name] and [Groom's Name]. This is a day of celebration, of laughter, and of tears of happiness – a day where we honor the commitment of two people who have found in each other a love worth sharing for a lifetime. 
 
Marriage is a beautiful journey of two souls who promise to walk hand in hand through all of life's seasons. It is about choosing each other, again and again, every single day.

Presentation of the Bride (Optional)
Officiant: 
Who gives this woman to be married to this man? 
 
Response: I do or We do.

Reflection on Love
Love is the reason we are here. It is the quiet strength of commitment, the joy of shared dreams, and the courage to face the world together. True love is patient and kind – it brings out the best in us, and helps us to become more fully ourselves. 
 
[Bride's Name] and [Groom's Name], in each other you have found the one with whom you can be your truest self – your partner, your confidant, your home.

Exchange of Vows
[Groom's Name], please repeat after me:
I take you as you are, loving who you are now and who you are yet to become. 
I promise to listen, to learn, and to grow with you. 
To celebrate your triumphs and comfort you in sorrow. 
I will love you and have faith in your love for me, through all our days and all of life's seasons.

[Bride's Name], please repeat after me:
I take you as you are, loving who you are now and who you are yet to become. 
I promise to listen, to learn, and to grow with you. 
To celebrate your triumphs and comfort you in sorrow. 
I will love you and have faith in your love for me, through all our days and all of life's seasons.

Exchange of Rings
Officiant: 
May I have the rings? 
 
These rings are a symbol – a circle with no end – representing the boundless nature of love.

[Groom places ring on Bride's finger, repeating after Officiant]: 
With this ring, I give you my heart, and I promise from this day forward, you shall not walk alone.

[Bride places ring on Groom's finger, repeating after Officiant]: 
With this ring, I give you my heart, and I promise from this day forward, you shall not walk alone.

Optional Unity Ritual
If [Bride's Name] and [Groom's Name] have selected a unity ritual, such as a candle lighting or sand ceremony, this moment is reserved for that gesture.

Pronouncement of Marriage
Having declared your love and promises before all present, and having sealed your vows with rings, it is now my great joy to pronounce you husband and wife. 
 
You may now kiss!

Closing Words and Recessional
It is my honor to introduce, for the very first time – [Your Preferred Name Style Here]! 
 
Let the celebration begin!`,

  "peace-love": `Lightly Religious Ceremony Script – With Personal Professions Option

Welcome / Opening Words
Welcome, family and friends. 
 
We are gathered here today to celebrate the love and commitment of [Bride's Name] and [Groom's Name]. Today marks not only the union of two people, but the joining of their lives, their hopes, and their shared future. Love is a sacred gift – a quiet strength that brings joy in the good times and comfort in the difficult ones. It is this love that brings us here today, and it is this love that will sustain this couple through all of life's seasons.

Presentation of the Bride (Optional)
Officiant: 
Who gives this woman to be married to this man? 
 
Response: I do or We do.

Opening Blessing
Let us take a quiet moment to invite peace into this space. To give thanks for the love that brings us together, and to ask for guidance and grace as [Bride's Name] and [Groom's Name] begin their married life. 
 
May this day be filled with joy, and may their journey be blessed with patience, kindness, and laughter.

Words on Marriage
Marriage is a promise – a vow made between two hearts to grow together, to face life's challenges as one, and to celebrate all that is beautiful in this world. It is not always easy, but when rooted in respect and care, it becomes the most rewarding of life's journeys. 
 
[Bride's Name] and [Groom's Name], as you stand here today, know that you are supported by every person in this room – each of whom is here to cheer you on, lift you up, and witness the beginning of this beautiful chapter.

Exchange of Vows
[Groom's Name], please repeat after me:
Today, I choose you. 
I offer you my love, my faith, and my heart. 
I promise to walk beside you through life's joys and challenges. 
I will listen, I will comfort, I will grow with you. 
With God as my guide, I give myself to you completely.

[Bride's Name], please repeat after me:
Today, I choose you. 
I offer you my love, my faith, and my heart. 
I promise to walk beside you through life's joys and challenges. 
I will listen, I will comfort, I will grow with you. 
With God as my guide, I give myself to you completely.

Exchange of Rings
Officiant: 
May I have the rings? 
 
These rings are a symbol – simple, unbroken, and enduring. They represent your love and your intention to be bound together from this day forward.

[Groom places ring on Bride's finger, repeating after Officiant]: 
With this ring, I promise to love, honor, and cherish you – always.

[Bride places ring on Groom's finger, repeating after Officiant]: 
With this ring, I promise to love, honor, and cherish you – always.

Optional Unity Ritual
If [Bride's Name] and [Groom's Name] have chosen a unity ritual – such as lighting a candle or blending sand – this is the moment in their ceremony where that gesture is made, symbolizing the joining of two lives into one.

Pronouncement of Marriage
[Bride's Name] and [Groom's Name], having exchanged vows and rings in the presence of those who love you, I now pronounce you married. May your life together be filled with joy, your home filled with laughter, and your hearts forever full of love. 
 
You may kiss!

Closing Words and Recessional
It is my honor to present to you, for the very first time – [Your Preferred Name Style Here]! 
 
Let the celebration begin!`,

  "nature-harmony": `Spiritual and Non-Denominational Ceremony Script

Welcome / Opening Words
Welcome, everyone. 
 
We gather here today in a spirit of joy and togetherness to celebrate the union of [Bride's Name] and [Groom's Name]. This ceremony is a reflection of their love – a love grounded in kindness, shared values, and deep connection. Though we come from different walks of life, today we stand united in support of this couple, as they make their commitment to one another. 
 
This ceremony is spiritual in nature, rooted in peace, gratitude, and the belief that love is life's most powerful force.

Presentation of the Bride (Optional)
Officiant: 
Who presents this woman to be joined in marriage to this man? 
 
Response: I do or We do.

Reflection on Partnership
[Bride's Name] and [Groom's Name], partnership is a sacred choice – one that invites us to show up with our whole selves. To listen without judgment, to speak with compassion, and to offer each other not perfection, but presence. 
 
Today, you become partners not only in life, but in spirit – choosing each other as your closest ally, your teammate, and your home.

Exchange of Vows
[Groom's Name], please repeat after me:
I offer you my hand and my heart. 
I promise to walk beside you in light and in shadow. 
To build a life filled with laughter, honesty, and understanding. 
I choose you today and every day, with joy and gratitude.

[Bride's Name], please repeat after me:
I offer you my hand and my heart. 
I promise to walk beside you in light and in shadow. 
To build a life filled with laughter, honesty, and understanding. 
I choose you today and every day, with joy and gratitude.

Exchange of Rings
Officiant: 
Rings are ancient symbols of unity, commitment, and eternity. They are circles with no beginning and no end – like the love you share.

[Groom places ring on Bride's finger, repeating after Officiant]: 
With this ring, I promise to love you, honor you, and walk this life with you.

[Bride places ring on Groom's finger, repeating after Officiant]: 
With this ring, I promise to love you, honor you, and walk this life with you.

Optional Unity Ritual
If [Bride's Name] and [Groom's Name] have chosen a symbolic ritual – such as sand pouring or candle lighting – this is the moment when that ritual takes place, honoring their unity in a visual way.

Special Notes (Optional)
At this point, any special elements such as involvement of children, pets, or personal requests can be acknowledged briefly by the officiant.

Pronouncement of Marriage
By the love that has brought you together, and the promises you have made in the presence of those who love you, I now pronounce you married partners in life. 
 
You may now share your first kiss as a married couple!

Closing Words and Recessional
It is my joy and honor to introduce, for the very first time – [Your Preferred Name Style Here]! 
 
Let the celebration begin!`
};

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

const vowChoicesOptions = [
  { value: "traditional", label: "Traditional Vows" },
  { value: "modern", label: "Modern Vows" },
  { value: "personalized", label: "Personalized Vows (written by couple)" },
  { value: "no-vows", label: "No Vows" }
];

export default function Block6Ceremony({
  ceremonyScript,
  vowChoices,
  unityCandle,
  sandCeremony,
  handfasting,
  guestReadingOrSongChoice,
  guestReadingOrSong,
  guestReadingOrSongName,
  officiantPassageChoice,
  officiantPassage,
  includingChildChoice,
  includingChild,
  childrenOrganizer,
  petInvolvementChoice,
  petPolicyAccepted,
  petInvolvement,
  ceremonySpecialRequests,
  onChange,
  showAddOns = true,
  readOnly = false,
  eventType
}: Block6CeremonyProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedScriptForPreview, setSelectedScriptForPreview] = useState<string>("");
  const [showPetPolicyDialog, setShowPetPolicyDialog] = useState(false);

  const handlePreviewClick = (scriptValue: string) => {
    setSelectedScriptForPreview(scriptValue);
    setDialogOpen(true);
  };

  const officiantPassageCharCount = officiantPassage?.length || 0;
  const maxOfficiantPassageChars = 3500;

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
        <CardContent className="space-y-4">
          <RadioGroup value={ceremonyScript} onValueChange={(value) => onChange('ceremonyScript', value)} disabled={readOnly}>
            {ceremonyScripts.map((script) => (
              <div key={script.value} className="flex items-start space-x-2 p-4 rounded-md border hover-elevate">
                <RadioGroupItem value={script.value} id={`script-${script.value}`} data-testid={`radio-script-${script.value}`} className="mt-1" disabled={readOnly} />
                <Label htmlFor={`script-${script.value}`} className="flex-1 cursor-pointer">
                  <span className="font-medium block text-lg">{script.icon} {script.label}</span>
                  <span className="text-sm text-muted-foreground block mt-1">{script.description}</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreviewClick(script.value)}
                  data-testid={`button-preview-script-${script.value}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Ceremony Script Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {ceremonyScripts.find(s => s.value === selectedScriptForPreview)?.label} - Full Script
            </DialogTitle>
            <DialogDescription>
              This is the complete ceremony script that will be used for your celebration.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="whitespace-pre-wrap text-sm">
              {FULL_CEREMONY_SCRIPTS[selectedScriptForPreview] || "Script not available"}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {eventType === 'modest-wedding' && (
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
              />
              <Label htmlFor="handfasting" className="cursor-pointer">
                Handfasting (we'll bring a handfasting ribbon or cord)
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {showAddOns && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Additional Ceremony Add-Ons</CardTitle>
            </div>
            <CardDescription>Personalize your ceremony with special touches (all completely optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Singing, Reading or Poem by a Guest */}
            <div className="space-y-3">
              <Label>Singing, Reading or Poem by a Guest</Label>
              <div className="flex gap-2">
                <Badge
                  variant={guestReadingOrSongChoice === 'yes' ? 'default' : 'outline'}
                  onClick={() => !readOnly && onChange('guestReadingOrSongChoice', 'yes')}
                  data-testid="badge-guest-reading-yes"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Yes
                </Badge>
                <Badge
                  variant={guestReadingOrSongChoice === 'no' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!readOnly) {
                      onChange('guestReadingOrSongChoice', 'no');
                      onChange('guestReadingOrSong', '');
                      onChange('guestReadingOrSongName', '');
                    }
                  }}
                  data-testid="badge-guest-reading-no"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  No
                </Badge>
              </div>
              {guestReadingOrSongChoice === 'yes' && (
                <div className="space-y-2">
                  <Input
                    id="guest-reading-or-song-name"
                    data-testid="input-guest-reading-or-song-name"
                    placeholder="Name of guest"
                    value={guestReadingOrSongName}
                    onChange={(e) => onChange('guestReadingOrSongName', e.target.value)}
                    disabled={readOnly}
                  />
                  <Textarea
                    id="guest-reading-or-song"
                    data-testid="input-guest-reading-or-song"
                    placeholder="Please describe how you'd like them involved and when"
                    value={guestReadingOrSong}
                    onChange={(e) => onChange('guestReadingOrSong', e.target.value)}
                    rows={2}
                    disabled={readOnly}
                  />
                </div>
              )}
            </div>

            {/* Passage Reading by the Officiant */}
            <div className="space-y-3">
              <Label>Passage Reading by the Officiant</Label>
              <div className="flex gap-2">
                <Badge
                  variant={officiantPassageChoice === 'yes' ? 'default' : 'outline'}
                  onClick={() => !readOnly && onChange('officiantPassageChoice', 'yes')}
                  data-testid="badge-officiant-passage-yes"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Yes
                </Badge>
                <Badge
                  variant={officiantPassageChoice === 'no' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!readOnly) {
                      onChange('officiantPassageChoice', 'no');
                      onChange('officiantPassage', '');
                    }
                  }}
                  data-testid="badge-officiant-passage-no"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  No
                </Badge>
              </div>
              {officiantPassageChoice === 'yes' && (
                <div className="space-y-2">
                  <Textarea
                    id="officiant-passage"
                    data-testid="input-officiant-passage"
                    placeholder="Upload or paste the passage here (10 minute max)"
                    value={officiantPassage}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= maxOfficiantPassageChars) {
                        onChange('officiantPassage', newValue);
                      }
                    }}
                    rows={3}
                    maxLength={maxOfficiantPassageChars}
                    disabled={readOnly}
                  />
                  <p className="text-xs text-muted-foreground">
                    {officiantPassageCharCount}/{maxOfficiantPassageChars} characters
                  </p>
                </div>
              )}
            </div>

            {/* Including a Child or Children */}
            <div className="space-y-3">
              <Label>Including a Child or Children</Label>
              <div className="flex gap-2">
                <Badge
                  variant={includingChildChoice === 'yes' ? 'default' : 'outline'}
                  onClick={() => !readOnly && onChange('includingChildChoice', 'yes')}
                  data-testid="badge-including-child-yes"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Yes
                </Badge>
                <Badge
                  variant={includingChildChoice === 'no' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!readOnly) {
                      onChange('includingChildChoice', 'no');
                      onChange('includingChild', '');
                      onChange('childrenOrganizer', '');
                    }
                  }}
                  data-testid="badge-including-child-no"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  No
                </Badge>
              </div>
              {includingChildChoice === 'yes' && (
                <div className="space-y-2">
                  <Textarea
                    id="including-child"
                    data-testid="input-including-child"
                    placeholder="Please describe how you'd like them involved (family vow, unity ritual, gift presentation, etc.)"
                    value={includingChild}
                    onChange={(e) => onChange('includingChild', e.target.value)}
                    rows={2}
                    disabled={readOnly}
                  />
                  <Input
                    id="children-organizer"
                    data-testid="input-children-organizer"
                    placeholder="Organizer for Children"
                    value={childrenOrganizer}
                    onChange={(e) => onChange('childrenOrganizer', e.target.value)}
                    disabled={readOnly}
                  />
                </div>
              )}
            </div>

            {/* Pet Involvement */}
            <div className="space-y-3">
              <Label>Pet Involvement</Label>
              <div className="flex gap-2">
                <Badge
                  variant={petInvolvementChoice === 'yes' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!readOnly) {
                      if (petPolicyAccepted) {
                        onChange('petInvolvementChoice', 'yes');
                      } else {
                        setShowPetPolicyDialog(true);
                      }
                    }
                  }}
                  data-testid="badge-pet-involvement-yes"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Yes
                </Badge>
                <Badge
                  variant={petInvolvementChoice === 'no' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!readOnly) {
                      onChange('petInvolvementChoice', 'no');
                      onChange('petInvolvement', '');
                    }
                  }}
                  data-testid="badge-pet-involvement-no"
                  className={`cursor-pointer ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  No
                </Badge>
              </div>
              {petInvolvementChoice === 'yes' && petPolicyAccepted && (
                <div className="space-y-2">
                  <Textarea
                    id="pet-involvement"
                    data-testid="input-pet-involvement"
                    placeholder="Name, role, and handler details (Note: pets only allowed in chapel area, not reception)"
                    value={petInvolvement}
                    onChange={(e) => onChange('petInvolvement', e.target.value)}
                    rows={2}
                    disabled={readOnly}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pet Policy Dialog */}
      <Dialog open={showPetPolicyDialog} onOpenChange={setShowPetPolicyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dogs Welcome</DialogTitle>
            <DialogDescription>
              Please review our pet policy before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              We're happy to include your furry family members in your special day! Dogs are very welcome to attend your Ceremony (not permitted in the Reception room), provided, of course, they are well-behaved and remain leashed throughout the event. For everyone's safety, we cannot accommodate dogs showing signs of aggression.
            </p>
            <p>
              Service dogs performing work or tasks for individuals with disabilities are always welcome.
            </p>
            <p className="font-medium">
              At this time, only dogs are permitted on the premises.
            </p>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPetPolicyDialog(false);
                  onChange('petInvolvementChoice', 'no');
                }}
                data-testid="button-pet-policy-decline"
              >
                Decline
              </Button>
              <Button
                onClick={() => {
                  onChange('petPolicyAccepted', true);
                  onChange('petInvolvementChoice', 'yes');
                  setShowPetPolicyDialog(false);
                }}
                data-testid="button-pet-policy-accept"
              >
                Accept
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
