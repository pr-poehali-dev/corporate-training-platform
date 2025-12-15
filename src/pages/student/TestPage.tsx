import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '@/components/StudentLayout';
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
  type: 'single' | 'multiple' | 'text' | 'match';
  question: string;
  answers?: Answer[];
  correctText?: string;
  matchPairs?: { left: string; right: string }[];
}

const mockTest = {
  id: '1',
  title: 'Тест: Основы React',
  description: 'Проверьте свои знания основ React',
  passingScore: 70,
  timeLimit: 15,
  questions: [
    {
      id: '1',
      type: 'single',
      question: 'Что такое JSX в React?',
      answers: [
        { id: '1', text: 'Язык программирования', isCorrect: false },
        { id: '2', text: 'Синтаксическое расширение JavaScript', isCorrect: true },
        { id: '3', text: 'Библиотека для стилей', isCorrect: false },
        { id: '4', text: 'Фреймворк для тестирования', isCorrect: false },
      ],
    },
    {
      id: '2',
      type: 'multiple',
      question: 'Какие из перечисленных являются хуками React? (выберите несколько)',
      answers: [
        { id: '1', text: 'useState', isCorrect: true },
        { id: '2', text: 'useStyle', isCorrect: false },
        { id: '3', text: 'useEffect', isCorrect: true },
        { id: '4', text: 'useComponent', isCorrect: false },
        { id: '5', text: 'useContext', isCorrect: true },
      ],
    },
    {
      id: '3',
      type: 'text',
      question: 'Напишите команду для создания нового React приложения с помощью Create React App',
      correctText: 'npx create-react-app my-app',
    },
    {
      id: '4',
      type: 'single',
      question: 'Что делает хук useEffect?',
      answers: [
        { id: '1', text: 'Создает состояние компонента', isCorrect: false },
        { id: '2', text: 'Выполняет побочные эффекты в компоненте', isCorrect: true },
        { id: '3', text: 'Создает контекст', isCorrect: false },
        { id: '4', text: 'Управляет роутингом', isCorrect: false },
      ],
    },
  ] as Question[],
};

export default function TestPage() {
  const { courseId, testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(mockTest.timeLimit * 60);

  const test = mockTest;
  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  const handleSingleAnswer = (answerId: string) => {
    setAnswers({ ...answers, [question.id]: answerId });
  };

  const handleMultipleAnswer = (answerId: string) => {
    const current = (answers[question.id] as string[]) || [];
    const updated = current.includes(answerId)
      ? current.filter(id => id !== answerId)
      : [...current, answerId];
    setAnswers({ ...answers, [question.id]: updated });
  };

  const handleTextAnswer = (text: string) => {
    setAnswers({ ...answers, [question.id]: text });
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    test.questions.forEach(q => {
      const answer = answers[q.id];
      if (q.type === 'single') {
        const correctAnswer = q.answers?.find(a => a.isCorrect);
        if (answer === correctAnswer?.id) correct++;
      } else if (q.type === 'multiple') {
        const correctAnswers = q.answers?.filter(a => a.isCorrect).map(a => a.id) || [];
        const userAnswers = (answer as string[]) || [];
        if (JSON.stringify(correctAnswers.sort()) === JSON.stringify(userAnswers.sort())) {
          correct++;
        }
      } else if (q.type === 'text') {
        if ((answer as string)?.toLowerCase().trim() === q.correctText?.toLowerCase().trim()) {
          correct++;
        }
      }
    });
    return Math.round((correct / test.questions.length) * 100);
  };

  const score = showResults ? calculateScore() : 0;
  const passed = score >= test.passingScore;

  if (showResults) {
    return (
      <StudentLayout>
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Icon 
                  name={passed ? 'Trophy' : 'XCircle'} 
                  size={48} 
                  className={passed ? 'text-green-600' : 'text-red-600'} 
                />
              </div>

              <h1 className="text-3xl font-bold mb-2">
                {passed ? 'Тест пройден!' : 'Тест не пройден'}
              </h1>
              <p className="text-gray-600 mb-8">
                {passed 
                  ? 'Поздравляем! Вы успешно прошли тест.' 
                  : 'К сожалению, вы не набрали проходной балл. Попробуйте еще раз!'}
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{score}%</div>
                  <div className="text-sm text-gray-500">Ваш результат</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{test.passingScore}%</div>
                  <div className="text-sm text-gray-500">Проходной балл</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {test.questions.length}
                  </div>
                  <div className="text-sm text-gray-500">Всего вопросов</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {!passed && (
                  <Button 
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                    }}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Icon name="RotateCcw" className="mr-2" size={16} />
                    Пройти еще раз
                  </Button>
                )}
                <Button 
                  onClick={() => navigate(`${ROUTES.STUDENT.COURSES}/${courseId}`)}
                  variant={passed ? 'default' : 'outline'}
                  className={passed ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' : ''}
                >
                  Вернуться к курсу
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(`${ROUTES.STUDENT.COURSES}/${courseId}`)}
        >
          <Icon name="ArrowLeft" className="mr-2" size={16} />
          Назад к курсу
        </Button>

        {/* Шапка теста */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600">{test.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500">Осталось времени</div>
            </div>
          </div>

          {/* Прогресс */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Вопрос {currentQuestion + 1} из {test.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Вопрос */}
        <Card className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {currentQuestion + 1}
              </div>
              <span className="text-sm text-gray-500">
                {question.type === 'single' && 'Выберите один вариант'}
                {question.type === 'multiple' && 'Выберите несколько вариантов'}
                {question.type === 'text' && 'Введите ответ текстом'}
                {question.type === 'match' && 'Сопоставьте пары'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
          </div>

          {/* Ответы */}
          <div className="space-y-3 mb-8">
            {question.type === 'single' && question.answers?.map(answer => (
              <button
                key={answer.id}
                onClick={() => handleSingleAnswer(answer.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === answer.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === answer.id
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === answer.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{answer.text}</span>
                </div>
              </button>
            ))}

            {question.type === 'multiple' && question.answers?.map(answer => (
              <button
                key={answer.id}
                onClick={() => handleMultipleAnswer(answer.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  (answers[question.id] as string[])?.includes(answer.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    (answers[question.id] as string[])?.includes(answer.id)
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}>
                    {(answers[question.id] as string[])?.includes(answer.id) && (
                      <Icon name="Check" size={14} className="text-white" />
                    )}
                  </div>
                  <span className="font-medium">{answer.text}</span>
                </div>
              </button>
            ))}

            {question.type === 'text' && (
              <textarea
                value={(answers[question.id] as string) || ''}
                onChange={(e) => handleTextAnswer(e.target.value)}
                placeholder="Введите ваш ответ..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                rows={4}
              />
            )}
          </div>

          {/* Навигация */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <Icon name="ChevronLeft" className="mr-2" size={16} />
              Назад
            </Button>

            <div className="flex gap-2">
              {test.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    idx === currentQuestion
                      ? 'bg-orange-500 text-white'
                      : answers[test.questions[idx].id]
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentQuestion === test.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Завершить тест
                <Icon name="Check" className="ml-2" size={16} />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Далее
                <Icon name="ChevronRight" className="ml-2" size={16} />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}
