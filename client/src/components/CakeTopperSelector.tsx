import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface CakeTopper {
  id: string;
  name: string;
  image: string;
}

interface CakeTopperSelectorProps {
  toppers: CakeTopper[];
  selectedTopper?: string;
  onSelectTopper: (topperId: string) => void;
}

export default function CakeTopperSelector({
  toppers,
  selectedTopper,
  onSelectTopper,
}: CakeTopperSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Cake Topper</CardTitle>
        <CardDescription>Choose the perfect finishing touch for your cake</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedTopper} onValueChange={onSelectTopper}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toppers.map((topper) => (
              <div key={topper.id} className="relative">
                <RadioGroupItem
                  value={topper.id}
                  id={topper.id}
                  className="sr-only"
                  data-testid={`radio-topper-${topper.id}`}
                />
                <Label
                  htmlFor={topper.id}
                  className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover-elevate ${
                    selectedTopper === topper.id
                      ? "border-primary bg-accent"
                      : "border-card-border"
                  }`}
                  data-testid={`label-topper-${topper.id}`}
                >
                  <div className="relative w-full aspect-square overflow-hidden rounded-md bg-background">
                    <img
                      src={topper.image}
                      alt={topper.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-topper-${topper.id}`}
                    />
                    {selectedTopper === topper.id && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <span className="text-base font-medium text-center">{topper.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
