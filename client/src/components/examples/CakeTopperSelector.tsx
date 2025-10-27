import CakeTopperSelector from '../CakeTopperSelector';
import traditionalImg from '@assets/generated_images/Traditional_wedding_cake_topper_8cf92715.png';
import gentlemenImg from '@assets/generated_images/Gentlemen_wedding_cake_topper_3a9bd51a.png';
import ladiesImg from '@assets/generated_images/Ladies_wedding_cake_topper_e1b9db02.png';

export default function CakeTopperSelectorExample() {
  const toppers = [
    { id: 'traditional', name: 'Traditional', image: traditionalImg },
    { id: 'gentlemen', name: 'Gentlemen', image: gentlemenImg },
    { id: 'ladies', name: 'Ladies', image: ladiesImg }
  ];

  return (
    <div className="max-w-3xl">
      <CakeTopperSelector
        toppers={toppers}
        selectedTopper="traditional"
        onSelectTopper={(id) => console.log('Selected topper:', id)}
      />
    </div>
  );
}
