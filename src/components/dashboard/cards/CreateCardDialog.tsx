import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface NewCardData {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo_url?: string;
}

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCard: NewCardData;
  onNewCardChange: (card: NewCardData) => void;
  creating: boolean;
  onCreateCard: () => void;
  formatPhone: (value: string) => string;
}

const CreateCardDialog = ({
  open,
  onOpenChange,
  newCard,
  onNewCardChange,
  creating,
  onCreateCard,
  formatPhone
}: CreateCardDialogProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const response = await fetch('https://functions.poehali.dev/50fdddd4-e611-4c44-a602-fc0d45e26445', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            content_type: file.type
          })
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки');
        }

        const data = await response.json();
        onNewCardChange({ ...newCard, logo_url: data.url });
        toast.success('Фото загружено!');
      };
    } catch (error) {
      toast.error('Не удалось загрузить фото');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новую визитку</DialogTitle>
          <DialogDescription>
            Заполните информацию для вашей новой визитки
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3 mb-6">
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
              {newCard.logo_url ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gold/20 shadow-lg">
                  <img src={newCard.logo_url} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingImage ? (
                      <Icon name="Loader2" size={24} className="text-white animate-spin" />
                    ) : (
                      <Icon name="Camera" size={24} className="text-white" />
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-4 border-gold/20 shadow-lg group-hover:border-gold/40 transition-colors">
                  {uploadingImage ? (
                    <Icon name="Loader2" size={36} className="text-gold/60 animate-spin" />
                  ) : (
                    <Icon name="Camera" size={36} className="text-gold/60" />
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

          <div>
            <label className="block text-sm font-medium mb-2">Имя *</label>
            <Input
              value={newCard.name}
              onChange={(e) => onNewCardChange({ ...newCard, name: e.target.value })}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Должность</label>
            <Input
              value={newCard.position}
              onChange={(e) => onNewCardChange({ ...newCard, position: e.target.value })}
              placeholder="Менеджер по продажам"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Компания</label>
            <Input
              value={newCard.company}
              onChange={(e) => onNewCardChange({ ...newCard, company: e.target.value })}
              placeholder="ООО «Компания»"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Телефон</label>
            <Input
              type="tel"
              value={newCard.phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                onNewCardChange({ ...newCard, phone: formatted });
              }}
              placeholder="+7 (900) 123-45-67"
              maxLength={18}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={newCard.email}
              onChange={(e) => onNewCardChange({ ...newCard, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Сайт</label>
            <Input
              value={newCard.website}
              onChange={(e) => onNewCardChange({ ...newCard, website: e.target.value })}
              placeholder="example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">О себе</label>
            <Textarea
              value={newCard.description}
              onChange={(e) => onNewCardChange({ ...newCard, description: e.target.value })}
              placeholder="Расскажите о себе..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={creating}
            >
              Отмена
            </Button>
            <Button
              onClick={onCreateCard}
              className="flex-1 bg-gold text-black hover:bg-gold/90"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать визитку
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCardDialog;
