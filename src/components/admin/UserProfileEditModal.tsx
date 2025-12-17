import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/types';
import { useState, useEffect } from 'react';

interface UserProfileEditModalProps {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, userData: Partial<User>) => void;
}

export default function UserProfileEditModal({ 
  show, 
  user, 
  onClose, 
  onSave 
}: UserProfileEditModalProps) {
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (show && user) {
      setEditedUser(user);
    }
  }, [show, user]);

  const handleSave = () => {
    if (editedUser && user) {
      onSave(user.id, {
        name: editedUser.name,
        email: editedUser.email,
        position: editedUser.position,
        department: editedUser.department,
        phone: editedUser.phone,
      });
      onClose();
    }
  };

  if (!show || !editedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold">Редактировать профиль</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ФИО *
            </label>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Должность
            </label>
            <input
              type="text"
              value={editedUser.position || ''}
              onChange={(e) => setEditedUser({ ...editedUser, position: e.target.value })}
              placeholder="Например: Менеджер по продажам"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Отдел
            </label>
            <input
              type="text"
              value={editedUser.department || ''}
              onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })}
              placeholder="Например: Отдел продаж"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={editedUser.phone || ''}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Icon name="Check" className="mr-2" size={16} />
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
