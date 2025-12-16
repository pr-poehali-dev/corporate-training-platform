import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { mockCourses, mockQuestions } from '@/data/mockData';

export default function Tests() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [questionType, setQuestionType] = useState<'single' | 'multiple'>('single');

  const filteredQuestions = selectedCourse === 'all'
    ? mockQuestions
    : mockQuestions;

  const questionsByType = {
    single: mockQuestions.filter(q => q.type === 'single').length,
    multiple: mockQuestions.filter(q => q.type === 'multiple').length,
    total: mockQuestions.length,
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление тестами</h1>
            <p className="text-gray-600">Создавайте и редактируйте тестовые вопросы для курсов</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/tests/new')}
          >
            <Icon name="Plus" className="mr-2" size={18} />
            Создать тест
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hidden">
                <Icon name="Plus" className="mr-2" size={18} />
                Добавить вопрос
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать новый вопрос</DialogTitle>
                <DialogDescription>
                  Добавьте новый вопрос для тестирования студентов
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Курс</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Выберите курс" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Тип вопроса</Label>
                  <RadioGroup value={questionType} onValueChange={(val) => setQuestionType(val as 'single' | 'multiple')} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single">Один правильный ответ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiple" id="multiple" />
                      <Label htmlFor="multiple">Несколько правильных ответов</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="question-text">Текст вопроса</Label>
                  <Input
                    id="question-text"
                    placeholder="Введите текст вопроса"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Варианты ответов</Label>
                  <div className="space-y-2 mt-2">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="flex items-center gap-2">
                        <Input placeholder={`Вариант ${num}`} />
                        <Button size="sm" variant="ghost">
                          <Icon name="Check" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Icon name="Plus" className="mr-2" size={14} />
                    Добавить вариант
                  </Button>
                </div>

                <div>
                  <Label htmlFor="points">Баллы за вопрос</Label>
                  <Input
                    id="points"
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={100}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Отмена
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  Создать вопрос
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Icon name="FileQuestion" className="text-orange-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{questionsByType.total}</div>
                  <div className="text-sm text-gray-600">Всего вопросов</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon name="CircleDot" className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{questionsByType.single}</div>
                  <div className="text-sm text-gray-600">Одиночный выбор</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon name="CheckSquare" className="text-purple-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{questionsByType.multiple}</div>
                  <div className="text-sm text-gray-600">Множественный выбор</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Фильтры</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Курс</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все курсы</SelectItem>
                    {mockCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Поиск</Label>
                <Input placeholder="Найти вопрос..." className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="List" size={20} />
              Список вопросов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-semibold text-gray-900">{question.text}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={question.type === 'single' ? 'default' : 'secondary'}>
                            {question.type === 'single' ? 'Одиночный' : 'Множественный'}
                          </Badge>
                          <Badge variant="outline">{question.points} баллов</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        {question.options?.map((option, idx) => {
                          const isCorrect = question.type === 'single'
                            ? option === question.correctAnswer
                            : (question.correctAnswer as string[]).includes(option);
                          
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border-2 ${
                                isCorrect
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrect && (
                                  <Icon name="CheckCircle" size={16} className="text-green-600" />
                                )}
                                <span className="text-sm text-gray-700">{option}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Icon name="Edit" className="mr-2" size={14} />
                          Редактировать
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Icon name="Trash2" className="mr-2" size={14} />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}