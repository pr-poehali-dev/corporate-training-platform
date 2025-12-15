import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text';
  question: string;
  answers?: Answer[];
  correctText?: string;
  points: number;
}

interface TestFormData {
  title: string;
  description: string;
  courseId: string;
  passingScore: number;
  timeLimit: number;
  questions: Question[];
}

const initialFormData: TestFormData = {
  title: '',
  description: '',
  courseId: '',
  passingScore: 70,
  timeLimit: 15,
  questions: [],
};

export default function TestEditor() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const isEditMode = !!testId;

  const [formData, setFormData] = useState<TestFormData>(initialFormData);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);

  const handleInputChange = (field: keyof TestFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: Date.now().toString(),
      type: 'single',
      question: '',
      answers: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
      ],
      points: 1,
    });
    setShowQuestionDialog(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionDialog(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    const existingIndex = formData.questions.findIndex(q => q.id === editingQuestion.id);
    if (existingIndex >= 0) {
      const updated = [...formData.questions];
      updated[existingIndex] = editingQuestion;
      setFormData({ ...formData, questions: updated });
    } else {
      setFormData({ ...formData, questions: [...formData.questions, editingQuestion] });
    }

    setShowQuestionDialog(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId),
    });
  };

  const handleAddAnswer = () => {
    if (!editingQuestion || !editingQuestion.answers) return;
    
    setEditingQuestion({
      ...editingQuestion,
      answers: [
        ...editingQuestion.answers,
        { id: Date.now().toString(), text: '', isCorrect: false },
      ],
    });
  };

  const handleRemoveAnswer = (answerId: string) => {
    if (!editingQuestion || !editingQuestion.answers) return;
    
    setEditingQuestion({
      ...editingQuestion,
      answers: editingQuestion.answers.filter(a => a.id !== answerId),
    });
  };

  const handleUpdateAnswer = (answerId: string, field: keyof Answer, value: string | boolean) => {
    if (!editingQuestion || !editingQuestion.answers) return;

    const updatedAnswers = editingQuestion.answers.map(a =>
      a.id === answerId ? { ...a, [field]: value } : a
    );

    if (field === 'isCorrect' && editingQuestion.type === 'single' && value === true) {
      updatedAnswers.forEach(a => {
        if (a.id !== answerId) a.isCorrect = false;
      });
    }

    setEditingQuestion({
      ...editingQuestion,
      answers: updatedAnswers,
    });
  };

  const handleSaveTest = () => {
    console.log('Saving test:', formData);
    navigate(ROUTES.ADMIN.TESTS);
  };

  const totalPoints = formData.questions.reduce((sum, q) => sum + q.points, 0);

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'single': return 'Один вариант';
      case 'multiple': return 'Несколько вариантов';
      case 'text': return 'Текстовый ответ';
      default: return type;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              className="mb-2"
              onClick={() => navigate(ROUTES.ADMIN.TESTS)}
            >
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              Назад к тестам
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Редактировать тест' : 'Создать новый тест'}
            </h1>
          </div>
          <Button
            onClick={handleSaveTest}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            disabled={!formData.title || !formData.courseId || formData.questions.length === 0}
          >
            <Icon name="Save" className="mr-2" size={16} />
            {isEditMode ? 'Сохранить изменения' : 'Создать тест'}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Основная информация */}
          <Card className="col-span-2 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="ClipboardList" size={20} />
              Основная информация
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название теста *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Тест: Основы React"
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
                  placeholder="Проверьте свои знания основ React"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Привязка к курсу *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleInputChange('courseId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Выберите курс</option>
                  <option value="1">React для начинающих</option>
                  <option value="2">Python и Django</option>
                  <option value="3">UI/UX дизайн в Figma</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Этот тест будет доступен в выбранном курсе
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Проходной балл (%)
                  </label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Время на тест (мин)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Статистика */}
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Статистика</h2>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {formData.questions.length}
                </div>
                <div className="text-sm text-gray-500">Всего вопросов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalPoints}</div>
                <div className="text-sm text-gray-500">Всего баллов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formData.timeLimit}</div>
                <div className="text-sm text-gray-500">Минут на тест</div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Один вариант</span>
                  <span className="font-medium">
                    {formData.questions.filter(q => q.type === 'single').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Несколько вариантов</span>
                  <span className="font-medium">
                    {formData.questions.filter(q => q.type === 'multiple').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Текстовые</span>
                  <span className="font-medium">
                    {formData.questions.filter(q => q.type === 'text').length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Вопросы */}
          <Card className="col-span-3 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Icon name="List" size={20} />
                Вопросы теста
              </h2>
              <Button onClick={handleAddQuestion} size="sm">
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить вопрос
              </Button>
            </div>

            {formData.questions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Icon name="HelpCircle" size={48} className="mx-auto mb-4 opacity-30" />
                <p>Вопросы еще не добавлены</p>
                <p className="text-sm">Нажмите "Добавить вопрос" чтобы начать</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {question.points} {question.points === 1 ? 'балл' : 'балла'}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900 mb-2">
                        {question.question || 'Без текста вопроса'}
                      </div>
                      {question.type !== 'text' && question.answers && (
                        <div className="text-sm text-gray-600">
                          {question.answers.length} вариантов ответа
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Icon name="Pencil" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteQuestion(question.id)}
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

        {/* Диалог редактирования вопроса */}
        {showQuestionDialog && editingQuestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-3xl p-6 my-8">
              <h3 className="text-xl font-bold mb-4">
                {formData.questions.find(q => q.id === editingQuestion.id)
                  ? 'Редактировать вопрос'
                  : 'Новый вопрос'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текст вопроса *
                  </label>
                  <textarea
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, question: e.target.value })
                    }
                    placeholder="Что такое JSX в React?"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип вопроса
                    </label>
                    <select
                      value={editingQuestion.type}
                      onChange={(e) => {
                        const newType = e.target.value as Question['type'];
                        if (newType === 'text') {
                          setEditingQuestion({
                            ...editingQuestion,
                            type: newType,
                            answers: undefined,
                            correctText: '',
                          });
                        } else if (!editingQuestion.answers) {
                          setEditingQuestion({
                            ...editingQuestion,
                            type: newType,
                            answers: [
                              { id: '1', text: '', isCorrect: false },
                              { id: '2', text: '', isCorrect: false },
                            ],
                            correctText: undefined,
                          });
                        } else {
                          setEditingQuestion({ ...editingQuestion, type: newType });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="single">Один правильный ответ</option>
                      <option value="multiple">Несколько правильных ответов</option>
                      <option value="text">Текстовый ответ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Баллов за вопрос
                    </label>
                    <input
                      type="number"
                      value={editingQuestion.points}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          points: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Варианты ответов */}
                {editingQuestion.type !== 'text' && editingQuestion.answers && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Варианты ответа
                      </label>
                      <Button size="sm" variant="outline" onClick={handleAddAnswer}>
                        <Icon name="Plus" className="mr-2" size={14} />
                        Добавить вариант
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {editingQuestion.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type={editingQuestion.type === 'single' ? 'radio' : 'checkbox'}
                            checked={answer.isCorrect}
                            onChange={(e) =>
                              handleUpdateAnswer(answer.id, 'isCorrect', e.target.checked)
                            }
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                          />
                          <input
                            type="text"
                            value={answer.text}
                            onChange={(e) =>
                              handleUpdateAnswer(answer.id, 'text', e.target.value)
                            }
                            placeholder="Текст варианта ответа"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveAnswer(answer.id)}
                            disabled={editingQuestion.answers!.length <= 2}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {editingQuestion.type === 'single'
                        ? 'Выберите один правильный ответ'
                        : 'Отметьте все правильные ответы'}
                    </p>
                  </div>
                )}

                {/* Текстовый ответ */}
                {editingQuestion.type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Правильный ответ
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.correctText || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, correctText: e.target.value })
                      }
                      placeholder="npx create-react-app my-app"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ответ будет сравниваться без учета регистра и пробелов
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveQuestion}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  disabled={
                    !editingQuestion.question ||
                    (editingQuestion.type !== 'text' &&
                      (!editingQuestion.answers ||
                        !editingQuestion.answers.some(a => a.isCorrect))) ||
                    (editingQuestion.type === 'text' && !editingQuestion.correctText)
                  }
                >
                  <Icon name="Check" className="mr-2" size={16} />
                  Сохранить вопрос
                </Button>
                <Button
                  onClick={() => {
                    setShowQuestionDialog(false);
                    setEditingQuestion(null);
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
