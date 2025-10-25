import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LandingPageProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onShowRegistration: () => void;
}

const LandingPage = ({ onLogin, onShowRegistration }: LandingPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await onLogin(loginEmail, loginPassword);

    if (result.success) {
      toast({ title: 'Успешно!', description: 'Вы вошли в систему' });
      setShowLoginModal(false);
    } else {
      toast({ 
        title: 'Ошибка', 
        description: result.error || 'Неверные учетные данные', 
        variant: 'destructive' 
      });
    }

    setLoading(false);
  };

  const categories = [
    { name: 'IT и разработка', icon: 'Code2', color: 'bg-blue-50 text-blue-600', count: 1240 },
    { name: 'Дизайн', icon: 'Palette', color: 'bg-pink-50 text-pink-600', count: 856 },
    { name: 'Маркетинг', icon: 'TrendingUp', color: 'bg-green-50 text-green-600', count: 642 },
    { name: 'Продажи', icon: 'ShoppingCart', color: 'bg-purple-50 text-purple-600', count: 523 },
    { name: 'Финансы', icon: 'DollarSign', color: 'bg-yellow-50 text-yellow-600', count: 412 },
    { name: 'HR и рекрутинг', icon: 'Users', color: 'bg-indigo-50 text-indigo-600', count: 318 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Briefcase" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">JobPortal</h1>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Icon name="LogIn" size={18} className="mr-2" />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Вход в систему</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Пароль</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      Тестовые аккаунты: employer@test.com, jobseeker@test.com, admin@test.com
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                      {loading ? 'Вход...' : 'Войти'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Button onClick={onShowRegistration} className="bg-primary hover:bg-primary/90">
                <Icon name="UserPlus" size={18} className="mr-2" />
                Регистрация
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Найдите работу мечты или лучших специалистов</h2>
          <p className="text-xl mb-8 text-white/90">
            Тысячи вакансий от ведущих компаний. Быстро, удобно, эффективно.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-3 shadow-xl">
            <div className="flex gap-2">
              <Input
                placeholder="Должность, навык или компания..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-gray-900 border-0 focus-visible:ring-0"
              />
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Search" size={20} className="mr-2" />
                Искать
              </Button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <Icon name="Briefcase" size={20} />
              <span>1000+ вакансий</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Building2" size={20} />
              <span>500+ компаний</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              <span>10,000+ соискателей</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Популярные категории</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.name}
                className="p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 ${category.color} rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon name={category.icon as any} size={28} />
                </div>
                <h4 className="font-semibold mb-2">{category.name}</h4>
                <p className="text-sm text-gray-500">{category.count} вакансий</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Как это работает?</h3>
            <p className="text-gray-600">Найдите работу мечты за 3 простых шага</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Icon name="UserPlus" size={32} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-3">1. Зарегистрируйтесь</h4>
              <p className="text-gray-600">
                Создайте профиль, загрузите резюме и укажите свои навыки
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Icon name="Search" size={32} className="text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">2. Найдите вакансию</h4>
              <p className="text-gray-600">
                Используйте расширенный поиск по навыкам, локации и зарплате
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Icon name="CheckCircle2" size={32} className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold mb-3">3. Получите предложение</h4>
              <p className="text-gray-600">
                Откликайтесь на вакансии и получайте приглашения на интервью
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Для работодателей</h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">База талантливых специалистов</h4>
                    <p className="text-gray-600">Доступ к тысячам проверенных кандидатов с актуальными резюме</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Filter" size={24} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Умный поиск резюме</h4>
                    <p className="text-gray-600">Найдите идеального кандидата по навыкам, опыту и локации</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Calendar" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Управление интервью</h4>
                    <p className="text-gray-600">Планируйте встречи и отправляйте приглашения прямо из системы</p>
                  </div>
                </div>
              </div>

              <Button onClick={onShowRegistration} size="lg" className="mt-8 bg-primary hover:bg-primary/90">
                Начать поиск сотрудников
              </Button>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2,500+</div>
                    <div className="text-sm text-gray-500">Успешных наймов</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Средний срок закрытия вакансии: <span className="font-bold">7 дней</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Briefcase" size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">JobPortal</h3>
              </div>
              <p className="text-gray-400">
                Современная платформа для поиска работы и талантливых специалистов
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Для соискателей</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Поиск вакансий</a></li>
                <li><a href="#" className="hover:text-white">Компании</a></li>
                <li><a href="#" className="hover:text-white">Карьерные советы</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Для работодателей</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Разместить вакансию</a></li>
                <li><a href="#" className="hover:text-white">Поиск резюме</a></li>
                <li><a href="#" className="hover:text-white">Тарифы</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@jobportal.ru</li>
                <li>Телефон: +7 (495) 123-45-67</li>
                <li>Адрес: Москва, ул. Примерная, 1</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 JobPortal. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
