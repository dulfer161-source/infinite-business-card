import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
  userInfo: {
    name: string;
    position?: string;
    company?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  action?: () => void;
}

const ProgressTracker = ({ userInfo }: ProgressTrackerProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'basic_info',
      title: 'Заполните базовую информацию',
      description: 'Имя, должность, контакты',
      icon: 'User',
      completed: false
    },
    {
      id: 'description',
      title: 'Добавьте описание',
      description: 'Расскажите о себе или компании',
      icon: 'FileText',
      completed: false
    },
    {
      id: 'design',
      title: 'Настройте дизайн',
      description: 'Выберите шаблон и цвета',
      icon: 'Palette',
      completed: false
    },
    {
      id: 'share',
      title: 'Поделитесь визиткой',
      description: 'Отправьте ссылку первому клиенту',
      icon: 'Share2',
      completed: false
    },
    {
      id: 'qr_download',
      title: 'Скачайте QR-код',
      description: 'Для печати на материалах',
      icon: 'QrCode',
      completed: false
    }
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatedTasks = tasks.map(task => {
      switch (task.id) {
        case 'basic_info':
          return {
            ...task,
            completed: !!(userInfo.name && userInfo.position && userInfo.phone && userInfo.email)
          };
        case 'description':
          return {
            ...task,
            completed: !!(userInfo.description && userInfo.description.length > 20)
          };
        case 'design':
          return {
            ...task,
            completed: localStorage.getItem('design_completed') === 'true'
          };
        case 'share':
          return {
            ...task,
            completed: localStorage.getItem('card_shared') === 'true'
          };
        case 'qr_download':
          return {
            ...task,
            completed: localStorage.getItem('qr_downloaded') === 'true'
          };
        default:
          return task;
      }
    });

    setTasks(updatedTasks);

    const hasSeenProgress = localStorage.getItem('progress_tracker_seen');
    if (hasSeenProgress) {
      setIsCollapsed(true);
    }
  }, [userInfo, refreshKey]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const handleDismiss = () => {
    setIsCollapsed(true);
    localStorage.setItem('progress_tracker_seen', 'true');
  };

  if (completedCount === tasks.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-green/20 bg-gradient-to-br from-green/5 to-blue/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green to-blue flex items-center justify-center">
                <Icon name="Trophy" size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Поздравляем! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  Вы выполнили все начальные настройки. Ваша визитка готова к использованию!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <Card 
          className="border-blue/20 cursor-pointer hover:border-blue/40 transition-colors"
          onClick={() => setIsCollapsed(false)}
        >
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Target" size={20} className="text-blue" />
                  <span className="font-semibold text-sm">Прогресс настройки</span>
                  <Badge variant="outline" className="text-xs">
                    {completedCount}/{tasks.length}
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Button variant="ghost" size="sm">
                <Icon name="ChevronDown" size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-blue/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-purple-500 flex items-center justify-center">
                <Icon name="Target" size={20} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Завершите настройку</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {completedCount} из {tasks.length} выполнено
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <Icon name="X" size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  task.completed
                    ? 'bg-green/5 border-green/20'
                    : 'bg-muted/30 border-border hover:border-blue/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  task.completed 
                    ? 'bg-green text-white' 
                    : 'bg-muted'
                }`}>
                  {task.completed ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={task.icon as any} size={16} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
                {!task.completed && task.action && (
                  <Button variant="ghost" size="sm" onClick={task.action}>
                    <Icon name="ArrowRight" size={16} />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {progress > 0 && progress < 100 && (
            <div className="bg-blue/5 border border-blue/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Icon name="Lightbulb" size={16} className="text-blue mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong>Совет:</strong> Чем полнее заполнена визитка, тем больше доверия 
                  она вызывает у клиентов. Уделите несколько минут для завершения настройки.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressTracker;