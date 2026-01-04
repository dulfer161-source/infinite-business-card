import { TeamMember } from './types';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@company.ru',
    position: 'Генеральный директор',
    department: 'Руководство',
    status: 'active',
    lastActive: '5 мин назад',
    views: 127
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@company.ru',
    position: 'Менеджер по продажам',
    department: 'Продажи',
    status: 'active',
    lastActive: '1 час назад',
    views: 89
  },
  {
    id: '3',
    name: 'Алексей Смирнов',
    email: 'alexey@company.ru',
    position: 'Старший разработчик',
    department: 'IT',
    status: 'active',
    lastActive: '2 часа назад',
    views: 45
  },
  {
    id: '4',
    name: 'Елена Васильева',
    email: 'elena@company.ru',
    position: 'HR-менеджер',
    department: 'HR',
    status: 'pending',
    lastActive: 'Не активирована',
    views: 0
  },
  {
    id: '5',
    name: 'Дмитрий Козлов',
    email: 'dmitry@company.ru',
    position: 'Маркетолог',
    department: 'Маркетинг',
    status: 'active',
    lastActive: '3 дня назад',
    views: 62
  }
];
