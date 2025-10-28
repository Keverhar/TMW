import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from '@assets/Copy of Composer banner_1761671065075.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="The Modest Wedding Venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            The Modest Wedding
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create your perfect ceremony with our elegant venue and personalized service
          </p>
          <div className="flex justify-center">
            <Link href="/booking">
              <Button size="lg" className="text-lg px-8 bg-primary/90 hover:bg-primary backdrop-blur-sm" data-testid="button-start-planning">
                The Wedding Composer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
