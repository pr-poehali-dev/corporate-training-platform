import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { mockRewards, mockProgress, mockCourses } from '@/data/mockData';

export default function StudentRewards() {
  const userId = '2';
  const userProgress = mockProgress.filter(p => p.userId === userId);
  const earnedRewards = userProgress.flatMap(p => p.earnedRewards);

  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои награды</h1>
        <p className="text-gray-600">Коллекция достижений за пройденные курсы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-amber-500 text-white">
          <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Award" size={32} />
                <div className="text-4xl font-bold">{earnedRewards.length}</div>
              </div>
              <div className="text-sm opacity-90">Наград получено</div>
            </CardContent>
          </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Trophy" size={32} />
                <div className="text-4xl font-bold">{userProgress.filter(p => p.completed).length}</div>
              </div>
              <div className="text-sm opacity-90">Курсов завершено</div>
            </CardContent>
          </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Star" size={32} />
                <div className="text-4xl font-bold">{mockRewards.length - earnedRewards.length}</div>
              </div>
              <div className="text-sm opacity-90">Осталось получить</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Полученные награды</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockRewards.filter(reward => earnedRewards.includes(reward.id)).map((reward) => {
              const course = mockCourses.find(c => c.id === reward.courseId);
              const progress = userProgress.find(p => p.courseId === reward.courseId);
              
              return (
                <Card
                  key={reward.id}
                  className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden"
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
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Доступные награды</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockRewards.filter(reward => !earnedRewards.includes(reward.id)).map((reward) => {
              const course = mockCourses.find(c => c.id === reward.courseId);
              
              return (
                <Card
                  key={reward.id}
                  className="border-0 shadow-md opacity-50 hover:opacity-70 transition-opacity"
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
      </div>
    </StudentLayout>
  );
}