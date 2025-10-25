import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface JobSeekerDashboardProps {
  onLogout: () => void;
}

const JobSeekerDashboard = ({ onLogout }: JobSeekerDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const appliedJobs = [
    {
      id: 1,
      title: 'Senior Frontend разработчик',
      company: 'TechCorp',
      status: 'На рассмотрении',
      appliedDate: '2024-01-15',
      salary: '200 000 - 300 000 ₽',
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupX',
      status: 'Приглашение на интервью',
      appliedDate: '2024-01-12',
      salary: '180 000 - 250 000 ₽',
    },
  ];

  const recommendedJobs = [
    {
      id: 3,
      title: 'TypeScript разработчик',
      company: 'DevCompany',
      location: 'Москва',
      salary: '220 000 - 280 000 ₽',
      match: 95,
      tags: ['React', 'TypeScript', 'Node.js'],
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'WebAgency',
      location: 'Удаленно',
      salary: '200 000 - 300 000 ₽',
      match: 88,
      tags: ['React', 'PostgreSQL', 'AWS'],
    },
  ];

  const skills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'];

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
              Вакансии
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Мои отклики
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Компании
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-primary text-white">ИП</AvatarFallback>
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
                    ИП
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">Иван Петров</h2>
                <p className="text-sm text-muted-foreground mb-4">Frontend разработчик</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-lg">12</div>
                    <div className="text-muted-foreground">Откликов</div>
                  </div>
                  <div className="w-px h-10 bg-border"></div>
                  <div>
                    <div className="font-semibold text-lg">3</div>
                    <div className="text-muted-foreground">Интервью</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full">
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
                  <Badge key={skill} variant="secondary">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  />
                  <Input
                    placeholder="Поиск вакансий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Icon name="SlidersHorizontal" size={18} className="mr-2" />
                  Фильтры
                </Button>
              </div>
            </div>

            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="recommended">Рекомендации</TabsTrigger>
                <TabsTrigger value="applied">Мои отклики ({appliedJobs.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="recommended" className="space-y-4">
                {recommendedJobs.map((job) => (
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">
                              {job.company[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {job.match}% совпадение
                      </Badge>
                    </div>

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

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Icon name="Send" size={16} className="mr-2" />
                        Откликнуться
                      </Button>
                      <Button variant="outline">
                        <Icon name="Bookmark" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="applied" className="space-y-4">
                {appliedJobs.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            Подано: {new Date(job.appliedDate).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Wallet" size={14} />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={job.status.includes('интервью') ? 'default' : 'secondary'}
                        className={job.status.includes('интервью') ? 'bg-green-500' : ''}
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Детали
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="MessageSquare" size={16} className="mr-2" />
                        Сообщения
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
