import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface WeddingTypeCardProps {
  title: string;
  description: string;
  price: string;
  inclusions: string[];
  selected?: boolean;
  onSelect: () => void;
}

export default function WeddingTypeCard({
  title,
  description,
  price,
  inclusions,
  selected = false,
  onSelect,
}: WeddingTypeCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all hover-elevate ${
        selected ? "border-2 border-primary" : ""
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}
      data-testid={`card-wedding-${title.toLowerCase().replace(/\//g, '-')}`}
    >
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="font-serif text-2xl" style={{ color: '#FAA0F0' }}>{title}</CardTitle>
          {selected && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        <CardDescription className="text-base" style={{ color: '#FAA0F0' }}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-serif font-semibold" style={{ color: '#FAA0F0' }}>
          {price}
        </div>
        <div className="space-y-2">
          {inclusions.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#FAA0F0' }} />
              <span className="text-sm" style={{ color: '#FAA0F0' }}>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={selected ? "default" : "outline"}
          onClick={onSelect}
          data-testid={`button-select-${title.toLowerCase().replace(/\//g, '-')}`}
        >
          {selected ? "Selected" : "Select Package"}
        </Button>
      </CardFooter>
    </Card>
  );
}
