import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/types';
import { useState } from 'react';

interface UserAccessManagementProps {
  user: User;
  onEditRole: (userId: string, newRole: 'admin' | 'student') => void;
  onEditPassword: (userId: string, newPassword: string) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
}

export default function UserAccessManagement({ 
  user, 
  onEditRole, 
  onEditPassword,
  onToggleActive
}: UserAccessManagementProps) {
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
  };

  const handlePasswordSave = () => {
    if (newPassword.length >= 8) {
      onEditPassword(user.id, newPassword);
      setNewPassword('');
      setShowPasswordEdit(false);
    }
  };

  return (
    <div className="border-t pt-6">
      <h5 className="font-bold mb-4">Управление доступом</h5>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">Роль пользователя</div>
            <div className="text-sm text-gray-500">
              Изменить права доступа в системе
            </div>
          </div>
          <select
            value={user.role}
            onChange={(e) => onEditRole(user.id, e.target.value as 'admin' | 'student')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="student">Обучающийся</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">Пароль</div>
              <div className="text-sm text-gray-500">
                Изменить пароль пользователя
              </div>
            </div>
            {!showPasswordEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordEdit(true)}
              >
                <Icon name="Key" className="mr-2" size={14} />
                Изменить
              </Button>
            )}
          </div>

          {showPasswordEdit && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                >
                  <Icon name="RefreshCw" size={14} />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handlePasswordSave}
                  disabled={newPassword.length < 8}
                >
                  <Icon name="Check" className="mr-2" size={14} />
                  Сохранить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPasswordEdit(false);
                    setNewPassword('');
                  }}
                >
                  Отмена
                </Button>
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-xs text-red-600">
                  Минимум 8 символов
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">Статус учетной записи</div>
            <div className="text-sm text-gray-500">
              {user.isActive !== false ? 'Пользователь может войти в систему' : 'Пользователь не может войти в систему'}
            </div>
          </div>
          <Button
            variant={user.isActive !== false ? 'outline' : 'default'}
            size="sm"
            onClick={() => onToggleActive(user.id, user.isActive === false)}
          >
            <Icon name={user.isActive !== false ? 'UserX' : 'UserCheck'} className="mr-2" size={14} />
            {user.isActive !== false ? 'Отключить' : 'Включить'}
          </Button>
        </div>
      </div>
    </div>
  );
}