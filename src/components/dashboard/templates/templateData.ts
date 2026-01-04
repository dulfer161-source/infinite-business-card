export interface CardTemplate {
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

export const templates: CardTemplate[] = [
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
  },
  {
    id: 'medical-mint',
    name: 'Медицинский мята',
    category: 'professional',
    preview: '💊',
    isPremium: false,
    colors: {
      primary: '#14b8a6',
      secondary: '#2dd4bf',
      background: '#f0fdfa'
    },
    layout: 'classic'
  },
  {
    id: 'lawyer-navy',
    name: 'Юридический синий',
    category: 'professional',
    preview: '⚖️',
    isPremium: true,
    colors: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      background: '#eff6ff'
    },
    layout: 'classic'
  },
  {
    id: 'architect-grey',
    name: 'Архитектурный серый',
    category: 'professional',
    preview: '📐',
    isPremium: true,
    colors: {
      primary: '#475569',
      secondary: '#94a3b8',
      background: '#f8fafc'
    },
    layout: 'minimal'
  },
  {
    id: 'restaurant-warm',
    name: 'Ресторанный теплый',
    category: 'business',
    preview: '🍽️',
    isPremium: false,
    colors: {
      primary: '#b45309',
      secondary: '#f59e0b',
      background: '#fffbeb'
    },
    layout: 'modern'
  },
  {
    id: 'fitness-energy',
    name: 'Фитнес энергия',
    category: 'sports',
    preview: '💪',
    isPremium: false,
    colors: {
      primary: '#ea580c',
      secondary: '#facc15',
      background: '#fef9c3'
    },
    layout: 'creative'
  },
  {
    id: 'photographer-bw',
    name: 'Фотограф ч/б',
    category: 'creative',
    preview: '📸',
    isPremium: true,
    colors: {
      primary: '#18181b',
      secondary: '#71717a',
      background: '#fafafa'
    },
    layout: 'minimal'
  },
  {
    id: 'real-estate-luxury',
    name: 'Недвижимость люкс',
    category: 'business',
    preview: '🏢',
    isPremium: true,
    colors: {
      primary: '#78350f',
      secondary: '#d4a574',
      background: '#fefce8'
    },
    layout: 'classic'
  },
  {
    id: 'teacher-bright',
    name: 'Преподаватель яркий',
    category: 'education',
    preview: '📚',
    isPremium: false,
    colors: {
      primary: '#2563eb',
      secondary: '#60a5fa',
      background: '#dbeafe'
    },
    layout: 'modern'
  },
  {
    id: 'designer-neon',
    name: 'Дизайнер неон',
    category: 'creative',
    preview: '✏️',
    isPremium: true,
    colors: {
      primary: '#a21caf',
      secondary: '#e879f9',
      background: '#fae8ff'
    },
    layout: 'creative'
  },
  {
    id: 'consultant-pro',
    name: 'Консультант про',
    category: 'business',
    preview: '💼',
    isPremium: false,
    colors: {
      primary: '#0f172a',
      secondary: '#64748b',
      background: '#f1f5f9'
    },
    layout: 'classic'
  },
  {
    id: 'yoga-zen',
    name: 'Йога дзен',
    category: 'sports',
    preview: '🧘',
    isPremium: false,
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      background: '#f5f3ff'
    },
    layout: 'minimal'
  },
  {
    id: 'barber-sharp',
    name: 'Барбер острый',
    category: 'beauty',
    preview: '✂️',
    isPremium: true,
    colors: {
      primary: '#7f1d1d',
      secondary: '#dc2626',
      background: '#fef2f2'
    },
    layout: 'modern'
  },
  {
    id: 'music-vibe',
    name: 'Музыка вайб',
    category: 'creative',
    preview: '🎵',
    isPremium: true,
    colors: {
      primary: '#581c87',
      secondary: '#c026d3',
      background: '#fdf4ff'
    },
    layout: 'creative'
  },
  {
    id: 'finance-trust',
    name: 'Финансы доверие',
    category: 'business',
    preview: '💰',
    isPremium: true,
    colors: {
      primary: '#064e3b',
      secondary: '#059669',
      background: '#ecfdf5'
    },
    layout: 'classic'
  },
  {
    id: 'travel-adventure',
    name: 'Путешествия приключения',
    category: 'lifestyle',
    preview: '✈️',
    isPremium: false,
    colors: {
      primary: '#0891b2',
      secondary: '#22d3ee',
      background: '#cffafe'
    },
    layout: 'modern'
  },
  {
    id: 'florist-spring',
    name: 'Флорист весна',
    category: 'beauty',
    preview: '🌺',
    isPremium: false,
    colors: {
      primary: '#be185d',
      secondary: '#f9a8d4',
      background: '#fce7f3'
    },
    layout: 'minimal'
  },
  {
    id: 'mechanic-industrial',
    name: 'Механик индустрия',
    category: 'professional',
    preview: '🔧',
    isPremium: false,
    colors: {
      primary: '#374151',
      secondary: '#ef4444',
      background: '#f3f4f6'
    },
    layout: 'modern'
  },
  {
    id: 'chef-gourmet',
    name: 'Шеф гурман',
    category: 'business',
    preview: '👨‍🍳',
    isPremium: true,
    colors: {
      primary: '#450a0a',
      secondary: '#fbbf24',
      background: '#fef3c7'
    },
    layout: 'classic'
  },
  {
    id: 'psychologist-calm',
    name: 'Психолог спокойствие',
    category: 'professional',
    preview: '🧠',
    isPremium: true,
    colors: {
      primary: '#4338ca',
      secondary: '#a5b4fc',
      background: '#e0e7ff'
    },
    layout: 'minimal'
  },
  {
    id: 'event-planner-festive',
    name: 'Организатор праздник',
    category: 'creative',
    preview: '🎉',
    isPremium: false,
    colors: {
      primary: '#db2777',
      secondary: '#fbbf24',
      background: '#fef3c7'
    },
    layout: 'creative'
  },
  {
    id: 'developer-matrix',
    name: 'Разработчик матрица',
    category: 'tech',
    preview: '⌨️',
    isPremium: true,
    colors: {
      primary: '#052e16',
      secondary: '#22c55e',
      background: '#052e16'
    },
    layout: 'modern'
  },
  {
    id: 'accountant-precise',
    name: 'Бухгалтер точность',
    category: 'business',
    preview: '🧮',
    isPremium: false,
    colors: {
      primary: '#1e40af',
      secondary: '#93c5fd',
      background: '#dbeafe'
    },
    layout: 'classic'
  },
  {
    id: 'veterinarian-care',
    name: 'Ветеринар забота',
    category: 'professional',
    preview: '🐾',
    isPremium: false,
    colors: {
      primary: '#15803d',
      secondary: '#86efac',
      background: '#dcfce7'
    },
    layout: 'modern'
  },
  {
    id: 'jeweler-precious',
    name: 'Ювелир драгоценный',
    category: 'luxury',
    preview: '💎',
    isPremium: true,
    colors: {
      primary: '#1e1b4b',
      secondary: '#c4b5fd',
      background: '#f5f3ff'
    },
    layout: 'classic'
  },
  {
    id: 'tattoo-artist-bold',
    name: 'Тату-мастер дерзкий',
    category: 'creative',
    preview: '🎨',
    isPremium: true,
    colors: {
      primary: '#18181b',
      secondary: '#ef4444',
      background: '#27272a'
    },
    layout: 'creative'
  }
];

export const categories = [
  { id: 'all', name: 'Все', icon: 'Grid' },
  { id: 'business', name: 'Бизнес', icon: 'Briefcase' },
  { id: 'creative', name: 'Креатив', icon: 'Palette' },
  { id: 'tech', name: 'Технологии', icon: 'Code' },
  { id: 'minimal', name: 'Минимализм', icon: 'Circle' },
  { id: 'beauty', name: 'Красота', icon: 'Sparkles' },
  { id: 'professional', name: 'Профессионалы', icon: 'Award' },
  { id: 'sports', name: 'Спорт', icon: 'Trophy' },
  { id: 'education', name: 'Образование', icon: 'BookOpen' },
  { id: 'lifestyle', name: 'Лайфстайл', icon: 'Heart' },
  { id: 'luxury', name: 'Люкс', icon: 'Crown' },
  { id: 'eco', name: 'Эко', icon: 'Leaf' }
];
