import { useState } from 'react'
import { Plus, Activity, Users, File, Bot, BarChart3 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MetricCard } from '../components/ui/metric-card'
import { usePatients, extractApiError } from '../lib/queries'

const QUICK_ACTIONS = [
  { label: 'Новый пациент', icon: Plus, to: '/patients/new', variant: 'emerald' as const },
  { label: 'Загрузить скан', icon: File, to: '/scans/upload', variant: 'default' as const },
  { label: 'Производство', icon: Bot, to: '/production', variant: 'amber' as const },
]

const RECENT_ACTIVITY = [
  { time: '2 ч назад', action: 'Новый пациент', detail: 'Иванов Иван Иванович добавлен', type: 'patient' },
  { time: '5 ч назад', action: 'Скан обработан', detail: 'scan_003.stl готов к просмотру', type: 'scan' },
  { time: '1 день назад', action: 'Этап в производстве', detail: 'Этап #2 отправлен на фрезеровку', type: 'production' },
  { time: '2 дня назад', action: 'Пациент завершён', detail: 'Петрова Мария Сергеевна — done', type: 'done' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview')
  const { data, isLoading, isError, error } = usePatients({ limit: 5, offset: 0 })

  const patients = data?.items ?? []
  const total = data?.total ?? 0

  const stats = [
    {
      title: 'Пациентов',
      value: total,
      subtitle: 'в базе данных',
      trend: 'up' as const,
      trendValue: '+12%',
      icon: <Users className="w-5 h-5" />,
      accent: 'sky' as const,
    },
    {
      title: 'Сканов',
      value: patients.length,
      subtitle: '3D моделей загружено',
      trend: 'neutral' as const,
      trendValue: '0%',
      icon: <File className="w-5 h-5" />,
      accent: 'emerald' as const,
    },
    {
      title: 'В производстве',
      value: patients.filter((p) => p.status === 'active').length,
      subtitle: 'активных лечений',
      trend: 'down' as const,
      trendValue: '-3%',
      icon: <Bot className="w-5 h-5" />,
      accent: 'amber' as const,
    },
    {
      title: 'Завершено',
      value: patients.filter((p) => p.status === 'completed').length,
      subtitle: 'завершённых лечений',
      trend: 'up' as const,
      trendValue: '+8%',
      icon: <Activity className="w-5 h-5" />,
      accent: 'emerald' as const,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Дашборд</h1>
          <p className="mt-1 text-medical-slate-400">
            Обзор клиники — состояние пациентов, сканов и производства
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-medical-sky-500/10 text-medical-sky-400 border-medical-sky-500/20' : ''}
          >
            <Activity className="w-4 h-4" /> Обзор
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'bg-medical-sky-500/10 text-medical-sky-400 border-medical-sky-500/20' : ''}
          >
            <BarChart3 className="w-4 h-4" /> Аналитика
          </Button>
        </div>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {extractApiError(error, 'Не удалось загрузить данные дашборда')}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            trend={stat.trend}
            trendValue={stat.trendValue}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.label} padding="lg" className="group cursor-pointer hover:border-medical-sky-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-medical-slate-800/50 flex items-center justify-center group-hover:bg-medical-sky-500/20 transition-colors mb-4">
                <Icon className="w-5 h-5 text-medical-slate-300 group-hover:text-medical-sky-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-1">{action.label}</h3>
              <p className="text-sm text-medical-slate-500 mb-4">
                Быстрый доступ к разделу
              </p>
              <Button variant="ghost" size="sm" className="text-medical-slate-400 hover:text-medical-sky-400" onClick={() => {}}>
                Перейти
              </Button>
            </Card>
          )
        })}
      </div>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Недавняя активность</CardTitle>
          <CardDescription>Последние события в клинике</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-medical-slate-800 flex items-center justify-center text-xs font-medium text-medical-slate-300 border border-medical-slate-700">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-200">{item.action}</span>
                    <span className="text-medical-slate-500 text-xs">• {item.time}</span>
                  </div>
                  <p className="text-sm text-medical-slate-400 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Последние пациенты</CardTitle>
          <CardDescription>{total} пациентов в базе</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="h-64 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-medical-slate-800 animate-pulse" />
                <div className="w-full h-4 bg-medical-slate-800 rounded w-3/4" />
                <div className="w-full h-4 bg-medical-slate-800 rounded w-1/2" />
              </div>
            </div>
          )}
          {!isLoading && patients.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-medical-slate-500">Пациентов пока нет</p>
              <Button variant="emerald" size="sm" onClick={() => {}}>
                Добавить первого пациента
              </Button>
            </div>
          )}
          {!isLoading && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-medical-slate-700/50 text-xs text-medical-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Пациент</th>
                    <th className="pb-3 font-medium text-right">Статус</th>
                    <th className="pb-3 font-medium text-right">Диагноз</th>
                    <th className="pb-3 font-medium text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-medical-slate-800/50">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-medical-slate-800/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-medical-sky-500/20 flex items-center justify-center text-medical-sky-400 font-medium text-xs">
                            {patient.full_name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{patient.full_name}</p>
                            <p className="text-xs text-medical-slate-500">ID: {patient.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <Badge variant="success" className="text-[10px] px-2 py-1">
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right text-sm text-medical-slate-400">
                        {patient.diagnosis || '—'}
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => {}}>
                          Открыть
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <span className="text-sm text-medical-slate-400">Всего пациентов: {total}</span>
            <Button variant="outline" size="sm" onClick={() => {}}>
              Все пациенты
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
