import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface CardTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  layout: 'classic' | 'modern' | 'minimal' | 'creative';
}

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

  const templates: CardTemplate[] = [
    {
      id: 'business-classic',
      name: 'Деловой классика',
      category: 'business',
      preview: '🎩',
      isPremium: false,
      colors: {
        primary: '#1a1a1a',
        secondary: '#d4a574',
        background: '#ffffff'
      },
      layout: 'classic'
    },
    {
      id: 'modern-gradient',
      name: 'Современный градиент',
      category: 'creative',
      preview: '🌈',
      isPremium: true,
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        background: '#f7fafc'
      },
      layout: 'modern'
    },
    {
      id: 'minimal-clean',
      name: 'Минимализм',
      category: 'minimal',
      preview: '⚪',
      isPremium: false,
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#fafafa'
      },
      layout: 'minimal'
    },
    {
      id: 'tech-blue',
      name: 'Технологичный синий',
      category: 'tech',
      preview: '💻',
      isPremium: true,
      colors: {
        primary: '#0066cc',
        secondary: '#00ccff',
        background: '#f0f4f8'
      },
      layout: 'modern'
    },
    {
      id: 'creative-purple',
      name: 'Креативный фиолетовый',
      category: 'creative',
      preview: '🎨',
      isPremium: true,
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        background: '#faf5ff'
      },
      layout: 'creative'
    },
    {
      id: 'elegant-gold',
      name: 'Элегантное золото',
      category: 'business',
      preview: '✨',
      isPremium: true,
      colors: {
        primary: '#1a1a1a',
        secondary: '#d4a574',
        background: '#fffbf5'
      },
      layout: 'classic'
    },
    {
      id: 'fresh-green',
      name: 'Свежий зелёный',
      category: 'eco',
      preview: '🌿',
      isPremium: false,
      colors: {
        primary: '#10b981',
        secondary: '#34d399',
        background: '#f0fdf4'
      },
      layout: 'modern'
    },
    {
      id: 'bold-red',
      name: 'Яркий красный',
      category: 'creative',
      preview: '🔥',
      isPremium: true,
      colors: {
        primary: '#dc2626',
        secondary: '#f97316',
        background: '#fef2f2'
      },
      layout: 'creative'
    },
    {
      id: 'dark-mode',
      name: 'Тёмная тема',
      category: 'tech',
      preview: '🌙',
      isPremium: true,
      colors: {
        primary: '#ffffff',
        secondary: '#d4a574',
        background: '#1a1a1a'
      },
      layout: 'modern'
    },
    {
      id: 'soft-pink',
      name: 'Нежный розовый',
      category: 'beauty',
      preview: '🌸',
      isPremium: false,
      colors: {
        primary: '#ec4899',
        secondary: '#f472b6',
        background: '#fdf2f8'
      },
      layout: 'minimal'
    },
    {
      id: 'ocean-blue',
      name: 'Океанский синий',
      category: 'business',
      preview: '🌊',
      isPremium: false,
      colors: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        background: '#ecfeff'
      },
      layout: 'modern'
    },
    {
      id: 'sunset-orange',
      name: 'Закатный оранжевый',
      category: 'creative',
      preview: '🌅',
      isPremium: true,
      colors: {
        primary: '#f97316',
        secondary: '#fb923c',
        background: '#fff7ed'
      },
      layout: 'creative'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: 'Grid' },
    { id: 'business', name: 'Бизнес', icon: 'Briefcase' },
    { id: 'creative', name: 'Креатив', icon: 'Palette' },
    { id: 'tech', name: 'Технологии', icon: 'Code' },
    { id: 'minimal', name: 'Минимализм', icon: 'Circle' },
    { id: 'beauty', name: 'Красота', icon: 'Sparkles' },
    { id: 'eco', name: 'Эко', icon: 'Leaf' }
  ];

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
                  <Card
                    key={template.id}
                    className="border-gold/20 hover:border-gold transition-all cursor-pointer group"
                    onClick={() => setPreviewTemplate(template)}
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
                          onSelectTemplate(template);
                          onOpenChange(false);
                        }}
                      >
                        Применить
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewTemplate?.name}</span>
              {previewTemplate?.isPremium && (
                <Badge variant="outline" className="border-gold text-gold">
                  Premium
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Предварительный просмотр макета
            </DialogDescription>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="space-y-4">
              <div 
                className="aspect-[3/4] rounded-lg flex flex-col items-center justify-center text-9xl"
                style={{ 
                  background: `linear-gradient(135deg, ${previewTemplate.colors.primary}, ${previewTemplate.colors.secondary})`,
                }}
              >
                {previewTemplate.preview}
                <div className="mt-4 text-sm font-semibold px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  {previewTemplate.layout}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 border rounded-lg">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: previewTemplate.colors.primary }}
                  />
                  <p className="text-xs font-mono">{previewTemplate.colors.primary}</p>
                  <p className="text-xs text-muted-foreground">Основной</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: previewTemplate.colors.secondary }}
                  />
                  <p className="text-xs font-mono">{previewTemplate.colors.secondary}</p>
                  <p className="text-xs text-muted-foreground">Акцент</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-2 border" 
                    style={{ backgroundColor: previewTemplate.colors.background }}
                  />
                  <p className="text-xs font-mono">{previewTemplate.colors.background}</p>
                  <p className="text-xs text-muted-foreground">Фон</p>
                </div>
              </div>

              <Button
                className="w-full bg-gold text-black hover:bg-gold/90"
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                  onOpenChange(false);
                }}
              >
                <Icon name="Check" className="mr-2" size={18} />
                Применить макет
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateLibrary;
