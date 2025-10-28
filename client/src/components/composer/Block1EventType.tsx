import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface Block1EventTypeProps {
  eventType: string;
  eventTypeOther: string;
  onChange: (field: string, value: string) => void;
}

const eventTypes = [
  {
    value: "modest-wedding",
    label: "A Modest Wedding",
    description: "Our signature three-hour wedding experience including ceremony, reception, photography, music, cake, and more (with an additional hour and a half in the bridal suite before the ceremony)."
  },
  {
    value: "modest-elopement",
    label: "A Modest Elopement",
    description: "A beautifully curated 90-minute ceremony and reception, perfect for intimate celebrations."
  },
  {
    value: "vow-renewal",
    label: "Vow Renewal",
    description: "Celebrate your journey together with a heartfelt renewal ceremony."
  },
  {
    value: "other",
    label: "Other",
    description: "Planning something unique? Tell us more and we'll customize the experience."
  }
];

export default function Block1EventType({ eventType, eventTypeOther, onChange }: Block1EventTypeProps) {
  const selectedEvent = eventTypes.find(e => e.value === eventType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Type of Event</h2>
        <p className="text-muted-foreground">
          This is the first step in shaping your celebration. Tell us what kind of event you're planning.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Type</CardTitle>
          <CardDescription>Choose one option below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-type">Select Your Event Type *</Label>
            <Select value={eventType} onValueChange={(value) => onChange('eventType', value)}>
              <SelectTrigger id="event-type" data-testid="select-event-type">
                <SelectValue placeholder="Choose your event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEvent && (
            <div className="p-4 bg-muted rounded-md">
              <div className="flex gap-2 items-start">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
            </div>
          )}

          {eventType === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="event-type-other">Tell us about your event</Label>
              <Textarea
                id="event-type-other"
                data-testid="input-event-type-other"
                placeholder="Please describe the type of event you're planning..."
                value={eventTypeOther}
                onChange={(e) => onChange('eventTypeOther', e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-2 items-start bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Once you make your selection, the rest of the composer will automatically adapt to your event type.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
