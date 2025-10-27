import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";

interface BookingSummaryItem {
  label: string;
  value: string;
  onEdit?: () => void;
}

interface BookingSummaryProps {
  items: BookingSummaryItem[];
  basePrice: number;
  additionalCharges?: { label: string; amount: number }[];
  total: number;
  onProceed: () => void;
}

export default function BookingSummary({
  items,
  basePrice,
  additionalCharges = [],
  total,
  onProceed,
}: BookingSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="text-base font-medium mt-1" data-testid={`text-summary-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
                  {item.value}
                </p>
              </div>
              {item.onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={item.onEdit}
                  data-testid={`button-edit-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base">Package Price</span>
            <span className="text-base font-medium">${basePrice.toFixed(2)}</span>
          </div>
          {additionalCharges.map((charge, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{charge.label}</span>
              <span className="text-sm font-medium">${charge.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-xl font-serif font-semibold">Total</span>
          <span className="text-2xl font-serif font-bold text-primary" data-testid="text-total-price">
            ${total.toFixed(2)}
          </span>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onProceed}
          data-testid="button-proceed-payment"
        >
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  );
}
