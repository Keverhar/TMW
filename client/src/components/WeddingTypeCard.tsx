import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface WeddingTypeCardProps {
  title: string;
  description: string;
  price: string;
  inclusions: string[];
  image: string;
  selected?: boolean;
  onSelect: () => void;
}

export default function WeddingTypeCard({
  title,
  description,
  price,
  inclusions,
  image,
  selected = false,
  onSelect,
}: WeddingTypeCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all hover-elevate ${
        selected ? "border-2 border-primary" : ""
      }`}
      data-testid={`card-wedding-${title.toLowerCase().replace(/\//g, '-')}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          data-testid={`img-wedding-${title.toLowerCase().replace(/\//g, '-')}`}
        />
      </div>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="font-serif text-2xl">{title}</CardTitle>
          {selected && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-serif font-semibold text-foreground">
          {price}
        </div>
        <div className="space-y-2">
          {inclusions.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{item}</span>
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
