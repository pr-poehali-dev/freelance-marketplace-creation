import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface AdminDashboardProps {
  onLogout: () => void;
  user: User | null;
}

const AdminDashboard = ({ onLogout, user }: AdminDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    totalResponses: 0,
    totalCompanies: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/bfafe6b0-192e-4071-8f38-b494ac72ffa1');
      const tasksData = await response.json();
      setTasks(tasksData);
      
      setStats({
        totalUsers: 3,
        activeTasks: tasksData.filter((t: any) => t.status === 'active').length,
        totalResponses: tasksData.reduce((sum: number, t: any) => sum + t.responses_count, 0),
        totalCompanies: 1
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const categories = [
    { id: 1, name: 'Разработка сайтов', jobCount: tasks.filter(t => t.category_id === 1).length, active: true },
    { id: 2, name: 'Дизайн и графика', jobCount: tasks.filter(t => t.category_id === 3).length, active: true },
    { id: 3, name: 'SEO и маркетинг', jobCount: tasks.filter(t => t.category_id === 5).length, active: true },
    { id: 4, name: 'Тексты и переводы', jobCount: tasks.filter(t => t.category_id === 4).length, active: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-3">
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
          <p className="text-gray-600">Управление платформой TaskHub</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Пользователи</h3>
              <Icon name="Users" size={18} className="text-primary" />
            </div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Активные задания</h3>
              <Icon name="Briefcase" size={18} className="text-accent" />
            </div>
            <div className="text-3xl font-bold">{stats.activeTasks}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Откликов</h3>
              <Icon name="Send" size={18} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">{stats.totalResponses}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Компаний</h3>
              <Icon name="Building2" size={18} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold">{stats.totalCompanies}</div>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks">
              <Icon name="Briefcase" size={16} className="mr-2" />
              Задания
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

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <Input
                  placeholder="Поиск заданий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Задание</TableHead>
                    <TableHead>Заказчик</TableHead>
                    <TableHead>Бюджет</TableHead>
                    <TableHead>Откликов</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks
                    .filter(task => 
                      task.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.employer_name}</TableCell>
                        <TableCell>{task.budget}</TableCell>
                        <TableCell>{task.responses_count}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            {task.status === 'active' ? 'Активно' : task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(task.created_at).toLocaleDateString('ru-RU')}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Управление категориями</h3>
              <Button className="bg-primary hover:bg-primary/90">
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
                      <p className="text-sm text-gray-500">{category.jobCount} заданий</p>
                    </div>
                    <Switch checked={category.active} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="Edit" size={14} className="mr-1" />
                      Редактировать
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
                    <h4 className="font-medium">Модерация заданий</h4>
                    <p className="text-sm text-gray-500">
                      Требовать одобрение администратора для новых заданий
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className="font-medium">Автоматическое резервное копирование</h4>
                    <p className="text-sm text-gray-500">
                      Ежедневное создание резервных копий базы данных
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium">Email уведомления</h4>
                    <p className="text-sm text-gray-500">
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
                    <p className="text-sm text-gray-500">
                      Последняя копия: {new Date().toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Icon name="Database" size={16} className="mr-2" />
                    Создать резервную копию
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-medium mb-1">Статистика базы данных</h4>
                    <p className="text-sm text-gray-500">
                      Всего записей: {tasks.length + 3} | Активных заданий: {stats.activeTasks}
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
