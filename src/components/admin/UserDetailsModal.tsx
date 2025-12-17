import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User, CourseAssignment } from '@/types';
import { mockCourses, mockAssignments } from '@/data/mockData';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface UserDetailsModalProps {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onEditRole: (userId: string, newRole: 'admin' | 'student') => void;
  userProgress: { total: number; completed: number };
  onAssignCourse?: (userId: string, courseId: string) => void;
  onRemoveAssignment?: (assignmentId: string) => void;
}

export default function UserDetailsModal({
  show,
  user,
  onClose,
  onEditRole,
  userProgress,
  onAssignCourse,
  onRemoveAssignment,
}: UserDetailsModalProps) {
  const [selectedCourse, setSelectedCourse] = useState('');
  
  if (!show || !user) return null;

  const userAssignments = mockAssignments.filter(a => a.userId === user.id);
  const assignedCourseIds = userAssignments.map(a => a.courseId);
  const availableCourses = mockCourses.filter(c => !assignedCourseIds.includes(c.id));

  const handleAssign = () => {
    if (selectedCourse && onAssignCourse) {
      onAssignCourse(user.id, selectedCourse);
      setSelectedCourse('');
    }
  };

  const getStatusBadge = (status: CourseAssignment['status']) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Назначен</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">В процессе</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Завершен</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Просрочен</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="text-xl font-bold">Детали пользователя</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                  {user.role === 'admin' ? 'Администратор' : 'Обучающийся'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Дата регистрации</div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-gray-400" />
                  <span className="font-medium">{user.registrationDate}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Последняя активность</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{user.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Курсов в процессе</div>
                <div className="flex items-center gap-2">
                  <Icon name="BookOpen" size={16} className="text-gray-400" />
                  <span className="font-medium">{userProgress.total}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Курсов завершено</div>
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} className="text-green-500" />
                  <span className="font-medium">{userProgress.completed}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h5 className="font-bold mb-4">Управление ролями</h5>
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
            </div>
          </div>

          {user.role === 'student' && (
            <div className="border-t pt-6">
              <h5 className="font-bold mb-4 flex items-center gap-2">
                <Icon name="BookOpen" size={18} />
                Назначенные курсы
              </h5>
              
              <div className="space-y-3 mb-4">
                {userAssignments.length > 0 ? (
                  userAssignments.map((assignment) => {
                    const course = mockCourses.find(c => c.id === assignment.courseId);
                    return (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{course?.title}</span>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Назначен: {new Date(assignment.assignedAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                        {onRemoveAssignment && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Курсы не назначены</p>
                )}
              </div>

              {availableCourses.length > 0 && onAssignCourse && (
                <div className="border-t pt-4 mt-4">
                  <Label className="text-sm font-medium mb-2 block">Назначить новый курс</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите курс" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAssign} 
                      disabled={!selectedCourse}
                      size="sm"
                    >
                      <Icon name="Plus" size={16} className="mr-1" />
                      Назначить
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-6">
            <h5 className="font-bold mb-4 flex items-center gap-2">
              <Icon name="Activity" size={18} />
              Статистика
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Курсов назначено</span>
                <span className="font-medium">{userAssignments.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">В процессе</span>
                <span className="font-medium">{userAssignments.filter(a => a.status === 'in_progress').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Завершено</span>
                <span className="font-medium">{userAssignments.filter(a => a.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Процент завершения</span>
                <span className="font-medium">
                  {userAssignments.length > 0
                    ? Math.round((userAssignments.filter(a => a.status === 'completed').length / userAssignments.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
}