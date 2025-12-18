import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Reward, Course } from '@/types';

interface RewardCardProps {
  reward: Reward & { earnedCount: number };
  course?: Course;
  onEdit: (reward: Reward & { earnedCount: number }) => void;
  onDelete: (rewardId: string) => void;
}

export default function RewardCard({ reward, course, onEdit, onDelete }: RewardCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-4"
            style={{
              backgroundColor: reward.color + '20',
              borderColor: reward.color,
            }}
          >
            {reward.icon}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(reward)}
            >
              <Icon name="Edit" size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(reward.id)}
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.name}</h3>
        
        {reward.description && (
          <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="BookOpen" size={14} />
            <span>{course?.title || 'Курс не найден'}</span>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-gray-900">
                {reward.earnedCount} студентов
              </span>
            </div>
            <Badge className="bg-orange-100 text-orange-700">
              За курс
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
