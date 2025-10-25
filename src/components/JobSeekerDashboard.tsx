import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface JobSeekerDashboardProps {
  onLogout: () => void;
  user: User | null;
}

interface Task {
  id: number;
  title: string;
  description: string;
  budget: string;
  category_name: string;
  employer_name: string;
  responses_count: number;
  created_at: string;
}

const JobSeekerDashboard = ({ onLogout, user }: JobSeekerDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myResponses, setMyResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
    if (user) {
      loadMyResponses();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/bfafe6b0-192e-4071-8f38-b494ac72ffa1');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyResponses = async () => {
    if (!user) return;
    try {
      const response = await fetch(`https://functions.poehali.dev/8f6102e9-3bb2-4be1-b237-39873fb8c467?jobseeker_id=${user.id}`);
      const data = await response.json();
      setMyResponses(data);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const handleApply = async (taskId: number) => {
    if (!user) {
      toast({ title: 'Ошибка', description: 'Необходимо войти в систему' });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/8f6102e9-3bb2-4be1-b237-39873fb8c467', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          jobseeker_id: user.id,
          message: responseMessage || 'Готов выполнить задание качественно и в срок!',
          proposed_budget: proposedBudget
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно!', description: 'Ваш отклик отправлен' });
        setResponseMessage('');
        setProposedBudget('');
        loadMyResponses();
        loadTasks();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отправить отклик' });
    }
  };

  const skills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'];

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
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              Заказы
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              Мои отклики
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-primary text-white">
                {user?.name.substring(0, 2).toUpperCase() || 'ИП'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                    {user?.name.substring(0, 2).toUpperCase() || 'ИП'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">{user?.name || 'Исполнитель'}</h2>
                <p className="text-sm text-gray-600 mb-4">{user?.description || 'Специалист'}</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-lg">{myResponses.length}</div>
                    <div className="text-gray-500">Откликов</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div>
                    <div className="font-semibold text-lg">
                      {myResponses.filter(r => r.status === 'accepted').length}
                    </div>
                    <div className="text-gray-500">Принято</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Icon name="Upload" size={18} className="mr-2" />
                  Загрузить резюме
                </Button>
                <Button variant="outline" className="w-full">
                  <Icon name="Edit" size={18} className="mr-2" />
                  Редактировать профиль
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Icon name="Award" size={20} className="text-primary" />
                Мои навыки
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-gray-100">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4">
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить навык
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
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
                <Button variant="outline">
                  <Icon name="SlidersHorizontal" size={18} className="mr-2" />
                  Фильтры
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="all">Все заказы ({tasks.length})</TabsTrigger>
                <TabsTrigger value="my">Мои отклики ({myResponses.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : (
                  tasks
                    .filter(task => 
                      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      task.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((task) => (
                      <Card key={task.id} className="p-6 hover:shadow-lg transition-all border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {task.employer_name?.[0] || 'K'}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                                <p className="text-sm text-gray-600">{task.employer_name}</p>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {task.category_name}
                          </Badge>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{task.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="font-bold text-lg text-primary">
                              {task.budget}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Icon name="MessageSquare" size={16} />
                              {task.responses_count} откликов
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Icon name="Send" size={16} className="mr-2" />
                                Откликнуться
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Отклик на задание</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <h4 className="font-semibold mb-2">{task.title}</h4>
                                  <p className="text-sm text-gray-600">{task.description}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">
                                    Ваше сообщение
                                  </label>
                                  <Textarea
                                    placeholder="Расскажите, почему вы подходите для этого задания..."
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                    rows={4}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">
                                    Ваша цена (необязательно)
                                  </label>
                                  <Input
                                    placeholder="Например: 20 000 ₽"
                                    value={proposedBudget}
                                    onChange={(e) => setProposedBudget(e.target.value)}
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleApply(task.id)}
                                  className="w-full bg-primary hover:bg-primary/90"
                                >
                                  Отправить отклик
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    ))
                )}
              </TabsContent>

              <TabsContent value="my" className="space-y-4">
                {myResponses.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">У вас пока нет откликов</p>
                  </Card>
                ) : (
                  myResponses.map((response) => (
                    <Card key={response.id} className="p-6 border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{response.task_title}</h3>
                          <p className="text-sm text-gray-600">Бюджет: {response.task_budget}</p>
                        </div>
                        <Badge 
                          variant={response.status === 'accepted' ? 'default' : 'secondary'}
                          className={response.status === 'accepted' ? 'bg-green-500' : ''}
                        >
                          {response.status === 'pending' ? 'На рассмотрении' : 
                           response.status === 'accepted' ? 'Принят' : 'Отклонен'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{response.message}</p>
                      {response.proposed_budget && (
                        <div className="text-sm text-gray-600">
                          Ваша цена: <span className="font-semibold">{response.proposed_budget}</span>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
