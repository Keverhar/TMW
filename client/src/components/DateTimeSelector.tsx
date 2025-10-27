import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface DateTimeSelectorProps {
  selectedDate?: Date;
  selectedTime?: string;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
}

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM"
];

export default function DateTimeSelector({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: DateTimeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Date & Time</CardTitle>
        <CardDescription>Choose your wedding date and ceremony time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Label className="text-base font-medium mb-3 block">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelectDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
              data-testid="calendar-date-selector"
            />
          </div>
          
          {selectedDate && (
            <div className="flex-1">
              <Label className="text-base font-medium mb-3 block">Available Times</Label>
              <RadioGroup value={selectedTime} onValueChange={onSelectTime}>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <div key={time}>
                      <RadioGroupItem
                        value={time}
                        id={time}
                        className="sr-only"
                        data-testid={`radio-time-${time.replace(/\s|:/g, '-')}`}
                      />
                      <Label
                        htmlFor={time}
                        className={`flex items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-all hover-elevate ${
                          selectedTime === time
                            ? "border-primary bg-accent"
                            : "border-card-border"
                        }`}
                      >
                        <span className="text-sm font-medium">{time}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
        
        {selectedDate && selectedTime && (
          <div className="rounded-md bg-accent p-4 border">
            <p className="text-sm font-medium text-accent-foreground">
              Selected: {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
