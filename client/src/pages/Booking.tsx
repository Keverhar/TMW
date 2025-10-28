import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import WeddingTypeCard from "@/components/WeddingTypeCard";
import DateTimeSelector from "@/components/DateTimeSelector";
import CeremonyScriptSelector from "@/components/CeremonyScriptSelector";
import VowsSelector from "@/components/VowsSelector";
import MusicSelector from "@/components/MusicSelector";
import ColorSelector from "@/components/ColorSelector";
import CakeTopperSelector from "@/components/CakeTopperSelector";
import BookingSummary from "@/components/BookingSummary";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import PaymentPage from "@/components/PaymentPage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import venueBackgroundImg from '@assets/generated_images/Intimate_indoor_wedding_venue_6ca435a6.png';
import traditionalImg from '@assets/generated_images/Traditional_wedding_cake_topper_8cf92715.png';
import gentlemenImg from '@assets/generated_images/Gentlemen_wedding_cake_topper_3a9bd51a.png';
import ladiesImg from '@assets/generated_images/Ladies_wedding_cake_topper_e1b9db02.png';
import heroImage from '@assets/Copy of Chapel_1761677843013.png';

const steps = [
  { id: '1', title: 'Select Package', description: 'Choose your wedding type' },
  { id: '2', title: 'Date & Time', description: 'Pick your ceremony date' },
  { id: '3', title: 'Customize', description: 'Personalize your ceremony' },
  { id: '4', title: 'Your Information', description: 'Enter contact details' },
  { id: '5', title: 'Review', description: 'Confirm your selections' },
];

const weddingTypes = [
  {
    id: 'elopement',
    title: 'Elopement',
    description: 'Intimate ceremony at our elegant indoor venue',
    price: 'From $999',
    basePrice: 999,
    inclusions: ['90-minute ceremony', 'Up to 10 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Full ceremony customization'],
  },
  {
    id: 'vow-renewal',
    title: 'Vow Renewal',
    description: 'Celebrate your continued love and commitment',
    price: 'From $999',
    basePrice: 999,
    inclusions: ['90-minute ceremony', 'Up to 10 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Custom vow assistance'],
  },
  {
    id: 'friday-sunday',
    title: 'Friday/Sunday',
    description: 'Complete wedding experience on weekend edges',
    price: '$3,900',
    basePrice: 3900,
    inclusions: ['3-hour event', 'Up to 30 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Full customization'],
  },
  {
    id: 'saturday',
    title: 'Saturday',
    description: 'Premium Saturday wedding at our venue',
    price: '$4,500',
    basePrice: 4500,
    inclusions: ['3-hour event', 'Up to 30 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Full customization'],
  },
];

const ceremonyScripts = [
  { id: 'non-secular', name: 'Secular', description: 'A modern, non-religious ceremony', preview: 'We are gathered here today to celebrate the union of two individuals who have found in each other a love that transcends the ordinary. This ceremony represents their commitment to building a life together based on mutual respect, understanding, and unwavering support.' },
  { id: 'candle', name: 'Candle', description: 'Traditional unity candle ceremony', preview: 'As you light this candle together, you symbolize the joining of your lives and families. The two flames merge into one, representing the new union you are creating while maintaining your individual identities.' },
  { id: 'ribbon', name: 'Ribbon', description: 'Hand-binding ribbon ceremony', preview: 'The binding of your hands represents the intertwining of your lives. As these ribbons are wrapped around your hands, they symbolize the promises you make to each other and the strength of your bond.' },
  { id: 'religious-non-denominational', name: 'Religious Non Denominational', description: 'Faith-based but inclusive ceremony', preview: 'Under the guidance of a higher power, we gather to witness and bless this sacred union. May your marriage be filled with divine love, grace, and the strength to overcome any challenges together.' },
  { id: 'traditional-christian', name: 'Traditional Christian', description: 'Classic Christian wedding ceremony', preview: 'Dearly beloved, we are gathered together here in the sight of God, and in the presence of these witnesses, to join together this man and this woman in holy matrimony, which is an honorable estate, instituted by God.' },
];

