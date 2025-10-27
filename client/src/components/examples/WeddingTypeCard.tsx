import WeddingTypeCard from '../WeddingTypeCard';
import elopementImg from '@assets/generated_images/Intimate_elopement_ceremony_setup_d5c87634.png';

export default function WeddingTypeCardExample() {
  return (
    <div className="max-w-md">
      <WeddingTypeCard
        title="Elopement"
        description="Intimate ceremony for just the two of you"
        price="$499"
        inclusions={[
          "30-minute ceremony",
          "Professional officiant",
          "Choice of ceremony script",
          "Venue for 2 guests"
        ]}
        image={elopementImg}
        onSelect={() => console.log('Elopement selected')}
      />
    </div>
  );
}
