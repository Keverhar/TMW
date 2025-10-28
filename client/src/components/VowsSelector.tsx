import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Vow {
  id: string;
  title: string;
  preview: string;
}

interface VowsSelectorProps {
  vows: Vow[];
  selectedVow?: string;
  onSelectVow: (vowId: string) => void;
}

export default function VowsSelector({
  vows,
  selectedVow,
  onSelectVow,
}: VowsSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Wedding Vows</CardTitle>
        <CardDescription>Select from our collection of heartfelt vows</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedVow} onValueChange={onSelectVow}>
          <div className="space-y-3">
            {vows.map((vow) => (
              <div
                key={vow.id}
                className="flex items-start space-x-3 rounded-md border p-4 hover-elevate"
                data-testid={`row-vow-${vow.id}`}
              >
                <RadioGroupItem
                  value={vow.id}
                  id={vow.id}
                  className="mt-1"
                  data-testid={`radio-vow-${vow.id}`}
                />
                <div className="flex-1">
                  <Label htmlFor={vow.id} className="text-base font-medium cursor-pointer">
                    {vow.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2 italic leading-relaxed">"{vow.preview}"</p>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
