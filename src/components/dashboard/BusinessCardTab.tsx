import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ExportMenu from '../ExportMenu';

interface UserInfo {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface BusinessCardTabProps {
  userInfo: UserInfo;
}

const BusinessCardTab = ({ userInfo }: BusinessCardTabProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [cardId] = useState(1); // TODO: Get from API
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const publicCardUrl = `${window.location.origin}/card/${cardId}`;

  useEffect(() => {
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      const response = await fetch('https://functions.poehali.dev/3abdccdf-8038-4ea9-a4bb-3302f15b8cf4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: cardId,
          url: publicCardUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qr_url);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const messengers = [
    { name: 'Telegram', icon: 'Send', color: 'text-blue-500', url: `https://t.me/share/url?url=${encodeURIComponent(publicCardUrl)}&text=${encodeURIComponent(`Моя визитка: ${userInfo.name}`)}` },
    { name: 'WhatsApp', icon: 'MessageCircle', color: 'text-green-500', url: `https://wa.me/?text=${encodeURIComponent(`Моя визитка: ${userInfo.name} ${publicCardUrl}`)}` },
    { name: 'VK', icon: 'Share2', color: 'text-blue-600', url: `https://vk.com/share.php?url=${encodeURIComponent(publicCardUrl)}&title=${encodeURIComponent(userInfo.name)}` },
    { name: 'Одноклассники', icon: 'Users', color: 'text-orange-500', url: `https://connect.ok.ru/offer?url=${encodeURIComponent(publicCardUrl)}&title=${encodeURIComponent(userInfo.name)}` },
    { name: 'VK Мессенджер', icon: 'MessageSquare', color: 'text-blue-500', url: `https://vk.me/share?url=${encodeURIComponent(publicCardUrl)}&title=${encodeURIComponent(`Моя визитка: ${userInfo.name}`)}` },
    { name: 'Скопировать ссылку', icon: 'Link', color: 'text-gray-500', url: '' }
  ];

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `qr-code-${userInfo.name}.png`;
    a.click();
    localStorage.setItem('qr_downloaded', 'true');
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${userInfo.name}
ORG:${userInfo.company}
TITLE:${userInfo.position}
TEL:${userInfo.phone}
EMAIL:${userInfo.email}
URL:${userInfo.website}
NOTE:${userInfo.description}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userInfo.name}.vcf`;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-gold/20 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-black to-secondary text-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{userInfo.name}</CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  {userInfo.position}
                </CardDescription>
                <p className="text-gold font-semibold mt-1">{userInfo.company}</p>
              </div>
              <div className="text-4xl">∞7</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Icon name="Phone" className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-semibold">{userInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{userInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Icon name="Globe" className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Веб-сайт</p>
                  <p className="font-semibold">{userInfo.website}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">О компании</p>
                <p className="text-sm">{userInfo.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Поделиться визиткой</p>
              <div className="flex gap-3">
                {messengers.map((messenger) => (
                  <Button
                    key={messenger.name}
                    variant="outline"
                    size="icon"
                    className="hover-scale"
                    title={messenger.name}
                    onClick={() => {
                      if (messenger.name === 'Скопировать ссылку') {
                        navigator.clipboard.writeText(publicCardUrl);
                        alert('Ссылка скопирована!');
                      } else {
                        window.open(messenger.url, '_blank');
                      }
                    }}
                  >
                    <Icon name={messenger.icon as any} className={messenger.color} size={20} />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="QrCode" className="text-gold" size={24} />
              QR-код визитки
            </CardTitle>
            <CardDescription>
              Отсканируйте для добавления в контакты
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              {isGeneratingQR ? (
                <div className="aspect-square flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
              ) : qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-square flex items-center justify-center text-muted-foreground">
                  <p>Ошибка загрузки</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadQR}
                  disabled={!qrCodeUrl}
                >
                  <Icon name="Download" className="mr-2" size={18} />
                  QR-код
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadVCard}
                >
                  <Icon name="Download" className="mr-2" size={18} />
                  vCard
                </Button>
              </div>
              <ExportMenu 
                type="card"
                cardData={{
                  name: userInfo.name,
                  position: userInfo.position,
                  company: userInfo.company,
                  phone: userInfo.phone,
                  email: userInfo.email,
                  website: userInfo.website,
                  description: userInfo.description,
                  qr_code_url: qrCodeUrl || undefined
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold/20 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Link" className="text-gold" size={24} />
              Короткая ссылка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/20 p-3 rounded-lg border border-gold/20 mb-3">
              <p className="text-center font-mono text-sm break-all">
                {publicCardUrl}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(publicCardUrl);
                alert('Ссылка скопирована!');
              }}
            >
              <Icon name="Copy" className="mr-2" size={18} />
              Копировать ссылку
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCardTab;