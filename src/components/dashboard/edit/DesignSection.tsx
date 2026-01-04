import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { TargetSection, TemplateType } from './types';

interface DesignSectionProps {
  onOpenTemplates: (section: TargetSection, type: TemplateType) => void;
}

const sections = [
  { id: 'full' as const, icon: 'Maximize2', label: 'Вся визитка' },
  { id: 'hero' as const, icon: 'Layout', label: 'Шапка' },
  { id: 'about' as const, icon: 'User', label: 'О себе' },
  { id: 'services' as const, icon: 'Briefcase', label: 'Услуги' },
  { id: 'contacts' as const, icon: 'Mail', label: 'Контакты' }
];

const templates = [
  {
    type: 'library' as const,
    icon: 'Library',
    title: 'Библиотека',
    description: '36 готовых шаблонов',
    isPremium: false
  },
  {
    type: 'ai' as const,
    icon: 'Sparkles',
    title: 'AI генератор',
    description: 'Создать уникальный дизайн',
    isPremium: true
  },
  {
    type: 'upload' as const,
    icon: 'Upload',
    title: 'Загрузить свой',
    description: 'Изображение или код',
    isPremium: true
  }
];

const DesignSection = ({ onOpenTemplates }: DesignSectionProps) => {
  const [selectedSection, setSelectedSection] = React.useState<TargetSection>('full');

  const handleSectionSelect = (sectionId: TargetSection) => {
    setSelectedSection(sectionId);
  };

  const handleTemplateClick = (templateType: TemplateType) => {
    onOpenTemplates(selectedSection, templateType);
  };

  return (
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
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={selectedSection === section.id ? 'default' : 'outline'}
              className={`h-auto flex-col gap-2 p-3 ${
                selectedSection === section.id 
                  ? 'bg-gold text-black hover:bg-gold/90' 
                  : 'border-gold/30 hover:border-gold hover:bg-gold/5'
              }`}
              onClick={() => handleSectionSelect(section.id)}
            >
              <Icon name={section.icon as any} size={20} className={selectedSection === section.id ? 'text-black' : 'text-gold'} />
              <span className="text-xs font-semibold">{section.label}</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map((template) => (
            <Button
              key={template.type}
              variant="outline"
              className="h-auto flex-col gap-3 p-4 border-gold/30 hover:border-gold hover:bg-gold/10 relative"
              onClick={() => handleTemplateClick(template.type)}
            >
              <Icon name={template.icon as any} size={28} className="text-gold" />
              <div className="text-center">
                <div className="font-semibold text-sm mb-1 flex items-center justify-center gap-1">
                  {template.title}
                  {template.isPremium && <Icon name="Crown" size={12} className="text-gold" />}
                </div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignSection;