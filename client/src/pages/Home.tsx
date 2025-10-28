import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState } from "react";
import heroImage from '@assets/Copy of Composer banner_1761671065075.png';

export default function Home() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.reportValidity()) {
      setLocation("/booking");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="The Modest Wedding Venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 md:whitespace-nowrap" style={{ color: '#FAA0F0' }}>
            Welcome to the Wedding Composer
          </h1>
          
          <div className="text-white/90 space-y-6 mb-8">
            <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '14pt' }}>
              Design, Save, and Return. Your selections are automatically saved with your email, so feel free to play and change things—nothing is final until you say it is.
            </p>
            
            <div className="text-left md:text-center text-base md:text-lg max-w-3xl mx-auto" style={{ fontFamily: '"Book Antiqua", Palatino, serif' }}>
              <p className="font-semibold text-white mb-2">Your vision comes to life - perfectly on cue.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.325rem' }}>
                <p><span className="font-semibold">Couple Information</span> – <span className="italic">Your love story, at the center.</span></p>
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

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/90 backdrop-blur-sm text-foreground placeholder:text-muted-foreground border-white/20"
                data-testid="input-email"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="text-lg px-8 bg-primary/90 hover:bg-primary backdrop-blur-sm w-full md:w-auto"
              data-testid="button-submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
