import MusicSelector from '../MusicSelector';

export default function MusicSelectorExample() {
  const musicOptions = [
    {
      id: 'processional',
      title: 'Canon in D',
      artist: 'Pachelbel',
      moment: 'Processional'
    },
    {
      id: 'ceremony',
      title: 'A Thousand Years',
      artist: 'Christina Perri',
      moment: 'During Ceremony'
    },
    {
      id: 'recessional',
      title: 'Married Life',
      artist: 'Michael Giacchino',
      moment: 'Recessional'
    }
  ];

  return (
    <div className="max-w-2xl">
      <MusicSelector
        musicOptions={musicOptions}
        selectedMusic={['processional', 'recessional']}
        onToggleMusic={(id) => console.log('Toggled music:', id)}
      />
    </div>
  );
}
