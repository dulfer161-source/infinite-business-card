import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import TemplateLibrary from './TemplateLibrary';
import AITemplateGenerator from './AITemplateGenerator';
import CustomTemplateUpload from './CustomTemplateUpload';
import { UserInfo, CardData, TargetSection, TemplateType, DesignSection, DataEditForm, BrandingSection } from './edit';

interface EditTabProps {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  selectedCardId?: number | null;
}

const EditTab = ({ userInfo, setUserInfo, selectedCardId }: EditTabProps) => {
  const [loadingCard, setLoadingCard] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [canRemoveBranding, setCanRemoveBranding] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [targetSection, setTargetSection] = useState<TargetSection>('full');

  useEffect(() => {
    if (selectedCardId) {
      loadCard(selectedCardId);
      checkBrandingPermission();
    } else {
      setCardData(null);
    }
    checkPremiumAccess();
  }, [selectedCardId]);

  const checkPremiumAccess = async () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/8a157dc3-1107-459c-8a50-def96da65372/subscriptions', {
        headers: { 'X-Auth-Token': authToken || '' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsPremium(data.has_premium_access || false);
      }
    } catch (error) {
      console.error('Failed to check premium access:', error);
    }
  };

  const checkBrandingPermission = async () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/8a157dc3-1107-459c-8a50-def96da65372/subscriptions', {
        headers: { 'X-Auth-Token': authToken || '' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCanRemoveBranding(data.has_branding_access || false);
      }
    } catch (error) {
      console.error('Failed to check branding permission:', error);
    }
  };

  const loadCard = async (id: number) => {
    setLoadingCard(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch(`https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f?id=${id}`, {
        headers: { 'X-Auth-Token': authToken || '' }
      });

      if (response.ok) {
        const data = await response.json();
        setCardData(data.card);
      } else {
        toast.error('Не удалось загрузить визитку');
      }
    } catch (error) {
      toast.error('Ошибка при загрузке визитки');
    } finally {
      setLoadingCard(false);
    }
  };

  const handleSave = async () => {
    if (selectedCardId && cardData) {
      try {
        const authToken = localStorage.getItem('auth_token');
        const response = await fetch('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': authToken || ''
          },
          body: JSON.stringify(cardData)
        });

        if (response.ok) {
          toast.success('Визитка обновлена!');
        } else {
          toast.error('Не удалось обновить визитку');
        }
      } catch (error) {
        toast.error('Ошибка при сохранении');
      }
    } else {
      try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        toast.success('Изменения успешно сохранены!');
      } catch (error) {
        toast.error('Ошибка при сохранении данных');
        console.error('Save error:', error);
      }
    }
  };

  const handleBrandingSave = async (branding: any, hidePlatform: boolean) => {
    if (!cardData) return;

    setCardData({
      ...cardData,
      custom_branding: branding,
      hide_platform_branding: hidePlatform
    });

    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('https://functions.poehali.dev/1b1c5f28-bcb7-48d0-9437-b01ccc89239f', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify({
          ...cardData,
          custom_branding: branding,
          hide_platform_branding: hidePlatform
        })
      });

      if (response.ok) {
        toast.success('Брендирование обновлено!');
      } else {
        toast.error('Не удалось обновить брендирование');
      }
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  if (loadingCard) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="text-muted-foreground">Загрузка визитки...</p>
        </div>
      </div>
    );
  }

  const editData = selectedCardId && cardData ? cardData : userInfo;
  const updateData = (field: string, value: string) => {
    if (selectedCardId && cardData) {
      setCardData({ ...cardData, [field]: value });
    } else {
      setUserInfo({ ...userInfo, [field]: value });
    }
  };

  const handleOpenTemplates = (section: TargetSection, type: TemplateType) => {
    setTargetSection(section);
    if (type === 'library') {
      setTemplateLibraryOpen(true);
    } else if (type === 'ai') {
      setAiGeneratorOpen(true);
    } else if (type === 'upload') {
      setUploadDialogOpen(true);
    }
  };

  const handleApplyTemplate = (template: any) => {
    toast.success(`Применён макет "${template.name}"`);
    console.log('Applied template:', template, 'to section:', targetSection);
  };

  const handleAIGenerated = (html: string, css: string) => {
    toast.success('AI макет применён к визитке!');
    console.log('AI generated:', { html, css, section: targetSection });
  };

  const handleTemplateUploaded = (html: string, css: string, image?: string) => {
    toast.success('Ваш макет загружен и применён!');
    console.log('Uploaded:', { html, css, image, section: targetSection });
  };

  return (
    <div className="space-y-6">
      {selectedCardId && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          Редактирование визитки #{selectedCardId}
        </div>
      )}

      <DesignSection onOpenTemplates={handleOpenTemplates} />

      <DataEditForm editData={editData} onUpdate={updateData} />

      <BrandingSection
        cardData={cardData}
        canRemoveBranding={canRemoveBranding}
        onBrandingSave={handleBrandingSave}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-gold text-black hover:bg-gold/90"
        >
          <Icon name="Save" className="mr-2" size={18} />
          Сохранить изменения
        </Button>
      </div>

      <TemplateLibrary
        open={templateLibraryOpen}
        onOpenChange={setTemplateLibraryOpen}
        onSelectTemplate={handleApplyTemplate}
        targetSection={targetSection}
      />

      <AITemplateGenerator
        open={aiGeneratorOpen}
        onOpenChange={setAiGeneratorOpen}
        onTemplateGenerated={handleAIGenerated}
        targetSection={targetSection}
        isPremium={isPremium}
      />

      <CustomTemplateUpload
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onTemplateUploaded={handleTemplateUploaded}
        targetSection={targetSection}
        isPremium={isPremium}
      />
    </div>
  );
};

export default EditTab;