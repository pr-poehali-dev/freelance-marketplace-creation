import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type UserRole = 'guest' | 'jobseeker' | 'employer' | 'admin';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Разработка сайтов', icon: 'Code2', color: 'bg-blue-50 text-blue-600' },
    { name: 'Мобильные приложения', icon: 'Smartphone', color: 'bg-purple-50 text-purple-600' },
    { name: 'Дизайн и графика', icon: 'Palette', color: 'bg-pink-50 text-pink-600' },
    { name: 'Тексты и переводы', icon: 'FileText', color: 'bg-orange-50 text-orange-600' },
    { name: 'SEO и маркетинг', icon: 'TrendingUp', color: 'bg-green-50 text-green-600' },
    { name: 'Видео и анимация', icon: 'Video', color: 'bg-red-50 text-red-600' },
    { name: 'Бизнес-услуги', icon: 'Briefcase', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Обучение', icon: 'GraduationCap', color: 'bg-yellow-50 text-yellow-600' },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Нужен лендинг для стартапа',
      budget: '25 000 ₽',
      responses: 12,
      category: 'Разработка',
      timeAgo: '2 часа назад',
      description: 'Создать современный лендинг для SaaS продукта. Дизайн готов в Figma.',
    },
    {
      id: 2,
      title: 'Логотип и фирменный стиль',
      budget: '15 000 ₽',
      responses: 8,
      category: 'Дизайн',
      timeAgo: '4 часа назад',
      description: 'Разработка логотипа и брендбука для кофейни.',
    },
    {
      id: 3,
      title: 'SEO продвижение интернет-магазина',
      budget: 'от 30 000 ₽/мес',
      responses: 15,
      category: 'Маркетинг',
      timeAgo: '1 день назад',
      description: 'Комплексное SEO продвижение магазина одежды.',
    },
    {
      id: 4,
      title: 'Написать статьи для блога',
      budget: '500 ₽/статья',
      responses: 23,
      category: 'Копирайтинг',
      timeAgo: '3 часа назад',
      description: 'Нужно 10 статей по IT-тематике, каждая 3000 знаков.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">TaskHub</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Найти исполнителя
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Найти заказы
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Как это работает
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => onLogin('jobseeker')} className="text-gray-700">
                Войти
              </Button>
              <Button onClick={() => onLogin('employer')} className="bg-primary hover:bg-primary/90">
                Разместить задание
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 via-white to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 text-gray-900">
              Найдём исполнителя для любой задачи
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              500 000+ специалистов готовы помочь с вашим проектом
            </p>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    placeholder="Что нужно сделать? Например: Создать сайт"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base border-gray-200 focus:border-primary"
                  />
                </div>
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90">
                  Найти
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500">Популярные:</span>
                {['Создать сайт', 'Дизайн логотипа', 'Написать текст', 'Настроить рекламу'].map((tag) => (
                  <button
                    key={tag}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="p-5 hover:shadow-lg transition-all cursor-pointer group border-gray-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon name={category.icon as any} size={28} />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900">{category.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Актуальные задания
              </h3>
              <p className="text-gray-600">
                Новые заказы от клиентов каждый день
              </p>
            </div>
            <Button variant="outline" className="border-gray-300">
              Все задания
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {tasks.map((task) => (
              <Card key={task.id} className="p-6 hover:shadow-lg transition-all cursor-pointer border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {task.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{task.timeAgo}</span>
                </div>
                
                <h4 className="text-xl font-bold mb-2 text-gray-900 hover:text-primary transition-colors">
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-lg text-primary">
                      {task.budget}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Icon name="MessageSquare" size={16} />
                      {task.responses} откликов
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Откликнуться
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Как это работает
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-2 border-primary/20">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Для заказчиков</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-gray-900">Опишите задачу</h5>
                      <p className="text-sm text-gray-600">Расскажите, что нужно сделать и какой у вас бюджет</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-gray-900">Получите отклики</h5>
                      <p className="text-sm text-gray-600">Исполнители откликнутся на ваше задание</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-gray-900">Выберите лучшего</h5>
                      <p className="text-sm text-gray-600">Сравните предложения и выберите специалиста</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90" onClick={() => onLogin('employer')}>
                  Разместить задание
                </Button>
              </Card>

              <Card className="p-8 border-2 border-accent/20">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                  <Icon name="Briefcase" size={24} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Для исполнителей</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 text-accent font-bold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-gray-900">Найдите задание</h5>
                      <p className="text-sm text-gray-600">Выберите заказ, который вам подходит</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 text-accent font-bold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-gray-900">Откликнитесь</h5>
                      <p className="text-sm text-gray-600">Предложите свои условия и цену</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 text-accent font-bold">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-gray-900">Выполните работу</h5>
                      <p className="text-sm text-gray-600">Сделайте качественно и получите оплату</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-accent hover:bg-accent/90" onClick={() => onLogin('jobseeker')}>
                  Найти заказы
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Готовы начать?</h3>
          <p className="text-xl mb-8 text-white/90">
            Присоединяйтесь к тысячам заказчиков и исполнителей
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => onLogin('employer')}
            >
              Разместить задание
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => onLogin('jobseeker')}
            >
              Стать исполнителем
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-lg">TaskHub</h3>
              </div>
              <p className="text-sm text-gray-600">
                Биржа фриланса для всех видов услуг
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Заказчикам</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Разместить задание</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Найти исполнителя</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Как это работает</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Исполнителям</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Найти заказы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Создать профиль</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Правила работы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            © 2024 TaskHub. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
