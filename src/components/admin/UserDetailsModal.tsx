import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User, CourseAssignment } from '@/types';
import { useState } from 'react';
import UserProfileSection from './UserProfileSection';
import UserAccessManagement from './UserAccessManagement';
import UserCoursesManagement from './UserCoursesManagement';
import UserProfileEditModal from './UserProfileEditModal';

interface UserDetailsModalProps {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onEditRole: (userId: string, newRole: 'admin' | 'student') => void;
  onEditPassword: (userId: string, newPassword: string) => void;
  onEditUser: (userId: string, userData: Partial<User>) => void;
  userProgress: { total: number; completed: number };
  onAssignCourse?: (userId: string, courseId: string) => void;
  onRemoveAssignment?: (assignmentId: string) => void;
  assignments: CourseAssignment[];
}

export default function UserDetailsModal({
  show,
  user,
  onClose,
  onEditRole,
  onEditPassword,
  onEditUser,
  userProgress,
  onAssignCourse,
  onRemoveAssignment,
  assignments,
}: UserDetailsModalProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (userId: string, userData: Partial<User>) => {
    onEditUser(userId, userData);
    setIsEditingProfile(false);
  };

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="text-xl font-bold">Детали пользователя</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <UserProfileSection 
            user={user} 
            userProgress={userProgress} 
            onEditProfile={handleEditProfile} 
          />

          <UserAccessManagement 
            user={user} 
            onEditRole={onEditRole} 
            onEditPassword={onEditPassword} 
          />

          <UserCoursesManagement 
            user={user} 
            assignments={assignments} 
            onAssignCourse={onAssignCourse} 
            onRemoveAssignment={onRemoveAssignment} 
          />
        </div>
      </div>

      <UserProfileEditModal 
        show={isEditingProfile} 
        user={user} 
        onClose={() => setIsEditingProfile(false)} 
        onSave={handleSaveProfile} 
      />
    </div>
  );
}
