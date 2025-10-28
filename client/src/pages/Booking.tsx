import { useState } from "react";
import { Button } from "@/components/ui/button";
import WeddingTypeCard from "@/components/WeddingTypeCard";
import DateTimeSelector from "@/components/DateTimeSelector";
import CeremonyScriptSelector from "@/components/CeremonyScriptSelector";
import VowsSelector from "@/components/VowsSelector";
import MusicSelector from "@/components/MusicSelector";
import ColorWheelSelector from "@/components/ColorWheelSelector";
import CakeTopperSelector from "@/components/CakeTopperSelector";
import BookingSummary from "@/components/BookingSummary";
import ProgressSteps from "@/components/ProgressSteps";
import CustomerInfoForm from "@/components/CustomerInfoForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';

import elopementImg from '@assets/generated_images/Intimate_elopement_ceremony_setup_d5c87634.png';
import vowRenewalImg from '@assets/generated_images/Vow_renewal_ceremony_decoration_3582a109.png';
import fridaySundayImg from '@assets/generated_images/Friday_Sunday_wedding_setup_cb5aed4d.png';
import saturdayImg from '@assets/generated_images/Saturday_wedding_ceremony_setup_870d9c76.png';
import traditionalImg from '@assets/generated_images/Traditional_wedding_cake_topper_8cf92715.png';
import gentlemenImg from '@assets/generated_images/Gentlemen_wedding_cake_topper_3a9bd51a.png';
import ladiesImg from '@assets/generated_images/Ladies_wedding_cake_topper_e1b9db02.png';

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
    image: elopementImg,
  },
  {
    id: 'vow-renewal',
    title: 'Vow Renewal',
    description: 'Celebrate your continued love and commitment',
    price: 'From $999',
    basePrice: 999,
    inclusions: ['90-minute ceremony', 'Up to 10 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Custom vow assistance'],
    image: vowRenewalImg,
  },
  {
    id: 'friday-sunday',
    title: 'Friday/Sunday',
    description: 'Complete wedding experience on weekend edges',
    price: '$3,900',
    basePrice: 3900,
    inclusions: ['3-hour event', 'Up to 30 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Full customization'],
    image: fridaySundayImg,
  },
  {
    id: 'saturday',
    title: 'Saturday',
    description: 'Premium Saturday wedding at our venue',
    price: '$4,500',
    basePrice: 4500,
    inclusions: ['3-hour event', 'Up to 30 guests', 'Professional officiant', 'Professional photography included', 'Floral arrangements included', 'Full customization'],
    image: saturdayImg,
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
  { id: 'classic', title: 'Classic Vows', excerpt: 'I promise to love you, honor you, and cherish you, in sickness and in health...' },
  { id: 'modern', title: 'Modern Vows', excerpt: 'Today I choose you to be my partner in life, to share my dreams and support yours...' },
  { id: 'romantic', title: 'Romantic Vows', excerpt: 'You are my today and all of my tomorrows, my adventure and my home...' },
  { id: 'heartfelt', title: 'Heartfelt Vows', excerpt: 'I vow to be your constant friend, your faithful partner, and your love...' },
];

const musicOptions = [
  { id: 'processional-1', title: 'Canon in D', artist: 'Pachelbel', moment: 'Processional' },
  { id: 'processional-2', title: 'A Thousand Years', artist: 'Christina Perri', moment: 'Processional' },
  { id: 'ceremony-1', title: 'All of Me', artist: 'John Legend', moment: 'During Ceremony' },
  { id: 'ceremony-2', title: 'Perfect', artist: 'Ed Sheeran', moment: 'During Ceremony' },
  { id: 'recessional-1', title: 'Married Life', artist: 'Michael Giacchino', moment: 'Recessional' },
  { id: 'recessional-2', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', moment: 'Recessional' },
];

const cakeToppers = [
  { id: 'traditional', name: 'Traditional', image: traditionalImg },
  { id: 'gentlemen', name: 'Gentlemen', image: gentlemenImg },
  { id: 'ladies', name: 'Ladies', image: ladiesImg },
];

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleProceedToPayment = async () => {
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
      
      const checkoutResponse = await apiRequest('POST', '/api/create-checkout-session', {
        bookingId: booking.id,
      });
      const { sessionId } = await checkoutResponse.json();

      if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        throw new Error('Stripe public key not configured');
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await (stripe as any).redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="font-serif text-2xl font-bold">The Wedding Composer</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="space-y-8">
              {currentStep === 0 && (
                <div>
                  <div className="mb-8">
                    <h2 className="font-serif text-3xl font-bold mb-2">Select Your Package</h2>
                    <p className="text-muted-foreground">Choose the wedding package that fits your vision</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {weddingTypes.map((wedding) => (
                      <WeddingTypeCard
                        key={wedding.id}
                        title={wedding.title}
                        description={wedding.description}
                        price={wedding.price}
                        inclusions={wedding.inclusions}
                        image={wedding.image}
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
                    <ColorWheelSelector
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
