import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Save, UserPlus, LogOut, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WeddingComposer as WeddingComposerType } from "@shared/schema";
import { getAddonPrice, getPaymentDiscount } from "@shared/pricing";
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
import Block10Slideshow from "@/components/composer/Block10Slideshow";
import Block11PersonalTouches from "@/components/composer/Block11PersonalTouches";
import Block12EviteSaveTheDate from "@/components/composer/Block12EviteSaveTheDate";
import BlockAddOns from "@/components/composer/BlockAddOns";
import Block13TheCouple from "@/components/composer/Block13TheCouple";
import Block13ContactPayment from "@/components/composer/Block13ContactPayment";

const allSteps = [
  { id: 1, title: 'The Couple', description: 'Your information', availableFor: ['all'] },
  { id: 2, title: 'Event Type', description: 'Choose your celebration', availableFor: ['all'] },
  { id: 3, title: 'Colors', description: 'Choose your color theme', availableFor: ['modest-wedding', 'other'] },
  { id: 4, title: 'Music', description: 'Pick your songs', availableFor: ['modest-wedding', 'other'] },
  { id: 5, title: 'Announcements', description: 'Special moments', availableFor: ['modest-wedding', 'other'] },
  { id: 6, title: 'Ceremony', description: 'Ceremony preferences', availableFor: ['all'] },
  { id: 7, title: 'Processional', description: 'Seating & procession', availableFor: ['modest-wedding', 'other'] },
  { id: 8, title: 'Reception', description: 'Reception details', availableFor: ['modest-wedding', 'other'] },
  { id: 9, title: 'Photography', description: 'Photo preferences', availableFor: ['modest-wedding', 'other'] },
  { id: 10, title: 'Memory Wall', description: 'Upload photos', availableFor: ['modest-wedding', 'other'] },
  { id: 11, title: 'Personal Touches', description: 'Special details', availableFor: ['modest-wedding', 'other'] },
  { id: 12, title: 'Evites', description: 'Digital invitations', availableFor: ['all'] },
  { id: 13, title: 'Add-Ons', description: 'Enhance your celebration', availableFor: ['all'] },
  { id: 14, title: 'Cart', description: 'Review & payment', availableFor: ['all'] },
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
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [composerId, setComposerId] = useState<string | null>(null);
  const [composerPaymentStatus, setComposerPaymentStatus] = useState<string>("pending");
  const [isSaving, setIsSaving] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showInitialDialog, setShowInitialDialog] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [userAccount, setUserAccount] = useState<{ id: string; email: string } | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [hasSeenInitialDialog, setHasSeenInitialDialog] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return !!savedUser;
  });
  const [savedStepBeforeSimplification, setSavedStepBeforeSimplification] = useState<number | null>(null);
  const previousEventTypeRef = useRef<string>("");
  const hasLoadedDataRef = useRef(false);
  const lastLocationRef = useRef<string>("");
  const isInitialLoadRef = useRef(true);

  const [formData, setFormData] = useState({
    // Block 1: Event Type
    eventType: "",

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
    musicCompletionStatus: "",

    // Block 5: Announcements
    grandIntroduction: "",
    fatherDaughterDanceAnnouncement: "",
    toastsSpeechesAnnouncement: "",
    guestCallouts: "",
    vibeCheck: "",
    announcementsCompletionStatus: "",

    // Block 6: Ceremony
    ceremonyScript: "",
    vowChoices: "",
    unityCandle: false,
    sandCeremony: false,
    handfasting: false,
    guestReadingOrSongChoice: "no",
    guestReadingOrSong: "",
    guestReadingOrSongName: "",
    officiantPassageChoice: "no",
    officiantPassage: "",
    includingChildChoice: "no",
    includingChild: "",
    childrenOrganizer: "",
    petInvolvementChoice: "no",
    petPolicyAccepted: false,
    petInvolvement: "",
    ceremonySpecialRequests: "",

    // Block 7: Processional
    walkingDownAisle: "",
    escortName: "",
    ringBearerIncluded: "",
    ringBearerFlowerGirl: "",
    ringBearerOrganizer: "",
    honoredGuestEscorts: "",
    honoredGuestEscortsNA: false,
    brideSideFrontRow: "",
    brideSideFrontRowNA: false,
    groomSideFrontRow: "",
    groomSideFrontRowNA: false,
    framedPhotos: "",
    framedPhotosNA: false,
    specialSeatingNeeds: "",
    specialSeatingNeedsNA: false,
    processionalSpecialInstructions: "",
    processionalSpecialInstructionsNA: false,
    processionalCompletionStatus: "",

    // Block 8: Reception
    firstDance: "",
    firstDanceNA: false,
    motherSonDance: "",
    motherSonDanceNA: false,
    specialDances: "",
    specialDancesNA: false,
    toastGivers: "",
    toastGiversNA: false,
    beveragePreferences: "",
    receptionSpecialRequests: "",
    receptionSpecialRequestsNA: false,
    receptionCompletionStatus: "",

    // Block 9: Photography
    mustHaveShots: "",
    mustHaveShotsNA: false,
    vipList: "",
    vipListNA: false,
    groupPhotosRequested: "",
    groupPhotosRequestedNA: false,
    photographySpecialRequests: "",
    photographySpecialRequestsNA: false,
    photographyCompletionStatus: "",

    // Block 10: Memory Wall
    slideshowPhotos: "[]",
    slideshowPhotosNA: false,
    engagementPhotos: "[]",
    engagementPhotosNA: false,
    slideshowCompletionStatus: "",

    // Block 11: Personal Touches
    freshFlorals: "",
    freshFloralsNA: false,
    guestBookChoice: "",
    guestBook: "",
    cakeKnifeChoice: "",
    cakeKnifeServiceSet: "",
    departureOrganizer: "",
    departureOrganizerTBD: false,
    departureVehicleChoice: "",
    departureVehicle: "",
    personalTouchesSpecialInstructions: "",
    personalTouchesSpecialInstructionsNA: false,
    personalTouchesCompletionStatus: "",

    // Block 12: Evite & Save-the-Date
    eviteDesignStyle: "",
    eviteHeaderText: "",
    eviteBodyText: "",
    eviteRsvpOption: "",
    eviteRsvpCustomLink: "",
    eviteDesignNoSpecialRequests: false,
    eviteWordingNoSpecialRequests: false,
    eviteRsvpNoSpecialRequests: false,
    eviteCompletionStatus: "",

    // Block 13: Contact & Payment - Couple Information
    person1Role: "",
    person1FullName: "",
    person1Pronouns: "",
    person1Email: "",
    person1Phone: "",
    person1AlternatePhone: "",
    person2Role: "",
    person2FullName: "",
    person2Pronouns: "",
    person2Email: "",
    person2Phone: "",
    smsConsent: false,
    mailingAddress: "",
    paymentMethod: "credit_card",
    termsAccepted: false,

    // Add-ons
    photoBookAddon: false,
    photoBookQuantity: 1,
    extraTimeAddon: false,
    byobBarAddon: false,
    rehearsalAddon: false,
    amountPaid: 0,
  });

  const updateField = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add hydration flag to prevent date clearing during data loads
  const isHydratingRef = useRef(false);

  // Clear dates when event type changes (but not during initial load or data hydration)
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }
    
    // Skip if we're hydrating data from database
    if (isHydratingRef.current) {
      return;
    }
    
    // Only clear dates if event type actually changed
    if (formData.eventType && formData.eventType !== previousEventTypeRef.current) {
      setFormData((prev) => ({
        ...prev,
        preferredDate: "",
        backupDate: "",
      }));
    }
  }, [formData.eventType]);

  // Preserve and restore navigation position when switching between package types
  useEffect(() => {
    const currentEventType = formData.eventType;
    const previousEventType = previousEventTypeRef.current;
    
    // Only act if event type actually changed
    if (currentEventType && currentEventType !== previousEventType) {
      const wasFullPackage = previousEventType === 'modest-wedding' || previousEventType === 'other';
      const isNowSimplified = currentEventType === 'modest-elopement' || currentEventType === 'vow-renewal';
      const wasSimplified = previousEventType === 'modest-elopement' || previousEventType === 'vow-renewal';
      const isNowFull = currentEventType === 'modest-wedding' || currentEventType === 'other';
      
      // Transitioning from full package to simplified package
      if (wasFullPackage && isNowSimplified) {
        const currentStepInfo = allSteps.find(s => s.id === currentStep);
        
        // Save current step if it won't be available in simplified package
        if (currentStepInfo && !currentStepInfo.availableFor.includes('all')) {
          setSavedStepBeforeSimplification(currentStep);
          
          // Navigate to Block 6 (Ceremony) - first read-only block
          setCurrentStep(6);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      
      // Transitioning from simplified package back to full package
      if (wasSimplified && isNowFull && savedStepBeforeSimplification !== null) {
        // Restore the previously saved step
        setCurrentStep(savedStepBeforeSimplification);
        setSavedStepBeforeSimplification(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Update ref for next comparison
      previousEventTypeRef.current = currentEventType;
    }
  }, [formData.eventType]);

  const saveProgress = async () => {
    setIsSaving(true);
    try {
      const dayOfWeek = getDayOfWeek(formData.preferredDate);
      const basePrice = calculatePrice(formData.eventType, dayOfWeek);
      
      // Get current prices from pricing config
      const photoBookPrice = getAddonPrice('photoBook');
      const extraTimePrice = getAddonPrice('extraTime');
      const byobBarPrice = getAddonPrice('byobBar');
      const rehearsalPrice = getAddonPrice('rehearsal');
      const achDiscountAmount = getPaymentDiscount('ach', formData.eventType);
      const affirmDiscountAmount = getPaymentDiscount('affirm', formData.eventType);
      
      const addonsTotal =
        (formData.photoBookAddon ? photoBookPrice * (formData.photoBookQuantity || 1) : 0) +
        (formData.extraTimeAddon ? extraTimePrice : 0) +
        (formData.byobBarAddon ? byobBarPrice : 0) +
        (formData.rehearsalAddon ? rehearsalPrice : 0);
      
      // Apply payment method discount
      const paymentDiscount = formData.paymentMethod === 'ach' 
        ? achDiscountAmount 
        : formData.paymentMethod === 'affirm' 
          ? affirmDiscountAmount 
          : 0;
      
      // Ensure total price is never negative
      const totalPrice = Math.max(0, basePrice + addonsTotal - paymentDiscount);

      let composerData;
      
      // For paid/initiated composers: preserve date/time
      // For pending composers: exclude date/time (only save on payment)
      if (composerPaymentStatus === "completed" || composerPaymentStatus === "payment_initiated") {
        composerData = {
          ...formData,
          basePackagePrice: basePrice,
          photoBookPrice,
          extraTimePrice,
          byobBarPrice,
          rehearsalPrice,
          achDiscountAmount,
          affirmDiscountAmount,
          totalPrice,
          userId: userAccount?.id || null,
        };
      } else {
        composerData = {
          ...formData,
          preferredDate: "", // Exclude date/time for unpaid composers
          backupDate: "",
          timeSlot: "",
          basePackagePrice: basePrice,
          photoBookPrice,
          extraTimePrice,
          byobBarPrice,
          rehearsalPrice,
          achDiscountAmount,
          affirmDiscountAmount,
          totalPrice,
          userId: userAccount?.id || null,
        };
      }

      if (composerId) {
        await apiRequest("PATCH", `/api/wedding-composers/${composerId}`, composerData);
      } else {
        const response = await apiRequest("POST", "/api/wedding-composers", composerData);
        const result = await response.json();
        setComposerId(result.id);
        setComposerPaymentStatus(result.paymentStatus || "pending");
      }
    } catch (error: any) {
      toast({
        title: "Error saving progress",
        description: error.message || "Failed to save your progress. Please try again.",
        variant: "destructive",
        duration: 3000,
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

  const navigateToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Require account creation before payment - check this first for guests
    if (!userAccount) {
      toast({
        title: "Account required",
        description: "You must create an account to continue.",
        variant: "destructive",
        duration: 3000,
      });
      setShowAccountDialog(true);
      return;
    }

    if (!formData.preferredDate) {
      toast({
        title: "Date required",
        description: "Please select a preferred date before proceeding to payment.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(2); // Navigate to Event Type page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.timeSlot) {
      toast({
        title: "Time required",
        description: "Please select a time slot before proceeding to payment.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!formData.termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!formData.person1FullName || !formData.person1Email || !formData.person1Phone || !formData.person1Role) {
      toast({
        title: "Missing information",
        description: "You must provide the couple's information before proceeding.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(1); // Navigate to The Couple block
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.person2FullName || !formData.person2Role) {
      toast({
        title: "Missing information",
        description: "You must provide the couple's information before proceeding.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(1); // Navigate to The Couple block
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.photoBookAddon && !formData.mailingAddress) {
      toast({
        title: "Mailing address required",
        description: "Please provide a mailing address for photo book delivery in the Add-Ons section.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(13); // Navigate to Add-Ons block
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.eventType) {
      toast({
        title: "Missing information",
        description: "Please select an event type.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!formData.ceremonyScript) {
      toast({
        title: "Ceremony script required",
        description: "Please select a ceremony script in the Ceremony section.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(6); // Navigate to ceremony block
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate ceremony add-ons if "Yes" is selected
    if (formData.guestReadingOrSongChoice === 'yes' && (!formData.guestReadingOrSongName || !formData.guestReadingOrSong)) {
      toast({
        title: "Guest reading or song details required",
        description: "Please provide the guest name and describe their involvement in the Ceremony section.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(6); // Navigate to ceremony block
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.officiantPassageChoice === 'yes' && !formData.officiantPassage) {
      toast({
        title: "Officiant passage required",
        description: "Please provide the passage text in the Ceremony section.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.includingChildChoice === 'yes' && (!formData.includingChild || !formData.childrenOrganizer)) {
      toast({
        title: "Child involvement details required",
        description: "Please describe how children will be involved and provide the organizer name in the Ceremony section.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.petInvolvementChoice === 'yes' && !formData.petInvolvement) {
      toast({
        title: "Pet involvement details required",
        description: "Please provide the pet name, role, and handler details in the Ceremony section.",
        variant: "destructive",
        duration: 3000,
      });
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }


    // Save progress with date/time for payment submission
    const dayOfWeek = getDayOfWeek(formData.preferredDate);
    const basePrice = calculatePrice(formData.eventType, dayOfWeek);
    
    // Get current prices from pricing config
    const photoBookPrice = getAddonPrice('photoBook');
    const extraTimePrice = getAddonPrice('extraTime');
    const byobBarPrice = getAddonPrice('byobBar');
    const rehearsalPrice = getAddonPrice('rehearsal');
    const achDiscountAmount = getPaymentDiscount('ach', formData.eventType);
    const affirmDiscountAmount = getPaymentDiscount('affirm', formData.eventType);
    
    const addonsTotal =
      (formData.photoBookAddon ? photoBookPrice * (formData.photoBookQuantity || 1) : 0) +
      (formData.extraTimeAddon ? extraTimePrice : 0) +
      (formData.byobBarAddon ? byobBarPrice : 0) +
      (formData.rehearsalAddon ? rehearsalPrice : 0);
    
    // Apply payment method discount
    const paymentDiscount = formData.paymentMethod === 'ach' 
      ? achDiscountAmount 
      : formData.paymentMethod === 'affirm' 
        ? affirmDiscountAmount 
        : 0;
    
    // Ensure total price is never negative
    const totalPrice = Math.max(0, basePrice + addonsTotal - paymentDiscount);
    
    // Calculate balance due
    const balanceDue = totalPrice - formData.amountPaid;
    
    // Prevent payment if there's no positive balance
    if (balanceDue <= 0) {
      toast({
        title: "No payment required",
        description: "Your balance is already paid in full. No additional payment is needed.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const composerData = {
      ...formData,
      basePackagePrice: basePrice,
      photoBookPrice,
      extraTimePrice,
      byobBarPrice,
      rehearsalPrice,
      achDiscountAmount,
      affirmDiscountAmount,
      totalPrice,
      userId: userAccount?.id || null,
      paymentStatus: "payment_initiated", // Mark as payment initiated to preserve date/time
    };

    let currentComposerId = composerId;

    try {
      if (composerId) {
        // For payment submission, save ALL data including date/time
        await apiRequest("PATCH", `/api/wedding-composers/${composerId}`, composerData);
        setComposerPaymentStatus("payment_initiated"); // Update local state
      } else {
        const response = await apiRequest("POST", "/api/wedding-composers", composerData);
        const result = await response.json();
        currentComposerId = result.id;
        setComposerId(result.id);
        setComposerPaymentStatus("payment_initiated"); // Update local state
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Unable to save your data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!currentComposerId) {
      toast({
        title: "Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Redirect to payment page
    setLocation(`/payment/${currentComposerId}`);
  };

  const handleSaveProgress = async () => {
    if (!userAccount) {
      setShowAccountDialog(true);
    } else {
      await saveProgress();
      toast({
        title: "Progress saved",
        description: "Your wedding details have been saved.",
        duration: 3000,
      });
    }
  };

  const handleAccountCreated = (userId: string, email: string) => {
    const user = { id: userId, email };
    setUserAccount(user);
    localStorage.setItem("user", JSON.stringify(user));
    toast({
      title: "Account created!",
      description: "Your progress will now be saved automatically",
      duration: 3000,
    });
  };

  const handleLoginSuccess = (userId: string, email: string, composer?: any) => {
    const user = { id: userId, email };
    setUserAccount(user);
    localStorage.setItem("user", JSON.stringify(user));
    setShowLoginDialog(false);
    setShowInitialDialog(false);
    
    if (composer) {
      // Load the composer data into the form
      setComposerId(composer.id);
      setComposerPaymentStatus(composer.paymentStatus || "pending");
      
      // Set hydration flag to prevent date clearing effect from running
      isHydratingRef.current = true;
      previousEventTypeRef.current = composer.eventType || ""; // Set the previous event type BEFORE loading data
      
      setFormData({
        eventType: composer.eventType || "",
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
        musicCompletionStatus: composer.musicCompletionStatus || "",
        grandIntroduction: composer.grandIntroduction || "",
        fatherDaughterDanceAnnouncement: composer.fatherDaughterDanceAnnouncement || "",
        toastsSpeechesAnnouncement: composer.toastsSpeechesAnnouncement || "",
        guestCallouts: composer.guestCallouts || "",
        vibeCheck: composer.vibeCheck || "",
        announcementsCompletionStatus: composer.announcementsCompletionStatus || "",
        ceremonyScript: composer.ceremonyScript || "simple-modern",
        vowChoices: composer.vowChoices || "",
        unityCandle: composer.unityCandle || false,
        sandCeremony: composer.sandCeremony || false,
        handfasting: composer.handfasting || false,
        guestReadingOrSongChoice: composer.guestReadingOrSongChoice || "no",
        guestReadingOrSong: composer.guestReadingOrSong || "",
        guestReadingOrSongName: composer.guestReadingOrSongName || "",
        officiantPassageChoice: composer.officiantPassageChoice || "no",
        officiantPassage: composer.officiantPassage || "",
        includingChildChoice: composer.includingChildChoice || "no",
        includingChild: composer.includingChild || "",
        childrenOrganizer: composer.childrenOrganizer || "",
        petInvolvementChoice: composer.petInvolvementChoice || "no",
        petPolicyAccepted: composer.petPolicyAccepted || false,
        petInvolvement: composer.petInvolvement || "",
        ceremonySpecialRequests: composer.ceremonySpecialRequests || "",
        walkingDownAisle: composer.walkingDownAisle || "",
        escortName: composer.escortName || "",
        ringBearerIncluded: composer.ringBearerIncluded || "",
        ringBearerFlowerGirl: composer.ringBearerFlowerGirl || "",
        ringBearerOrganizer: composer.ringBearerOrganizer || "",
        honoredGuestEscorts: composer.honoredGuestEscorts || "",
        honoredGuestEscortsNA: composer.honoredGuestEscortsNA || false,
        brideSideFrontRow: composer.brideSideFrontRow || "",
        brideSideFrontRowNA: composer.brideSideFrontRowNA || false,
        groomSideFrontRow: composer.groomSideFrontRow || "",
        groomSideFrontRowNA: composer.groomSideFrontRowNA || false,
        framedPhotos: composer.framedPhotos || "",
        framedPhotosNA: composer.framedPhotosNA || false,
        specialSeatingNeeds: composer.specialSeatingNeeds || "",
        specialSeatingNeedsNA: composer.specialSeatingNeedsNA || false,
        processionalSpecialInstructions: composer.processionalSpecialInstructions || "",
        processionalSpecialInstructionsNA: composer.processionalSpecialInstructionsNA || false,
        processionalCompletionStatus: composer.processionalCompletionStatus || "",
        firstDance: composer.firstDance || "",
        firstDanceNA: composer.firstDanceNA || false,
        motherSonDance: composer.motherSonDance || "",
        motherSonDanceNA: composer.motherSonDanceNA || false,
        specialDances: composer.specialDances || "",
        specialDancesNA: composer.specialDancesNA || false,
        toastGivers: composer.toastGivers || "",
        toastGiversNA: composer.toastGiversNA || false,
        beveragePreferences: composer.beveragePreferences || "",
        receptionSpecialRequests: composer.receptionSpecialRequests || "",
        receptionSpecialRequestsNA: composer.receptionSpecialRequestsNA || false,
        receptionCompletionStatus: composer.receptionCompletionStatus || "",
        mustHaveShots: composer.mustHaveShots || "",
        mustHaveShotsNA: composer.mustHaveShotsNA || false,
        vipList: composer.vipList || "",
        vipListNA: composer.vipListNA || false,
        groupPhotosRequested: composer.groupPhotosRequested || "",
        groupPhotosRequestedNA: composer.groupPhotosRequestedNA || false,
        photographySpecialRequests: composer.photographySpecialRequests || "",
        photographySpecialRequestsNA: composer.photographySpecialRequestsNA || false,
        photographyCompletionStatus: composer.photographyCompletionStatus || "",
        slideshowPhotos: composer.slideshowPhotos || "[]",
        slideshowPhotosNA: composer.slideshowPhotosNA || false,
        engagementPhotos: composer.engagementPhotos || "[]",
        engagementPhotosNA: composer.engagementPhotosNA || false,
        slideshowCompletionStatus: composer.slideshowCompletionStatus || "",
        freshFlorals: composer.freshFlorals || "",
        freshFloralsNA: composer.freshFloralsNA || false,
        guestBookChoice: composer.guestBookChoice || "",
        guestBook: composer.guestBook || "",
        cakeKnifeChoice: composer.cakeKnifeChoice || "",
        cakeKnifeServiceSet: composer.cakeKnifeServiceSet || "",
        departureOrganizer: composer.departureOrganizer || "",
        departureOrganizerTBD: composer.departureOrganizerTBD || false,
        departureVehicleChoice: composer.departureVehicleChoice || "",
        departureVehicle: composer.departureVehicle || "",
        personalTouchesSpecialInstructions: composer.personalTouchesSpecialInstructions || "",
        personalTouchesSpecialInstructionsNA: composer.personalTouchesSpecialInstructionsNA || false,
        personalTouchesCompletionStatus: composer.personalTouchesCompletionStatus || "",
        eviteDesignStyle: composer.eviteDesignStyle || "",
        eviteHeaderText: composer.eviteHeaderText || "",
        eviteBodyText: composer.eviteBodyText || "",
        eviteRsvpOption: composer.eviteRsvpOption || "",
        eviteRsvpCustomLink: composer.eviteRsvpCustomLink || "",
        eviteDesignNoSpecialRequests: composer.eviteDesignNoSpecialRequests || false,
        eviteWordingNoSpecialRequests: composer.eviteWordingNoSpecialRequests || false,
        eviteRsvpNoSpecialRequests: composer.eviteRsvpNoSpecialRequests || false,
        eviteCompletionStatus: composer.eviteCompletionStatus || "",
        person1Role: composer.person1Role || "",
        person1FullName: composer.person1FullName || "",
        person1Pronouns: composer.person1Pronouns || "",
        person1Email: composer.person1Email || email,
        person1Phone: composer.person1Phone || "",
        person1AlternatePhone: composer.person1AlternatePhone || "",
        person2Role: composer.person2Role || "",
        person2FullName: composer.person2FullName || "",
        person2Pronouns: composer.person2Pronouns || "",
        person2Email: composer.person2Email || "",
        person2Phone: composer.person2Phone || "",
        smsConsent: composer.smsConsent || false,
        mailingAddress: composer.mailingAddress || "",
        paymentMethod: composer.paymentMethod || "credit_card",
        termsAccepted: composer.termsAccepted || false,
        photoBookAddon: composer.photoBookAddon || false,
        photoBookQuantity: composer.photoBookQuantity || 1,
        extraTimeAddon: composer.extraTimeAddon || false,
        byobBarAddon: composer.byobBarAddon || false,
        rehearsalAddon: composer.rehearsalAddon || false,
        amountPaid: composer.amountPaid || 0,
      });
      
      // Release hydration flag after a brief delay to ensure effect has run
      setTimeout(() => {
        isHydratingRef.current = false;
      }, 100);
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

  const handleLoginFailure = () => {
    // Close login dialog
    setShowLoginDialog(false);
    // Redirect to home page
    setLocation("/");
    // Reopen initial dialog
    setShowInitialDialog(true);
    setHasSeenInitialDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserAccount(null);
    setComposerId(null);
    setComposerPaymentStatus("pending");
    hasLoadedDataRef.current = false;
    setLocation("/");
  };

  // Verify user account exists in database on mount
  useEffect(() => {
    const verifyUserAccount = async () => {
      if (userAccount) {
        try {
          const response = await fetch(`/api/users/${userAccount.id}`);
          if (!response.ok) {
            // User doesn't exist in database, clear localStorage
            console.log('User account not found in database, clearing localStorage');
            localStorage.removeItem("user");
            setUserAccount(null);
            setHasSeenInitialDialog(false);
          }
        } catch (error) {
          console.error('Error verifying user account:', error);
          // On error, clear the account to be safe
          localStorage.removeItem("user");
          setUserAccount(null);
          setHasSeenInitialDialog(false);
        }
      }
    };
    
    verifyUserAccount();
  }, []); // Run only on mount

  // Load user's existing composer data when component mounts with logged-in user
  useEffect(() => {
    const loadUserComposerData = async () => {
      if (userAccount && !composerId && !hasLoadedDataRef.current) {
        hasLoadedDataRef.current = true;
        console.log('Loading composer data for user:', userAccount.id);
        try {
          const response = await fetch(`/api/wedding-composers/by-user?userId=${userAccount.id}`);
          if (response.ok) {
            const composers: WeddingComposerType[] = await response.json();
            console.log('Loaded composers:', composers.length);
            if (composers && composers.length > 0) {
              // Get the most recent composer regardless of payment status
              const composer = composers.sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )[0];
              
              // Load the composer data into the form
              setComposerId(composer.id);
              setComposerPaymentStatus(composer.paymentStatus || "pending");
              
              // Set hydration flag to prevent date clearing effect from running
              isHydratingRef.current = true;
              previousEventTypeRef.current = composer.eventType || ""; // Set the previous event type BEFORE loading data
              
              setFormData({
                eventType: composer.eventType || "",
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
                musicCompletionStatus: composer.musicCompletionStatus || "",
                grandIntroduction: composer.grandIntroduction || "",
                fatherDaughterDanceAnnouncement: composer.fatherDaughterDanceAnnouncement || "",
                toastsSpeechesAnnouncement: composer.toastsSpeechesAnnouncement || "",
                guestCallouts: composer.guestCallouts || "",
                vibeCheck: composer.vibeCheck || "",
                announcementsCompletionStatus: composer.announcementsCompletionStatus || "",
                ceremonyScript: composer.ceremonyScript || "",
                vowChoices: composer.vowChoices || "",
                unityCandle: composer.unityCandle || false,
                sandCeremony: composer.sandCeremony || false,
                handfasting: composer.handfasting || false,
                guestReadingOrSongChoice: composer.guestReadingOrSongChoice || "no",
                guestReadingOrSong: composer.guestReadingOrSong || "",
                guestReadingOrSongName: composer.guestReadingOrSongName || "",
                officiantPassageChoice: composer.officiantPassageChoice || "no",
                officiantPassage: composer.officiantPassage || "",
                includingChildChoice: composer.includingChildChoice || "no",
                includingChild: composer.includingChild || "",
                childrenOrganizer: composer.childrenOrganizer || "",
                petInvolvementChoice: composer.petInvolvementChoice || "no",
                petPolicyAccepted: composer.petPolicyAccepted || false,
                petInvolvement: composer.petInvolvement || "",
                ceremonySpecialRequests: composer.ceremonySpecialRequests || "",
                walkingDownAisle: composer.walkingDownAisle || "",
                escortName: composer.escortName || "",
                ringBearerIncluded: composer.ringBearerIncluded || "",
                ringBearerFlowerGirl: composer.ringBearerFlowerGirl || "",
                ringBearerOrganizer: composer.ringBearerOrganizer || "",
                honoredGuestEscorts: composer.honoredGuestEscorts || "",
                honoredGuestEscortsNA: composer.honoredGuestEscortsNA || false,
                brideSideFrontRow: composer.brideSideFrontRow || "",
                brideSideFrontRowNA: composer.brideSideFrontRowNA || false,
                groomSideFrontRow: composer.groomSideFrontRow || "",
                groomSideFrontRowNA: composer.groomSideFrontRowNA || false,
                framedPhotos: composer.framedPhotos || "",
                framedPhotosNA: composer.framedPhotosNA || false,
                specialSeatingNeeds: composer.specialSeatingNeeds || "",
                specialSeatingNeedsNA: composer.specialSeatingNeedsNA || false,
                processionalSpecialInstructions: composer.processionalSpecialInstructions || "",
                processionalSpecialInstructionsNA: composer.processionalSpecialInstructionsNA || false,
                processionalCompletionStatus: composer.processionalCompletionStatus || "",
                firstDance: composer.firstDance || "",
                firstDanceNA: composer.firstDanceNA || false,
                motherSonDance: composer.motherSonDance || "",
                motherSonDanceNA: composer.motherSonDanceNA || false,
                specialDances: composer.specialDances || "",
                specialDancesNA: composer.specialDancesNA || false,
                toastGivers: composer.toastGivers || "",
                toastGiversNA: composer.toastGiversNA || false,
                beveragePreferences: composer.beveragePreferences || "",
                receptionSpecialRequests: composer.receptionSpecialRequests || "",
                receptionSpecialRequestsNA: composer.receptionSpecialRequestsNA || false,
                receptionCompletionStatus: composer.receptionCompletionStatus || "",
                mustHaveShots: composer.mustHaveShots || "",
                mustHaveShotsNA: composer.mustHaveShotsNA || false,
                vipList: composer.vipList || "",
                vipListNA: composer.vipListNA || false,
                groupPhotosRequested: composer.groupPhotosRequested || "",
                groupPhotosRequestedNA: composer.groupPhotosRequestedNA || false,
                photographySpecialRequests: composer.photographySpecialRequests || "",
                photographySpecialRequestsNA: composer.photographySpecialRequestsNA || false,
                photographyCompletionStatus: composer.photographyCompletionStatus || "",
                slideshowPhotos: composer.slideshowPhotos || "[]",
                slideshowPhotosNA: composer.slideshowPhotosNA || false,
                engagementPhotos: composer.engagementPhotos || "[]",
                engagementPhotosNA: composer.engagementPhotosNA || false,
                slideshowCompletionStatus: composer.slideshowCompletionStatus || "",
                freshFlorals: composer.freshFlorals || "",
                freshFloralsNA: composer.freshFloralsNA || false,
                guestBookChoice: composer.guestBookChoice || "",
                guestBook: composer.guestBook || "",
                cakeKnifeChoice: composer.cakeKnifeChoice || "",
                cakeKnifeServiceSet: composer.cakeKnifeServiceSet || "",
                departureOrganizer: composer.departureOrganizer || "",
                departureOrganizerTBD: composer.departureOrganizerTBD || false,
                departureVehicleChoice: composer.departureVehicleChoice || "",
                departureVehicle: composer.departureVehicle || "",
                personalTouchesSpecialInstructions: composer.personalTouchesSpecialInstructions || "",
                personalTouchesSpecialInstructionsNA: composer.personalTouchesSpecialInstructionsNA || false,
                personalTouchesCompletionStatus: composer.personalTouchesCompletionStatus || "",
                eviteDesignStyle: composer.eviteDesignStyle || "",
                eviteHeaderText: composer.eviteHeaderText || "",
                eviteBodyText: composer.eviteBodyText || "",
                eviteRsvpOption: composer.eviteRsvpOption || "",
                eviteRsvpCustomLink: composer.eviteRsvpCustomLink || "",
                eviteDesignNoSpecialRequests: composer.eviteDesignNoSpecialRequests || false,
                eviteWordingNoSpecialRequests: composer.eviteWordingNoSpecialRequests || false,
                eviteRsvpNoSpecialRequests: composer.eviteRsvpNoSpecialRequests || false,
                eviteCompletionStatus: composer.eviteCompletionStatus || "",
                person1Role: composer.person1Role || "",
                person1FullName: composer.person1FullName || "",
                person1Pronouns: composer.person1Pronouns || "",
                person1Email: composer.person1Email || userAccount.email,
                person1Phone: composer.person1Phone || "",
                person1AlternatePhone: composer.person1AlternatePhone || "",
                person2Role: composer.person2Role || "",
                person2FullName: composer.person2FullName || "",
                person2Pronouns: composer.person2Pronouns || "",
                person2Email: composer.person2Email || "",
                person2Phone: composer.person2Phone || "",
                smsConsent: composer.smsConsent || false,
                mailingAddress: composer.mailingAddress || "",
                paymentMethod: composer.paymentMethod || "credit_card",
                termsAccepted: composer.termsAccepted || false,
                photoBookAddon: composer.photoBookAddon || false,
                photoBookQuantity: composer.photoBookQuantity || 1,
                extraTimeAddon: composer.extraTimeAddon || false,
                byobBarAddon: composer.byobBarAddon || false,
                rehearsalAddon: composer.rehearsalAddon || false,
                amountPaid: composer.amountPaid || 0,
              });
              
              // Release hydration flag after a brief delay to ensure effect has run
              setTimeout(() => {
                isHydratingRef.current = false;
              }, 100);
            }
          }
        } catch (error) {
          console.error('Error loading composer data:', error);
          hasLoadedDataRef.current = false;
        }
      }
    };
    
    loadUserComposerData();
  }, [userAccount, composerId]);

  // Reset to step 1 when returning from payment/confirmation
  useEffect(() => {
    if (lastLocationRef.current.includes('/payment') || lastLocationRef.current.includes('/confirmation')) {
      setCurrentStep(1);
    }
    lastLocationRef.current = location;
  }, [location]);

  // Auto-save when formData changes and user is logged in
  // Only auto-save for pending composers (not payment_initiated or completed)
  const hasDataLoadedRef = useRef(false);
  const autosaveEnabled = useRef(false);
  
  useEffect(() => {
    // Skip auto-save during initial data load
    if (!hasDataLoadedRef.current) {
      hasDataLoadedRef.current = true;
      // Enable autosave after a delay to ensure data is fully loaded
      setTimeout(() => {
        autosaveEnabled.current = true;
      }, 2000);
      return;
    }
    
    // Only auto-save for pending composers after user makes changes
    if (autosaveEnabled.current && userAccount && composerId && composerPaymentStatus === "pending") {
      const timeoutId = setTimeout(() => {
        saveProgress();
      }, 1000); // Debounce auto-save
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  // DO NOT save on login - user explicitly requested no autosave on login

  // Extract day of week from preferred date
  const getDayOfWeek = (dateString: string): string => {
    if (!dateString) return '';
    // Add time component to ensure correct timezone parsing
    const date = new Date(dateString + 'T12:00:00');
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const isSimplifiedFlow = formData.eventType === 'modest-elopement' || formData.eventType === 'vow-renewal';
  // Always show all steps - users can view all blocks even if some are read-only
  const steps = allSteps;
  
  // Helper function to determine if a block should be read-only
  const isBlockReadOnly = (blockId: number): boolean => {
    if (!isSimplifiedFlow) return false; // Full wedding packages have full access
    
    // Blocks available for all event types (not read-only)
    const alwaysAvailableBlocks = [1, 2, 6, 13, 14]; // The Couple, Event Type, Ceremony, Add-Ons, Cart
    return !alwaysAvailableBlocks.includes(blockId);
  };

  // Function to determine completion status for each block
  const getBlockCompletionStatus = (blockId: number): 'complete' | 'partial' | 'none' => {
    switch (blockId) {
      case 1: // The Couple
        // Check if person1 required fields are filled
        if (formData.person1FullName && formData.person1Email && formData.person1Phone && formData.person1Role) return 'complete';
        // Partial if at least one field is filled
        if (formData.person1FullName || formData.person1Email || formData.person1Phone || formData.person1Role) return 'partial';
        return 'none';
      
      case 2: // Event Type (includes Date & Time at bottom)
        // Check if event type, date, and time are all filled
        if (formData.eventType && formData.preferredDate && formData.timeSlot) return 'complete';
        // Partial if only event type is filled (or event type + one of date/time)
        if (formData.eventType) return 'partial';
        return 'none';
      
      case 3: // Colors
        if (formData.colorSwatchDecision && formData.colorSwatchDecision !== 'see-swatches-at-tour') return 'complete';
        if (formData.signatureColor || formData.colorSwatchDecision === 'see-swatches-at-tour') return 'partial';
        return 'none';
      
      case 4: // Music
        if (formData.musicCompletionStatus && formData.musicCompletionStatus !== 'finish-later') return 'complete';
        if (formData.musicCompletionStatus === 'finish-later' || formData.processionalSong || formData.recessionalSong || formData.playlistUrl) return 'partial';
        return 'none';
      
      case 5: // Announcements
        if (formData.announcementsCompletionStatus && formData.announcementsCompletionStatus !== 'finish-later') return 'complete';
        if (formData.announcementsCompletionStatus === 'finish-later' || formData.grandIntroduction || formData.vibeCheck) return 'partial';
        return 'none';
      
      case 6: // Ceremony
        return formData.ceremonyScript ? 'complete' : 'none';
      
      case 7: // Processional
        if (formData.processionalCompletionStatus && formData.processionalCompletionStatus !== 'finish-later') return 'complete';
        if (formData.processionalCompletionStatus === 'finish-later' || formData.walkingDownAisle || formData.ringBearerIncluded) return 'partial';
        return 'none';
      
      case 8: // Reception
        if (formData.receptionCompletionStatus && formData.receptionCompletionStatus !== 'finish-later') return 'complete';
        if (formData.receptionCompletionStatus === 'finish-later' || formData.firstDance || formData.beveragePreferences) return 'partial';
        return 'none';
      
      case 9: // Photography
        if (formData.photographyCompletionStatus && formData.photographyCompletionStatus !== 'finish-later') return 'complete';
        if (formData.photographyCompletionStatus === 'finish-later' || formData.mustHaveShots || formData.vipList) return 'partial';
        return 'none';
      
      case 10: // Memory Wall (optional - not required for progression)
        if (formData.slideshowCompletionStatus === 'done') return 'complete';
        if (formData.slideshowCompletionStatus === 'later' || formData.slideshowPhotos !== '[]' || formData.engagementPhotos !== '[]') return 'partial';
        return 'none';
      
      case 11: // Personal Touches
        if (formData.personalTouchesCompletionStatus && formData.personalTouchesCompletionStatus !== 'finish-later') return 'complete';
        // Check for partial completion - exclude departureOrganizerTBD and checkbox-only flags as they don't represent actual data
        const hasPersonalTouchesData = (formData.freshFlorals && formData.freshFlorals.trim() !== '') || 
            formData.guestBookChoice || formData.cakeKnifeChoice || 
            formData.departureVehicleChoice || (formData.departureOrganizer && formData.departureOrganizer.trim() !== '' && !formData.departureOrganizerTBD) || 
            (formData.personalTouchesSpecialInstructions && formData.personalTouchesSpecialInstructions.trim() !== '');
        if (formData.personalTouchesCompletionStatus === 'finish-later' || hasPersonalTouchesData) return 'partial';
        return 'none';
      
      case 12: // Evites
        if (formData.eviteCompletionStatus && formData.eviteCompletionStatus !== 'finish-later') return 'complete';
        if (formData.eviteCompletionStatus === 'finish-later' || formData.eviteDesignStyle || formData.eviteHeaderText) return 'partial';
        return 'none';
      
      case 13: // Add-Ons
        // Add-ons are optional, turn green when any add-on is selected
        if (formData.photoBookAddon || formData.extraTimeAddon || formData.byobBarAddon || formData.rehearsalAddon) return 'complete';
        return 'none';
      
      case 14: // Cart (Payment & Review)
        // Cart is complete when terms are accepted
        if (formData.termsAccepted) return 'complete';
        // Partial if user has selected ACH or E-Check (which have discounts, indicating interaction)
        if (formData.paymentMethod === 'ach') return 'partial';
        // None for default state (credit_card, affirm, and paypal don't show partial)
        return 'none';
      
      default:
        return 'none';
    }
  };

  const progress = (currentStep / steps.length) * 100;
  const dayOfWeek = getDayOfWeek(formData.preferredDate);
  const basePrice = calculatePrice(formData.eventType, dayOfWeek);

  // Get current prices from pricing config
  const photoBookPrice = getAddonPrice('photoBook');
  const extraTimePrice = getAddonPrice('extraTime');
  const byobBarPrice = getAddonPrice('byobBar');
  const rehearsalPrice = getAddonPrice('rehearsal');
  
  const addonsTotal =
    (formData.photoBookAddon ? photoBookPrice * (formData.photoBookQuantity || 1) : 0) +
    (formData.extraTimeAddon ? extraTimePrice : 0) +
    (formData.byobBarAddon ? byobBarPrice : 0) +
    (formData.rehearsalAddon ? rehearsalPrice : 0);
  const totalPrice = basePrice + addonsTotal;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-start gap-3">
            {formData.eventType && (
              <div className="flex-shrink-0 px-4 py-1.5 bg-background border rounded-md font-bold text-sm text-yellow-400" data-testid="text-total-price">
                ${(totalPrice / 100).toFixed(2)}
              </div>
            )}
            <div className="flex flex-wrap gap-2 flex-1 min-w-0">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const completionStatus = getBlockCompletionStatus(step.id);
                const isCurrentStep = currentStep === stepNumber;
                const isReadOnly = isBlockReadOnly(step.id);
                
                // Determine color based on completion status or read-only status
                let colorClasses = '';
                if (isReadOnly) {
                  // Disabled blocks: dark grey background with dark red text
                  colorClasses = 'bg-[#4A4A4A] text-[#8B0000]';
                } else {
                  // Enabled blocks: color based on completion status
                  switch (completionStatus) {
                    case 'complete':
                      colorClasses = 'bg-green-600/80 text-[#FFFFFF] hover-elevate';
                      break;
                    case 'partial':
                      colorClasses = 'bg-yellow-600/80 text-[#FFFFFF] hover-elevate';
                      break;
                    case 'none':
                    default:
                      colorClasses = 'bg-muted text-[#FFFFFF] hover-elevate';
                      break;
                  }
                }
                
                // Add ring to indicate current step
                const borderClass = isCurrentStep ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '';
                
                return (
                  <button
                    key={step.id}
                    onClick={() => navigateToStep(stepNumber)}
                    data-testid={`button-step-${stepNumber}`}
                    className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${colorClasses} ${borderClass}`}
                  >
                    <span className="block">{step.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex-shrink-0 flex gap-2">
              {userAccount ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="button-account"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLocation('/account')} data-testid="button-nav-account">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      data-testid="button-auth-menu"
                      className="h-auto py-2"
                    >
                      <User className="h-4 w-4 mr-2 self-start mt-0.5" />
                      <div className="flex flex-col items-start leading-tight">
                        <span>Login or</span>
                        <span>Create Account</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowLoginDialog(true)} data-testid="button-nav-login">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAccountDialog(true)} data-testid="button-nav-create-account">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-serif mb-2">The Wedding Composer</h1>
            <p className="text-muted-foreground">
              Your personalized planning tool for designing a wedding day that feels entirely your own
            </p>
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
            <Block13TheCouple
              person1Role={formData.person1Role}
              person1FullName={formData.person1FullName}
              person1Pronouns={formData.person1Pronouns}
              person1Email={formData.person1Email}
              person1Phone={formData.person1Phone}
              person1AlternatePhone={formData.person1AlternatePhone}
              person2Role={formData.person2Role}
              person2FullName={formData.person2FullName}
              person2Pronouns={formData.person2Pronouns}
              person2Email={formData.person2Email}
              person2Phone={formData.person2Phone}
              smsConsent={formData.smsConsent}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 2 && (
            <Block1EventType
              eventType={formData.eventType}
              preferredDate={formData.preferredDate}
              timeSlot={formData.timeSlot}
              onChange={updateField}
            />
          )}
          {steps[currentStep - 1]?.id === 3 && (
            <Block3SignatureColor
              signatureColor={formData.signatureColor}
              colorSwatchDecision={formData.colorSwatchDecision}
              onChange={updateField}
              readOnly={isBlockReadOnly(3)}
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
              musicCompletionStatus={formData.musicCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(3)}
            />
          )}
          {steps[currentStep - 1]?.id === 5 && (
            <Block5Announcements
              grandIntroduction={formData.grandIntroduction}
              fatherDaughterDanceAnnouncement={formData.fatherDaughterDanceAnnouncement}
              toastsSpeechesAnnouncement={formData.toastsSpeechesAnnouncement}
              guestCallouts={formData.guestCallouts}
              vibeCheck={formData.vibeCheck}
              announcementsCompletionStatus={formData.announcementsCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(4)}
            />
          )}
          {steps[currentStep - 1]?.id === 6 && (
            <Block6Ceremony
              ceremonyScript={formData.ceremonyScript}
              vowChoices={formData.vowChoices}
              unityCandle={formData.unityCandle}
              sandCeremony={formData.sandCeremony}
              handfasting={formData.handfasting}
              guestReadingOrSongChoice={formData.guestReadingOrSongChoice}
              guestReadingOrSong={formData.guestReadingOrSong}
              guestReadingOrSongName={formData.guestReadingOrSongName}
              officiantPassageChoice={formData.officiantPassageChoice}
              officiantPassage={formData.officiantPassage}
              includingChildChoice={formData.includingChildChoice}
              includingChild={formData.includingChild}
              childrenOrganizer={formData.childrenOrganizer}
              petInvolvementChoice={formData.petInvolvementChoice}
              petPolicyAccepted={formData.petPolicyAccepted}
              petInvolvement={formData.petInvolvement}
              ceremonySpecialRequests={formData.ceremonySpecialRequests}
              onChange={updateField}
              showAddOns={!isSimplifiedFlow}
              readOnly={isBlockReadOnly(6)}
              eventType={formData.eventType}
            />
          )}
          {steps[currentStep - 1]?.id === 7 && (
            <Block7Processional
              walkingDownAisle={formData.walkingDownAisle}
              escortName={formData.escortName}
              ringBearerIncluded={formData.ringBearerIncluded}
              ringBearerFlowerGirl={formData.ringBearerFlowerGirl}
              ringBearerOrganizer={formData.ringBearerOrganizer}
              honoredGuestEscorts={formData.honoredGuestEscorts}
              honoredGuestEscortsNA={formData.honoredGuestEscortsNA}
              brideSideFrontRow={formData.brideSideFrontRow}
              brideSideFrontRowNA={formData.brideSideFrontRowNA}
              groomSideFrontRow={formData.groomSideFrontRow}
              groomSideFrontRowNA={formData.groomSideFrontRowNA}
              framedPhotos={formData.framedPhotos}
              framedPhotosNA={formData.framedPhotosNA}
              specialSeatingNeeds={formData.specialSeatingNeeds}
              specialSeatingNeedsNA={formData.specialSeatingNeedsNA}
              processionalSpecialInstructions={formData.processionalSpecialInstructions}
              processionalSpecialInstructionsNA={formData.processionalSpecialInstructionsNA}
              processionalCompletionStatus={formData.processionalCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(7)}
            />
          )}
          {steps[currentStep - 1]?.id === 8 && (
            <Block8Reception
              firstDance={formData.firstDance}
              firstDanceNA={formData.firstDanceNA}
              motherSonDance={formData.motherSonDance}
              motherSonDanceNA={formData.motherSonDanceNA}
              specialDances={formData.specialDances}
              specialDancesNA={formData.specialDancesNA}
              toastGivers={formData.toastGivers}
              toastGiversNA={formData.toastGiversNA}
              beveragePreferences={formData.beveragePreferences}
              receptionSpecialRequests={formData.receptionSpecialRequests}
              receptionSpecialRequestsNA={formData.receptionSpecialRequestsNA}
              receptionCompletionStatus={formData.receptionCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(7)}
            />
          )}
          {steps[currentStep - 1]?.id === 9 && (
            <Block9Photography
              mustHaveShots={formData.mustHaveShots}
              mustHaveShotsNA={formData.mustHaveShotsNA}
              vipList={formData.vipList}
              vipListNA={formData.vipListNA}
              groupPhotosRequested={formData.groupPhotosRequested}
              groupPhotosRequestedNA={formData.groupPhotosRequestedNA}
              photographySpecialRequests={formData.photographySpecialRequests}
              photographySpecialRequestsNA={formData.photographySpecialRequestsNA}
              photographyCompletionStatus={formData.photographyCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(8)}
            />
          )}
          {steps[currentStep - 1]?.id === 10 && (
            <Block10Slideshow
              slideshowPhotos={formData.slideshowPhotos}
              slideshowPhotosNA={formData.slideshowPhotosNA}
              engagementPhotos={formData.engagementPhotos}
              engagementPhotosNA={formData.engagementPhotosNA}
              slideshowCompletionStatus={formData.slideshowCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(9)}
            />
          )}
          {steps[currentStep - 1]?.id === 11 && (
            <Block11PersonalTouches
              freshFlorals={formData.freshFlorals}
              freshFloralsNA={formData.freshFloralsNA}
              guestBookChoice={formData.guestBookChoice}
              guestBook={formData.guestBook}
              cakeKnifeChoice={formData.cakeKnifeChoice}
              cakeKnifeServiceSet={formData.cakeKnifeServiceSet}
              departureOrganizer={formData.departureOrganizer}
              departureOrganizerTBD={formData.departureOrganizerTBD}
              departureVehicleChoice={formData.departureVehicleChoice}
              departureVehicle={formData.departureVehicle}
              personalTouchesSpecialInstructions={formData.personalTouchesSpecialInstructions}
              personalTouchesSpecialInstructionsNA={formData.personalTouchesSpecialInstructionsNA}
              personalTouchesCompletionStatus={formData.personalTouchesCompletionStatus}
              onChange={updateField}
              readOnly={isBlockReadOnly(10)}
            />
          )}
          {steps[currentStep - 1]?.id === 12 && (
            <Block12EviteSaveTheDate
              eviteDesignStyle={formData.eviteDesignStyle}
              eviteHeaderText={formData.eviteHeaderText}
              eviteBodyText={formData.eviteBodyText}
              eviteRsvpOption={formData.eviteRsvpOption}
              eviteRsvpCustomLink={formData.eviteRsvpCustomLink}
              eviteDesignNoSpecialRequests={formData.eviteDesignNoSpecialRequests}
              eviteWordingNoSpecialRequests={formData.eviteWordingNoSpecialRequests}
              eviteRsvpNoSpecialRequests={formData.eviteRsvpNoSpecialRequests}
              eviteCompletionStatus={formData.eviteCompletionStatus}
              onChange={updateField}
              customerName={formData.person1FullName}
              customerName2={formData.person2FullName}
              preferredDate={formData.preferredDate}
              timeSlot={formData.timeSlot}
              readOnly={isBlockReadOnly(11)}
            />
          )}
          {steps[currentStep - 1]?.id === 13 && (
            <BlockAddOns
              photoBookAddon={formData.photoBookAddon}
              photoBookQuantity={formData.photoBookQuantity}
              extraTimeAddon={formData.extraTimeAddon}
              byobBarAddon={formData.byobBarAddon}
              rehearsalAddon={formData.rehearsalAddon}
              mailingAddress={formData.mailingAddress}
              onChange={updateField}
              eventType={formData.eventType}
              preferredDate={formData.preferredDate}
              timeSlot={formData.timeSlot}
            />
          )}
          {steps[currentStep - 1]?.id === 14 && (
            <Block13ContactPayment
              customerName={formData.person1FullName}
              customerName2={formData.person2FullName}
              customerEmail={formData.person1Email}
              customerPhone={formData.person1Phone}
              smsConsent={formData.smsConsent}
              mailingAddress={formData.mailingAddress}
              paymentMethod={formData.paymentMethod}
              termsAccepted={formData.termsAccepted}
              photoBookAddon={formData.photoBookAddon}
              extraTimeAddon={formData.extraTimeAddon}
              byobBarAddon={formData.byobBarAddon}
              rehearsalAddon={formData.rehearsalAddon}
              photoBookQuantity={formData.photoBookQuantity}
              photoBookPrice={photoBookPrice}
              extraTimePrice={extraTimePrice}
              byobBarPrice={byobBarPrice}
              rehearsalPrice={rehearsalPrice}
              achDiscountAmount={getPaymentDiscount('ach', formData.eventType)}
              affirmDiscountAmount={getPaymentDiscount('affirm', formData.eventType)}
              onChange={updateField}
              eventType={formData.eventType}
              basePackagePrice={basePrice}
              amountPaid={formData.amountPaid}
              preferredDate={formData.preferredDate}
              timeSlot={formData.timeSlot}
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
              disabled={currentStep === 2 && !formData.eventType}
              data-testid="button-next"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.termsAccepted}
              size="lg"
              data-testid="button-finalize-payment"
            >
              {userAccount ? 'Proceed to Payment' : 'You must create an Account to Continue'}
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
        onLoginFailure={handleLoginFailure}
        onSwitchToSignup={() => {
          setShowLoginDialog(false);
          setShowAccountDialog(true);
        }}
      />

      <AccountCreationDialog
        open={showAccountDialog}
        onOpenChange={setShowAccountDialog}
        onAccountCreated={handleAccountCreated}
        onSwitchToLogin={() => {
          setShowAccountDialog(false);
          setShowLoginDialog(true);
        }}
      />
    </div>
  );
}
