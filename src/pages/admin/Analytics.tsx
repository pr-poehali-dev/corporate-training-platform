import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { mockCourses, mockUsers, mockProgress, mockTestResults } from '@/data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Analytics() {
  const students = mockUsers.filter(u => u.role === 'student');
  const totalEnrollments = mockProgress.length;
  const completedCourses = mockProgress.filter(p => p.completed).length;
  const averageCompletion = totalEnrollments > 0 
    ? Math.round((completedCourses / totalEnrollments) * 100) 
    : 0;

  const courseCompletionData = mockCourses.map(course => {
    const courseProgress = mockProgress.filter(p => p.courseId === course.id);
    const completed = courseProgress.filter(p => p.completed).length;
    const inProgress = courseProgress.filter(p => !p.completed && p.completedLessons > 0).length;
    const notStarted = courseProgress.filter(p => p.completedLessons === 0).length;

    return {
      name: course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title,
      Завершено: completed,
      'В процессе': inProgress,
      'Не начато': notStarted,
    };
  });

  const categoryData = mockCourses.reduce((acc, course) => {
    const existing = acc.find(item => item.name === course.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: course.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const testScoresData = mockCourses.map(course => {
    const courseResults = mockTestResults.filter(r => r.courseId === course.id);
    const avgScore = courseResults.length > 0
      ? courseResults.reduce((sum, r) => sum + r.score, 0) / courseResults.length
      : 0;

    return {
      name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
      'Средний балл': Math.round(avgScore),
      'Проходной балл': course.passScore,
    };
  });

  const studentActivityData = [
    { month: 'Янв', активных: 45, новых: 12 },
    { month: 'Фев', активных: 52, новых: 18 },
    { month: 'Мар', активных: 61, новых: 15 },
    { month: 'Апр', активных: 58, новых: 20 },
    { month: 'Май', активных: 67, новых: 22 },
    { month: 'Июн', активных: 73, новых: 19 },
  ];

  const COLORS = ['#F97316', '#FBBF24', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Аналитика и отчеты</h1>
          <p className="text-gray-600">Детальная статистика по обучению и прогрессу студентов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Icon name="Users" className="text-orange-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{students.length}</div>
                  <div className="text-sm text-gray-600">Всего студентов</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon name="BookOpen" className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalEnrollments}</div>
                  <div className="text-sm text-gray-600">Активных записей</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completedCourses}</div>
                  <div className="text-sm text-gray-600">Завершено курсов</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon name="TrendingUp" className="text-purple-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{averageCompletion}%</div>
                  <div className="text-sm text-gray-600">Средний процент завершения</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart3" size={20} />
                Прогресс по курсам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Завершено" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="В процессе" fill="#F97316" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Не начато" fill="#9CA3AF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" size={20} />
                Распределение курсов по категориям
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="LineChart" size={20} />
                Активность студентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="активных"
                    stroke="#F97316"
                    strokeWidth={3}
                    dot={{ fill: '#F97316', r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="новых"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Target" size={20} />
                Результаты тестирования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Средний балл" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Проходной балл" fill="#FBBF24" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Топ студентов по завершенным курсам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student, index) => {
                const studentProgress = mockProgress.filter(p => p.userId === student.id);
                const completedCount = studentProgress.filter(p => p.completed).length;
                const inProgressCount = studentProgress.filter(p => !p.completed && p.completedLessons > 0).length;
                const avgScore = studentProgress
                  .filter(p => p.testScore)
                  .reduce((sum, p, _, arr) => sum + (p.testScore || 0) / arr.length, 0);

                return (
                  <div key={student.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                        <div className="text-xs text-gray-600">Завершено</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
                        <div className="text-xs text-gray-600">В процессе</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{Math.round(avgScore)}%</div>
                        <div className="text-xs text-gray-600">Средний балл</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
