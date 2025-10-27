import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from '@assets/generated_images/Elegant_wedding_venue_interior_cc244093.png';
import { Heart, Calendar, Sparkles, CheckCircle } from "lucide-react";

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="text-lg px-8 bg-primary/90 hover:bg-primary backdrop-blur-sm" data-testid="button-start-planning">
                Start Planning Your Day
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/50 backdrop-blur-sm" data-testid="button-view-packages">
              View Packages
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Why Choose The Modest Wedding
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make your special day unforgettable with personalized attention to every detail
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="text-center space-y-4 p-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-semibold">Personalized Service</h3>
            <p className="text-muted-foreground">
              Choose from multiple ceremony styles, vows, and music to create a ceremony that's uniquely yours
            </p>
          </div>

          <div className="text-center space-y-4 p-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-semibold">Flexible Scheduling</h3>
            <p className="text-muted-foreground">
              Book your perfect date and time with our easy online scheduling system
            </p>
          </div>

          <div className="text-center space-y-4 p-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-semibold">Beautiful Venue</h3>
            <p className="text-muted-foreground">
              Our elegant space provides the perfect backdrop for your special moment
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start planning your perfect ceremony today. Our simple booking process will guide you through every step.
          </p>
          <Link href="/booking">
            <Button size="lg" className="text-lg px-8" data-testid="button-book-now">
              Book Your Wedding
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
