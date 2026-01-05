import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CustomTemplateUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetSection: 'hero' | 'about' | 'services' | 'contacts' | 'full';
  onTemplateUploaded: (html: string, css: string, image?: string) => void;
  isPremium: boolean;
}

const CustomTemplateUpload = ({ 
  open, 
  onOpenChange, 
  targetSection,
  onTemplateUploaded,
  isPremium
}: CustomTemplateUploadProps) => {
  const navigate = useNavigate();
  const [uploadMethod, setUploadMethod] = useState<'image' | 'code'>('image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPremium) {
      toast.error('Загрузка макетов доступна только на премиум-тарифах');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5 МБ');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, загрузите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      toast.success('Изображение загружено!');
    };
    reader.readAsDataURL(file);
  };

  const handleCodeApply = () => {
    if (!isPremium) {
      toast.error('Загрузка макетов доступна только на премиум-тарифах');
      return;
    }

    if (!htmlCode.trim()) {
      toast.error('Введите HTML код');
      return;
    }

    onTemplateUploaded(htmlCode, cssCode);
    toast.success('Макет применён!');
    onOpenChange(false);
    resetState();
  };

  const handleImageApply = async () => {
    if (!uploadedImage) {
      toast.error('Загрузите изображение');
      return;
    }

    setIsProcessing(true);
    try {
      onTemplateUploaded('', '', uploadedImage);
      toast.success('Макет применён к визитке!');
      onOpenChange(false);
      resetState();
    } catch (error) {
      toast.error('Ошибка при применении макета');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setUploadedImage(null);
    setHtmlCode('');
    setCssCode('');
    setUploadMethod('image');
  };

  const getSectionName = (section: string) => {
    const names: Record<string, string> = {
      hero: 'Шапка',
      about: 'О себе',
      services: 'Услуги',
      contacts: 'Контакты',
      full: 'Вся визитка'
    };
    return names[section] || section;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Upload" size={24} className="text-gold" />
            Загрузить свой макет
            <Badge variant="outline" className="border-gold text-gold ml-2">Premium</Badge>
          </DialogTitle>
          <DialogDescription>
            Добавьте собственный дизайн для раздела: <span className="font-semibold text-foreground">{getSectionName(targetSection)}</span>
          </DialogDescription>
        </DialogHeader>

        {!isPremium && (
          <Card className="border-gold/50 bg-gold/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Lock" size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Функция доступна на Premium</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Загрузка собственных макетов, изображений и HTML/CSS кода доступна на платных тарифах от 490₽/мес
                  </p>
                  <Button 
                    className="bg-gold text-black hover:bg-gold/90"
                    onClick={() => {
                      onOpenChange(false);
                      navigate('/dashboard?tab=subscription');
                    }}
                  >
                    <Icon name="Crown" className="mr-2" size={16} />
                    Перейти на Premium
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'image' | 'code')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" disabled={!isPremium}>
              <Icon name="Image" className="mr-2" size={16} />
              Загрузить изображение
            </TabsTrigger>
            <TabsTrigger value="code" disabled={!isPremium}>
              <Icon name="Code" className="mr-2" size={16} />
              Вставить код
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Загрузите макет-изображение</CardTitle>
                <CardDescription>
                  Загрузите готовый дизайн в формате JPG, PNG или SVG (до 5 МБ)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-gold/50 transition-colors">
                  <input
                    type="file"
                    id="template-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={!isPremium}
                  />
                  <label htmlFor="template-image" className="cursor-pointer">
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={uploadedImage} 
                          alt="Preview" 
                          className="max-h-64 mx-auto rounded-lg border border-gold/20"
                        />
                        <p className="text-sm text-muted-foreground">
                          Нажмите, чтобы изменить изображение
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                          <Icon name="Upload" size={32} className="text-gold" />
                        </div>
                        <p className="font-semibold">Нажмите для загрузки</p>
                        <p className="text-sm text-muted-foreground">
                          или перетащите файл сюда
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, SVG до 5 МБ
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {uploadedImage && (
                  <Button
                    onClick={handleImageApply}
                    disabled={isProcessing}
                    className="w-full bg-gold text-black hover:bg-gold/90"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                        Применяю...
                      </>
                    ) : (
                      <>
                        <Icon name="Check" className="mr-2" size={18} />
                        Применить изображение
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Вставьте HTML/CSS код</CardTitle>
                <CardDescription>
                  Вставьте готовый код вашего макета
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="html-code" className="font-semibold">
                    HTML код
                  </Label>
                  <textarea
                    id="html-code"
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder='<div class="hero">
  <h1>Заголовок</h1>
  <p>Описание</p>
</div>'
                    className="w-full min-h-[200px] mt-2 p-3 border rounded-lg font-mono text-sm bg-muted/50"
                    disabled={!isPremium}
                  />
                </div>

                <div>
                  <Label htmlFor="css-code" className="font-semibold">
                    CSS код (опционально)
                  </Label>
                  <textarea
                    id="css-code"
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder='.hero {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}'
                    className="w-full min-h-[150px] mt-2 p-3 border rounded-lg font-mono text-sm bg-muted/50"
                    disabled={!isPremium}
                  />
                </div>

                <Button
                  onClick={handleCodeApply}
                  disabled={!htmlCode.trim()}
                  className="w-full bg-gold text-black hover:bg-gold/90"
                >
                  <Icon name="Check" className="mr-2" size={18} />
                  Применить код
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Icon name="Info" size={16} />
            Полезная информация
          </h4>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-gold">•</span>
              Загружаемое изображение будет использовано как фоновая инфографика для выбранного раздела
            </li>
            <li className="flex gap-2">
              <span className="text-gold">•</span>
              HTML/CSS код будет вставлен в структуру визитки с сохранением всех стилей
            </li>
            <li className="flex gap-2">
              <span className="text-gold">•</span>
              Вы можете использовать Tailwind CSS классы или собственные стили
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTemplateUpload;