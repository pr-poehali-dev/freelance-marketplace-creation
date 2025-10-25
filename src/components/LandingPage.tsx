import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type UserRole = 'guest' | 'jobseeker' | 'employer' | 'admin';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Разработка', icon: 'Code2', count: 234 },
    { name: 'Дизайн', icon: 'Palette', count: 156 },
    { name: 'Маркетинг', icon: 'TrendingUp', count: 189 },
    { name: 'Копирайтинг', icon: 'FileText', count: 98 },
    { name: 'Аналитика', icon: 'BarChart3', count: 67 },
    { name: 'Управление', icon: 'Users', count: 45 },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Frontend разработчик',
      company: 'TechCorp',
      location: 'Москва',
      salary: '200 000 - 300 000 ₽',
      type: 'Полная занятость',
      tags: ['React', 'TypeScript', 'Remote'],
    },
    {
      id: 2,
      title: 'UX/UI дизайнер',
      company: 'DesignStudio',
      location: 'Санкт-Петербург',
      salary: '150 000 - 220 000 ₽',
      type: 'Контракт',
      tags: ['Figma', 'Prototyping', 'Mobile'],
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupX',
      location: 'Удаленно',
      salary: '180 000 - 250 000 ₽',
      type: 'Полная занятость',
      tags: ['Agile', 'SaaS', 'B2B'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Briefcase" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-secondary">FreelanceHub</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#jobs" className="text-sm font-medium hover:text-primary transition-colors">
              Вакансии
            </a>
            <a href="#companies" className="text-sm font-medium hover:text-primary transition-colors">
              Компании
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              О платформе
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onLogin('jobseeker')}>
              Войти
            </Button>
            <Button onClick={() => onLogin('employer')}>
              Разместить вакансию
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 text-secondary">
              Найдите идеальную работу
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Тысячи вакансий от ведущих компаний. Начните карьеру мечты уже сегодня
            </p>
            
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Должность, навыки или компания..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                <Icon name="Search" size={20} className="mr-2" />
                Найти
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="p-4 hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon name={category.icon as any} size={24} className="text-primary" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} вакансий</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-secondary mb-2">
                Рекомендуемые вакансии
              </h3>
              <p className="text-muted-foreground">
                Специально подобранные предложения для вас
              </p>
            </div>
            <Button variant="outline">
              Смотреть все
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {job.company[0]}
                    </span>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
                
                <h4 className="text-xl font-bold mb-2 text-secondary">{job.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">{job.company}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Wallet" size={14} />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="jobseeker" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/10">
                <TabsTrigger value="jobseeker" className="data-[state=active]:bg-white data-[state=active]:text-secondary">
                  Для соискателей
                </TabsTrigger>
                <TabsTrigger value="employer" className="data-[state=active]:bg-white data-[state=active]:text-secondary">
                  Для работодателей
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:text-secondary">
                  Администрирование
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobseeker" className="space-y-6">
                <h3 className="text-3xl font-bold mb-4">Возможности для соискателей</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Search" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Умный поиск</h4>
                      <p className="text-sm text-white/80">Расширенные фильтры по категориям, локации и навыкам</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="FileText" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Управление резюме</h4>
                      <p className="text-sm text-white/80">Загружайте и обновляйте своё резюме</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Send" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Быстрые отклики</h4>
                      <p className="text-sm text-white/80">Подавайте заявки на вакансии в один клик</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Bell" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Уведомления</h4>
                      <p className="text-sm text-white/80">Получайте оповещения о новых вакансиях</p>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-secondary hover:bg-white/90"
                  onClick={() => onLogin('jobseeker')}
                >
                  Начать поиск работы
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </TabsContent>

              <TabsContent value="employer" className="space-y-6">
                <h3 className="text-3xl font-bold mb-4">Инструменты для работодателей</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="PlusCircle" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Публикация вакансий</h4>
                      <p className="text-sm text-white/80">Быстро размещайте объявления о работе</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">База кандидатов</h4>
                      <p className="text-sm text-white/80">Просматривайте и фильтруйте резюме</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="MessageSquare" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Прямые сообщения</h4>
                      <p className="text-sm text-white/80">Связывайтесь с кандидатами напрямую</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="BarChart3" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Аналитика</h4>
                      <p className="text-sm text-white/80">Отслеживайте эффективность вакансий</p>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-secondary hover:bg-white/90"
                  onClick={() => onLogin('employer')}
                >
                  Начать подбор персонала
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <h3 className="text-3xl font-bold mb-4">Панель администратора</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Управление пользователями</h4>
                      <p className="text-sm text-white/80">Модерация и контроль аккаунтов</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Database" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Резервное копирование</h4>
                      <p className="text-sm text-white/80">Полная защита данных платформы</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Settings" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Настройка категорий</h4>
                      <p className="text-sm text-white/80">Управление индустриями и городами</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Activity" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Мониторинг системы</h4>
                      <p className="text-sm text-white/80">Отслеживание активности платформы</p>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-secondary hover:bg-white/90"
                  onClick={() => onLogin('admin')}
                >
                  Войти в админ-панель
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Briefcase" size={24} className="text-primary" />
                <h3 className="font-bold text-lg">FreelanceHub</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Профессиональная платформа для поиска работы и талантов
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Для соискателей</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Поиск вакансий</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Создать резюме</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Карьерные советы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Для работодателей</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Разместить вакансию</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Поиск резюме</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Тарифы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Помощь</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 FreelanceHub. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
