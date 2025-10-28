import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Info, Palette } from "lucide-react";

interface Block3SignatureColorProps {
  signatureColor: string;
  colorSwatchDecision: string;
  onChange: (field: string, value: string) => void;
}

const colors = [
  { value: "blush-cream", label: "Blush Cream", hex: "#F5E6D3" },
  { value: "classic-coral", label: "Classic Coral", hex: "#FF7F50" },
  { value: "soft-sage", label: "Soft Sage", hex: "#9CAF88" },
  { value: "sunny-yellow", label: "Sunny Yellow", hex: "#FFD700" },
  { value: "dusty-blue", label: "Dusty Blue", hex: "#6B8E9F" },
  { value: "ivory-white", label: "Ivory White", hex: "#FFFFF0" },
  { value: "crisp-white", label: "Crisp White", hex: "#FFFFFF" },
  { value: "champagne-gold", label: "Champagne Gold", hex: "#F7E7CE" },
  { value: "midnight-navy", label: "Midnight Navy", hex: "#191970" },
  { value: "black-night", label: "Black Night", hex: "#0C0C0C" },
  { value: "classic-rose", label: "Classic Rose", hex: "#FF69B4" },
  { value: "terracotta-sunset", label: "Terracotta Sunset", hex: "#E27149" },
  { value: "bold-red", label: "Bold Red", hex: "#DC143C" },
  { value: "pretty-pink", label: "Pretty in Pink", hex: "#FFC0CB" },
  { value: "autumn-brown", label: "Autumn Brown", hex: "#8B4513" },
  { value: "royal-blue", label: "Royal Blue", hex: "#4169E1" },
  { value: "hunter-green", label: "Hunter Green", hex: "#355E3B" },
  { value: "aqua-teal", label: "Aqua Teal", hex: "#008080" },
  { value: "distinctive-purple", label: "Distinctive Purple", hex: "#6A0DAD" },
  { value: "light-lavender", label: "Light Lavender", hex: "#E6E6FA" },
];

export default function Block3SignatureColor({ signatureColor, colorSwatchDecision, onChange }: Block3SignatureColorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Signature Color Ring Selection</h2>
        <p className="text-muted-foreground">
          Your signature color sets the mood for your celebration and helps tie together the floral, décor, and photography aesthetic.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>What Your Color Choice Includes</CardTitle>
          </div>
          <CardDescription>Your chosen signature color will appear throughout your wedding day</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>A beautiful satin ribbon tied to your ceremonial brass rings throughout the venue</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Coordinating florals on your wedding cake</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Decorative touches woven throughout your photo projection display</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose Your Signature Color</CardTitle>
          <CardDescription>Select the color that best fits your vision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                data-testid={`button-color-${color.value}`}
                onClick={() => onChange('signatureColor', color.value)}
                className={`p-3 rounded-md border-2 transition-all hover-elevate active-elevate-2 ${
                  signatureColor === color.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div
                  className="w-full h-12 rounded-md mb-2"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-sm font-medium text-center">{color.label}</p>
              </button>
            ))}
          </div>

          {!signatureColor && (
            <div className="flex gap-2 items-start bg-muted p-3 rounded-md">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Not ready to choose yet? Select "We're not sure yet" and come back to this step later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {signatureColor && (
        <Card>
          <CardHeader>
            <CardTitle>Swatch Preview or Final Decision</CardTitle>
            <CardDescription>Would you like to see the color in person before finalizing?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={colorSwatchDecision} onValueChange={(value) => onChange('colorSwatchDecision', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tour" id="swatch-tour" data-testid="radio-swatch-tour" />
                <Label htmlFor="swatch-tour" className="cursor-pointer">
                  I'm still deciding — I'd like to see swatches at my tour
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="finalize" id="swatch-finalize" data-testid="radio-swatch-finalize" />
                <Label htmlFor="swatch-finalize" className="cursor-pointer">
                  I'm ready to finalize my selection now
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blank" id="swatch-blank" data-testid="radio-swatch-blank" />
                <Label htmlFor="swatch-blank" className="cursor-pointer">
                  Leave blank for now
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
