import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';
import funcUrls from '../../backend/func2url.json';

interface QuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AnswerRecord {
  questionText: string;
  selectedAnswerIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
}

const quizData: Record<string, Question[]> = {
  'Создание визитки за 2 минуты': [
    {
      question: 'Сколько времени нужно для создания визитки?',
      options: ['30 секунд', '2 минуты', '5 минут', '10 минут'],
      correctAnswer: 1,
      explanation: 'Базовую визитку можно создать всего за 2 минуты, заполнив основную информацию.'
    },
    {
      question: 'Что обязательно нужно указать при создании визитки?',
      options: ['Фото профиля', 'Имя и контакты', 'Соцсети', 'QR-код'],
      correctAnswer: 1,
      explanation: 'Имя и контакты — это минимально необходимая информация для визитки.'
    }
  ],
  'QR-коды и шаринг': [
    {
      question: 'Для чего нужен QR-код на визитке?',
      options: ['Для красоты', 'Быстро поделиться контактами', 'Для аналитики', 'Для защиты'],
      correctAnswer: 1,
      explanation: 'QR-код позволяет моментально поделиться вашими контактами — достаточно отсканировать камерой телефона.'
    },
    {
      question: 'Куда можно поделиться визиткой?',
      options: ['Только в WhatsApp', 'Только по QR-коду', 'В любые соцсети и мессенджеры', 'Только по email'],
      correctAnswer: 2,
      explanation: 'Визиткой можно делиться во все популярные соцсети, мессенджеры, по email и через QR-код.'
    }
  ],
  'Аналитика просмотров': [
    {
      question: 'Какую информацию показывает аналитика?',
      options: ['Только количество просмотров', 'Просмотры, клики, источники', 'Только время просмотра', 'Только географию'],
      correctAnswer: 1,
      explanation: 'Аналитика показывает полную картину: просмотры, клики по кнопкам, источники трафика и многое другое.'
    },
    {
      question: 'Зачем нужна аналитика визитки?',
      options: ['Для красоты', 'Понять эффективность и улучшить конверсию', 'Обязательное требование', 'Для соцсетей'],
      correctAnswer: 1,
      explanation: 'Аналитика помогает понять, как люди взаимодействуют с визиткой и что можно улучшить для большей эффективности.'
    }
  ],
  'Интеграции и автоматизация': [
    {
      question: 'С какими системами можно интегрировать визитку?',
      options: ['Только с CRM', 'CRM, email-сервисы, мессенджеры', 'Только с Google', 'Интеграции недоступны'],
      correctAnswer: 1,
      explanation: 'Визитку можно интегрировать с популярными CRM, email-сервисами и мессенджерами для автоматизации работы.'
    },
    {
      question: 'Что дает автоматизация визитки?',
      options: ['Экономит время на ручной работе', 'Делает визитку красивее', 'Увеличивает скорость загрузки', 'Добавляет QR-код'],
      correctAnswer: 0,
      explanation: 'Автоматизация позволяет автоматически отправлять данные в CRM, рассылать письма и экономить часы работы.'
    }
  ]
};

const Quiz = ({ open, onOpenChange, videoTitle }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [startTime] = useState<number>(Date.now());

  const questions = quizData[videoTitle] || [];

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswerRecords([...answerRecords, {
      questionText: questions[currentQuestion].question,
      selectedAnswerIndex: answerIndex,
      correctAnswerIndex: questions[currentQuestion].correctAnswer,
      isCorrect
    }]);

    setAnsweredQuestions([...answeredQuestions, true]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const sendAnalytics = async () => {
    const completionTime = Math.round((Date.now() - startTime) / 1000);
    
    try {
      await fetch(funcUrls['quiz-analytics'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle,
          totalQuestions: questions.length,
          correctAnswers: score,
          completionTimeSeconds: completionTime,
          answers: answerRecords
        })
      });
    } catch (error) {
      console.error('Failed to send quiz analytics:', error);
    }
  };

  useEffect(() => {
    if (showResult && answerRecords.length > 0) {
      sendAnalytics();
    }
  }, [showResult]);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setAnswerRecords([]);
  };

  const handleClose = () => {
    handleRestart();
    onOpenChange(false);
  };

  if (questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">
            {showResult ? '🎉 Результаты' : '❓ Проверьте знания'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green to-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue/10 to-green/10 rounded-xl p-6 border border-blue/20">
                <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQ.correctAnswer;
                    const showFeedback = selectedAnswer !== null;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showFeedback
                            ? isCorrect
                              ? 'border-green bg-green/10 text-green-700'
                              : isSelected
                              ? 'border-red-500 bg-red-500/10 text-red-700'
                              : 'border-muted bg-muted/30'
                            : isSelected
                            ? 'border-blue bg-blue/10'
                            : 'border-muted hover:border-blue/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {showFeedback && isCorrect && (
                            <Icon name="CheckCircle2" size={20} className="text-green flex-shrink-0" />
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <Icon name="XCircle" size={20} className="text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-blue/5 border border-blue/20 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="Info" size={16} className="text-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Объяснение</p>
                        <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end">
                <Button 
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="min-w-32"
                >
                  {currentQuestion < questions.length - 1 ? 'Далее' : 'Результаты'}
                  <Icon name="ChevronRight" className="ml-2" size={18} />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-6"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green to-blue flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {score}/{questions.length}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {score === questions.length ? 'Превосходно! 🎉' :
                   score >= questions.length * 0.7 ? 'Отличный результат! 👏' :
                   score >= questions.length * 0.5 ? 'Хороший результат! 👍' :
                   'Попробуйте ещё раз! 💪'}
                </h3>
                <p className="text-muted-foreground">
                  Вы правильно ответили на {score} из {questions.length} вопросов
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue/10 to-green/10 rounded-xl p-6 border border-blue/20">
                <div className="flex items-start gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-blue/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Lightbulb" size={20} className="text-blue" />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Что дальше?</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Попробуйте функции из видео на практике</li>
                      <li>• Изучите другие обучающие материалы</li>
                      <li>• Создайте свою первую визитку прямо сейчас</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleRestart}>
                  <Icon name="RotateCcw" className="mr-2" size={18} />
                  Пройти ещё раз
                </Button>
                <Button onClick={handleClose}>
                  Закрыть
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default Quiz;