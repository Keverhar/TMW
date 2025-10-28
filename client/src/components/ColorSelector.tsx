import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const weddingColors = [
  { name: 'Blush Pink', value: '#ffc0cb', dark: false },
  { name: 'Rose Gold', value: '#b76e79', dark: false },
  { name: 'Dusty Blue', value: '#8b9dc3', dark: false },
  { name: 'Sage Green', value: '#9caf88', dark: false },
  { name: 'Lavender', value: '#c8a2c8', dark: false },
  { name: 'Champagne', value: '#f7e7ce', dark: false },
  { name: 'Navy Blue', value: '#001f3f', dark: true },
  { name: 'Burgundy', value: '#800020', dark: true },
  { name: 'Emerald Green', value: '#50c878', dark: false },
  { name: 'Coral', value: '#ff7f50', dark: false },
];

export default function ColorSelector({
  selectedColor,
  onSelectColor,
}: ColorSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Wedding Colors</CardTitle>
        <CardDescription>Select your wedding color scheme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weddingColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onSelectColor(color.value)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate transition-all"
              data-testid={`button-color-${color.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="relative">
                <div
                  className="h-16 w-16 rounded-full border-2 border-card-border shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                {selectedColor === color.value && (
                  <div className={`absolute inset-0 flex items-center justify-center rounded-full ${color.dark ? 'text-white' : 'text-black'}`}>
                    <div className="bg-background/80 rounded-full p-1">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-center">{color.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
