import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface EmployerDashboardProps {
  onLogout: () => void;
}

const EmployerDashboard = ({ onLogout }: EmployerDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const myJobs = [
    {
      id: 1,
      title: 'Senior Frontend разработчик',
      status: 'Активна',
      applicants: 24,
      posted: '2024-01-10',
      views: 156,
    },
    {
      id: 2,
      title: 'Product Designer',
      status: 'Активна',
      applicants: 18,
      posted: '2024-01-08',
      views: 98,
    },
    {
      id: 3,
      title: 'Backend Developer',
      status: 'На паузе',
      applicants: 12,
      posted: '2024-01-05',
      views: 67,
    },
  ];

  const candidates = [
    {
      id: 1,
      name: 'Иван Петров',
      position: 'Frontend разработчик',
      experience: '5 лет',
      skills: ['React', 'TypeScript', 'Node.js'],
      match: 95,
      appliedFor: 'Senior Frontend разработчик',
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      position: 'UI/UX Designer',
      experience: '3 года',
      skills: ['Figma', 'Prototyping', 'User Research'],
      match: 88,
      appliedFor: 'Product Designer',
    },
    {
      id: 3,
      name: 'Алексей Иванов',
      position: 'Full Stack Developer',
      experience: '4 года',
      skills: ['React', 'PostgreSQL', 'Python'],
      match: 82,
      appliedFor: 'Backend Developer',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Briefcase" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-secondary">FreelanceHub</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Мои вакансии
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Кандидаты
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Поиск резюме
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-accent text-white">TC</AvatarFallback>
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
              <h3 className="text-sm font-medium text-muted-foreground">Активные вакансии</h3>
              <Icon name="Briefcase" size={18} className="text-primary" />
            </div>
            <div className="text-3xl font-bold">{myJobs.filter(j => j.status === 'Активна').length}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Всего откликов</h3>
              <Icon name="Users" size={18} className="text-accent" />
            </div>
            <div className="text-3xl font-bold">{myJobs.reduce((sum, job) => sum + job.applicants, 0)}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Просмотров</h3>
              <Icon name="Eye" size={18} className="text-primary" />
            </div>
            <div className="text-3xl font-bold">{myJobs.reduce((sum, job) => sum + job.views, 0)}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Приглашения</h3>
              <Icon name="Send" size={18} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold">8</div>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Управление вакансиями</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={18} className="mr-2" />
                Создать вакансию
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новая вакансия</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="jobTitle">Название должности</Label>
                  <Input id="jobTitle" placeholder="Senior Frontend разработчик" />
                </div>
                <div>
                  <Label htmlFor="jobDescription">Описание</Label>
                  <Textarea 
                    id="jobDescription" 
                    placeholder="Опишите требования и обязанности..." 
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary">Зарплата</Label>
                    <Input id="salary" placeholder="200 000 - 300 000 ₽" />
                  </div>
                  <div>
                    <Label htmlFor="location">Локация</Label>
                    <Input id="location" placeholder="Москва" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Требуемые навыки</Label>
                  <Input id="skills" placeholder="React, TypeScript, Node.js" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Отмена</Button>
                  <Button>Опубликовать вакансию</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="jobs">Мои вакансии ({myJobs.length})</TabsTrigger>
            <TabsTrigger value="candidates">Кандидаты ({candidates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {myJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <Badge variant={job.status === 'Активна' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Откликов</div>
                        <div className="text-2xl font-bold text-primary">{job.applicants}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Просмотров</div>
                        <div className="text-2xl font-bold">{job.views}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Опубликовано</div>
                        <div className="text-sm font-medium">
                          {new Date(job.posted).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Icon name="Users" size={16} className="mr-2" />
                        Смотреть кандидатов
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                      {job.status === 'Активна' && (
                        <Button variant="ghost" size="sm">
                          <Icon name="Pause" size={16} className="mr-2" />
                          Приостановить
                        </Button>
                      )}
                      {job.status === 'На паузе' && (
                        <Button variant="ghost" size="sm">
                          <Icon name="Play" size={16} className="mr-2" />
                          Активировать
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="candidates" className="space-y-4">
            <div className="mb-4">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  placeholder="Поиск кандидатов по имени, навыкам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {candidates.map((candidate) => (
              <Card key={candidate.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{candidate.position}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icon name="Briefcase" size={14} />
                          Опыт: {candidate.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="FileText" size={14} />
                          Откликнулся на: {candidate.appliedFor}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {candidate.match}% совпадение
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Навыки:</div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать резюме
                  </Button>
                  <Button variant="outline">
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Написать
                  </Button>
                  <Button variant="outline">
                    <Icon name="Mail" size={16} className="mr-2" />
                    Пригласить на интервью
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerDashboard;
