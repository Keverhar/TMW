import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, Music, Mic, Church, Users, PartyPopper, Camera, Image, Sparkles, Mail, DollarSign, Check, X } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Summary() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [composerData, setComposerData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setLocation("/composer");
        return;
      }

      const user = JSON.parse(savedUser);
      try {
        const response = await fetch(`/api/wedding-composers/by-user?userId=${user.id}`);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setLocation]);

  const formatPackageName = (type: string) => {
    if (!type) return "Not selected";
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not selected";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTimeSlot = (slot: string) => {
    if (!slot) return "Not selected";
    return slot;
  };

  const BooleanDisplay = ({ value }: { value: boolean }) => (
    value ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" />
  );

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
              <Button onClick={() => setLocation("/composer")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Composer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

        {/* Block 1: Event Type */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle>Event Type</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{formatPackageName(composerData.eventType)}</p>
          </CardContent>
        </Card>

        {/* Block 2: Date & Time */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Date & Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Preferred Date</p>
              <p className="font-medium">{formatDate(composerData.preferredDate)}</p>
            </div>
            {composerData.backupDate && (
              <div>
                <p className="text-sm text-muted-foreground">Backup Date</p>
                <p className="font-medium">{formatDate(composerData.backupDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Time Slot</p>
              <p className="font-medium">{formatTimeSlot(composerData.timeSlot)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Block 3: Signature Color */}
        {composerData.signatureColor && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Signature Color</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Selected Color</p>
                <p className="font-medium">{composerData.signatureColor}</p>
              </div>
              {composerData.colorSwatchDecision && (
                <div>
                  <p className="text-sm text-muted-foreground">Color Swatch Decision</p>
                  <p className="font-medium">{composerData.colorSwatchDecision}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 4: Music */}
        {(composerData.processionalSong || composerData.recessionalSong || composerData.receptionEntranceSong || 
          composerData.cakeCuttingSong || composerData.fatherDaughterDanceSong || composerData.lastDanceSong || 
          composerData.playlistUrl) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <CardTitle>Music Selections</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.processionalSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Processional Song</p>
                  <p className="font-medium">{composerData.processionalSong}</p>
                </div>
              )}
              {composerData.recessionalSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Recessional Song</p>
                  <p className="font-medium">{composerData.recessionalSong}</p>
                </div>
              )}
              {composerData.receptionEntranceSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Reception Entrance Song</p>
                  <p className="font-medium">{composerData.receptionEntranceSong}</p>
                </div>
              )}
              {composerData.cakeCuttingSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Cake Cutting Song</p>
                  <p className="font-medium">{composerData.cakeCuttingSong}</p>
                </div>
              )}
              {composerData.fatherDaughterDanceSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Father Daughter Dance Song</p>
                  <p className="font-medium">{composerData.fatherDaughterDanceSong}</p>
                </div>
              )}
              {composerData.lastDanceSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Dance Song</p>
                  <p className="font-medium">{composerData.lastDanceSong}</p>
                </div>
              )}
              {composerData.playlistUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">Playlist URL</p>
                  <p className="font-medium break-all">{composerData.playlistUrl}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 5: Announcements */}
        {(composerData.grandIntroduction || composerData.fatherDaughterDanceAnnouncement || 
          composerData.toastsSpeechesAnnouncement || composerData.guestCallouts || composerData.vibeCheck) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                <CardTitle>Announcements & Hosting</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.grandIntroduction && (
                <div>
                  <p className="text-sm text-muted-foreground">Grand Introduction</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.grandIntroduction}</p>
                </div>
              )}
              {composerData.fatherDaughterDanceAnnouncement && (
                <div>
                  <p className="text-sm text-muted-foreground">Father Daughter Dance Announcement</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.fatherDaughterDanceAnnouncement}</p>
                </div>
              )}
              {composerData.toastsSpeechesAnnouncement && (
                <div>
                  <p className="text-sm text-muted-foreground">Toasts & Speeches Announcement</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.toastsSpeechesAnnouncement}</p>
                </div>
              )}
              {composerData.guestCallouts && (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Callouts</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.guestCallouts}</p>
                </div>
              )}
              {composerData.vibeCheck && (
                <div>
                  <p className="text-sm text-muted-foreground">Vibe Check</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.vibeCheck}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 6: Ceremony */}
        {(composerData.ceremonyScript || composerData.vowChoices || composerData.unityCandle || 
          composerData.sandCeremony || composerData.handfasting || composerData.guestReadingOrSong || 
          composerData.officiantPassage || composerData.includingChild || composerData.petInvolvement || 
          composerData.ceremonySpecialRequests) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Church className="h-5 w-5 text-primary" />
                <CardTitle>Ceremony Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {composerData.ceremonyScript && (
                <div>
                  <p className="text-sm text-muted-foreground">Ceremony Script</p>
                  <p className="font-medium">{composerData.ceremonyScript}</p>
                </div>
              )}
              {composerData.vowChoices && (
                <div>
                  <p className="text-sm text-muted-foreground">Vow Choices</p>
                  <p className="font-medium">{composerData.vowChoices}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unity Ceremonies</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <BooleanDisplay value={composerData.unityCandle} />
                    <span className="text-sm">Unity Candle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BooleanDisplay value={composerData.sandCeremony} />
                    <span className="text-sm">Sand Ceremony</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BooleanDisplay value={composerData.handfasting} />
                    <span className="text-sm">Handfasting</span>
                  </div>
                </div>
              </div>
              {composerData.guestReadingOrSong && (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Reading/Song</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.guestReadingOrSong}</p>
                  {composerData.guestReadingOrSongName && (
                    <p className="text-sm text-muted-foreground mt-1">Performer: {composerData.guestReadingOrSongName}</p>
                  )}
                </div>
              )}
              {composerData.officiantPassage && (
                <div>
                  <p className="text-sm text-muted-foreground">Officiant Passage</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.officiantPassage}</p>
                </div>
              )}
              {composerData.includingChild && (
                <div>
                  <p className="text-sm text-muted-foreground">Including Children</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.includingChild}</p>
                  {composerData.childrenOrganizer && (
                    <p className="text-sm text-muted-foreground mt-1">Organizer: {composerData.childrenOrganizer}</p>
                  )}
                </div>
              )}
              {composerData.petInvolvement && (
                <div>
                  <p className="text-sm text-muted-foreground">Pet Involvement</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.petInvolvement}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <BooleanDisplay value={composerData.petPolicyAccepted} />
                    <span className="text-sm">Pet Policy Accepted</span>
                  </div>
                </div>
              )}
              {composerData.ceremonySpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.ceremonySpecialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 7: Processional */}
        {(composerData.walkingDownAisle || composerData.escortName || composerData.ringBearerFlowerGirl || 
          composerData.honoredGuestEscorts || composerData.specialSeatingNeeds || composerData.processionalSpecialInstructions) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Ceremony Processional & Seating</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.walkingDownAisle && (
                <div>
                  <p className="text-sm text-muted-foreground">Walking Down Aisle</p>
                  <p className="font-medium">{composerData.walkingDownAisle}</p>
                  {composerData.escortName && (
                    <p className="text-sm mt-1">Escort: {composerData.escortName}</p>
                  )}
                </div>
              )}
              {composerData.ringBearerIncluded && (
                <div>
                  <p className="text-sm text-muted-foreground">Ring Bearer / Flower Girl</p>
                  <p className="font-medium">{composerData.ringBearerIncluded === 'yes' ? 'Yes' : 'No'}</p>
                  {composerData.ringBearerFlowerGirl && (
                    <>
                      <p className="text-sm mt-1">Details: {composerData.ringBearerFlowerGirl}</p>
                      {composerData.ringBearerOrganizer && (
                        <p className="text-sm">Organizer: {composerData.ringBearerOrganizer}</p>
                      )}
                    </>
                  )}
                </div>
              )}
              {composerData.honoredGuestEscorts && !composerData.honoredGuestEscortsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Honored Guest Escorts</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.honoredGuestEscorts}</p>
                </div>
              )}
              {composerData.specialSeatingNeeds && !composerData.specialSeatingNeedsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Seating or Mobility Needs</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.specialSeatingNeeds}</p>
                </div>
              )}
              {composerData.processionalSpecialInstructions && !composerData.processionalSpecialInstructionsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Instructions</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.processionalSpecialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 8: Reception */}
        {(composerData.firstDance || composerData.motherSonDance || composerData.specialDances || 
          composerData.toastGivers || composerData.beveragePreferences || composerData.receptionSpecialRequests) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-primary" />
                <CardTitle>Reception Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.firstDance && !composerData.firstDanceNA && (
                <div>
                  <p className="text-sm text-muted-foreground">First Dance</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.firstDance}</p>
                </div>
              )}
              {composerData.motherSonDance && !composerData.motherSonDanceNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Mother Son Dance</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.motherSonDance}</p>
                </div>
              )}
              {composerData.specialDances && !composerData.specialDancesNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Dances</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.specialDances}</p>
                </div>
              )}
              {composerData.toastGivers && !composerData.toastGiversNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Toast Givers</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.toastGivers}</p>
                </div>
              )}
              {composerData.beveragePreferences && (
                <div>
                  <p className="text-sm text-muted-foreground">Beverage Preferences</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.beveragePreferences}</p>
                </div>
              )}
              {composerData.receptionSpecialRequests && !composerData.receptionSpecialRequestsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.receptionSpecialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 9: Photography */}
        {(composerData.mustHaveShots || composerData.vipList || composerData.groupPhotosRequested || 
          composerData.photographySpecialRequests) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <CardTitle>Photography Wishlist</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.mustHaveShots && !composerData.mustHaveShotsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Must Have Shots</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.mustHaveShots}</p>
                </div>
              )}
              {composerData.vipList && !composerData.vipListNA && (
                <div>
                  <p className="text-sm text-muted-foreground">VIP List</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.vipList}</p>
                </div>
              )}
              {composerData.groupPhotosRequested && !composerData.groupPhotosRequestedNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Group Photos Requested</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.groupPhotosRequested}</p>
                </div>
              )}
              {composerData.photographySpecialRequests && !composerData.photographySpecialRequestsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.photographySpecialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 10: Memory Wall */}
        {((composerData.slideshowPhotos && composerData.slideshowPhotos !== '[]') || 
          (composerData.engagementPhotos && composerData.engagementPhotos !== '[]')) && (
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
                  <p className="font-medium">{JSON.parse(composerData.slideshowPhotos).length} photo(s) uploaded</p>
                </div>
              )}
              {composerData.engagementPhotos && composerData.engagementPhotos !== '[]' && !composerData.engagementPhotosNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Photos</p>
                  <p className="font-medium">{JSON.parse(composerData.engagementPhotos).length} photo(s) uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 11: Personal Touches */}
        {(composerData.freshFlorals || composerData.guestBook || composerData.cakeKnifeServiceSet || 
          composerData.departureOrganizer || composerData.departureVehicle || composerData.personalTouchesSpecialInstructions) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Personal Touches</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.freshFlorals && !composerData.freshFloralsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Fresh Florals</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.freshFlorals}</p>
                </div>
              )}
              {composerData.guestBookChoice && (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Book</p>
                  <p className="font-medium">{composerData.guestBookChoice}</p>
                  {composerData.guestBook && (
                    <p className="text-sm mt-1">{composerData.guestBook}</p>
                  )}
                </div>
              )}
              {composerData.cakeKnifeChoice && (
                <div>
                  <p className="text-sm text-muted-foreground">Cake Knife</p>
                  <p className="font-medium">{composerData.cakeKnifeChoice}</p>
                  {composerData.cakeKnifeServiceSet && (
                    <p className="text-sm mt-1">{composerData.cakeKnifeServiceSet}</p>
                  )}
                </div>
              )}
              {composerData.departureOrganizer && !composerData.departureOrganizerTBD && (
                <div>
                  <p className="text-sm text-muted-foreground">Departure Organizer</p>
                  <p className="font-medium">{composerData.departureOrganizer}</p>
                </div>
              )}
              {composerData.departureVehicleChoice && (
                <div>
                  <p className="text-sm text-muted-foreground">Departure Vehicle</p>
                  <p className="font-medium">{composerData.departureVehicleChoice}</p>
                  {composerData.departureVehicle && (
                    <p className="text-sm mt-1">{composerData.departureVehicle}</p>
                  )}
                </div>
              )}
              {composerData.personalTouchesSpecialInstructions && !composerData.personalTouchesSpecialInstructionsNA && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Instructions</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.personalTouchesSpecialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 12: Evite */}
        {(composerData.eviteDesignStyle || composerData.eviteHeaderText || composerData.eviteBodyText || 
          composerData.eviteRsvpOption) && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Evite & Save-the-Date</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {composerData.eviteDesignStyle && !composerData.eviteDesignNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Design Style</p>
                  <p className="font-medium">{composerData.eviteDesignStyle}</p>
                </div>
              )}
              {composerData.eviteHeaderText && !composerData.eviteWordingNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Header Text</p>
                  <p className="font-medium">{composerData.eviteHeaderText}</p>
                </div>
              )}
              {composerData.eviteBodyText && !composerData.eviteWordingNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">Body Text</p>
                  <p className="font-medium whitespace-pre-wrap">{composerData.eviteBodyText}</p>
                </div>
              )}
              {composerData.eviteRsvpOption && !composerData.eviteRsvpNoSpecialRequests && (
                <div>
                  <p className="text-sm text-muted-foreground">RSVP Option</p>
                  <p className="font-medium">{composerData.eviteRsvpOption}</p>
                  {composerData.eviteRsvpCustomLink && (
                    <p className="text-sm mt-1 break-all">{composerData.eviteRsvpCustomLink}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Block 13: Contact & Add-ons */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Contact Information & Add-ons</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Couple Information */}
            {composerData.person1FullName && (
              <div>
                <p className="text-sm font-medium mb-2">Person 1</p>
                <div className="ml-4 space-y-1">
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {composerData.person1FullName}</p>
                  {composerData.person1Role && <p className="text-sm"><span className="text-muted-foreground">Role:</span> {composerData.person1Role}</p>}
                  {composerData.person1Pronouns && <p className="text-sm"><span className="text-muted-foreground">Pronouns:</span> {composerData.person1Pronouns}</p>}
                  {composerData.person1Email && <p className="text-sm"><span className="text-muted-foreground">Email:</span> {composerData.person1Email}</p>}
                  {composerData.person1Phone && <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {composerData.person1Phone}</p>}
                  {composerData.person1AlternatePhone && <p className="text-sm"><span className="text-muted-foreground">Alt Phone:</span> {composerData.person1AlternatePhone}</p>}
                </div>
              </div>
            )}
            {composerData.person2FullName && (
              <div>
                <p className="text-sm font-medium mb-2">Person 2</p>
                <div className="ml-4 space-y-1">
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {composerData.person2FullName}</p>
                  {composerData.person2Role && <p className="text-sm"><span className="text-muted-foreground">Role:</span> {composerData.person2Role}</p>}
                  {composerData.person2Pronouns && <p className="text-sm"><span className="text-muted-foreground">Pronouns:</span> {composerData.person2Pronouns}</p>}
                  {composerData.person2Email && <p className="text-sm"><span className="text-muted-foreground">Email:</span> {composerData.person2Email}</p>}
                  {composerData.person2Phone && <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {composerData.person2Phone}</p>}
                </div>
              </div>
            )}
            {composerData.mailingAddress && (
              <div>
                <p className="text-sm text-muted-foreground">Mailing Address</p>
                <p className="font-medium whitespace-pre-wrap">{composerData.mailingAddress}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BooleanDisplay value={composerData.smsConsent} />
              <span className="text-sm">SMS Consent</span>
            </div>

            {/* Add-ons */}
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">Add-ons</p>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <BooleanDisplay value={composerData.photoBookAddon} />
                  <span className="text-sm">Photo Book {composerData.photoBookAddon && composerData.photoBookQuantity > 1 && `(×${composerData.photoBookQuantity})`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BooleanDisplay value={composerData.extraTimeAddon} />
                  <span className="text-sm">Extra Time Block</span>
                </div>
                <div className="flex items-center gap-2">
                  <BooleanDisplay value={composerData.byobBarAddon} />
                  <span className="text-sm">BYOB Bar Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <BooleanDisplay value={composerData.rehearsalAddon} />
                  <span className="text-sm">Rehearsal Hour</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            {composerData.paymentMethod && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{composerData.paymentMethod.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BooleanDisplay value={composerData.termsAccepted} />
              <span className="text-sm">Terms Accepted</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
