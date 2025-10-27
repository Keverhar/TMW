import VowsSelector from '../VowsSelector';

export default function VowsSelectorExample() {
  const vows = [
    {
      id: 'classic',
      title: 'Classic Vows',
      excerpt: 'I promise to love you, honor you, and cherish you...'
    },
    {
      id: 'modern',
      title: 'Modern Vows',
      excerpt: 'Today I choose you to be my partner in life...'
    },
    {
      id: 'romantic',
      title: 'Romantic Vows',
      excerpt: 'You are my today and all of my tomorrows...'
    }
  ];

  return (
    <div className="max-w-2xl">
      <VowsSelector
        vows={vows}
        selectedVow="classic"
        onSelectVow={(id) => console.log('Selected vow:', id)}
      />
    </div>
  );
}
