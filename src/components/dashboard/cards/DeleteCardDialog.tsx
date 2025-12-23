import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
  created_at: string;
}

interface DeleteCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardData | null;
  deleting: boolean;
  onConfirm: () => void;
}

const DeleteCardDialog = ({ open, onOpenChange, card, deleting, onConfirm }: DeleteCardDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить визитку?</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить визитку <strong>{card?.name}</strong>?
            Это действие нельзя отменить.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={deleting}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Удаление...
              </>
            ) : (
              <>
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCardDialog;
