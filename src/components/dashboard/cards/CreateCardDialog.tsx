import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface NewCardData {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
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
