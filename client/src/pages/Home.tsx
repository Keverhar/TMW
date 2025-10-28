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
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to the Wedding Composer
          </h1>
          
          <div className="text-white/90 space-y-6 mb-8">
            <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '14pt' }}>
              Design, Save, and Return. Your selections are automatically saved with your email, so feel free to play and change things—nothing is final until you say it is.
            </p>
            
            <div className="text-left md:text-center text-base md:text-lg space-y-2 max-w-3xl mx-auto">
              <p className="font-semibold text-white">Your vision comes to life - perfectly on cue.</p>
              <p><span className="font-semibold">Couple Information</span> – Your love story, at the center.</p>
              <p><span className="font-semibold">Wedding Date</span> – No date? No problem.</p>
              <p><span className="font-semibold">Guest Count</span> – Estimate now, adjust later.</p>
              <p><span className="font-semibold">Event Type</span> – From intimate elopements to full celebrations.</p>
              <p><span className="font-semibold">Signature Color</span> – Choose your satin ribbon hue.</p>
              <p><span className="font-semibold">Ceremony & Vows</span> – Personalize the words that matter most.</p>
              <p><span className="font-semibold">Music & Toasts</span> – Every song and speech, orchestrated.</p>
              <p><span className="font-semibold">Evite Templates</span> – Stylish invites, ready to send.</p>
              <p><span className="font-semibold">Photo Book Options</span> – Cherish the memories forever.</p>
              <p className="font-semibold">And much more!</p>
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
