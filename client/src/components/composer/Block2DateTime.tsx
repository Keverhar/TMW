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
  
  // Get allowed backup days based on preferred date's price tier
  const getAllowedBackupDays = (): number[] => {
    if (!preferredDate) return allowedDays;
    
    const prefDateObj = new Date(preferredDate + 'T12:00:00');
    const prefDayOfWeek = prefDateObj.getDay();
    
    if (isSimplifiedFlow) {
      // Elopement/Vow Renewal: same day only (same price tier)
      // Wednesday ($999) → only Wednesday
      // Friday ($1499) → only Friday
      return [prefDayOfWeek];
    } else {
      // Modest Wedding: same price tier days
      // Saturday ($4500) → only Saturday
      // Friday ($3900) → Friday or Sunday
      // Sunday ($3900) → Friday or Sunday
      if (prefDayOfWeek === 6) { // Saturday
        return [6]; // Only Saturday
      } else {
        return [5, 0]; // Friday or Sunday (both $3900)
      }
    }
  };
  
  const allowedBackupDays = getAllowedBackupDays();
  const availableDaysText = allowedDays.map(d => getDayName(d)).join(', ');
  const availableBackupDaysText = allowedBackupDays.map(d => getDayName(d)).join(', ');
  
  // Convert string dates to Date objects
  const preferredDateObj = preferredDate ? new Date(preferredDate + 'T12:00:00') : undefined;
  const backupDateObj = backupDate ? new Date(backupDate + 'T12:00:00') : undefined;
  
  // Matcher function to disable days not in allowedDays (for preferred date)
  const disabledDays = (date: Date) => {
    return !allowedDays.includes(date.getDay());
  };
  
  // Matcher function to disable days not in allowedBackupDays (for backup date)
  const disabledBackupDays = (date: Date) => {
    return !allowedBackupDays.includes(date.getDay());
  };
  
  // Matcher function to highlight available days
  const highlightDays = (date: Date) => {
    return allowedDays.includes(date.getDay());
  };
  
  // Matcher function to highlight available backup days
  const highlightBackupDays = (date: Date) => {
    return allowedBackupDays.includes(date.getDay());
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
          <div className="space-y-2">
            <Label>Preferred Date ({availableDaysText} only)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-testid="button-preferred-date"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {preferredDateObj ? format(preferredDateObj, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={preferredDateObj}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      onChange('preferredDate', `${year}-${month}-${day}`);
                      // Clear backup date if it's no longer in the allowed price tier
                      if (backupDate) {
                        const backupDateObj = new Date(backupDate + 'T12:00:00');
                        const backupDayOfWeek = backupDateObj.getDay();
                        const newAllowedBackupDays = isSimplifiedFlow 
                          ? [date.getDay()] 
                          : (date.getDay() === 6 ? [6] : [5, 0]);
                        if (!newAllowedBackupDays.includes(backupDayOfWeek)) {
                          onChange('backupDate', '');
                        }
                      }
                    }
                  }}
                  disabled={disabledDays}
                  modifiers={{ available: highlightDays }}
                  modifiersClassNames={{
                    available: "bg-primary/10 font-semibold"
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            <Label>Backup Date ({preferredDate ? availableBackupDaysText : availableDaysText} only)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-testid="button-backup-date"
                  className="w-full justify-start text-left font-normal"
                  disabled={!preferredDate}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {backupDateObj ? format(backupDateObj, "PPP") : <span>Pick a date (optional)</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={backupDateObj}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      onChange('backupDate', `${year}-${month}-${day}`);
                    } else {
                      onChange('backupDate', '');
                    }
                  }}
                  disabled={disabledBackupDays}
                  modifiers={{ available: highlightBackupDays }}
                  modifiersClassNames={{
                    available: "bg-primary/10 font-semibold"
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {!preferredDate && (
              <p className="text-sm text-muted-foreground">
                Please select a preferred date first
              </p>
            )}
            {preferredDate && (
              <p className="text-sm text-muted-foreground">
                💡 Available days (same price tier): {availableBackupDaysText}
              </p>
            )}
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
