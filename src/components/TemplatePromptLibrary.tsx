import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  icon: string;
  color: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'it-minimal',
    title: 'IT-специалист',
    category: 'Технологии',
    prompt: 'Современная минималистичная визитка для IT-специалиста. Синие и серые тона, геометрические элементы, иконки технологий, чистый дизайн с акцентом на профессионализм',
    icon: 'Code',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200'
  },
  {
    id: 'designer-creative',
    title: 'Дизайнер',
    category: 'Креатив',
    prompt: 'Креативная визитка для дизайнера с яркими градиентами, абстрактными формами, современная типографика, фиолетовые и розовые оттенки, творческая композиция',
    icon: 'Palette',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200'
  },
  {
    id: 'business-elegant',
    title: 'Бизнес',
    category: 'Корпоративный',
    prompt: 'Элегантная корпоративная визитка для бизнеса. Строгий стиль, золотые акценты на темном фоне, классическая типографика, премиальный вид',
    icon: 'Briefcase',
    color: 'bg-amber-500/10 text-amber-700 border-amber-200'
  },
  {
    id: 'realtor-modern',
    title: 'Риэлтор',
    category: 'Недвижимость',
    prompt: 'Современная визитка для риэлтора с изображением домов или ключей, зеленые и бежевые тона, надежный и профессиональный дизайн',
    icon: 'Home',
    color: 'bg-green-500/10 text-green-600 border-green-200'
  },
  {
    id: 'doctor-clean',
    title: 'Врач',
    category: 'Медицина',
    prompt: 'Чистая медицинская визитка для врача, белые и голубые тона, крест или сердце, минималистичный дизайн, внушающий доверие',
    icon: 'Heart',
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200'
  },
  {
    id: 'photographer-artistic',
    title: 'Фотограф',
    category: 'Креатив',
    prompt: 'Художественная визитка для фотографа с камерой или объективом, черно-белая гамма с яркими акцентами, стильная композиция',
    icon: 'Camera',
    color: 'bg-slate-500/10 text-slate-600 border-slate-200'
  },
  {
    id: 'lawyer-professional',
    title: 'Юрист',
    category: 'Корпоративный',
    prompt: 'Профессиональная визитка для юриста, темно-синие тона, весы правосудия, строгий шрифт, символы закона и порядка',
    icon: 'Scale',
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
  },
  {
    id: 'fitness-energy',
    title: 'Фитнес-тренер',
    category: 'Спорт',
    prompt: 'Энергичная визитка для фитнес-тренера, оранжевые и черные тона, динамичные линии, силуэты спортсменов, мотивирующий дизайн',
    icon: 'Dumbbell',
    color: 'bg-orange-500/10 text-orange-600 border-orange-200'
  },
  {
    id: 'beauty-luxury',
    title: 'Салон красоты',
    category: 'Красота',
    prompt: 'Роскошная визитка для салона красоты, розовые и золотые оттенки, цветочные элементы, элегантная типографика, женственный стиль',
    icon: 'Sparkles',
    color: 'bg-pink-500/10 text-pink-600 border-pink-200'
  },
  {
    id: 'restaurant-tasty',
    title: 'Ресторан',
    category: 'Питание',
    prompt: 'Аппетитная визитка для ресторана, теплые красные и коричневые тона, изображение блюд или столовых приборов, уютный дизайн',
    icon: 'UtensilsCrossed',
    color: 'bg-red-500/10 text-red-600 border-red-200'
  },
  {
    id: 'education-smart',
    title: 'Репетитор',
    category: 'Образование',
    prompt: 'Образовательная визитка для репетитора, синие и зеленые тона, книги или карандаши, академичный стиль, понятный дизайн',
    icon: 'GraduationCap',
    color: 'bg-teal-500/10 text-teal-600 border-teal-200'
  },
  {
    id: 'mechanic-strong',
    title: 'Автомеханик',
    category: 'Услуги',
    prompt: 'Надежная визитка для автомеханика, серые и красные тона, инструменты или двигатель, индустриальный стиль, мужской дизайн',
    icon: 'Wrench',
    color: 'bg-gray-500/10 text-gray-600 border-gray-200'
  }
];

interface TemplatePromptLibraryProps {
  onSelectPrompt: (prompt: string) => void;
  onRandomGenerate?: () => void;
}

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * promptTemplates.length);
  return promptTemplates[randomIndex].prompt;
};

const TemplatePromptLibrary = ({ onSelectPrompt, onRandomGenerate }: TemplatePromptLibraryProps) => {
  const categories = Array.from(new Set(promptTemplates.map(t => t.category)));

  const handleRandomClick = () => {
    if (onRandomGenerate) {
      onRandomGenerate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Lightbulb" size={16} />
          <span>Выберите готовый шаблон или создайте свой</span>
        </div>
        {onRandomGenerate && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRandomClick}
            className="gap-2"
          >
            <Icon name="Shuffle" size={16} />
            Случайный макет
          </Button>
        )}
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {promptTemplates
              .filter(t => t.category === category)
              .map(template => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] group"
                  onClick={() => onSelectPrompt(template.prompt)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${template.color} shrink-0`}>
                        <Icon name={template.icon as any} size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {template.title}
                        </h5>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {template.prompt.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplatePromptLibrary;