import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { mockProgress, mockRewards, mockCourses } from '@/data/mockData';

export default function StudentProfile() {
  const { user } = useAuth();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const userId = '2';
  const userProgress = mockProgress.filter(p => p.userId === userId);
  const earnedRewards = userProgress.flatMap(p => p.earnedRewards);
  
  const totalLessons = userProgress.reduce((sum, p) => sum + p.totalLessons, 0);
  const completedLessons = userProgress.reduce((sum, p) => sum + p.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const averageScore = userProgress
    .filter(p => p.testScore)
    .reduce((sum, p, _, arr) => sum + (p.testScore || 0) / arr.length, 0);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setIsEditingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Мой профиль</h1>
        <p className="text-gray-600">Ваши достижения, прогресс и награды</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md sticky top-20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold">
                      {user?.name.split(' ').map(n => n[0]).join('') || 'ИП'}
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditingAvatar(true)}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="Camera" className="text-white" size={24} />
                  </button>
                </div>
                
                {isEditingAvatar && (
                  <div className="w-full mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer text-sm text-orange-600 hover:text-orange-700 underline"
                    >
                      Выберите файл
                    </label>
                    <button
                      onClick={() => setIsEditingAvatar(false)}
                      className="ml-3 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Отмена
                    </button>
                  </div>
                )}
                
                <h3 className="font-bold text-xl text-gray-900 mb-1">{user?.name || 'Иван Петров'}</h3>
                <p className="text-sm text-gray-600 mb-2">{user?.email || 'student@company.com'}</p>
                <Badge className="mb-4">Обучающийся</Badge>
                <div className="w-full pt-4 border-t border-gray-200 space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Участник с</div>
                    <div className="text-sm font-semibold text-gray-900">Февраль 2024</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Должность</div>
                    <div className="text-sm font-medium text-gray-900">Менеджер по продажам</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Отдел</div>
                    <div className="text-sm font-medium text-gray-900">Отдел продаж</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <Icon name="BarChart3" size={16} />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="progress" className="gap-2">
                <Icon name="TrendingUp" size={16} />
                Прогресс
              </TabsTrigger>
              <TabsTrigger value="rewards" className="gap-2">
                <Icon name="Award" size={16} />
                Награды
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon name="BookOpen" className="text-orange-600" size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{userProgress.length}</div>
                        <div className="text-xs text-gray-600">Курсов начато</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="CheckCircle" className="text-green-600" size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {userProgress.filter(p => p.completed).length}
                        </div>
                        <div className="text-xs text-gray-600">Завершено</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="Award" className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{earnedRewards.length}</div>
                        <div className="text-xs text-gray-600">Наград</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="Target" className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}%</div>
                        <div className="text-xs text-gray-600">Средний балл</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="TrendingUp" size={20} />
                    Общий прогресс обучения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Завершено уроков</span>
                      <span className="text-sm font-bold text-gray-900">
                        {completedLessons} из {totalLessons}
                      </span>
                    </div>
                    <Progress value={overallProgress} className="h-3" />
                    <p className="text-xs text-gray-500">{Math.round(overallProgress)}% от всех уроков</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="Award" size={20} />
                    Последние награды
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {mockRewards.filter(r => earnedRewards.includes(r.id)).slice(0, 6).map((reward) => (
                      <div 
                        key={reward.id} 
                        className="aspect-square bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center text-4xl border-2 border-orange-200"
                      >
                        {reward.icon}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-5">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BookOpen" size={20} />
                    Детальный прогресс по курсам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProgress.map((progress) => {
                      const course = mockCourses.find(c => c.id === progress.courseId);
                      if (!course) return null;

                      const progressPercent = (progress.completedLessons / progress.totalLessons) * 100;

                      return (
                        <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base text-gray-900 mb-1">{course.title}</h4>
                              <p className="text-xs text-gray-600 mb-2">{course.category}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Icon name="BookOpen" size={12} />
                                  {progress.completedLessons}/{progress.totalLessons} ур.
                                </span>
                                {progress.testScore && (
                                  <span className="flex items-center gap-1">
                                    <Icon name="Target" size={12} />
                                    {progress.testScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                            {progress.completed && (
                              <div className="flex items-center gap-2 text-green-600">
                                <Icon name="CheckCircle" size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-gray-600">Прогресс курса</span>
                              <span className="font-semibold text-gray-900">{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Icon name="Award" size={28} />
                      <div className="text-3xl font-bold">{earnedRewards.length}</div>
                    </div>
                    <div className="text-sm opacity-90">Наград получено</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Icon name="Trophy" size={28} />
                      <div className="text-3xl font-bold">{userProgress.filter(p => p.completed).length}</div>
                    </div>
                    <div className="text-sm opacity-90">Курсов завершено</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Icon name="Star" size={28} />
                      <div className="text-3xl font-bold">{mockRewards.length - earnedRewards.length}</div>
                    </div>
                    <div className="text-sm opacity-90">Осталось получить</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Полученные награды</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockRewards.filter(reward => earnedRewards.includes(reward.id)).map((reward) => {
                      const course = mockCourses.find(c => c.id === reward.courseId);
                      const progress = userProgress.find(p => p.courseId === reward.courseId);
                      
                      return (
                        <Card
                          key={reward.id}
                          className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                          style={{ borderTop: `3px solid ${reward.color}` }}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-5xl mb-3">{reward.icon}</div>
                            <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">{reward.name}</h3>
                            <Badge variant="outline" className="mb-2 text-xs">{course?.title}</Badge>
                            {progress?.testScore && (
                              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                                <Icon name="Target" size={12} />
                                <span>{progress.testScore}%</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Доступные награды</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockRewards.filter(reward => !earnedRewards.includes(reward.id)).map((reward) => {
                      const course = mockCourses.find(c => c.id === reward.courseId);
                      
                      return (
                        <Card
                          key={reward.id}
                          className="border-0 shadow-sm opacity-50 hover:opacity-70 transition-opacity"
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-5xl mb-3 grayscale">{reward.icon}</div>
                            <h3 className="font-bold text-sm text-gray-700 mb-2 line-clamp-2">{reward.name}</h3>
                            <Badge variant="secondary" className="text-xs">{course?.title}</Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudentLayout>
  );
}
