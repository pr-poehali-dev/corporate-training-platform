import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Course } from '@/types';

interface CreateRewardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onCreateReward: (rewardData: {
    name: string;
    courseId: string;
    description: string;
    icon: string;
    color: string;
  }) => void;
}

export default function CreateRewardDialog({ 
  isOpen, 
  onOpenChange, 
  courses, 
  onCreateReward 
}: CreateRewardDialogProps) {
  const [selectedIcon, setSelectedIcon] = useState('🏆');
  const [selectedColor, setSelectedColor] = useState('#F97316');
  const [newReward, setNewReward] = useState({
    name: '',
    courseId: '',
    description: '',
  });

  const icons = ['🏆', '🎯', '💎', '📊', '💰', '🚀', '⭐', '🎓', '👑', '🔥', '💪', '🌟'];
  const colors = [
    { name: 'Оранжевый', value: '#F97316' },
    { name: 'Синий', value: '#3B82F6' },
    { name: 'Зеленый', value: '#10B981' },
    { name: 'Фиолетовый', value: '#8B5CF6' },
    { name: 'Розовый', value: '#EC4899' },
    { name: 'Желтый', value: '#FBBF24' },
  ];

  const handleCreate = () => {
    if (!newReward.name || !newReward.courseId) return;
    
    onCreateReward({
      ...newReward,
      icon: selectedIcon,
      color: selectedColor,
    });

    setNewReward({ name: '', courseId: '', description: '' });
    setSelectedIcon('🏆');
    setSelectedColor('#F97316');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
          <Icon name="Plus" className="mr-2" size={18} />
          Создать награду
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать новую награду</DialogTitle>
          <DialogDescription>
            Добавьте новую награду за прохождение курса
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="reward-name">Название награды</Label>
            <Input
              id="reward-name"
              placeholder="Например: Эксперт по маркетингу"
              className="mt-1"
              value={newReward.name}
              onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Курс</Label>
            <Select value={newReward.courseId} onValueChange={(value) => setNewReward({ ...newReward, courseId: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите курс" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reward-description">Описание (опционально)</Label>
            <Textarea
              id="reward-description"
              placeholder="Краткое описание награды"
              className="mt-1"
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
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
            <div className="grid grid-cols-3 gap-3 mt-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-gray-900 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value + '20' }}
                >
                  <div
                    className="w-full h-8 rounded"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="text-sm font-medium text-gray-700 mt-2">{color.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <Label className="mb-3 block">Предпросмотр</Label>
            <div className="flex items-center justify-center">
              <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center text-6xl border-4"
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={handleCreate}
            disabled={!newReward.name || !newReward.courseId}
          >
            Создать награду
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
