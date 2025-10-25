import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (userData: any) => Promise<{ success: boolean; error?: string }>;
}

const RegistrationModal = ({ isOpen, onClose, onRegister }: RegistrationModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    city_id: '',
    bio: '',
    current_position: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Ошибка', description: 'Пароли не совпадают', variant: 'destructive' });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: 'Ошибка', description: 'Пароль должен быть не менее 6 символов', variant: 'destructive' });
      return;
    }

    setLoading(true);

    const userData = {
      ...formData,
      role,
      city_id: formData.city_id ? parseInt(formData.city_id) : null,
      country_id: 1
    };

    delete userData.confirmPassword;

    const result = await onRegister(userData);

    if (result.success) {
      toast({ title: 'Успешно!', description: 'Регистрация завершена' });
      onClose();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        city_id: '',
        bio: '',
        current_position: ''
      });
    } else {
      toast({ 
        title: 'Ошибка', 
        description: result.error || 'Не удалось зарегистрироваться', 
        variant: 'destructive' 
      });
    }

    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Регистрация на платформе</DialogTitle>
        </DialogHeader>

        <Tabs value={role} onValueChange={(v) => setRole(v as 'jobseeker' | 'employer')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="jobseeker" className="flex items-center gap-2">
              <Icon name="User" size={18} />
              Я ищу работу
            </TabsTrigger>
            <TabsTrigger value="employer" className="flex items-center gap-2">
              <Icon name="Building2" size={18} />
              Я работодатель
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Имя *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Фамилия *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city_id">Город</Label>
              <Select value={formData.city_id} onValueChange={(v) => handleChange('city_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Москва</SelectItem>
                  <SelectItem value="2">Санкт-Петербург</SelectItem>
                  <SelectItem value="3">Нью-Йорк</SelectItem>
                  <SelectItem value="4">Лондон</SelectItem>
                  <SelectItem value="5">Берлин</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="jobseeker" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="current_position">Текущая должность</Label>
                <Input
                  id="current_position"
                  placeholder="Например: Frontend разработчик"
                  value={formData.current_position}
                  onChange={(e) => handleChange('current_position', e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="employer" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="current_position">Должность в компании</Label>
                <Input
                  id="current_position"
                  placeholder="Например: HR менеджер"
                  value={formData.current_position}
                  onChange={(e) => handleChange('current_position', e.target.value)}
                />
              </div>
            </TabsContent>

            <div>
              <Label htmlFor="bio">О себе</Label>
              <Input
                id="bio"
                placeholder="Расскажите немного о себе..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Отмена
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
