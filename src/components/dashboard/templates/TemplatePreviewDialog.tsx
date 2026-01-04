import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { CardTemplate } from './templateData';

interface TemplatePreviewDialogProps {
  template: CardTemplate | null;
  onClose: () => void;
  onSelect: (template: CardTemplate) => void;
}

const TemplatePreviewDialog = ({ template, onClose, onSelect }: TemplatePreviewDialogProps) => {
  return (
    <Dialog open={!!template} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{template?.name}</span>
            {template?.isPremium && (
              <Badge variant="outline" className="border-gold text-gold">
                Premium
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Предварительный просмотр макета
          </DialogDescription>
        </DialogHeader>
        
        {template && (
          <div className="space-y-4">
            <div 
              className="aspect-[3/4] rounded-lg flex flex-col items-center justify-center text-9xl"
              style={{ 
                background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
              }}
            >
              {template.preview}
              <div className="mt-4 text-sm font-semibold px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                {template.layout}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 border rounded-lg">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2" 
                  style={{ backgroundColor: template.colors.primary }}
                />
                <p className="text-xs font-mono">{template.colors.primary}</p>
                <p className="text-xs text-muted-foreground">Основной</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2" 
                  style={{ backgroundColor: template.colors.secondary }}
                />
                <p className="text-xs font-mono">{template.colors.secondary}</p>
                <p className="text-xs text-muted-foreground">Акцент</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 border" 
                  style={{ backgroundColor: template.colors.background }}
                />
                <p className="text-xs font-mono">{template.colors.background}</p>
                <p className="text-xs text-muted-foreground">Фон</p>
              </div>
            </div>

            <Button
              className="w-full bg-gold text-black hover:bg-gold/90"
              onClick={() => {
                onSelect(template);
                onClose();
              }}
            >
              <Icon name="Check" className="mr-2" size={18} />
              Применить макет
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
