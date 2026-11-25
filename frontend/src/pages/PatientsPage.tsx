import { useState } from 'react'
import { Search, UserPlus, ArrowRight, Users, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MetricCard } from '../components/ui/metric-card'
import { usePatients, useCreatePatient, extractApiError } from '../lib/queries'

const STATUS_LABELS: Record<string, string> = {
  active: 'Активен',
  completed: 'Завершён',
  archived: 'Архив',
}

const STATUS_VARIANTS: Record<string, 'default' | 'success' | 'info'> = {
  active: 'success',
  completed: 'info',
  archived: 'default',
}

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ full_name: '', birth_year: '', diagnosis: '' })
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading, refetch } = usePatients({
    limit: 20,
    offset: 0,
  })
  const createPatient = useCreatePatient()

  const patients = data?.items ?? []
  const total = data?.total ?? 0

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.diagnosis ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const birthYear = Number.parseInt(form.birth_year, 10)
    if (Number.isNaN(birthYear) || birthYear < 1900 || birthYear > 2100) {
      setFormError('Укажите корректный год рождения (1900–2100)')
      return
    }
    try {
      await createPatient.mutateAsync({
        full_name: form.full_name.trim(),
        birth_year: birthYear,
        diagnosis: form.diagnosis.trim(),
      })
      setForm({ full_name: '', birth_year: '', diagnosis: '' })
      setShowForm(false)
      void refetch()
    } catch (err) {
      setFormError(extractApiError(err, 'Не удалось создать пациента'))
    }
  }

  const activeCount = filtered.filter((p) => p.status === 'active').length
  const completedCount = filtered.filter((p) => p.status === 'completed').length

  return (
    <div className="space-y-8">
      <div className="relative rounded-3xl bg-gradient-to-br from-medical-sky-900/20 to-medical-slate-950 p-8 md:p-12 border border-medical-slate-800/50 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-8 bg-medical-sky-500 rounded-full animate-pulse" />
              <h1 className="text-3xl font-bold tracking-tight text-white">Пациенты</h1>
            </div>
            <p className="text-medical-slate-400 text-lg">
              Управление клиентской базой и отслеживание лечения
            </p>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="text-right hidden md:block">
              <p className="text-xs text-medical-slate-500 uppercase tracking-wider font-semibold">Всего пациентов</p>
              <p className="text-2xl font-bold text-white">{total}</p>
            </div>
            <Button variant="emerald" size="lg" onClick={() => setShowForm(true)} className="shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]">
              <UserPlus className="w-4 h-4 mr-2" /> Новый пациент
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Всего пациентов"
          value={total}
          subtitle="в системе"
          trend="up"
          trendValue="+12%"
          icon={<Users className="w-5 h-5" />}
          accent="sky"
        />
        <MetricCard
          title="Активные"
          value={activeCount}
          subtitle="в лечении сейчас"
          trend="neutral"
          icon={<Activity className="w-5 h-5" />}
          accent="emerald"
        />
        <MetricCard
          title="Завершенные"
          value={completedCount}
          subtitle="в архиве и завершённых"
          trend="up"
          trendValue="+8%"
          icon={<Activity className="w-5 h-5" />}
          accent="emerald"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-slate-500" />
          <input
            type="search"
            placeholder="Поиск по имени, диагнозу или ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-medical-slate-900 border border-medical-slate-700 text-slate-200 placeholder-medical-slate-500 focus:border-medical-sky-500 focus:outline-none focus:ring-1 focus:ring-medical-sky-500 transition-all"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить пациента'}
        </Button>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {formError}
        </div>
      )}

      {showForm && (
        <Card padding="lg" className="animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <CardTitle>Новый пациент</CardTitle>
            <CardDescription>Добавьте пациента в систему для начала отслеживания лечения</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-medical-slate-400 mb-2">
                    ФИО пациента
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-medical-slate-800/50 border border-medical-slate-700 text-slate-200 placeholder-medical-slate-500 focus:border-medical-sky-500 focus:outline-none focus:ring-1 focus:ring-medical-sky-500 transition-all"
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-slate-400 mb-2">
                    Год рождения
                  </label>
                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    value={form.birth_year}
                    onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-medical-slate-800/50 border border-medical-slate-700 text-slate-200 placeholder-medical-slate-500 focus:border-medical-sky-500 focus:outline-none focus:ring-1 focus:ring-medical-sky-500 transition-all"
                    placeholder="1985"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-medical-slate-400 mb-2">
                  Диагноз
                </label>
                <input
                  type="text"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-medical-slate-800/50 border border-medical-slate-700 text-slate-200 placeholder-medical-slate-500 focus:border-medical-sky-500 focus:outline-none focus:ring-1 focus:ring-medical-sky-500 transition-all"
                  placeholder="Перекрестный прикус, класс II по Энглю"
                />
              </div>
              <Button type="submit" variant="emerald" disabled={createPatient.isPending} className="w-auto">
                {createPatient.isPending ? 'Создаём…' : 'Создать пациента'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Список пациентов</CardTitle>
          <CardDescription>{filtered.length} из {total}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="h-96 flex items-center justify-center animate-pulse">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-medical-slate-800 animate-pulse" />
                <div className="w-full h-4 bg-medical-slate-800 rounded w-3/4" />
                <div className="w-full h-4 bg-medical-slate-800 rounded w-1/2" />
              </div>
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-medical-slate-500">Пациентов не найдено</p>
              {search && (
                <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                  Очистить поиск
                </Button>
              )}
            </div>
          )}
          {!isLoading && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-medical-slate-700/50 text-xs text-medical-slate-400 uppercase tracking-wider">
                    <th className="pb-4 font-medium">Пациент</th>
                    <th className="pb-4 font-medium text-right">Год рожд.</th>
                    <th className="pb-4 font-medium text-right">Диагноз</th>
                    <th className="pb-4 font-medium text-right">Статус</th>
                    <th className="pb-4 font-medium text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-medical-slate-800/50">
                  {filtered.map((patient) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="hover:bg-medical-slate-800/30 transition-colors group"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-medical-sky-500/20 flex items-center justify-center text-medical-sky-400 font-medium text-xs">
                            {patient.full_name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{patient.full_name}</p>
                            <p className="text-xs text-medical-slate-500">
                              {patient.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm text-slate-300">
                        {patient.birth_year}
                      </td>
                      <td className="py-4 text-right text-sm text-medical-slate-400">
                        {patient.diagnosis || <span className="italic">—</span>}
                      </td>
                      <td className="py-4 text-right">
                        <Badge variant={STATUS_VARIANTS[patient.status]}>
                          {STATUS_LABELS[patient.status] ?? patient.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => {}}>
                          Открыть <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <span className="text-sm text-medical-slate-400">
              Показано {Math.min(filtered.length, 20)} из {total}
            </span>
            <Button variant="outline" size="sm" onClick={() => {}}>
              Все пациенты
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
