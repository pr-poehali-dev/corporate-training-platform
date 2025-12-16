import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { mockTests } from '@/data/mockData';

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: 'Начальный' | 'Средний' | 'Продвинутый';
  instructor: string;
  image: string;
  testId?: string;
  status: 'draft' | 'published' | 'archived';
  accessType: 'open' | 'closed';
}

interface CourseInfoFormProps {
  formData: CourseFormData;
  onInputChange: (field: keyof CourseFormData, value: any) => void;
}

export default function CourseInfoForm({ formData, onInputChange }: CourseInfoFormProps) {
  return (
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
            onChange={(e) => onInputChange('title', e.target.value)}
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
            onChange={(e) => onInputChange('description', e.target.value)}
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
              onChange={(e) => onInputChange('category', e.target.value)}
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
              onChange={(e) => onInputChange('level', e.target.value as any)}
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
            onChange={(e) => onInputChange('instructor', e.target.value)}
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
            onChange={(e) => onInputChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Итоговый тест (необязательно)
          </label>
          <select
            value={formData.testId || ''}
            onChange={(e) => onInputChange('testId', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Без теста</option>
            {mockTests.filter(t => t.status === 'published').map(test => (
              <option key={test.id} value={test.id}>
                {test.title} ({test.questionsCount} вопросов, {test.timeLimit} мин)
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Тест будет отображаться после всех уроков в программе курса
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус публикации
            </label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликован</option>
              <option value="archived">Архив</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип доступа
            </label>
            <select
              value={formData.accessType}
              onChange={(e) => onInputChange('accessType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="open">Открытый</option>
              <option value="closed">Закрытый</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {formData.accessType === 'open' 
                ? 'Доступен всем студентам' 
                : 'Требуется назначение администратором'}
            </p>
          </div>
        </div>


      </div>
    </Card>
  );
}