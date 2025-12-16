import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon name="Settings" size={24} />
            Настройки
          </DialogTitle>
          <DialogDescription>
            Управляйте своей учетной записью и безопасностью
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="User" size={18} />
              Личная информация
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="Lock" size={18} />
              Безопасность
            </h3>
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
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              <Icon name="Save" className="mr-2" size={16} />
              Сохранить изменения
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
