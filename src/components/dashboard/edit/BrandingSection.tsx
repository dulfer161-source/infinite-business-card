import BrandingSettings from '../cards/BrandingSettings';
import { CardData } from './types';

interface BrandingSectionProps {
  cardData: CardData | null;
  canRemoveBranding: boolean;
  onBrandingSave: (branding: any, hidePlatform: boolean) => Promise<void>;
}

const BrandingSection = ({ cardData, canRemoveBranding, onBrandingSave }: BrandingSectionProps) => {
  if (!cardData) return null;

  return (
    <BrandingSettings
      cardId={cardData.id}
      currentBranding={cardData.custom_branding}
      hidePlatformBranding={cardData.hide_platform_branding}
      canRemoveBranding={canRemoveBranding}
      onSave={onBrandingSave}
    />
  );
};

export default BrandingSection;
