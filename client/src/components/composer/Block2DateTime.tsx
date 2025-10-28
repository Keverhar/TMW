import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";

interface Block2DateTimeProps {
  preferredDate: string;
  backupDate: string;
  timeSlot: string;
  onChange: (field: string, value: string) => void;
  eventType?: string;
}

const timeSlots = [
  { value: "11am-2pm", label: "11:00 AM – 2:00 PM", arrival: "Bride arrival 9:30am" },
  { value: "2:30pm-5:30pm", label: "2:30 PM – 5:30 PM", arrival: "Bride arrival 1:00pm" },
  { value: "6pm-9pm", label: "6:00 PM – 9:00 PM", arrival: "Bride arrival 4:30pm" },
  { value: "flexible", label: "I'm flexible – show me all options", arrival: "" }
];

export default function Block2DateTime({ preferredDate, backupDate, timeSlot, onChange, eventType = 'modest-wedding' }: Block2DateTimeProps) {
  const isSimplifiedFlow = eventType === 'modest-elopement' || eventType === 'vow-renewal';
  const allowedDays = isSimplifiedFlow 
    ? [3, 5] // Wednesday (3), Friday (5)
    : [5, 6, 0]; // Friday (5), Saturday (6), Sunday (0)
  
  const getDayName = (dayNumber: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };
  
  const availableDaysText = allowedDays.map(d => getDayName(d)).join(', ');
  
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
          <div className="space-y-2">
            <Label htmlFor="preferred-date">Preferred Date ({availableDaysText} only)</Label>
            <Input
              id="preferred-date"
              data-testid="input-preferred-date"
              type="date"
              value={preferredDate}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const dayOfWeek = selectedDate.getDay();
                if (allowedDays.includes(dayOfWeek)) {
                  onChange('preferredDate', e.target.value);
                }
              }}
              onKeyDown={(e) => {
                // Prevent manual typing - force calendar selection
                if (e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
            />
            <p className="text-sm text-muted-foreground">
              💡 Available days: {availableDaysText}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Date (Optional)</CardTitle>
          <CardDescription>If your first choice is unavailable, we'll check your backup date next</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="backup-date">Backup Date ({availableDaysText} only)</Label>
            <Input
              id="backup-date"
              data-testid="input-backup-date"
              type="date"
              value={backupDate}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const dayOfWeek = selectedDate.getDay();
                if (allowedDays.includes(dayOfWeek)) {
                  onChange('backupDate', e.target.value);
                }
              }}
              onKeyDown={(e) => {
                // Prevent manual typing - force calendar selection
                if (e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
            />
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
