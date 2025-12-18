import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Reward, Course } from '@/types';

interface RewardCardProps {
  reward: Reward & { earnedCount: number };
  course?: Course;
  onEdit: (reward: Reward & { earnedCount: number }) => void;
  onDelete: (rewardId: string) => void;
}

export default function RewardCard({ reward, course, onEdit, onDelete }: RewardCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(reward.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
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
                onClick={() => setIsDeleteDialogOpen(true)}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" className="text-red-600" size={24} />
              </div>
              <DialogTitle>Удалить награду?</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              Вы действительно хотите удалить награду <span className="font-semibold text-gray-900">"{reward.name}"</span>?
              <br /><br />
              Это действие нельзя отменить. Награда будет удалена у всех студентов.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Icon name="Trash2" className="mr-2" size={16} />
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
