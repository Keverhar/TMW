import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Heart, Music, Mic, Church, Users, PartyPopper, Camera, Image, Sparkles, Mail, DollarSign, Check, X, Package } from "lucide-react";
import { Loader2 } from "lucide-react";
import { getAddonPrice } from "@shared/pricing";

export default function Summary() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [composerData, setComposerData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const savedUser = localStorage.getItem("user");
      
      // Try to load data from localStorage for guest users
      const savedComposerData = localStorage.getItem("composerData");
      
      if (savedUser) {
        // Logged-in user: fetch from API
        const user = JSON.parse(savedUser);
        try {
          const response = await fetch(`/api/wedding-composers/by-user?userId=${user.id}&t=${Date.now()}`);
          if (response.ok) {
            const composers = await response.json();
            if (composers && composers.length > 0) {
              // Get the most recent composer
              const mostRecent = composers.sort((a: any, b: any) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )[0];
              setComposerData(mostRecent);
            }
          }
        } catch (error) {
          console.error("Error loading composer data:", error);
        }
      } else if (savedComposerData) {
        // Guest user: load from localStorage
        try {
          setComposerData(JSON.parse(savedComposerData));
        } catch (error) {
          console.error("Error parsing composer data:", error);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [location]);

  const capitalize = (str: string) => {
    if (!str) return str;
    // Handle kebab-case and snake_case
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const hasValue = (value: any) => {
    if (value === null || value === undefined || value === "") return false;
    if (value === "no" || value === false) return false;
    if (value === "[]") return false;
    return true;
  };

  const toBoolean = (value: any): boolean => {
    if (value === true || value === 'yes') return true;
    return false;
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return phone;
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as (###) ###-####
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    // Return original if not 10 digits
    return phone;
  };

  const BooleanDisplay = ({ value, label }: { value: boolean; label: string }) => (
    value ? (
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-600" />
        <span className="text-sm">{label}</span>
      </div>
    ) : null
  );

  const calculateBasePrice = (eventType: string, dayOfWeek: string): number => {
    if (eventType === 'modest-wedding' || eventType === 'other') {
      return dayOfWeek === 'saturday' ? 450000 : 390000;
    } else if (eventType === 'modest-elopement' || eventType === 'vow-renewal') {
      return dayOfWeek === 'friday' ? 150000 : 99900;
    }
    return 390000;
  };

  const getDayOfWeek = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[date.getDay()];
  };

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!composerData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>No Booking Found</CardTitle>
              <CardDescription>You don't have any saved wedding composer data yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/composer")} data-testid="button-go-to-composer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Composer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if any unity ceremonies are selected
  const hasUnityCeremonies = toBoolean(composerData.unityCandle) || toBoolean(composerData.sandCeremony) || toBoolean(composerData.handfasting);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif mb-2">Wedding Composer Summary</h1>
            <p className="text-muted-foreground">
              Complete overview of your wedding selections
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/composer")}
            data-testid="button-back-to-composer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Composer
          </Button>
        </div>

        {/* The Couple */}
        {(hasValue(composerData.person1FullName) || hasValue(composerData.person2FullName)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>The Couple</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasValue(composerData.person1FullName) && (
                <div className="space-y-1">
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {composerData.person1FullName}</p>
                  {hasValue(composerData.person1Role) && <p className="text-sm"><span className="text-muted-foreground">Role:</span> {capitalize(composerData.person1Role)}</p>}
                  {hasValue(composerData.person1Pronouns) && <p className="text-sm"><span className="text-muted-foreground">Pronouns:</span> {composerData.person1Pronouns}</p>}
                  {hasValue(composerData.person1Email) && <p className="text-sm"><span className="text-muted-foreground">Email:</span> {composerData.person1Email}</p>}
                  {hasValue(composerData.person1Phone) && <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {formatPhoneNumber(composerData.person1Phone)}</p>}
                  {hasValue(composerData.person1AlternatePhone) && <p className="text-sm"><span className="text-muted-foreground">Alt Phone:</span> {formatPhoneNumber(composerData.person1AlternatePhone)}</p>}
                </div>
              )}
              {hasValue(composerData.person2FullName) && (
                <div className="space-y-1">
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {composerData.person2FullName}</p>
                  {hasValue(composerData.person2Role) && <p className="text-sm"><span className="text-muted-foreground">Role:</span> {capitalize(composerData.person2Role)}</p>}
                  {hasValue(composerData.person2Pronouns) && <p className="text-sm"><span className="text-muted-foreground">Pronouns:</span> {composerData.person2Pronouns}</p>}
                  {hasValue(composerData.person2Email) && <p className="text-sm"><span className="text-muted-foreground">Email:</span> {composerData.person2Email}</p>}
                  {hasValue(composerData.person2Phone) && <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {formatPhoneNumber(composerData.person2Phone)}</p>}
                </div>
              )}
              {hasValue(composerData.mailingAddress) && (
                <div>
                  <p className="text-sm text-muted-foreground">Mailing Address</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.mailingAddress}</p>
                </div>
              )}
              {toBoolean(composerData.smsConsent) && (
                <div>
                  <BooleanDisplay value={true} label="SMS Consent" />
                </div>
              )}
              {toBoolean(composerData.termsAccepted) && (
                <div>
                  <BooleanDisplay value={true} label="Terms Accepted" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 1: Event Type */}
        {hasValue(composerData.eventType) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Event Type</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{capitalize(composerData.eventType)}</p>
            </CardContent>
          </Card>
        )}

        {/* Block 2: Date & Time */}
        {(hasValue(composerData.preferredDate) || hasValue(composerData.backupDate) || hasValue(composerData.timeSlot)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Date & Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.preferredDate) && (
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(composerData.preferredDate)}</p>
                </div>
              )}
              {hasValue(composerData.backupDate) && (
                <div>
                  <p className="text-sm text-muted-foreground">Backup Date</p>
                  <p className="font-medium">{formatDate(composerData.backupDate)}</p>
                </div>
              )}
              {hasValue(composerData.timeSlot) && (
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-medium">{composerData.timeSlot}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add-ons */}
        {(composerData.photoBookAddon || composerData.extraTimeAddon || composerData.byobBarAddon || composerData.rehearsalAddon) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Add-ons</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <BooleanDisplay 
                  value={composerData.photoBookAddon} 
                  label={`Photo Book${composerData.photoBookAddon && composerData.photoBookQuantity > 1 ? ` (×${composerData.photoBookQuantity})` : ''}`} 
                />
                <BooleanDisplay value={composerData.extraTimeAddon} label="Extra Time Block" />
                <BooleanDisplay value={composerData.byobBarAddon} label="BYOB Bar Setup" />
                <BooleanDisplay value={composerData.rehearsalAddon} label="Rehearsal Hour" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Block 3: Signature Color */}
        {(hasValue(composerData.signatureColor) || hasValue(composerData.colorSwatchDecision)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Signature Color</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.signatureColor) && (
                <div>
                  <p className="text-sm text-muted-foreground">Selected Color</p>
                  <p className="font-medium">{capitalize(composerData.signatureColor)}</p>
                </div>
              )}
              {hasValue(composerData.colorSwatchDecision) && (
                <div>
                  <p className="text-sm text-muted-foreground">Color Swatch Decision</p>
                  <p className="font-medium">{capitalize(composerData.colorSwatchDecision)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 4: Music */}
        {(hasValue(composerData.processionalSong) || hasValue(composerData.recessionalSong) || 
          hasValue(composerData.receptionEntranceSong) || hasValue(composerData.cakeCuttingSong) || 
          hasValue(composerData.fatherDaughterDanceSong) || hasValue(composerData.lastDanceSong) || 
          hasValue(composerData.playlistUrl)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <CardTitle>Music Selections</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.processionalSong) && (
                <div>
                  <p className="text-sm text-muted-foreground">Processional Song</p>
                  <p className="font-medium">{composerData.processionalSong}</p>
                </div>
              )}
              {hasValue(composerData.recessionalSong) && (
                <div>
                  <p className="text-sm text-muted-foreground">Recessional Song</p>
                  <p className="font-medium">{composerData.recessionalSong}</p>
                </div>
              )}
              {hasValue(composerData.receptionEntranceSong) && (
                <div>
                  <p className="text-sm text-muted-foreground">Reception Entrance Song</p>
                  <p className="font-medium">{composerData.receptionEntranceSong}</p>
                </div>
              )}
              {hasValue(composerData.cakeCuttingSong) && (
                <div>
                  <p className="text-sm text-muted-foreground">Cake Cutting Song</p>
                  <p className="font-medium">{composerData.cakeCuttingSong}</p>
                </div>
              )}
              {hasValue(composerData.fatherDaughterDanceSong) && (
                <div>
                  <p className="text-sm text-muted-foreground">Father Daughter Dance Song</p>
                  <p className="font-medium">{composerData.fatherDaughterDanceSong}</p>
                </div>
              )}
              {hasValue(composerData.lastDanceSong) && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Dance Song</p>
                  <p className="font-medium">{composerData.lastDanceSong}</p>
                </div>
              )}
              {hasValue(composerData.playlistUrl) && (
                <div>
                  <p className="text-sm text-muted-foreground">Playlist URL</p>
                  <p className="font-medium break-all">{composerData.playlistUrl}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 5: Announcements */}
        {(hasValue(composerData.grandIntroduction) || hasValue(composerData.fatherDaughterDanceAnnouncement) || 
          hasValue(composerData.toastsSpeechesAnnouncement) || hasValue(composerData.guestCallouts) || 
          hasValue(composerData.vibeCheck)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                <CardTitle>Announcements & Hosting</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.grandIntroduction) && (
                <div>
                  <p className="text-sm text-muted-foreground">Grand Introduction</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.grandIntroduction}</p>
                </div>
              )}
              {hasValue(composerData.fatherDaughterDanceAnnouncement) && (
                <div>
                  <p className="text-sm text-muted-foreground">Father Daughter Dance Announcement</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.fatherDaughterDanceAnnouncement}</p>
                </div>
              )}
              {hasValue(composerData.toastsSpeechesAnnouncement) && (
                <div>
                  <p className="text-sm text-muted-foreground">Toasts & Speeches Announcement</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.toastsSpeechesAnnouncement}</p>
                </div>
              )}
              {hasValue(composerData.guestCallouts) && (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Callouts</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.guestCallouts}</p>
                </div>
              )}
              {hasValue(composerData.vibeCheck) && (
                <div>
                  <p className="text-sm text-muted-foreground">Vibe Check</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.vibeCheck}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 6: Ceremony */}
        {(hasValue(composerData.ceremonyScript) || hasValue(composerData.vowChoices) || hasUnityCeremonies || 
          (hasValue(composerData.guestReadingOrSong) && composerData.guestReadingOrSongChoice === 'yes') || 
          (hasValue(composerData.officiantPassage) && composerData.officiantPassageChoice === 'yes') || 
          (hasValue(composerData.includingChild) && composerData.includingChildChoice === 'yes') || 
          (hasValue(composerData.petInvolvement) && composerData.petInvolvementChoice === 'yes') || 
          hasValue(composerData.ceremonySpecialRequests)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Church className="h-5 w-5 text-primary" />
                <CardTitle>Ceremony Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasValue(composerData.ceremonyScript) && (
                <div>
                  <p className="text-sm text-muted-foreground">Ceremony Script</p>
                  <p className="font-medium">{capitalize(composerData.ceremonyScript)}</p>
                </div>
              )}
              {hasValue(composerData.vowChoices) && (
                <div>
                  <p className="text-sm text-muted-foreground">Vow Choices</p>
                  <p className="font-medium">{capitalize(composerData.vowChoices)}</p>
                </div>
              )}
              {hasUnityCeremonies && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Unity Ceremonies</p>
                  <div className="flex flex-wrap gap-4">
                    <BooleanDisplay value={toBoolean(composerData.unityCandle)} label="Unity Candle" />
                    <BooleanDisplay value={toBoolean(composerData.sandCeremony)} label="Sand Ceremony" />
                    <BooleanDisplay value={toBoolean(composerData.handfasting)} label="Handfasting" />
                  </div>
                </div>
              )}
              {hasValue(composerData.guestReadingOrSong) && composerData.guestReadingOrSongChoice === 'yes' && (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Reading/Song</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.guestReadingOrSong}</p>
                  {hasValue(composerData.guestReadingOrSongName) && (
                    <p className="text-sm text-muted-foreground mt-1">Performer: {composerData.guestReadingOrSongName}</p>
                  )}
                </div>
              )}
              {hasValue(composerData.officiantPassage) && composerData.officiantPassageChoice === 'yes' && (
                <div>
                  <p className="text-sm text-muted-foreground">Officiant Passage</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.officiantPassage}</p>
                </div>
              )}
              {hasValue(composerData.includingChild) && composerData.includingChildChoice === 'yes' && (
                <div>
                  <p className="text-sm text-muted-foreground">Including Children</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.includingChild}</p>
                  {hasValue(composerData.childrenOrganizer) && (
                    <p className="text-sm text-muted-foreground mt-1">Organizer: {composerData.childrenOrganizer}</p>
                  )}
                </div>
              )}
              {hasValue(composerData.petInvolvement) && composerData.petInvolvementChoice === 'yes' && (
                <div>
                  <p className="text-sm text-muted-foreground">Pet Involvement</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.petInvolvement}</p>
                  {toBoolean(composerData.petPolicyAccepted) && (
                    <div className="mt-1">
                      <BooleanDisplay value={true} label="Pet Policy Accepted" />
                    </div>
                  )}
                </div>
              )}
              {hasValue(composerData.ceremonySpecialRequests) && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.ceremonySpecialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 7: Processional */}
        {(hasValue(composerData.walkingDownAisle) || hasValue(composerData.escortName) || 
          (hasValue(composerData.ringBearerFlowerGirl) && composerData.ringBearerIncluded === 'yes') || 
          (hasValue(composerData.honoredGuestEscorts) && !composerData.honoredGuestEscortsNA) || 
          (hasValue(composerData.specialSeatingNeeds) && !composerData.specialSeatingNeedsNA) || 
          (hasValue(composerData.processionalSpecialInstructions) && !composerData.processionalSpecialInstructionsNA)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Ceremony Processional & Seating</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.walkingDownAisle) && (
                <div>
                  <p className="text-sm text-muted-foreground">Walking Down Aisle</p>
                  <p className="font-medium">{capitalize(composerData.walkingDownAisle)}</p>
                  {hasValue(composerData.escortName) && (
                    <p className="text-sm mt-1">Escort: {composerData.escortName}</p>
                  )}
                </div>
              )}
              {hasValue(composerData.ringBearerFlowerGirl) && composerData.ringBearerIncluded === 'yes' && (
                <div>
                  <p className="text-sm text-muted-foreground">Ring Bearer / Flower Girl</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.ringBearerFlowerGirl}</p>
                  {hasValue(composerData.ringBearerOrganizer) && (
                    <p className="text-sm mt-1">Organizer: {composerData.ringBearerOrganizer}</p>
                  )}
                </div>
              )}
              {hasValue(composerData.honoredGuestEscorts) && !composerData.honoredGuestEscortsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Honored Guest Escorts</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.honoredGuestEscorts}</p>
                </div>
              )}
              {hasValue(composerData.specialSeatingNeeds) && !composerData.specialSeatingNeedsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Seating or Mobility Needs</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.specialSeatingNeeds}</p>
                </div>
              )}
              {hasValue(composerData.processionalSpecialInstructions) && !composerData.processionalSpecialInstructionsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Instructions</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.processionalSpecialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 8: Reception */}
        {((hasValue(composerData.firstDance) && !composerData.firstDanceNA) || 
          (hasValue(composerData.motherSonDance) && !composerData.motherSonDanceNA) || 
          (hasValue(composerData.specialDances) && !composerData.specialDancesNA) || 
          (hasValue(composerData.toastGivers) && !composerData.toastGiversNA) || 
          hasValue(composerData.beveragePreferences) || 
          (hasValue(composerData.receptionSpecialRequests) && !composerData.receptionSpecialRequestsNA)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-primary" />
                <CardTitle>Reception Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.firstDance) && !composerData.firstDanceNA && (
                <div>
                  <p className="text-sm text-muted-foreground">First Dance</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.firstDance}</p>
                </div>
              )}
              {hasValue(composerData.motherSonDance) && !composerData.motherSonDanceNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Mother Son Dance</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.motherSonDance}</p>
                </div>
              )}
              {hasValue(composerData.specialDances) && !composerData.specialDancesNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Dances</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.specialDances}</p>
                </div>
              )}
              {hasValue(composerData.toastGivers) && !composerData.toastGiversNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Toast Givers</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.toastGivers}</p>
                </div>
              )}
              {hasValue(composerData.beveragePreferences) && (
                <div>
                  <p className="text-sm text-muted-foreground">Beverage Preferences</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.beveragePreferences}</p>
                </div>
              )}
              {hasValue(composerData.receptionSpecialRequests) && !composerData.receptionSpecialRequestsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.receptionSpecialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 9: Photography */}
        {((hasValue(composerData.mustHaveShots) && !composerData.mustHaveShotsNA) || 
          (hasValue(composerData.vipList) && !composerData.vipListNA) || 
          (hasValue(composerData.groupPhotosRequested) && !composerData.groupPhotosRequestedNA) || 
          (hasValue(composerData.photographySpecialRequests) && !composerData.photographySpecialRequestsNA)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <CardTitle>Photography Wishlist</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.mustHaveShots) && !composerData.mustHaveShotsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Must Have Shots</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.mustHaveShots}</p>
                </div>
              )}
              {hasValue(composerData.vipList) && !composerData.vipListNA && (
                <div>
                  <p className="text-sm text-muted-foreground">VIP List</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.vipList}</p>
                </div>
              )}
              {hasValue(composerData.groupPhotosRequested) && !composerData.groupPhotosRequestedNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Group Photos Requested</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.groupPhotosRequested}</p>
                </div>
              )}
              {hasValue(composerData.photographySpecialRequests) && !composerData.photographySpecialRequestsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.photographySpecialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 10: Memory Wall */}
        {((composerData.slideshowPhotos && composerData.slideshowPhotos !== '[]' && !composerData.slideshowPhotosNA) || 
          (composerData.engagementPhotos && composerData.engagementPhotos !== '[]' && !composerData.engagementPhotosNA)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                <CardTitle>Memory Wall Photos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.slideshowPhotos && composerData.slideshowPhotos !== '[]' && !composerData.slideshowPhotosNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Memory Wall Photos</p>
                  <p className="font-medium">{JSON.parse(composerData.slideshowPhotos).length} Photo(s) Uploaded</p>
                </div>
              )}
              {composerData.engagementPhotos && composerData.engagementPhotos !== '[]' && !composerData.engagementPhotosNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Photo</p>
                  <p className="font-medium">{JSON.parse(composerData.engagementPhotos).length} Photo(s) Uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 11: Personal Touches */}
        {((hasValue(composerData.freshFlorals) && !composerData.freshFloralsNA) || 
          hasValue(composerData.guestBook) || hasValue(composerData.cakeKnifeServiceSet) || 
          (hasValue(composerData.departureOrganizer) && !composerData.departureOrganizerTBD) || 
          hasValue(composerData.departureVehicle) || 
          (hasValue(composerData.personalTouchesSpecialInstructions) && !composerData.personalTouchesSpecialInstructionsNA)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Personal Touches</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.freshFlorals) && !composerData.freshFloralsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Fresh Florals</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.freshFlorals}</p>
                </div>
              )}
              {hasValue(composerData.guestBookChoice) && hasValue(composerData.guestBook) && (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Book</p>
                  <p className="font-medium">{capitalize(composerData.guestBookChoice)}</p>
                  <p className="text-sm mt-1">{composerData.guestBook}</p>
                </div>
              )}
              {hasValue(composerData.cakeKnifeChoice) && hasValue(composerData.cakeKnifeServiceSet) && (
                <div>
                  <p className="text-sm text-muted-foreground">Cake Knife</p>
                  <p className="font-medium">{capitalize(composerData.cakeKnifeChoice)}</p>
                  <p className="text-sm mt-1">{composerData.cakeKnifeServiceSet}</p>
                </div>
              )}
              {hasValue(composerData.departureOrganizer) && !composerData.departureOrganizerTBD && (
                <div>
                  <p className="text-sm text-muted-foreground">Departure Organizer</p>
                  <p className="font-medium">{composerData.departureOrganizer}</p>
                </div>
              )}
              {hasValue(composerData.departureVehicleChoice) && hasValue(composerData.departureVehicle) && (
                <div>
                  <p className="text-sm text-muted-foreground">Departure Vehicle</p>
                  <p className="font-medium">{capitalize(composerData.departureVehicleChoice)}</p>
                  <p className="text-sm mt-1">{composerData.departureVehicle}</p>
                </div>
              )}
              {hasValue(composerData.personalTouchesSpecialInstructions) && !composerData.personalTouchesSpecialInstructionsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Instructions</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.personalTouchesSpecialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 12: Evite */}
        {(hasValue(composerData.eviteDesignStyle) || hasValue(composerData.eviteHeaderText) || 
          hasValue(composerData.eviteBodyText) || hasValue(composerData.eviteRsvpOption)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Evite & Save-the-Date</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {hasValue(composerData.eviteDesignStyle) && !composerData.eviteDesignNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Design Style</p>
                  <p className="font-medium">{capitalize(composerData.eviteDesignStyle)}</p>
                </div>
              )}
              {hasValue(composerData.eviteHeaderText) && !composerData.eviteWordingNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Header Text</p>
                  <p className="font-medium">{composerData.eviteHeaderText}</p>
                </div>
              )}
              {hasValue(composerData.eviteBodyText) && !composerData.eviteWordingNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Body Text</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.eviteBodyText}</p>
                </div>
              )}
              {hasValue(composerData.eviteRsvpOption) && !composerData.eviteRsvpNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">RSVP Option</p>
                  <p className="font-medium">{capitalize(composerData.eviteRsvpOption)}</p>
                  {hasValue(composerData.eviteRsvpCustomLink) && (
                    <p className="text-sm mt-1 break-all">{composerData.eviteRsvpCustomLink}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {hasValue(composerData.eventType) && hasValue(composerData.preferredDate) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Booking Summary</CardTitle>
              </div>
              <CardDescription>Review your selections before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {/* Base Package */}
                <div className="flex justify-between">
                  <span>
                    {composerData.eventType === 'modest-elopement' ? 'Modest Elopement' :
                     composerData.eventType === 'vow-renewal' ? 'Vow Renewal' :
                     composerData.eventType === 'modest-wedding' ? 'Modest Wedding' :
                     composerData.eventType === 'other' ? 'Other Event' :
                     capitalize(composerData.eventType)}
                  </span>
                  <span>${((composerData.basePackagePrice || calculateBasePrice(composerData.eventType, getDayOfWeek(composerData.preferredDate))) / 100).toFixed(2)}</span>
                </div>

                {/* Add-ons */}
                {composerData.photoBookAddon && (
                  <div className="flex justify-between">
                    <span>Photo Book {composerData.photoBookQuantity > 1 && `(×${composerData.photoBookQuantity})`}</span>
                    <span>${((getAddonPrice('photoBook') * (composerData.photoBookQuantity || 1)) / 100).toFixed(2)}</span>
                  </div>
                )}
                {composerData.extraTimeAddon && (
                  <div className="flex justify-between">
                    <span>Extra Time Block (Saturday 6PM only)</span>
                    <span>${(getAddonPrice('extraTime') / 100).toFixed(2)}</span>
                  </div>
                )}
                {composerData.byobBarAddon && (
                  <div className="flex justify-between">
                    <span>BYOB Bar Setup</span>
                    <span>${(getAddonPrice('byobBar') / 100).toFixed(2)}</span>
                  </div>
                )}
                {composerData.rehearsalAddon && (
                  <div className="flex justify-between">
                    <span>Rehearsal Hour</span>
                    <span>${(getAddonPrice('rehearsal') / 100).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t my-2"></div>

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${((
                    (composerData.basePackagePrice || calculateBasePrice(composerData.eventType, getDayOfWeek(composerData.preferredDate))) +
                    (composerData.photoBookAddon ? getAddonPrice('photoBook') * (composerData.photoBookQuantity || 1) : 0) +
                    (composerData.extraTimeAddon ? getAddonPrice('extraTime') : 0) +
                    (composerData.byobBarAddon ? getAddonPrice('byobBar') : 0) +
                    (composerData.rehearsalAddon ? getAddonPrice('rehearsal') : 0)
                  ) / 100).toFixed(2)}</span>
                </div>

                {/* Payment Discount */}
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>
                    {composerData.paymentMethod === 'ach' ? 'ACH' :
                     composerData.paymentMethod === 'affirm' ? 'Affirm' :
                     composerData.paymentMethod === 'paypal' ? 'PayPal' :
                     composerData.paymentMethod === 'venmo' ? 'Venmo' :
                     'Payment'} Discount
                  </span>
                  <span>{(composerData.appliedDiscountAmount || 0) > 0 ? '-' : ''}${((composerData.appliedDiscountAmount || 0) / 100).toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>

                <div className="border-t my-2"></div>

                {/* Total */}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${((
                    (composerData.basePackagePrice || calculateBasePrice(composerData.eventType, getDayOfWeek(composerData.preferredDate))) +
                    (composerData.photoBookAddon ? getAddonPrice('photoBook') * (composerData.photoBookQuantity || 1) : 0) +
                    (composerData.extraTimeAddon ? getAddonPrice('extraTime') : 0) +
                    (composerData.byobBarAddon ? getAddonPrice('byobBar') : 0) +
                    (composerData.rehearsalAddon ? getAddonPrice('rehearsal') : 0) -
                    (composerData.appliedDiscountAmount || 0)
                  ) / 100).toFixed(2)}</span>
                </div>

                {/* Amount Paid */}
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span>${((composerData.amountPaid || 0) / 100).toFixed(2)}</span>
                </div>

                <div className="border-t my-2"></div>

                {/* Balance Due */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Balance Due</span>
                  <span>${((
                    (composerData.basePackagePrice || calculateBasePrice(composerData.eventType, getDayOfWeek(composerData.preferredDate))) +
                    (composerData.photoBookAddon ? getAddonPrice('photoBook') * (composerData.photoBookQuantity || 1) : 0) +
                    (composerData.extraTimeAddon ? getAddonPrice('extraTime') : 0) +
                    (composerData.byobBarAddon ? getAddonPrice('byobBar') : 0) +
                    (composerData.rehearsalAddon ? getAddonPrice('rehearsal') : 0) -
                    (composerData.appliedDiscountAmount || 0) -
                    (composerData.amountPaid || 0)
                  ) / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
