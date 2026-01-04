import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const FAQ = () => {
  const faqs = [
    {
      question: 'Как создать свою первую визитку?',
      answer: 'Зарегистрируйтесь, выберите шаблон дизайна из библиотеки, заполните контактные данные (имя, должность, телефон, email), добавьте фото и логотип. Визитка готова к публикации!'
    },
    {
      question: 'Что такое AI-генерация макетов?',
      answer: 'Искусственный интеллект YandexGPT создает уникальные HTML/CSS макеты для вашей визитки. Опишите желаемый дизайн, и ИИ сгенерирует профессиональный макет за несколько секунд. Доступно на Premium тарифах.'
    },
    {
      question: 'Как работают шаблоны?',
      answer: 'В библиотеке 37 готовых шаблонов для разных профессий: бизнес, креатив, технологии, красота и др. Выбирайте по категории, настраивайте цвета и сразу применяйте к визитке.'
    },
    {
      question: 'Что включает бесплатный тариф?',
      answer: 'Бесплатный тариф: 1 визитка, 100 просмотров/мес, базовые шаблоны, QR-код, короткая ссылка visitka.site/ваш-ник, шаринг в соцсети. Без ограничений по времени.'
    },
    {
      question: 'Как работает QR-код?',
      answer: 'QR-код генерируется автоматически и содержит ссылку на вашу визитку. Сканирование открывает визитку в браузере с возможностью сохранить контакт в телефон (формат vCard).'
    },
    {
      question: 'Можно ли редактировать дизайн визитки?',
      answer: 'Да! Используйте визуальный редактор для изменения текста, изображений, цветов. Можно выбрать другой шаблон, загрузить свой макет или сгенерировать через AI.'
    },
    {
      question: 'Как делиться визиткой?',
      answer: 'Используйте короткую ссылку visitka.site/ваш-ник, отправляйте через кнопки Telegram/VK/WhatsApp, показывайте QR-код для сканирования или встраивайте на сайт.'
    },
    {
      question: 'Безопасны ли мои данные?',
      answer: 'Да, все данные защищены SSL-шифрованием, хранятся на серверах Яндекс.Облако. Авторизация через VK OAuth. Соблюдаем требования 152-ФЗ о персональных данных.'
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