import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import BrandingSettings from './cards/BrandingSettings';
import TemplateLibrary from './TemplateLibrary';
import AITemplateGenerator from './AITemplateGenerator';
import CustomTemplateUpload from './CustomTemplateUpload';

interface UserInfo {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface CardData {
  id: number;
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  custom_branding?: any;
  hide_platform_branding?: boolean;
}

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
  const [targetSection, setTargetSection] = useState<'hero' | 'about' | 'services' | 'contacts' | 'full'>('full');

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

  const handleOpenTemplates = (section: 'hero' | 'about' | 'services' | 'contacts' | 'full', type: 'library' | 'ai' | 'upload') => {
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

      <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="LayoutTemplate" className="text-gold" size={24} />
            Дизайн визитки
          </CardTitle>
          <CardDescription>
            Выберите раздел и способ оформления
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-3 border-gold/30 hover:border-gold hover:bg-gold/5"
            >
              <Icon name="Maximize2" size={20} className="text-gold" />
              <span className="text-xs font-semibold">Вся визитка</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-3 border-gold/30 hover:border-gold hover:bg-gold/5"
            >
              <Icon name="Layout" size={20} className="text-gold" />
              <span className="text-xs font-semibold">Шапка</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-3 border-gold/30 hover:border-gold hover:bg-gold/5"
            >
              <Icon name="User" size={20} className="text-gold" />
              <span className="text-xs font-semibold">О себе</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-3 border-gold/30 hover:border-gold hover:bg-gold/5"
            >
              <Icon name="Briefcase" size={20} className="text-gold" />
              <span className="text-xs font-semibold">Услуги</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-3 border-gold/30 hover:border-gold hover:bg-gold/5"
            >
              <Icon name="Mail" size={20} className="text-gold" />
              <span className="text-xs font-semibold">Контакты</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 p-4 border-gold/30 hover:border-gold hover:bg-gold/10"
              onClick={() => handleOpenTemplates('full', 'library')}
            >
              <Icon name="Library" size={28} className="text-gold" />
              <div className="text-center">
                <div className="font-semibold text-sm mb-1">Библиотека</div>
                <div className="text-xs text-muted-foreground">36 готовых шаблонов</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 p-4 border-gold/30 hover:border-gold hover:bg-gold/10 relative"
              onClick={() => handleOpenTemplates('full', 'ai')}
            >
              <Icon name="Sparkles" size={28} className="text-gold" />
              <div className="text-center">
                <div className="font-semibold text-sm mb-1 flex items-center justify-center gap-1">
                  AI генератор
                  <Icon name="Crown" size={12} className="text-gold" />
                </div>
                <div className="text-xs text-muted-foreground">Создать уникальный дизайн</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 p-4 border-gold/30 hover:border-gold hover:bg-gold/10 relative"
              onClick={() => handleOpenTemplates('full', 'upload')}
            >
              <Icon name="Upload" size={28} className="text-gold" />
              <div className="text-center">
                <div className="font-semibold text-sm mb-1 flex items-center justify-center gap-1">
                  Загрузить свой
                  <Icon name="Crown" size={12} className="text-gold" />
                </div>
                <div className="text-xs text-muted-foreground">Изображение или код</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Edit" className="text-gold" size={24} />
            Редактировать данные
          </CardTitle>
          <CardDescription>
            Обновите информацию вашей визитки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                value={editData.name || ''}
                onChange={(e) => updateData('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Должность</Label>
              <Input
                id="position"
                value={editData.position || ''}
                onChange={(e) => updateData('position', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input
                id="company"
                value={editData.company || ''}
                onChange={(e) => updateData('company', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={editData.phone || ''}
                onChange={(e) => updateData('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email || ''}
                onChange={(e) => updateData('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Веб-сайт</Label>
              <Input
                id="website"
                value={editData.website || ''}
                onChange={(e) => updateData('website', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              rows={4}
              value={editData.description || ''}
              onChange={(e) => updateData('description', e.target.value)}
            />
          </div>

          {selectedCardId && cardData && (
            <div className="space-y-2">
              <Label htmlFor="logo">Аватар / Логотип</Label>
              <div className="flex items-center gap-4">
                {cardData.logo_url && (
                  <img 
                    src={cardData.logo_url} 
                    alt="Logo" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold/20"
                  />
                )}
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  value={cardData.logo_url || ''}
                  onChange={(e) => updateData('logo_url', e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Вставьте ссылку на изображение
              </p>
            </div>
          )}

          <Button className="w-full md:w-auto bg-gold text-black hover:bg-gold/90" onClick={handleSave}>
            <Icon name="Save" className="mr-2" size={18} />
            Сохранить изменения
          </Button>
        </CardContent>
      </Card>

      {selectedCardId && cardData && (
        <BrandingSettings
          cardId={cardData.id}
          currentBranding={cardData.custom_branding}
          hidePlatformBranding={cardData.hide_platform_branding}
          canRemoveBranding={canRemoveBranding}
          onSave={handleBrandingSave}
        />
      )}

      <TemplateLibrary
        open={templateLibraryOpen}
        onOpenChange={setTemplateLibraryOpen}
        onSelectTemplate={handleApplyTemplate}
        targetSection={targetSection}
      />

      <AITemplateGenerator
        open={aiGeneratorOpen}
        onOpenChange={setAiGeneratorOpen}
        targetSection={targetSection}
        onTemplateGenerated={handleAIGenerated}
        isPremium={isPremium}
      />

      <CustomTemplateUpload
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        targetSection={targetSection}
        onTemplateUploaded={handleTemplateUploaded}
        isPremium={isPremium}
      />
    </div>
  );
};

export default EditTab;