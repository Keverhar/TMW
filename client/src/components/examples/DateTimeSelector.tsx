import DateTimeSelector from '../DateTimeSelector';

export default function DateTimeSelectorExample() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);

  return (
    <div className="max-w-4xl">
      <DateTimeSelector
        selectedDate={tomorrow}
        selectedTime="2:00 PM"
        onSelectDate={(date) => console.log('Selected date:', date)}
        onSelectTime={(time) => console.log('Selected time:', time)}
      />
    </div>
  );
}
