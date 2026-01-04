import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { CardTemplate, templates, categories } from './templates/templateData';
import TemplateCard from './templates/TemplateCard';
import TemplatePreviewDialog from './templates/TemplatePreviewDialog';

interface TemplateLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: CardTemplate) => void;
  targetSection?: 'hero' | 'about' | 'services' | 'contacts' | 'full';
}

const TemplateLibrary = ({ 
  open, 
  onOpenChange, 
  onSelectTemplate,
  targetSection = 'full'
}: TemplateLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getSectionName = (section: string) => {
    const names: Record<string, string> = {
      'hero': 'Шапку визитки',
      'about': 'Блок "О себе"',
      'services': 'Блок услуг',
      'contacts': 'Контакты',
      'full': 'Всю визитку'
    };
    return names[section] || 'Визитку';
  };

  const handleSelectTemplate = (template: CardTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  const handleSelectFromPreview = (template: CardTemplate) => {
    onSelectTemplate(template);
    setPreviewTemplate(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="LayoutTemplate" size={24} className="text-gold" />
              Библиотека макетов
            </DialogTitle>
            <DialogDescription>
              Выберите готовый макет для раздела: <span className="font-semibold text-foreground">{getSectionName(targetSection)}</span>
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === category.id ? 'bg-gold text-black hover:bg-gold/90' : 'border-gold/30'}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon name={category.icon as any} className="mr-2" size={16} />
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={setPreviewTemplate}
                    onSelect={handleSelectTemplate}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <TemplatePreviewDialog
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={handleSelectFromPreview}
      />
    </>
  );
};

export default TemplateLibrary;
