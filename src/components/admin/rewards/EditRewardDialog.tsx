import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Reward } from '@/types';

interface EditRewardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reward: (Reward & { earnedCount: number }) | null;
  onUpdateReward: (rewardData: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
  }) => void;
}

export default function EditRewardDialog({ 
  isOpen, 
  onOpenChange, 
  reward, 
  onUpdateReward 
}: EditRewardDialogProps) {
  const [selectedIcon, setSelectedIcon] = useState('🏆');
  const [selectedColor, setSelectedColor] = useState('#F97316');
  const [editingReward, setEditingReward] = useState<(Reward & { earnedCount: number }) | null>(null);

  const icons = ['🏆', '🎯', '💎', '📊', '💰', '🚀', '⭐', '🎓', '👑', '🔥', '💪', '🌟'];
  const colors = [
    { name: 'Оранжевый', value: '#F97316' },
    { name: 'Синий', value: '#3B82F6' },
    { name: 'Зеленый', value: '#10B981' },
    { name: 'Фиолетовый', value: '#8B5CF6' },
    { name: 'Розовый', value: '#EC4899' },
    { name: 'Желтый', value: '#FBBF24' },
  ];

  useEffect(() => {
    if (reward) {
      setEditingReward(reward);
      setSelectedIcon(reward.icon);
      setSelectedColor(reward.color);
    }
  }, [reward]);

  const handleUpdate = () => {
    if (!editingReward) return;
    
    onUpdateReward({
      id: editingReward.id,
      name: editingReward.name,
      description: editingReward.description || null,
      icon: selectedIcon,
      color: selectedColor,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать награду</DialogTitle>
          <DialogDescription>
            Измените параметры награды
          </DialogDescription>
        </DialogHeader>
        {editingReward && (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-reward-name">Название награды</Label>
              <Input
                id="edit-reward-name"
                className="mt-1"
                value={editingReward.name}
                onChange={(e) => setEditingReward({ ...editingReward, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-reward-description">Описание</Label>
              <Textarea
                id="edit-reward-description"
                className="mt-1"
                value={editingReward.description || ''}
                onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Выберите иконку</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`aspect-square text-4xl rounded-lg border-2 transition-all ${
                      selectedIcon === icon
                        ? 'border-orange-500 bg-orange-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Выберите цвет</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value + '20' }}
                  >
                    <div
                      className="w-full h-6 rounded"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="text-xs font-medium text-gray-700 mt-1">{color.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <Label className="mb-2 block text-sm">Предпросмотр</Label>
              <div className="flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl border-4"
                  style={{
                    backgroundColor: selectedColor + '20',
                    borderColor: selectedColor,
                  }}
                >
                  {selectedIcon}
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={handleUpdate}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}