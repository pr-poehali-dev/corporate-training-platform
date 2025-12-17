import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User, CourseAssignment, Course } from '@/types';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';

interface UserCoursesManagementProps {
  user: User;
  assignments: CourseAssignment[];
  onAssignCourse?: (userId: string, courseId: string) => void;
  onRemoveAssignment?: (assignmentId: string) => void;
}

export default function UserCoursesManagement({ 
  user, 
  assignments, 
  onAssignCourse, 
  onRemoveAssignment 
}: UserCoursesManagementProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.COURSES, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const userAssignments = assignments;
  const assignedCourseIds = userAssignments.map(a => a.courseId);
  const completedCourseIds = userAssignments.filter(a => a.status === 'completed').map(a => a.courseId);

  const getCourseStatus = (course: Course) => {
    const isCompleted = completedCourseIds.includes(course.id);
    const assignment = userAssignments.find(a => a.courseId === course.id);
    
    if (isCompleted) {
      return { status: 'completed', label: 'Пройден', color: 'bg-green-500 text-white' };
    }
    
    if (assignment) {
      switch (assignment.status) {
        case 'assigned':
          return { status: 'assigned', label: 'Назначен', color: 'bg-blue-50 text-blue-700 border border-blue-200' };
        case 'in_progress':
          return { status: 'in_progress', label: 'В процессе', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' };
        case 'overdue':
          return { status: 'overdue', label: 'Просрочен', color: 'bg-red-50 text-red-700 border border-red-200' };
        default:
          return { status: 'assigned', label: 'Назначен', color: 'bg-blue-50 text-blue-700 border border-blue-200' };
      }
    }
    
    if (course.accessType === 'open') {
      return { status: 'available', label: 'Доступен', color: 'bg-gray-100 text-gray-700 border border-gray-200' };
    }
    
    return { status: 'not_assigned', label: 'Не назначен', color: 'bg-gray-50 text-gray-500 border border-gray-200' };
  };

  if (user.role !== 'student') return null;

  if (loading) {
    return (
      <div className="border-t pt-6">
        <div className="flex justify-center py-4">
          <Icon name="Loader2" className="animate-spin" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-6">
      <h5 className="font-bold mb-4 flex items-center gap-2">
        <Icon name="BookOpen" size={18} />
        Все курсы и доступ
      </h5>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Unlock" size={16} className="text-green-500" />
            <h6 className="font-semibold text-gray-700">Открытые курсы</h6>
          </div>
          <div className="space-y-2">
            {courses.filter(c => c.accessType === 'open').map((course) => {
              const courseStatus = getCourseStatus(course);
              
              return (
                <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {course.lessonsCount} уроков • {course.duration} мин
                      </div>
                    </div>
                    <Badge className={courseStatus.color}>
                      {courseStatus.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Lock" size={16} className="text-orange-500" />
            <h6 className="font-semibold text-gray-700">Закрытые курсы</h6>
          </div>
          <div className="space-y-2">
            {courses.filter(c => c.accessType === 'closed').map((course) => {
              const courseStatus = getCourseStatus(course);
              const assignment = userAssignments.find(a => a.courseId === course.id);
              const isAssigned = assignedCourseIds.includes(course.id);
              
              return (
                <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {course.lessonsCount} уроков • {course.duration} мин
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={courseStatus.color}>
                        {courseStatus.label}
                      </Badge>
                      {!isAssigned && onAssignCourse && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAssignCourse(user.id, course.id)}
                        >
                          <Icon name="Plus" size={14} className="mr-1" />
                          Назначить
                        </Button>
                      )}
                      {isAssigned && onRemoveAssignment && assignment && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveAssignment(assignment.id)}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}