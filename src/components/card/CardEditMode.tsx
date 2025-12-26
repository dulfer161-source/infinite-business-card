import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { compressImage } from '@/lib/imageCompression';

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
  view_count: number;
}

interface CardEditModeProps {
  editForm: CardData;
  saving: boolean;
  onEditFormChange: (field: keyof CardData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CardEditMode = ({ editForm, saving, onEditFormChange, onSave, onCancel }: CardEditModeProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    let formatted = '+7';
    if (cleaned.length > 1) {
      formatted += ' (' + cleaned.substring(1, 4);
    }
    if (cleaned.length >= 5) {
      formatted += ') ' + cleaned.substring(4, 7);
    }
    if (cleaned.length >= 8) {
      formatted += '-' + cleaned.substring(7, 9);
    }
    if (cleaned.length >= 10) {
      formatted += '-' + cleaned.substring(9, 11);
    }
    
    return formatted;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл слишком большой (макс. 5 МБ)');
      return;
    }

    setUploadingImage(true);
    try {
      const base64 = await compressImage(file, 800, 800, 0.85);
      
      const response = await fetch('https://functions.poehali.dev/50fdddd4-e611-4c44-a602-fc0d45e26445', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          content_type: 'image/jpeg'
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки');
      }

      const data = await response.json();
      onEditFormChange('logo_url', data.url);
      toast.success('Фото загружено!');
    } catch (error) {
      toast.error('Не удалось загрузить фото');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-4 md:mb-6">
        <div className="flex items-center justify-center mb-3 md:mb-4">
          <Logo size="md" />
        </div>
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Button 
            variant="destructive"
            size="sm"
            onClick={onCancel}
            className="text-xs md:text-sm"
          >
            <Icon name="X" size={14} className="mr-1" />
            Отменить
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={saving}
            className="bg-gold text-black hover:bg-gold/90 text-xs md:text-sm"
          >
            {saving ? (
              <>
                <Icon name="Loader2" size={14} className="mr-1 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={14} className="mr-1" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Edit Card */}
      <Card className="overflow-hidden border-2 border-gold/20 shadow-xl">
        <div className="relative">
          {/* Gold accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>
          
          <div className="p-4 md:p-8 pt-6 md:pt-10">
            {/* Logo / Avatar with Upload */}
            <div className="mb-4 md:mb-6 flex flex-col items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div 
                onClick={handleImageClick}
                className="relative cursor-pointer group"
              >
                {editForm.logo_url ? (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gold/20 shadow-lg">
                    <img src={editForm.logo_url} alt={editForm.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {uploadingImage ? (
                        <Icon name="Loader2" size={28} className="md:w-8 md:h-8 text-white animate-spin" />
                      ) : (
                        <Icon name="Camera" size={28} className="md:w-8 md:h-8 text-white" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-4 border-gold/20 shadow-lg group-hover:border-gold/40 transition-colors">
                    {uploadingImage ? (
                      <Icon name="Loader2" size={40} className="md:w-12 md:h-12 text-gold/60 animate-spin" />
                    ) : (
                      <Icon name="Camera" size={40} className="md:w-12 md:h-12 text-gold/60" />
                    )}
                  </div>
                )}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageClick}
                disabled={uploadingImage}
                className="text-xs"
              >
                <Icon name="Upload" size={14} className="mr-1" />
                {uploadingImage ? 'Загрузка...' : 'Загрузить фото'}
              </Button>
            </div>

            {/* Edit Form */}
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя *</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => onEditFormChange('name', e.target.value)}
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Должность</label>
                <Input
                  value={editForm.position || ''}
                  onChange={(e) => onEditFormChange('position', e.target.value)}
                  placeholder="Менеджер по продажам"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Компания</label>
                <Input
                  value={editForm.company || ''}
                  onChange={(e) => onEditFormChange('company', e.target.value)}
                  placeholder="ООО «Компания»"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <Input
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    onEditFormChange('phone', formatted);
                  }}
                  placeholder="+7 (900) 123-45-67"
                  maxLength={18}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => onEditFormChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Сайт</label>
                <Input
                  value={editForm.website || ''}
                  onChange={(e) => onEditFormChange('website', e.target.value)}
                  placeholder="example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">О себе</label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => onEditFormChange('description', e.target.value)}
                  placeholder="Расскажите о себе..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CardEditMode;