import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { UserInfo, CardData } from './types';

interface DataEditFormProps {
  editData: UserInfo | CardData;
  onUpdate: (field: string, value: string) => void;
}

const formFields = [
  { id: 'name', label: 'ФИО', type: 'text' },
  { id: 'position', label: 'Должность', type: 'text' },
  { id: 'company', label: 'Компания', type: 'text' },
  { id: 'phone', label: 'Телефон', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'website', label: 'Веб-сайт', type: 'url' }
];

const DataEditForm = ({ editData, onUpdate }: DataEditFormProps) => {
  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Edit" className="text-gold" size={24} />
          Редактировать данные
        </CardTitle>
        <CardDescription>
          Обновите информацию вашей визитки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                value={(editData as any)[field.id] || ''}
                onChange={(e) => onUpdate(field.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            rows={4}
            value={editData.description || ''}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Расскажите о себе или своих услугах..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataEditForm;
