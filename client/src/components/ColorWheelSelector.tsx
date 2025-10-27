import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface ColorWheelSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function ColorWheelSelector({
  selectedColor,
  onSelectColor,
}: ColorWheelSelectorProps) {
  const [color, setColor] = useState(selectedColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onSelectColor(newColor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Wedding Colors</CardTitle>
        <CardDescription>Select your wedding color scheme</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="h-48 w-48 rounded-full cursor-pointer border-4 border-card-border"
            data-testid="input-color-wheel"
          />
        </div>
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Selected Color:</span>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-md border-2 border-card-border"
                style={{ backgroundColor: color }}
                data-testid="swatch-selected-color"
              />
              <span className="font-mono text-sm text-muted-foreground">{color}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
