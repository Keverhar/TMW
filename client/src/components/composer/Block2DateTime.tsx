import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Block2DateTimeProps {
  preferredDate: string;
  timeSlot: string;
  onChange: (field: string, value: string) => void;
  eventType?: string;
}

// Time slots vary by day of week
const getTimeSlots = (preferredDate: string, eventType: string) => {
  if (!preferredDate) {
    return [];
  }
  
  const dateObj = new Date(preferredDate + 'T12:00:00');
  const dayOfWeek = dateObj.getDay();
  
  // Wednesday (3) has specific time slots for elopement/vow renewal
  if (dayOfWeek === 3 && (eventType === 'modest-elopement' || eventType === 'vow-renewal')) {
    return [
      { value: "12pm", label: "12:00 PM", arrival: "" },
      { value: "2pm", label: "2:00 PM", arrival: "" },
      { value: "4pm", label: "4:00 PM", arrival: "" },
      { value: "6pm", label: "6:00 PM", arrival: "" },
    ];
  }
  
  // Default time slots for other days
  return [
    { value: "11am-2pm", label: "11:00 AM – 2:00 PM", arrival: "Bride arrival 9:30am" },
    { value: "2:30pm-5:30pm", label: "2:30 PM – 5:30 PM", arrival: "Bride arrival 1:00pm" },
    { value: "6pm-9pm", label: "6:00 PM – 9:00 PM", arrival: "Bride arrival 4:30pm" }
  ];
};

export default function Block2DateTime({ preferredDate, timeSlot, onChange, eventType = 'modest-wedding' }: Block2DateTimeProps) {
  const isSimplifiedFlow = eventType === 'modest-elopement' || eventType === 'vow-renewal';
  const allowedDays = isSimplifiedFlow 
    ? [3, 5] // Wednesday (3), Friday (5)
    : [5, 6, 0]; // Friday (5), Saturday (6), Sunday (0)
  const timeSlots = getTimeSlots(preferredDate, eventType);
  
  const getDayName = (dayNumber: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };
  
  const availableDaysText = allowedDays.map(d => getDayName(d)).join(', ');
  
  // Convert string dates to Date objects
  const preferredDateObj = preferredDate ? new Date(preferredDate + 'T12:00:00') : undefined;
  
  // Minimum days in advance: 7 for elopement/vow renewal, 14 for weddings
  const minDaysInAdvance = isSimplifiedFlow ? 7 : 14;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + minDaysInAdvance);
  minDate.setHours(0, 0, 0, 0);
  
  // Matcher function to disable days not in allowedDays or too soon
  const disabledDays = (date: Date) => {
    const isTooSoon = date < minDate;
    const isWrongDay = !allowedDays.includes(date.getDay());
    return isTooSoon || isWrongDay;
  };
  
  // Matcher function to highlight available days (must be right day AND not too soon)
  const highlightDays = (date: Date) => {
    const isRightDay = allowedDays.includes(date.getDay());
    const isNotTooSoon = date >= minDate;
    return isRightDay && isNotTooSoon;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif mb-2">Preferred Date & Time</h2>
        <p className="text-muted-foreground">
          Let's talk about when you'd like your celebration to happen. You can change your date any time before finalizing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose Your Preferred Date</CardTitle>
          <CardDescription>Select the date you'd most love to celebrate your event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Preferred Date ({availableDaysText} only)</Label>
            {preferredDateObj && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md" data-testid="text-selected-date">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">{format(preferredDateObj, "EEEE, MMMM d, yyyy")}</span>
              </div>
            )}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={preferredDateObj}
                onSelect={(date) => {
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    onChange('preferredDate', `${year}-${month}-${day}`);
                  }
                }}
                disabled={disabledDays}
                modifiers={{ available: highlightDays }}
                modifiersClassNames={{
                  available: "bg-primary/10 font-semibold"
                }}
                numberOfMonths={2}
                className="border rounded-md"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              💡 Available days: {availableDaysText}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose a Time Slot</CardTitle>
          <CardDescription>Select your preferred time for the celebration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={timeSlot} onValueChange={(value) => onChange('timeSlot', value)}>
            {timeSlots.map((slot) => (
              <div key={slot.value} className="flex items-center space-x-2">
                <RadioGroupItem value={slot.value} id={`time-${slot.value}`} data-testid={`radio-time-${slot.value}`} />
                <Label htmlFor={`time-${slot.value}`} className="flex-1 cursor-pointer">
                  <span className="font-medium">{slot.label}</span>
                  {slot.arrival && <span className="text-sm text-muted-foreground ml-2">({slot.arrival})</span>}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-2 items-start bg-amber-50 dark:bg-amber-950 p-3 rounded-md mt-4">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-medium mb-1">Important:</p>
              <p>Your date and time are not secured until your final payment is received. You can work in The Wedding Composer even if you don't have a date yet, and make changes up until 7 days before your event.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
