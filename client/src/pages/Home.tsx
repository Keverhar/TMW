import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import heroImage from '@assets/Copy of Composer banner_1761671065075.png';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-screen flex items-start justify-center overflow-hidden pb-12" style={{ paddingTop: '0.03rem' }}>
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="The Modest Wedding Venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="font-serif text-2xl md:text-4xl italic mb-1" style={{ color: '#FAA0F0' }}>
              Welcome to...
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold md:whitespace-nowrap" style={{ color: '#FAA0F0' }}>
              The Wedding Composer
            </h1>
          </div>
          
          <div className="space-y-6 mb-8" style={{ color: '#FAA0F0' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14pt', lineHeight: '1.2' }}>
              <p style={{ marginBottom: '0' }}>Design, Save, Return.</p>
              <p style={{ marginBottom: '0' }}>Your selections are automatically saved with your email,</p>
              <p style={{ marginBottom: '0' }}>so feel free to plan and change things.</p>
              <p style={{ marginBottom: '0', color: '#F04673' }} className="italic font-bold underline">Nothing is final until you say it is.</p>
            </div>
            
            <div className="text-left md:text-center max-w-3xl mx-auto" style={{ fontFamily: '"Book Antiqua", Palatino, serif' }}>
              <p className="font-semibold" style={{ fontFamily: 'Garamond, serif', fontSize: '1.2em', marginBottom: '0.03rem' }}>Your vision comes to life - perfectly on cue.</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ marginBottom: '0.03rem' }}><span className="font-semibold">Couple Information</span> – <span className="italic">Your love story, at the center.</span></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.025rem' }}>
                  <p><span className="font-semibold">Wedding Date</span> – <span className="italic">No date? No problem.</span></p>
                  <p><span className="font-semibold">Guest Count</span> – <span className="italic">Estimate now, adjust later.</span></p>
                  <p><span className="font-semibold">Event Type</span> – <span className="italic">From intimate elopements to full celebrations.</span></p>
                  <p><span className="font-semibold">Signature Color</span> – <span className="italic">Choose your satin ribbon hue.</span></p>
                  <p><span className="font-semibold">Ceremony & Vows</span> – <span className="italic">Personalize the words that matter most.</span></p>
                  <p><span className="font-semibold">Music & Toasts</span> – <span className="italic">Every song and speech, orchestrated.</span></p>
                  <p><span className="font-semibold">Evite Templates</span> – <span className="italic">Stylish invites, ready to send.</span></p>
                  <p><span className="font-semibold">Photo Book Options</span> – <span className="italic">Cherish the memories forever.</span></p>
                  <p className="font-semibold italic">And much more!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => setLocation("/booking")}
              size="lg" 
              className="text-lg px-8 bg-primary/90 hover:bg-primary backdrop-blur-sm w-full md:w-auto"
              data-testid="button-start-booking"
            >
              Start Planning Your Wedding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
