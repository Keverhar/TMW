import CeremonyScriptSelector from '../CeremonyScriptSelector';

export default function CeremonyScriptSelectorExample() {
  const scripts = [
    {
      id: 'non-secular',
      name: 'Non Secular',
      description: 'A modern, non-religious ceremony',
      preview: 'We are gathered here today to celebrate the union of two individuals who have found in each other a love that transcends the ordinary...'
    },
    {
      id: 'candle',
      name: 'Candle',
      description: 'Traditional unity candle ceremony',
      preview: 'As you light this candle together, you symbolize the joining of your lives and families...'
    }
  ];

  return (
    <div className="max-w-2xl">
      <CeremonyScriptSelector
        scripts={scripts}
        selectedScript="non-secular"
        onSelectScript={(id) => console.log('Selected script:', id)}
      />
    </div>
  );
}
