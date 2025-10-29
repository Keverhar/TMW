import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, UserPlus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WeddingComposer as WeddingComposerType } from "@shared/schema";
import AccountCreationDialog from "@/components/AccountCreationDialog";
import InitialAuthDialog from "@/components/InitialAuthDialog";
import LoginDialog from "@/components/LoginDialog";

import Block1EventType from "@/components/composer/Block1EventType";
import Block2DateTime from "@/components/composer/Block2DateTime";
import Block3SignatureColor from "@/components/composer/Block3SignatureColor";
import Block4Music from "@/components/composer/Block4Music";
import Block5Announcements from "@/components/composer/Block5Announcements";
import Block6Ceremony from "@/components/composer/Block6Ceremony";
import Block7Processional from "@/components/composer/Block7Processional";
import Block8Reception from "@/components/composer/Block8Reception";
import Block9Photography from "@/components/composer/Block9Photography";
import Block10PhotoProjection from "@/components/composer/Block10PhotoProjection";
import Block11PersonalTouches from "@/components/composer/Block11PersonalTouches";
import Block12ContactPayment from "@/components/composer/Block12ContactPayment";

const allSteps = [
  { id: 1, title: 'Event Type', description: 'Choose your celebration', availableFor: ['all'] },
  { id: 2, title: 'Date & Time', description: 'Pick your ceremony date', availableFor: ['all'] },
  { id: 3, title: 'Signature Color', description: 'Choose your color theme', availableFor: ['modest-wedding', 'other'] },
  { id: 4, title: 'Music Selection', description: 'Pick your songs', availableFor: ['modest-wedding', 'other'] },
  { id: 5, title: 'Announcements', description: 'Special moments', availableFor: ['modest-wedding', 'other'] },
  { id: 6, title: 'Ceremony', description: 'Ceremony preferences', availableFor: ['all'] },
  { id: 7, title: 'Processional', description: 'Seating & procession', availableFor: ['modest-wedding', 'other'] },
  { id: 8, title: 'Reception', description: 'Reception details', availableFor: ['modest-wedding', 'other'] },
  { id: 9, title: 'Photography', description: 'Photo preferences', availableFor: ['modest-wedding', 'other'] },
  { id: 10, title: 'Photo Projection', description: 'Slideshow options', availableFor: ['modest-wedding', 'other'] },
  { id: 11, title: 'Personal Touches', description: 'Special details', availableFor: ['modest-wedding', 'other'] },
  { id: 12, title: 'Contact & Payment', description: 'Finalize booking', availableFor: ['all'] },
];

const calculatePrice = (eventType: string, dayOfWeek: string): number => {
  if (eventType === 'modest-wedding' || eventType === 'other') {
    // Modest Wedding: Saturday = $4500, Friday/Sunday = $3900
    return dayOfWeek === 'saturday' ? 450000 : 390000;
  } else if (eventType === 'modest-elopement' || eventType === 'vow-renewal') {
    // Elopement/Vow Renewal: Default = $999, Friday = $1500
    return dayOfWeek === 'friday' ? 150000 : 99900;
  }
  return 390000; // Default
};