const vowsOptions = [
  { 
    id: 'classic', 
    title: 'Classic Vows', 
    preview: 'I promise to love you, honor you, and cherish you, in sickness and in health. I will stand by your side through all of life\'s joys and challenges. I choose you today and every day for the rest of my life. You are my best friend, my partner, and my soulmate. With this ring, I pledge my eternal love and commitment to you.'
  },
  { 
    id: 'modern', 
    title: 'Modern Vows', 
    preview: 'Today I choose you to be my partner in life, to share my dreams and support yours. I promise to be your constant companion and your biggest cheerleader. I will love you fiercely and stand with you through every adventure. Together we will build a life filled with laughter, growth, and endless possibilities. I am honored to call you mine, today and always.'
  },
  { 
    id: 'romantic', 
    title: 'Romantic Vows', 
    preview: 'You are my today and all of my tomorrows, my adventure and my home. From the moment I met you, I knew my heart had found its match. I promise to love you with every breath, to treasure every moment we share. You are the dream I never knew I had, and the reality that exceeds all dreams. I will love you endlessly, through this life and beyond.'
  },
  { 
    id: 'heartfelt', 
    title: 'Heartfelt Vows', 
    preview: 'I vow to be your constant friend, your faithful partner, and your love from this day forward. I promise to support your dreams and celebrate your successes. In times of joy, I will rejoice with you; in times of sorrow, I will comfort you. I will respect you, trust you, and honor you all the days of my life. You have my heart, my soul, and my unwavering devotion.'
  },
];

