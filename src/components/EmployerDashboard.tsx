import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface EmployerDashboardProps {
  onLogout: () => void;
  user: User | null;
}

const EmployerDashboard = ({ onLogout, user }: EmployerDashboardProps) => {
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    budget: '',
    category_id: '',
    location: ''
  });

  useEffect(() => {
    loadMyTasks();
  }, [user]);

  const loadMyTasks = async () => {
    if (!user) return;
    try {
      const response = await fetch('https://functions.poehali.dev/bfafe6b0-192e-4071-8f38-b494ac72ffa1');
      const data = await response.json();
      const myTasksList = data.filter((t: any) => t.employer_id === user.id);
      setMyTasks(myTasksList);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (taskId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/8f6102e9-3bb2-4be1-b237-39873fb8c467?task_id=${taskId}`);
      const data = await response.json();
      setResponses(data);
      setSelectedTaskId(taskId);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!user || !newTask.title || !newTask.description || !newTask.budget) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля' });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/bfafe6b0-192e-4071-8f38-b494ac72ffa1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          employer_id: user.id,
          category_id: parseInt(newTask.category_id) || 1
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно!', description: 'Задание создано' });
        setNewTask({ title: '', description: '', budget: '', category_id: '', location: '' });
        setIsDialogOpen(false);
        loadMyTasks();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать задание' });
    }
  };

  const handleAcceptResponse = async (responseId: number) => {
    try {
      await fetch('https://functions.poehali.dev/8f6102e9-3bb2-4be1-b237-39873fb8c467', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: responseId, status: 'accepted' })
      });
      
      toast({ title: 'Успешно!', description: 'Отклик принят' });
      if (selectedTaskId) loadResponses(selectedTaskId);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось принять отклик' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TaskHub</h1>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-accent text-white">
                {user?.name.substring(0, 2).toUpperCase() || 'TC'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Активные задания</h3>
              <Icon name="Briefcase" size={18} className="text-primary" />
            </div>
            <div className="text-3xl font-bold">{myTasks.filter(t => t.status === 'active').length}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Всего откликов</h3>
              <Icon name="Users" size={18} className="text-accent" />
            </div>
            <div className="text-3xl font-bold">{myTasks.reduce((sum, t) => sum + t.responses_count, 0)}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Всего заданий</h3>
              <Icon name="FileText" size={18} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">{myTasks.length}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Завершено</h3>
              <Icon name="CheckCircle2" size={18} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold">{myTasks.filter(t => t.status === 'completed').length}</div>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Управление заданиями</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать задание
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новое задание</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Название задания *</Label>
                  <Input 
                    id="title"
                    placeholder="Например: Разработать сайт-визитку"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Описание *</Label>
                  <Textarea 
                    id="description"
                    placeholder="Подробно опишите задание..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Бюджет *</Label>
                    <Input 
                      id="budget"
                      placeholder="25 000 ₽"
                      value={newTask.budget}
                      onChange={(e) => setNewTask({...newTask, budget: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Select 
                      value={newTask.category_id}
                      onValueChange={(value) => setNewTask({...newTask, category_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Разработка сайтов</SelectItem>
                        <SelectItem value="2">Мобильные приложения</SelectItem>
                        <SelectItem value="3">Дизайн и графика</SelectItem>
                        <SelectItem value="4">Тексты и переводы</SelectItem>
                        <SelectItem value="5">SEO и маркетинг</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Локация</Label>
                  <Input 
                    id="location"
                    placeholder="Москва"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreateTask} className="bg-primary hover:bg-primary/90">
                    Создать задание
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tasks">Мои задания ({myTasks.length})</TabsTrigger>
            <TabsTrigger value="responses">
              Отклики {selectedTaskId && `(${responses.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Загрузка...</div>
            ) : myTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">У вас пока нет заданий</p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                  Создать первое задание
                </Button>
              </Card>
            ) : (
              myTasks.map((task) => (
                <Card key={task.id} className="p-6 hover:shadow-lg transition-all border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">{task.title}</h3>
                        <Badge className="bg-green-100 text-green-700">Активно</Badge>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <div><Icon name="DollarSign" size={16} className="inline mr-1" />{task.budget}</div>
                        <div><Icon name="MessageSquare" size={16} className="inline mr-1" />{task.responses_count} откликов</div>
                        <div><Icon name="Tag" size={16} className="inline mr-1" />{task.category_name}</div>
                      </div>

                      <Button 
                        size="sm" 
                        onClick={() => loadResponses(task.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Icon name="Users" size={16} className="mr-2" />
                        Смотреть отклики ({task.responses_count})
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            {!selectedTaskId ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Выберите задание, чтобы посмотреть отклики</p>
              </Card>
            ) : responses.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">На это задание пока нет откликов</p>
              </Card>
            ) : (
              responses.map((response) => (
                <Card key={response.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {response.jobseeker_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{response.jobseeker_name}</h3>
                        <p className="text-sm text-gray-600">{response.jobseeker_description}</p>
                      </div>
                    </div>
                    <Badge>{response.status === 'pending' ? 'Новый' : 'Принят'}</Badge>
                  </div>

                  <p className="text-gray-700 mb-4">{response.message}</p>

                  {response.proposed_budget && (
                    <div className="text-sm font-semibold text-primary mb-4">
                      Предлагаемая цена: {response.proposed_budget}
                    </div>
                  )}

                  {response.status === 'pending' && (
                    <Button 
                      onClick={() => handleAcceptResponse(response.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Принять
                    </Button>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerDashboard;
