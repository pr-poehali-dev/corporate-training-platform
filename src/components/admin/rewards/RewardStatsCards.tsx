import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RewardStatsCardsProps {
  totalRewards: number;
  totalEarned: number;
  totalCourses: number;
}

export default function RewardStatsCards({ totalRewards, totalEarned, totalCourses }: RewardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Icon name="Award" className="text-orange-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalRewards}</div>
              <div className="text-sm text-gray-600">Всего наград</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Icon name="Users" className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalEarned}</div>
              <div className="text-sm text-gray-600">Получено студентами</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Icon name="BookOpen" className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalCourses}</div>
              <div className="text-sm text-gray-600">Курсов с наградами</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
