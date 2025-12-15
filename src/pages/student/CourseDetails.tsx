import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '@/components/StudentLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'test';
  duration: number;
  isCompleted: boolean;
  content?: string;
  videoUrl?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  progress: number;
  lessons: Lesson[];
}

const mockCourse: Course = {
  id: '1',
  title: 'React для начинающих',
  description: 'Полный курс по React с нуля до продвинутого уровня. Изучите компоненты, хуки, роутинг и управление состоянием.',
  instructor: 'Анна Петрова',
  duration: '12 часов',
  level: 'Начальный',
  category: 'Программирование',
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  progress: 35,
  lessons: [
    { id: '1', title: 'Введение в React', type: 'video', duration: 15, isCompleted: true, videoUrl: 'https://example.com/video1' },
    { id: '2', title: 'Компоненты и Props', type: 'video', duration: 25, isCompleted: true, videoUrl: 'https://example.com/video2' },
    { id: '3', title: 'Тест: Основы React', type: 'test', duration: 10, isCompleted: true },
    { id: '4', title: 'State и Lifecycle', type: 'video', duration: 30, isCompleted: false, videoUrl: 'https://example.com/video3' },
    { id: '5', title: 'События и формы', type: 'text', duration: 20, isCompleted: false, content: 'Подробное описание работы с событиями...' },
    { id: '6', title: 'Тест: Управление состоянием', type: 'test', duration: 15, isCompleted: false },
    { id: '7', title: 'Хуки: useState и useEffect', type: 'video', duration: 35, isCompleted: false },
    { id: '8', title: 'React Router', type: 'video', duration: 40, isCompleted: false },
  ],
};

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(mockCourse.lessons[0]);
  
  const course = mockCourse;
  const completedLessons = course.lessons.filter(l => l.isCompleted).length;
  const totalLessons = course.lessons.length;

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.type === 'test') {
      navigate(`${ROUTES.STUDENT.COURSES}/${courseId}/test/${lesson.id}`);
    } else {
      setSelectedLesson(lesson);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'text': return 'FileText';
      case 'test': return 'ClipboardList';
      default: return 'Circle';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto">
        {/* Шапка курса */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate(ROUTES.STUDENT.COURSES)}
          >
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад к курсам
          </Button>
          
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    {course.level}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-white/90 mb-4 text-lg">{course.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="BookOpen" size={16} />
                    <span>{completedLessons} из {totalLessons} уроков</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Прогресс */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Прогресс прохождения</span>
                <span className="text-sm font-bold">{course.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="grid grid-cols-3 gap-6">
          {/* Список уроков */}
          <Card className="col-span-1 p-6 h-fit sticky top-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="List" size={20} />
              Программа курса
            </h2>
            
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedLesson?.id === lesson.id 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 ${
                      lesson.isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {lesson.isCompleted ? <Icon name="Check" size={14} /> : index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon 
                          name={getTypeIcon(lesson.type)} 
                          size={14} 
                          className="text-gray-400 flex-shrink-0" 
                        />
                        <span className="font-medium text-sm truncate">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{lesson.duration} мин</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Контент урока */}
          <Card className="col-span-2 p-8">
            {selectedLesson ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <Icon name={getTypeIcon(selectedLesson.type)} className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h2>
                    <p className="text-sm text-gray-500">Урок {course.lessons.findIndex(l => l.id === selectedLesson.id) + 1} из {totalLessons}</p>
                  </div>
                </div>

                {selectedLesson.type === 'video' && (
                  <div className="space-y-6">
                    <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
                      <div className="text-center text-white">
                        <Icon name="Play" size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">Видео-плеер</p>
                        <p className="text-sm text-gray-500 mt-2">{selectedLesson.duration} минут</p>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <h3>Описание урока</h3>
                      <p>В этом уроке вы изучите основные концепции и практические примеры использования React. Мы рассмотрим ключевые моменты и лучшие практики разработки.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedLesson.isCompleted ? (
                        <Button variant="outline" className="gap-2">
                          <Icon name="RotateCcw" size={16} />
                          Пересмотреть урок
                        </Button>
                      ) : (
                        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                          <Icon name="Check" size={16} />
                          Отметить как завершенный
                        </Button>
                      )}
                      
                      <Button variant="outline" className="gap-2">
                        <Icon name="ArrowRight" size={16} />
                        Следующий урок
                      </Button>
                    </div>
                  </div>
                )}

                {selectedLesson.type === 'text' && (
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <p className="text-lg text-gray-600 mb-6">
                        {selectedLesson.content || 'Содержание текстового урока появится здесь...'}
                      </p>
                      
                      <h3>События в React</h3>
                      <p>React предоставляет удобную систему обработки событий, которая работает кроссбраузерно.</p>
                      
                      <h4>Основные типы событий:</h4>
                      <ul>
                        <li>onClick - клик по элементу</li>
                        <li>onChange - изменение значения в форме</li>
                        <li>onSubmit - отправка формы</li>
                        <li>onMouseEnter / onMouseLeave - наведение мыши</li>
                      </ul>

                      <h3>Работа с формами</h3>
                      <p>Контролируемые компоненты позволяют React управлять значениями полей формы через состояние.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedLesson.isCompleted ? (
                        <Button variant="outline" className="gap-2">
                          <Icon name="RotateCcw" size={16} />
                          Перечитать урок
                        </Button>
                      ) : (
                        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                          <Icon name="Check" size={16} />
                          Отметить как завершенный
                        </Button>
                      )}
                      
                      <Button variant="outline" className="gap-2">
                        <Icon name="ArrowRight" size={16} />
                        Следующий урок
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Выберите урок для начала обучения</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
