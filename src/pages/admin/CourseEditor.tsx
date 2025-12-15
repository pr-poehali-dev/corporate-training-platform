import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'test';
  duration: number;
  content?: string;
  videoUrl?: string;
  testId?: string;
  order: number;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: 'Начальный' | 'Средний' | 'Продвинутый';
  instructor: string;
  image: string;
  lessons: Lesson[];
}

const initialFormData: CourseFormData = {
  title: '',
  description: '',
  category: '',
  level: 'Начальный',
  instructor: '',
  image: '',
  lessons: [],
};

export default function CourseEditor() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditMode = !!courseId;

  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showLessonDialog, setShowLessonDialog] = useState(false);

  const handleInputChange = (field: keyof CourseFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddLesson = () => {
    setEditingLesson({
      id: Date.now().toString(),
      title: '',
      type: 'video',
      duration: 10,
      order: formData.lessons.length,
    });
    setShowLessonDialog(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonDialog(true);
  };

  const handleSaveLesson = () => {
    if (!editingLesson) return;

    const existingIndex = formData.lessons.findIndex(l => l.id === editingLesson.id);
    if (existingIndex >= 0) {
      const updated = [...formData.lessons];
      updated[existingIndex] = editingLesson;
      setFormData({ ...formData, lessons: updated });
    } else {
      setFormData({ ...formData, lessons: [...formData.lessons, editingLesson] });
    }

    setShowLessonDialog(false);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setFormData({
      ...formData,
      lessons: formData.lessons.filter(l => l.id !== lessonId),
    });
  };

  const handleReorderLesson = (lessonId: string, direction: 'up' | 'down') => {
    const index = formData.lessons.findIndex(l => l.id === lessonId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.lessons.length - 1)
    ) {
      return;
    }

    const newLessons = [...formData.lessons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];

    newLessons.forEach((lesson, idx) => {
      lesson.order = idx;
    });

    setFormData({ ...formData, lessons: newLessons });
  };

  const handleSaveCourse = () => {
    console.log('Saving course:', formData);
    navigate(ROUTES.ADMIN.COURSES);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'text': return 'FileText';
      case 'test': return 'ClipboardList';
      default: return 'Circle';
    }
  };

  const totalDuration = formData.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              className="mb-2"
              onClick={() => navigate(ROUTES.ADMIN.COURSES)}
            >
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              Назад к курсам
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Редактировать курс' : 'Создать новый курс'}
            </h1>
          </div>
          <Button
            onClick={handleSaveCourse}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            disabled={!formData.title || formData.lessons.length === 0}
          >
            <Icon name="Save" className="mr-2" size={16} />
            {isEditMode ? 'Сохранить изменения' : 'Создать курс'}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Основная информация */}
          <Card className="col-span-2 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="BookOpen" size={20} />
              Основная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название курса *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="React для начинающих"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Полный курс по React с нуля до продвинутого уровня..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="Программирование">Программирование</option>
                    <option value="Дизайн">Дизайн</option>
                    <option value="Маркетинг">Маркетинг</option>
                    <option value="Бизнес">Бизнес</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Уровень сложности
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Начальный">Начальный</option>
                    <option value="Средний">Средний</option>
                    <option value="Продвинутый">Продвинутый</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Преподаватель
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  placeholder="Анна Петрова"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL изображения
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Статистика */}
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Статистика</h2>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {formData.lessons.length}
                </div>
                <div className="text-sm text-gray-500">Всего уроков</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor(totalDuration / 60)}ч {totalDuration % 60}м
                </div>
                <div className="text-sm text-gray-500">Общая длительность</div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Видео-уроки</span>
                  <span className="font-medium">
                    {formData.lessons.filter(l => l.type === 'video').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Текстовые уроки</span>
                  <span className="font-medium">
                    {formData.lessons.filter(l => l.type === 'text').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Тесты</span>
                  <span className="font-medium">
                    {formData.lessons.filter(l => l.type === 'test').length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Уроки */}
          <Card className="col-span-3 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Icon name="List" size={20} />
                Программа курса
              </h2>
              <Button onClick={handleAddLesson} size="sm">
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить урок
              </Button>
            </div>

            {formData.lessons.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Icon name="BookOpen" size={48} className="mx-auto mb-4 opacity-30" />
                <p>Уроки еще не добавлены</p>
                <p className="text-sm">Нажмите "Добавить урок" чтобы начать</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleReorderLesson(lesson.id, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <Icon name="ChevronUp" size={16} />
                      </button>
                      <button
                        onClick={() => handleReorderLesson(lesson.id, 'down')}
                        disabled={index === formData.lessons.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <Icon name="ChevronDown" size={16} />
                      </button>
                    </div>

                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>

                    <Icon
                      name={getTypeIcon(lesson.type)}
                      className="text-gray-400"
                      size={20}
                    />

                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{lesson.title || 'Без названия'}</div>
                      <div className="text-sm text-gray-500">{lesson.duration} мин</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Icon name="Pencil" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Диалог редактирования урока */}
        {showLessonDialog && editingLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl p-6">
              <h3 className="text-xl font-bold mb-4">
                {formData.lessons.find(l => l.id === editingLesson.id) ? 'Редактировать урок' : 'Новый урок'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название урока *
                  </label>
                  <input
                    type="text"
                    value={editingLesson.title}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, title: e.target.value })
                    }
                    placeholder="Введение в React"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип урока
                    </label>
                    <select
                      value={editingLesson.type}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, type: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="video">Видео-урок</option>
                      <option value="text">Текстовый урок</option>
                      <option value="test">Тест</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Длительность (мин)
                    </label>
                    <input
                      type="number"
                      value={editingLesson.duration}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {editingLesson.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL видео
                    </label>
                    <input
                      type="text"
                      value={editingLesson.videoUrl || ''}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, videoUrl: e.target.value })
                      }
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}

                {editingLesson.type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Содержание урока
                    </label>
                    <textarea
                      value={editingLesson.content || ''}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, content: e.target.value })
                      }
                      placeholder="Текст урока в формате Markdown..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
                    />
                  </div>
                )}

                {editingLesson.type === 'test' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID теста
                    </label>
                    <select
                      value={editingLesson.testId || ''}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, testId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Выберите тест</option>
                      <option value="1">Тест: Основы React</option>
                      <option value="2">Тест: Хуки React</option>
                      <option value="3">Тест: React Router</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Тесты создаются в разделе "Тесты"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveLesson}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  disabled={!editingLesson.title}
                >
                  <Icon name="Check" className="mr-2" size={16} />
                  Сохранить урок
                </Button>
                <Button
                  onClick={() => {
                    setShowLessonDialog(false);
                    setEditingLesson(null);
                  }}
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
