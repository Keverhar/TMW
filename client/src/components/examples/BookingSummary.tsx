import BookingSummary from '../BookingSummary';

export default function BookingSummaryExample() {
  const items = [
    { label: 'Wedding Package', value: 'Saturday', onEdit: () => console.log('Edit package') },
    { label: 'Date & Time', value: 'June 15, 2025 at 3:00 PM', onEdit: () => console.log('Edit date') },
    { label: 'Ceremony Script', value: 'Traditional Christian', onEdit: () => console.log('Edit script') },
    { label: 'Cake Topper', value: 'Traditional', onEdit: () => console.log('Edit topper') }
  ];

  return (
    <div className="max-w-md">
      <BookingSummary
        items={items}
        basePrice={1499}
        additionalCharges={[
          { label: 'Premium flowers', amount: 200 }
        ]}
        total={1699}
        onProceed={() => console.log('Proceed to payment')}
      />
    </div>
  );
}
