import ProgressSteps from '../ProgressSteps';

export default function ProgressStepsExample() {
  const steps = [
    { id: '1', title: 'Select Package', description: 'Choose your wedding type' },
    { id: '2', title: 'Date & Time', description: 'Pick your ceremony date' },
    { id: '3', title: 'Customize', description: 'Personalize your ceremony' },
    { id: '4', title: 'Review', description: 'Confirm your selections' },
    { id: '5', title: 'Payment', description: 'Complete your booking' }
  ];

  return (
    <div className="max-w-sm p-6 bg-card rounded-lg border">
      <ProgressSteps steps={steps} currentStep={2} />
    </div>
  );
}
