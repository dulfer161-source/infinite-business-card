import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CardTemplate } from './templateData';

interface TemplateCardProps {
  template: CardTemplate;
  onPreview: (template: CardTemplate) => void;
  onSelect: (template: CardTemplate) => void;
}

const TemplateCard = ({ template, onPreview, onSelect }: TemplateCardProps) => {
  return (
    <Card
      className="border-gold/20 hover:border-gold transition-all cursor-pointer group"
      onClick={() => onPreview(template)}
    >
      <CardContent className="p-4 space-y-3">
        <div 
          className="aspect-[3/4] rounded-lg flex items-center justify-center text-6xl group-hover:scale-105 transition-transform"
          style={{ 
            background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
          }}
        >
          {template.preview}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{template.name}</h4>
            {template.isPremium && (
              <Badge variant="outline" className="border-gold text-gold text-xs">
                Pro
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {Object.values(template.colors).map((color, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-full border border-muted"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <Button
          size="sm"
          className="w-full bg-gold text-black hover:bg-gold/90"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template);
          }}
        >
          Применить
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
