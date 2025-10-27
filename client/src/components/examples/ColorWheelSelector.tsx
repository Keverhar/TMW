import ColorWheelSelector from '../ColorWheelSelector';

export default function ColorWheelSelectorExample() {
  return (
    <div className="max-w-md">
      <ColorWheelSelector
        selectedColor="#e91e63"
        onSelectColor={(color) => console.log('Selected color:', color)}
      />
    </div>
  );
}