const musicOptions = [
  { id: 'processional-1', title: 'Canon in D', artist: 'Pachelbel', moment: 'Processional', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'processional-2', title: 'A Thousand Years', artist: 'Christina Perri', moment: 'Processional', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'ceremony-1', title: 'All of Me', artist: 'John Legend', moment: 'During Ceremony', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'ceremony-2', title: 'Perfect', artist: 'Ed Sheeran', moment: 'During Ceremony', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'recessional-1', title: 'Married Life', artist: 'Michael Giacchino', moment: 'Recessional', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'recessional-2', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', moment: 'Recessional', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
];

const cakeToppers = [
  { id: 'traditional', name: 'Traditional', image: traditionalImg },
  { id: 'gentlemen', name: 'Gentlemen', image: gentlemenImg },
  { id: 'ladies', name: 'Ladies', image: ladiesImg },
];

export default function Booking() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [selectedVows, setSelectedVows] = useState<string>('');
  const [selectedMusic, setSelectedMusic] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#e91e63');
  const [selectedTopper, setSelectedTopper] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleMusic = (musicId: string) => {
    setSelectedMusic(prev =>
      prev.includes(musicId)
        ? prev.filter(id => id !== musicId)
        : [...prev, musicId]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedPackage !== '';
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return selectedScript && selectedVows && selectedTopper;
      case 3:
        return customerName && customerEmail && customerPhone;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const getSelectedPackage = () => weddingTypes.find(w => w.id === selectedPackage);
  const getTotal = () => getSelectedPackage()?.basePrice || 0;
  const { toast } = useToast();

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    if (!selectedDate) return;

    setIsProcessing(true);
    try {
      const bookingData = {
        weddingType: getSelectedPackage()?.title || '',
        weddingDate: selectedDate.toISOString(),
        weddingTime: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        ceremonyScript: ceremonyScripts.find(s => s.id === selectedScript)?.name || '',
        vows: vowsOptions.find(v => v.id === selectedVows)?.title || '',
        music: selectedMusic,
        color: selectedColor,
        cakeTopper: cakeToppers.find(t => t.id === selectedTopper)?.name || '',
        totalPrice: getTotal() * 100, // Convert to cents for storage
      };

      const bookingResponse = await apiRequest('POST', '/api/bookings', bookingData);
      const booking = await bookingResponse.json();
      
      // Simulate successful payment by updating booking status
      await apiRequest('PUT', `/api/bookings/${booking.id}`, {
        paymentStatus: 'completed',
      });

      // Redirect to confirmation page
      setLocation(`/confirmation/${booking.id}?simulated=true`);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to process booking. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleBackToReview = () => {
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#FAA0F0' }}>The Wedding Composer</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 mx-auto w-full">
            <div className="space-y-8">
              {showPayment ? (
                <PaymentPage
                  totalAmount={getTotal() * 100}
                  onPaymentComplete={handlePaymentComplete}
                  onBack={handleBackToReview}
                />
              ) : (
                <>
              {currentStep === 0 && (
                <div className="relative min-h-screen -mx-4 px-4 -my-8 py-8">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={heroImage}
                      alt="The Modest Wedding Venue"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                  </div>
                  <div className="relative z-10 mb-8">
                    <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: '#FAA0F0' }}>Select Your Package</h2>
                    <p style={{ color: '#FAA0F0' }}>Choose the wedding package that fits your vision</p>
                  </div>
                  <div className="relative z-10 grid md:grid-cols-2 gap-6">
                    {weddingTypes.map((wedding) => (
                      <WeddingTypeCard
                        key={wedding.id}
                        title={wedding.title}
                        description={wedding.description}
                        price={wedding.price}
                        inclusions={wedding.inclusions}
                        selected={selectedPackage === wedding.id}
                        onSelect={() => setSelectedPackage(wedding.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold mb-2">Choose Date & Time</h2>
                    <p className="text-muted-foreground">Select when you'd like to celebrate</p>
                  </div>
                  <DateTimeSelector
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={setSelectedDate}
                    onSelectTime={setSelectedTime}
                    selectedPackage={selectedPackage}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold mb-2">Customize Your Ceremony</h2>
                    <p className="text-muted-foreground">Personalize every detail of your special day</p>
                  </div>
                  <div className="space-y-6">
                    <CeremonyScriptSelector
                      scripts={ceremonyScripts}
                      selectedScript={selectedScript}
                      onSelectScript={setSelectedScript}
                    />
                    <VowsSelector
                      vows={vowsOptions}
                      selectedVow={selectedVows}
                      onSelectVow={setSelectedVows}
                    />
                    <MusicSelector
                      musicOptions={musicOptions}
                      selectedMusic={selectedMusic}
                      onToggleMusic={handleToggleMusic}
                    />
                    <ColorSelector
                      selectedColor={selectedColor}
                      onSelectColor={setSelectedColor}
                    />
                    <CakeTopperSelector
                      toppers={cakeToppers}
                      selectedTopper={selectedTopper}
                      onSelectTopper={setSelectedTopper}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold mb-2">Your Information</h2>
                    <p className="text-muted-foreground">Please provide your contact details</p>
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <CustomerInfoForm
                      name={customerName}
                      email={customerEmail}
                      phone={customerPhone}
                      onNameChange={setCustomerName}
                      onEmailChange={setCustomerEmail}
                      onPhoneChange={setCustomerPhone}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold mb-2">Review Your Booking</h2>
                    <p className="text-muted-foreground">Confirm your selections before proceeding to payment</p>
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <BookingSummary
                      items={[
                        { label: 'Wedding Package', value: getSelectedPackage()?.title || '', onEdit: () => setCurrentStep(0) },
                        { label: 'Date & Time', value: selectedDate && selectedTime ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${selectedTime}` : '', onEdit: () => setCurrentStep(1) },
                        { label: 'Ceremony Script', value: ceremonyScripts.find(s => s.id === selectedScript)?.name || '', onEdit: () => setCurrentStep(2) },
                        { label: 'Vows', value: vowsOptions.find(v => v.id === selectedVows)?.title || '', onEdit: () => setCurrentStep(2) },
                        { label: 'Music Selections', value: `${selectedMusic.length} songs selected`, onEdit: () => setCurrentStep(2) },
                        { label: 'Color Theme', value: selectedColor, onEdit: () => setCurrentStep(2) },
                        { label: 'Cake Topper', value: cakeToppers.find(t => t.id === selectedTopper)?.name || '', onEdit: () => setCurrentStep(2) },
                        { label: 'Contact', value: `${customerName} (${customerEmail})`, onEdit: () => setCurrentStep(3) },
                      ]}
                      basePrice={getTotal()}
                      total={getTotal()}
                      onProceed={handleProceedToPayment}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  data-testid="button-back"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                {currentStep < steps.length - 1 && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || isProcessing}
                    data-testid="button-next"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
