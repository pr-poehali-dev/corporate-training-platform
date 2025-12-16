import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { mockProgress, mockRewards } from '@/data/mockData';

export default function StudentProfile() {
  const { user } = useAuth();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const userId = '2';
  const userProgress = mockProgress.filter(p => p.userId === userId);
  const earnedRewards = userProgress.flatMap(p => p.earnedRewards);

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
        <p className="text-gray-600">Управляйте своей учетной записью и настройками</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Личная информация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" defaultValue="Иван" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="surname">Фамилия</Label>
                      <Input id="surname" defaultValue="Петров" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="student@company.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="position">Должность</Label>
                    <Input id="position" defaultValue="Менеджер по продажам" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="department">Отдел</Label>
                    <Input id="department" defaultValue="Отдел продаж" className="mt-1" />
                  </div>
                  <Button>
                    <Icon name="Save" className="mr-2" size={16} />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Lock" size={20} />
                  Безопасность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Текущий пароль</Label>
                    <Input id="current-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Новый пароль</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                    <Input id="confirm-password" type="password" className="mt-1" />
                  </div>
                  <Button variant="outline">
                    <Icon name="Key" className="mr-2" size={16} />
                    Изменить пароль
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>

        <div className="space-y-5">
            <Card>
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
                  <div className="w-full pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Участник с</div>
                    <div className="font-semibold text-gray-900">Февраль 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon name="Award" size={18} />
                  Мои достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {mockRewards.filter(r => earnedRewards.includes(r.id)).slice(0, 6).map((reward) => (
                    <div key={reward.id} className="aspect-square bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center text-3xl border-2 border-orange-200">
                      {reward.icon}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{earnedRewards.length}</div>
                  <div className="text-sm text-gray-600">Наград получено</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon name="BarChart3" size={18} />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Курсов начато</span>
                    <span className="font-semibold text-gray-900">{userProgress.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Завершено</span>
                    <span className="font-semibold text-gray-900">
                      {userProgress.filter(p => p.completed).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">В процессе</span>
                    <span className="font-semibold text-gray-900">
                      {userProgress.filter(p => !p.completed && p.completedLessons > 0).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </StudentLayout>
  );
}