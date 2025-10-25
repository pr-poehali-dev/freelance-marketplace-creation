import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'Иван Петров', email: 'ivan@example.com', role: 'Соискатель', status: 'Активен', joined: '2024-01-15' },
    { id: 2, name: 'TechCorp', email: 'hr@techcorp.com', role: 'Работодатель', status: 'Активен', joined: '2024-01-10' },
    { id: 3, name: 'Мария Сидорова', email: 'maria@example.com', role: 'Соискатель', status: 'Активен', joined: '2024-01-12' },
    { id: 4, name: 'StartupX', email: 'jobs@startupx.com', role: 'Работодатель', status: 'Неактивен', joined: '2024-01-08' },
  ];

  const jobs = [
    { id: 1, title: 'Senior Frontend разработчик', company: 'TechCorp', status: 'Активна', posted: '2024-01-10', applicants: 24 },
    { id: 2, name: 'Product Designer', company: 'StartupX', status: 'На модерации', posted: '2024-01-14', applicants: 0 },
    { id: 3, name: 'Backend Developer', company: 'DevCompany', status: 'Активна', posted: '2024-01-05', applicants: 18 },
  ];

  const categories = [
    { id: 1, name: 'Разработка', jobCount: 234, active: true },
    { id: 2, name: 'Дизайн', jobCount: 156, active: true },
    { id: 3, name: 'Маркетинг', jobCount: 189, active: true },
    { id: 4, name: 'Копирайтинг', jobCount: 98, active: false },
  ];

  const stats = [
    { label: 'Всего пользователей', value: 1248, icon: 'Users', color: 'text-primary' },
    { label: 'Активных вакансий', value: 456, icon: 'Briefcase', color: 'text-accent' },
    { label: 'Компаний', value: 89, icon: 'Building2', color: 'text-green-500' },
    { label: 'Откликов сегодня', value: 127, icon: 'Send', color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-secondary">Admin Panel</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Пользователи
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Вакансии
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Настройки
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-secondary text-white">AD</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Панель управления</h2>
          <p className="text-muted-foreground">Управление платформой FreelanceHub</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <Icon name={stat.icon as any} size={18} className={stat.color} />
              </div>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="users">
              <Icon name="Users" size={16} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Icon name="Briefcase" size={16} className="mr-2" />
              Вакансии
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Icon name="FolderTree" size={16} className="mr-2" />
              Категории
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Поиск пользователей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Icon name="Filter" size={16} className="mr-2" />
                  Фильтры
                </Button>
                <Button variant="outline">
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Активен' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.joined).toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Поиск вакансий..."
                  className="pl-10"
                />
              </div>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить вакансию
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Вакансия</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата публикации</TableHead>
                    <TableHead>Откликов</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title || job.name}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            job.status === 'Активна' ? 'default' : 
                            job.status === 'На модерации' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(job.posted).toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell>{job.applicants}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Управление категориями</h3>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить категорию
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.jobCount} вакансий</p>
                    </div>
                    <Switch checked={category.active} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="Edit" size={14} className="mr-1" />
                      Редактировать
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="Trash2" size={14} className="mr-1" />
                      Удалить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Системные настройки</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className="font-medium">Модерация вакансий</h4>
                    <p className="text-sm text-muted-foreground">
                      Требовать одобрение администратора для новых вакансий
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className="font-medium">Автоматическое резервное копирование</h4>
                    <p className="text-sm text-muted-foreground">
                      Ежедневное создание резервных копий базы данных
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className="font-medium">Email уведомления</h4>
                    <p className="text-sm text-muted-foreground">
                      Отправка уведомлений пользователям по email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">База данных</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Резервное копирование</h4>
                    <p className="text-sm text-muted-foreground">
                      Последняя копия: 25 октября 2024, 03:00
                    </p>
                  </div>
                  <Button>
                    <Icon name="Database" size={16} className="mr-2" />
                    Создать резервную копию
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-medium mb-1">Статистика базы данных</h4>
                    <p className="text-sm text-muted-foreground">
                      Размер: 245 MB | Записей: 15,234
                    </p>
                  </div>
                  <Button variant="outline">
                    <Icon name="BarChart3" size={16} className="mr-2" />
                    Просмотреть детали
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