export default function WeddingComposer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [composerId, setComposerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showInitialDialog, setShowInitialDialog] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userAccount, setUserAccount] = useState<{ id: string; email: string } | null>(null);
  const [hasSeenInitialDialog, setHasSeenInitialDialog] = useState(false);

  const [formData, setFormData] = useState({
    // Block 1: Event Type
    eventType: "modest-wedding",
    eventTypeOther: "",

    // Block 2: Date & Time
    preferredDate: "",
    backupDate: "",
    timeSlot: "",

    // Block 3: Signature Color
    signatureColor: "",
    colorSwatchDecision: "",

    // Block 4: Music
    processionalSong: "",
    recessionalSong: "",
    receptionEntranceSong: "",
    cakeCuttingSong: "",
    fatherDaughterDanceSong: "",
    lastDanceSong: "",
    playlistUrl: "",

    // Block 5: Announcements
    grandIntroduction: "",
    fatherDaughterDanceAnnouncement: "",
    toastsSpeechesAnnouncement: "",
    guestCallouts: "",
    vibeCheck: "",

    // Block 6: Ceremony
    ceremonyScript: "simple-modern",
    unityCandle: false,
    sandCeremony: false,
    handfasting: false,
    guestReadingOrSong: "",
    guestReadingOrSongName: "",
    officiantPassage: "",
    includingChild: "",
    petInvolvement: "",
    ceremonySpecialRequests: "",

    // Block 7: Processional
    walkingDownAisle: "",
    ringBearerFlowerGirl: "",
    ringBearerOrganizer: "",
    honoredGuestEscorts: "",
    brideSideFrontRow: "",
    groomSideFrontRow: "",
    framedPhotos: "",
    specialSeatingNeeds: "",
    processionalSpecialInstructions: "",

    // Block 8: Reception
    firstDance: "",
    motherSonDance: "",
    specialDances: "",
    toastGivers: "",
    beveragePreferences: "",
    horsDoeuvresPreferences: "",
    sendOffStyle: "",
    receptionSpecialRequests: "",

    // Block 9: Photography
    photographyStyle: "",
    mustHaveShots: "",
    vipList: "",
    groupPhotosRequested: "",
    photographySpecialRequests: "",

    // Block 10: Photo Projection
    photoProjectionPreferences: "",

    // Block 11: Personal Touches
    freshFlorals: "",
    guestBook: "",
    cakeKnifeServiceSet: "",
    departureOrganizer: "",
    departureVehicle: "",
    personalTouchesSpecialInstructions: "",

    // Block 12: Contact & Payment
    customerName: "",
    customerName2: "",
    customerEmail: "",
    customerPhone: "",
    smsConsent: false,
    mailingAddress: "",
    termsAccepted: false,

    // Add-ons
    photoBookAddon: false,
    photoBookQuantity: 1,
    extraTimeAddon: false,
    byobBarAddon: false,
    rehearsalAddon: false,
  });

  const updateField = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Clear dates when event type changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      preferredDate: "",
      backupDate: "",
    }));
  }, [formData.eventType]);

  const saveProgress = async () => {
    setIsSaving(true);
    try {
      const dayOfWeek = getDayOfWeek(formData.preferredDate);
      const basePrice = calculatePrice(formData.eventType, dayOfWeek);
      const addonsTotal =
        (formData.photoBookAddon ? 30000 * (formData.photoBookQuantity || 1) : 0) +
        (formData.extraTimeAddon ? 100000 : 0) +
        (formData.byobBarAddon ? 40000 : 0) +
        (formData.rehearsalAddon ? 15000 : 0);
      const totalPrice = basePrice + addonsTotal;

      const composerData = {
        ...formData,
        basePackagePrice: basePrice,
        totalPrice,
        userId: userAccount?.id || null,
      };

      if (composerId) {
        await apiRequest("PATCH", `/api/wedding-composers/${composerId}`, composerData);
      } else {
        const response = await apiRequest("POST", "/api/wedding-composers", composerData);
        const result = await response.json();
        setComposerId(result.id);
      }
    } catch (error: any) {
      toast({
        title: "Error saving progress",
        description: error.message || "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      await saveProgress();
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!formData.preferredDate) {
      toast({
        title: "Date required",
        description: "Please select a preferred date before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.timeSlot) {
      toast({
        title: "Time required",
        description: "Please select a time slot before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerName || !formData.customerEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required contact information.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.eventType || !formData.ceremonyScript) {
      toast({
        title: "Missing information",
        description: "Please select an event type and ceremony script.",
        variant: "destructive",
      });
      return;
    }

    // Require account creation before payment
    if (!userAccount) {
      toast({
        title: "Account required",
        description: "Please create an account or log in before proceeding to payment.",
        variant: "destructive",
      });
      setShowAccountDialog(true);
      return;
    }

    // Save progress first
    await saveProgress();

    if (!composerId) {
      toast({
        title: "Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to payment page
    setLocation(`/payment/${composerId}`);
  };

  const handleSaveProgress = async () => {
    if (!userAccount) {
      setShowAccountDialog(true);
    } else {
      await saveProgress();
      toast({
        title: "Progress saved",
        description: "Your wedding details have been saved.",
      });
    }
  };

  const handleAccountCreated = (userId: string, email: string) => {
    setUserAccount({ id: userId, email });
    toast({
      title: "Account created!",
      description: "Your progress will now be saved automatically",
    });
  };

  const handleLoginSuccess = (userId: string, email: string, composer?: any) => {
    setUserAccount({ id: userId, email });
    setShowLoginDialog(false);
    setShowInitialDialog(false);
    
    if (composer) {
      // Load the composer data into the form
      setComposerId(composer.id);
      setFormData({
        eventType: composer.eventType || "modest-wedding",
        eventTypeOther: composer.eventTypeOther || "",
        preferredDate: composer.preferredDate || "",
        backupDate: composer.backupDate || "",
        timeSlot: composer.timeSlot || "",
        signatureColor: composer.signatureColor || "",
        colorSwatchDecision: composer.colorSwatchDecision || "",
        processionalSong: composer.processionalSong || "",
        recessionalSong: composer.recessionalSong || "",
        receptionEntranceSong: composer.receptionEntranceSong || "",
        cakeCuttingSong: composer.cakeCuttingSong || "",
        fatherDaughterDanceSong: composer.fatherDaughterDanceSong || "",
        lastDanceSong: composer.lastDanceSong || "",
        playlistUrl: composer.playlistUrl || "",
        grandIntroduction: composer.grandIntroduction || "",
        fatherDaughterDanceAnnouncement: composer.fatherDaughterDanceAnnouncement || "",
        toastsSpeechesAnnouncement: composer.toastsSpeechesAnnouncement || "",
        guestCallouts: composer.guestCallouts || "",
        vibeCheck: composer.vibeCheck || "",
        ceremonyScript: composer.ceremonyScript || "simple-modern",
        unityCandle: composer.unityCandle || false,
        sandCeremony: composer.sandCeremony || false,
        handfasting: composer.handfasting || false,
        guestReadingOrSong: composer.guestReadingOrSong || "",
        guestReadingOrSongName: composer.guestReadingOrSongName || "",
        officiantPassage: composer.officiantPassage || "",
        includingChild: composer.includingChild || "",
        petInvolvement: composer.petInvolvement || "",
        ceremonySpecialRequests: composer.ceremonySpecialRequests || "",
        walkingDownAisle: composer.walkingDownAisle || "",
        ringBearerFlowerGirl: composer.ringBearerFlowerGirl || "",
        ringBearerOrganizer: composer.ringBearerOrganizer || "",
        honoredGuestEscorts: composer.honoredGuestEscorts || "",
        brideSideFrontRow: composer.brideSideFrontRow || "",
        groomSideFrontRow: composer.groomSideFrontRow || "",
        framedPhotos: composer.framedPhotos || "",
        specialSeatingNeeds: composer.specialSeatingNeeds || "",
        processionalSpecialInstructions: composer.processionalSpecialInstructions || "",
        firstDance: composer.firstDance || "",
        motherSonDance: composer.motherSonDance || "",
        specialDances: composer.specialDances || "",
        toastGivers: composer.toastGivers || "",
        beveragePreferences: composer.beveragePreferences || "",
        horsDoeuvresPreferences: composer.horsDoeuvresPreferences || "",
        sendOffStyle: composer.sendOffStyle || "",
        receptionSpecialRequests: composer.receptionSpecialRequests || "",
        photographyStyle: composer.photographyStyle || "",
        mustHaveShots: composer.mustHaveShots || "",
        vipList: composer.vipList || "",
        groupPhotosRequested: composer.groupPhotosRequested || "",
        photographySpecialRequests: composer.photographySpecialRequests || "",
        photoProjectionPreferences: composer.photoProjectionPreferences || "",
        freshFlorals: composer.freshFlorals || "",
        guestBook: composer.guestBook || "",
        cakeKnifeServiceSet: composer.cakeKnifeServiceSet || "",
        departureOrganizer: composer.departureOrganizer || "",
        departureVehicle: composer.departureVehicle || "",
        personalTouchesSpecialInstructions: composer.personalTouchesSpecialInstructions || "",
        customerName: composer.customerName || "",
        customerName2: composer.customerName2 || "",
        customerEmail: composer.customerEmail || email,
        customerPhone: composer.customerPhone || "",
        smsConsent: composer.smsConsent || false,
        mailingAddress: composer.mailingAddress || "",
        termsAccepted: composer.termsAccepted || false,
        photoBookAddon: composer.photoBookAddon || false,
        extraTimeAddon: composer.extraTimeAddon || false,
        byobBarAddon: composer.byobBarAddon || false,
        rehearsalAddon: composer.rehearsalAddon || false,
      });
      
      toast({
        title: "Welcome back!",
        description: "Your saved wedding plans have been loaded.",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Start planning your wedding!",
      });
    }
  };

  const handleInitialDialogLogin = () => {
    setShowInitialDialog(false);
    setShowLoginDialog(true);
  };

  const handleInitialDialogCreateAccount = () => {
    setShowInitialDialog(false);
    setShowAccountDialog(true);
  };

  const handleInitialDialogGuest = () => {
    setShowInitialDialog(false);
    setHasSeenInitialDialog(true);
  };

  // Auto-save when formData changes and user is logged in
  useEffect(() => {
    if (userAccount && composerId) {
      const timeoutId = setTimeout(() => {
        saveProgress();
      }, 1000); // Debounce auto-save
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, userAccount]);

  // Save immediately when user account is created or logs in
  useEffect(() => {
    if (userAccount && hasSeenInitialDialog) {
      saveProgress();
    }
  }, [userAccount]);

  // Extract day of week from preferred date
  const getDayOfWeek = (dateString: string): string => {
    if (!dateString) return '';
    // Add time component to ensure correct timezone parsing
    const date = new Date(dateString + 'T12:00:00');
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const isSimplifiedFlow = formData.eventType === 'modest-elopement' || formData.eventType === 'vow-renewal';
  const steps = allSteps.filter(step => 
    step.availableFor.includes('all') || 
    (!isSimplifiedFlow && step.availableFor.includes(formData.eventType))
  );

  const progress = (currentStep / steps.length) * 100;
  const dayOfWeek = getDayOfWeek(formData.preferredDate);
  const basePrice = calculatePrice(formData.eventType, dayOfWeek);

  const addonsTotal =
    (formData.photoBookAddon ? 30000 : 0) +
    (formData.extraTimeAddon ? 100000 : 0) +
    (formData.byobBarAddon ? 40000 : 0) +
    (formData.rehearsalAddon ? 15000 : 0);
  const totalPrice = basePrice + addonsTotal;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 px-4 py-2 bg-background border rounded-md font-bold text-sm text-yellow-400" data-testid="text-total-price">
              ${(totalPrice / 100).toFixed(2)}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(stepNumber)}
                    data-testid={`button-step-${stepNumber}`}
                    className={`flex-shrink-0 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      currentStep === stepNumber
                        ? 'bg-primary text-primary-foreground'
                        : currentStep > stepNumber
                        ? 'bg-muted text-muted-foreground hover-elevate'
                        : 'bg-background text-muted-foreground border hover-elevate'
                    }`}
                  >
                    <span className="block">{stepNumber}. {step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-4xl font-serif mb-2">The Wedding Composer</h1>
              <p className="text-muted-foreground">
                Your personalized planning tool for designing a wedding day that feels entirely your own
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end shrink-0">
              {!userAccount && (
                <Button
                  onClick={() => setShowLoginDialog(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                  data-testid="button-create-account-login-header"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account or Login
                </Button>
              )}
              {userAccount && (
                <div className="text-sm text-muted-foreground" data-testid="text-auto-save-indicator">
                  Auto-saving as {userAccount.email}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="mb-8">
          {steps[currentStep - 1]?.id === 1 && (
            <Block1EventType
              eventType={formData.eventType}
              eventTypeOther={formData.eventTypeOther}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 2 && (
            <Block2DateTime
              preferredDate={formData.preferredDate}
              timeSlot={formData.timeSlot}
              onChange={updateField}
              eventType={formData.eventType}
            />
          )}
          {steps[currentStep - 1]?.id === 3 && (
            <Block3SignatureColor
              signatureColor={formData.signatureColor}
              colorSwatchDecision={formData.colorSwatchDecision}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 4 && (
            <Block4Music
              processionalSong={formData.processionalSong}
              recessionalSong={formData.recessionalSong}
              receptionEntranceSong={formData.receptionEntranceSong}
              cakeCuttingSong={formData.cakeCuttingSong}
              fatherDaughterDanceSong={formData.fatherDaughterDanceSong}
              lastDanceSong={formData.lastDanceSong}
              playlistUrl={formData.playlistUrl}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 5 && (
            <Block5Announcements
              grandIntroduction={formData.grandIntroduction}
              fatherDaughterDanceAnnouncement={formData.fatherDaughterDanceAnnouncement}
              toastsSpeechesAnnouncement={formData.toastsSpeechesAnnouncement}
              guestCallouts={formData.guestCallouts}
              vibeCheck={formData.vibeCheck}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 6 && (
            <Block6Ceremony
              ceremonyScript={formData.ceremonyScript}
              unityCandle={formData.unityCandle}
              sandCeremony={formData.sandCeremony}
              handfasting={formData.handfasting}
              guestReadingOrSong={formData.guestReadingOrSong}
              guestReadingOrSongName={formData.guestReadingOrSongName}
              officiantPassage={formData.officiantPassage}
              includingChild={formData.includingChild}
              petInvolvement={formData.petInvolvement}
              ceremonySpecialRequests={formData.ceremonySpecialRequests}
              onChange={updateField}
              showAddOns={!isSimplifiedFlow}
            />
          )}
          {steps[currentStep - 1]?.id === 7 && (
            <Block7Processional
              walkingDownAisle={formData.walkingDownAisle}
              ringBearerFlowerGirl={formData.ringBearerFlowerGirl}
              ringBearerOrganizer={formData.ringBearerOrganizer}
              honoredGuestEscorts={formData.honoredGuestEscorts}
              brideSideFrontRow={formData.brideSideFrontRow}
              groomSideFrontRow={formData.groomSideFrontRow}
              framedPhotos={formData.framedPhotos}
              specialSeatingNeeds={formData.specialSeatingNeeds}
              processionalSpecialInstructions={formData.processionalSpecialInstructions}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 8 && (
            <Block8Reception
              firstDance={formData.firstDance}
              motherSonDance={formData.motherSonDance}
              specialDances={formData.specialDances}
              toastGivers={formData.toastGivers}
              beveragePreferences={formData.beveragePreferences}
              horsDoeuvresPreferences={formData.horsDoeuvresPreferences}
              sendOffStyle={formData.sendOffStyle}
              receptionSpecialRequests={formData.receptionSpecialRequests}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 9 && (
            <Block9Photography
              photographyStyle={formData.photographyStyle}
              mustHaveShots={formData.mustHaveShots}
              vipList={formData.vipList}
              groupPhotosRequested={formData.groupPhotosRequested}
              photographySpecialRequests={formData.photographySpecialRequests}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 10 && (
            <Block10PhotoProjection
              photoProjectionPreferences={formData.photoProjectionPreferences}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 11 && (
            <Block11PersonalTouches
              freshFlorals={formData.freshFlorals}
              guestBook={formData.guestBook}
              cakeKnifeServiceSet={formData.cakeKnifeServiceSet}
              departureOrganizer={formData.departureOrganizer}
              departureVehicle={formData.departureVehicle}
              personalTouchesSpecialInstructions={formData.personalTouchesSpecialInstructions}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 12 && (
            <Block12ContactPayment
              customerName={formData.customerName}
              customerName2={formData.customerName2}
              customerEmail={formData.customerEmail}
              customerPhone={formData.customerPhone}
              smsConsent={formData.smsConsent}
              mailingAddress={formData.mailingAddress}
              termsAccepted={formData.termsAccepted}
              photoBookAddon={formData.photoBookAddon}
              photoBookQuantity={formData.photoBookQuantity}
              extraTimeAddon={formData.extraTimeAddon}
              byobBarAddon={formData.byobBarAddon}
              rehearsalAddon={formData.rehearsalAddon}
              onChange={updateField}
              eventType={formData.eventType}
              basePackagePrice={basePrice}
            />
          )}
        </div>

        <div className="flex justify-between gap-4 pt-6 border-t">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            data-testid="button-previous"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!formData.eventType}
              data-testid="button-next"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.termsAccepted || !formData.customerName}
              size="lg"
              data-testid="button-finalize-payment"
            >
              Proceed to Payment
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <InitialAuthDialog
        open={showInitialDialog && !hasSeenInitialDialog}
        onLoginClick={handleInitialDialogLogin}
        onCreateAccountClick={handleInitialDialogCreateAccount}
        onContinueAsGuest={handleInitialDialogGuest}
      />

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />

      <AccountCreationDialog
        open={showAccountDialog}
        onOpenChange={setShowAccountDialog}
        onAccountCreated={handleAccountCreated}
      />
    </div>
  );
}
