import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import funcUrls from '../../backend/func2url.json';

interface AnalyticsDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VideoStat {
  video_title: string;
  total_sessions: number;
  avg_score: number;
  avg_time: string;
}

interface DifficultQuestion {
  question_text: string;
  total_answers: number;
  correct_count: number;
  success_rate: string;
}

interface OverallStats {
  total_sessions: number;
  overall_avg_score: number;
}

interface AnalyticsData {
  videoStats: VideoStat[];
  difficultQuestions: DifficultQuestion[];
  overallStats: OverallStats;
}

const AnalyticsDashboard = ({ open, onOpenChange }: AnalyticsDashboardProps) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(funcUrls['quiz-analytics']);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAnalytics();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl gradient-text">📊 Аналитика тестов</DialogTitle>
            <Button variant="ghost" size="sm" onClick={fetchAnalytics}>
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-blue/30 border-t-blue rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Загрузка данных...</p>
            </div>
          </div>
        ) : !data || data.overallStats.total_sessions === 0 ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icon name="BarChart3" size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Пока нет данных</h3>
            <p className="text-muted-foreground">
              Статистика появится после того, как пользователи начнут проходить тесты
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue/10 to-blue/5 rounded-xl p-6 border border-blue/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue/20 flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего тестов</p>
                    <p className="text-2xl font-bold">{data.overallStats.total_sessions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green/10 to-green/5 rounded-xl p-6 border border-green/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green/20 flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-green" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Средний балл</p>
                    <p className="text-2xl font-bold">{data.overallStats.overall_avg_score.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange/10 to-orange/5 rounded-xl p-6 border border-orange/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange/20 flex items-center justify-center">
                    <Icon name="Video" size={20} className="text-orange" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Видео с тестами</p>
                    <p className="text-2xl font-bold">{data.videoStats.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon name="PlayCircle" size={20} className="text-blue" />
                <h3 className="text-lg font-semibold">Статистика по видео</h3>
              </div>
              
              <div className="space-y-3">
                {data.videoStats.map((video, index) => (
                  <div 
                    key={index}
                    className="bg-muted/50 rounded-lg p-4 border border-border hover:border-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{video.video_title}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="Users" size={14} />
                            <span>{video.total_sessions} прохождений</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            <span>~{Math.round(parseFloat(video.avg_time))} сек</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={video.avg_score >= 70 ? 'default' : 'secondary'}
                        className="text-base px-3 py-1"
                      >
                        {video.avg_score.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="mt-3 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          video.avg_score >= 70 ? 'bg-green' : 
                          video.avg_score >= 50 ? 'bg-blue' : 'bg-orange'
                        }`}
                        style={{ width: `${video.avg_score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={20} className="text-orange" />
                <h3 className="text-lg font-semibold">Сложные вопросы</h3>
                <Badge variant="secondary" className="text-xs">
                  Требуют улучшения
                </Badge>
              </div>
              
              <div className="space-y-3">
                {data.difficultQuestions.slice(0, 5).map((question, index) => (
                  <div 
                    key={index}
                    className="bg-orange/5 border border-orange/20 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question_text}</p>
                        <p className="text-sm text-muted-foreground">
                          {question.correct_count} из {question.total_answers} правильно
                        </p>
                      </div>
                      <Badge 
                        variant={parseFloat(question.success_rate) < 50 ? 'destructive' : 'secondary'}
                        className="flex-shrink-0"
                      >
                        {question.success_rate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue/10 to-green/10 border border-blue/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-green flex items-center justify-center flex-shrink-0">
                  <Icon name="Lightbulb" size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">💡 Рекомендации</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Вопросы с успешностью {'<'}50% требуют пересмотра</li>
                    <li>• Добавьте больше примеров в видео для сложных тем</li>
                    <li>• Средний балл {'<'}70% говорит о необходимости доработки материала</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsDashboard;
