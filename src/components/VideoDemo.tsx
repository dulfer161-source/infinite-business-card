import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface VideoDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoDemo = ({ open, onOpenChange }: VideoDemoProps) => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      title: 'Создание визитки за 2 минуты',
      description: 'Узнайте, как быстро создать профессиональную визитку',
      duration: '2:15',
      thumbnail: 'https://cdn.poehali.dev/projects/666a7962-8495-4155-b108-1b12b4677071/files/8aabacba-8a5b-4042-8934-40638ada56c7.jpg',
      category: 'Начало работы',
      color: 'green'
    },
    {
      title: 'QR-коды и шаринг',
      description: 'Делитесь визиткой через QR-код и соцсети',
      duration: '1:45',
      thumbnail: 'https://cdn.poehali.dev/projects/666a7962-8495-4155-b108-1b12b4677071/files/cf8784e1-e519-4d80-862e-7826012b93f4.jpg',
      category: 'Функции',
      color: 'blue'
    },
    {
      title: 'Аналитика просмотров',
      description: 'Отслеживайте эффективность визитки',
      duration: '2:30',
      thumbnail: 'https://cdn.poehali.dev/projects/666a7962-8495-4155-b108-1b12b4677071/files/188359c1-40ac-4fdb-9e86-3293726bd228.jpg',
      category: 'Аналитика',
      color: 'orange'
    },
    {
      title: 'Интеграции и автоматизация',
      description: 'Подключайте CRM и автоматизируйте процессы',
      duration: '3:00',
      thumbnail: 'https://cdn.poehali.dev/projects/666a7962-8495-4155-b108-1b12b4677071/files/2d04bea3-0362-4604-8e98-1d6245a61afb.jpg',
      category: 'Продвинутое',
      color: 'blue'
    }
  ];

  const currentVideoData = videos[currentVideo];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Видео-демонстрация</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-dark to-blue">
              <div className="text-center space-y-4">
                <Icon name="PlayCircle" size={64} className="text-white mx-auto opacity-80" />
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">{currentVideoData.title}</h3>
                  <p className="text-white/70">{currentVideoData.description}</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  <Icon name="Clock" size={14} className="mr-1" />
                  {currentVideoData.duration}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  currentVideo === index
                    ? 'border-green shadow-lg scale-105'
                    : 'border-transparent hover:border-blue-light/50'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  video.color === 'green' ? 'from-green/20 to-green/5' :
                  video.color === 'blue' ? 'from-blue/20 to-blue/5' :
                  'from-orange/20 to-orange/5'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon 
                      name={currentVideo === index ? "Pause" : "Play"} 
                      size={32} 
                      className="text-white opacity-80 group-hover:scale-110 transition-transform" 
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white font-medium truncate">{video.title}</p>
                  <p className="text-xs text-white/60">{video.duration}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Lightbulb" size={20} className="text-blue" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Советы по просмотру</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Смотрите видео последовательно для лучшего понимания</li>
                  <li>• Повторяйте действия из видео в демо-режиме</li>
                  <li>• Делайте паузы, чтобы попробовать функции самостоятельно</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentVideo(Math.max(0, currentVideo - 1))}
              disabled={currentVideo === 0}
            >
              <Icon name="ChevronLeft" className="mr-2" size={18} />
              Предыдущее
            </Button>
            
            <div className="flex gap-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentVideo === index
                      ? 'bg-green w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentVideo(Math.min(videos.length - 1, currentVideo + 1))}
              disabled={currentVideo === videos.length - 1}
            >
              Следующее
              <Icon name="ChevronRight" className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDemo;