import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const FAQ = () => {
  const faqs = [
    {
      question: 'Как работает бесплатный тариф?',
      answer: 'На бесплатном тарифе вы получаете полноценную цифровую визитку с контактами, описанием организации, QR-кодом и возможностью делиться в мессенджерах. Ограничений по времени использования нет.'
    },
    {
      question: 'Что такое AI-генерация макетов?',
      answer: 'На тарифе Премиум вы можете использовать искусственный интеллект для создания уникальных изображений, логотипов и макетов для вашей визитки. Просто опишите что хотите получить, и ИИ создаст изображение за несколько секунд.'
    },
    {
      question: 'Как работает загрузка макетов за 79₽?',
      answer: 'На любом тарифе вы можете загрузить свои готовые макеты и логотипы в визитку за разовый платёж 79₽. Это удобно, если у вас уже есть готовый дизайн.'
    },
    {
      question: 'Что входит в корпоративный тариф?',
      answer: 'Корпоративный тариф включает 20 регистраций сотрудников с единым дизайном компании, корпоративными макетами, аналитикой по всей команде и персональным менеджером для поддержки.'
    },
    {
      question: 'Как работает QR-код?',
      answer: 'QR-код генерируется автоматически для каждой визитки и содержит все ваши контактные данные. При сканировании QR-кода человек может мгновенно добавить ваши контакты в свою телефонную книгу.'
    },
    {
      question: 'Можно ли изменить тариф позже?',
      answer: 'Да, вы можете в любой момент обновить свой тариф или вернуться на бесплатный. При переходе на платный тариф оплата происходит только за оставшийся период.'
    },
    {
      question: 'Как делиться визиткой в мессенджерах?',
      answer: 'В каждой визитке есть кнопки быстрого шеринга для Telegram, VK и других популярных российских мессенджеров. Один клик — и визитка отправлена!'
    },
    {
      question: 'Безопасны ли мои данные?',
      answer: 'Да, все данные защищены SSL-шифрованием и хранятся на надёжных серверах. Мы делаем ежедневные резервные копии и соблюдаем требования по защите персональных данных.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-blue/10 text-blue border-blue/20 font-semibold">FAQ</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ответы на популярные вопросы о сервисе
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 hover:border-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-green/10"
              >
                <AccordionTrigger className="text-left hover:text-green transition-colors">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div id="contacts" className="mt-24 text-center">
          <div className="bg-card border border-green/20 rounded-lg p-8 max-w-2xl mx-auto hover:border-green/40 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 gradient-text">Остались вопросы?</h3>
            <p className="text-muted-foreground mb-6">
              Наша команда поддержки готова помочь вам в любое время
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@visitka.site" 
                className="inline-flex items-center justify-center px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-blue/20 hover:shadow-green/40 font-semibold"
              >
                Написать на email
              </a>
              <a 
                href="https://t.me/visitka_support" 
                className="inline-flex items-center justify-center px-6 py-3 gradient-accent text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-orange/20 font-semibold"
              >
                Telegram поддержка
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;