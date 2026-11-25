import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Scan, File, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  usePatient,
  useScans,
  useStages,
  useCreateStage,
  useUploadScan,
  extractApiError,
} from '../lib/queries'
import { ScanViewer3D } from '../components/ScanViewer3D'
import { TreatmentTimeline } from '../components/TreatmentTimeline'
import { RobotProductionPanel } from '../components/RobotProductionPanel'

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const patientQuery = usePatient(id)
  const scansQuery = useScans(id)
  const stagesQuery = useStages(id)
  const createStage = useCreateStage(id ?? '')
  const uploadScan = useUploadScan(id ?? '')

  const [stageError, setStageError] = useState<string | null>(null)
  const [newStageDesc, setNewStageDesc] = useState('')
  const [newStageDays, setNewStageDays] = useState('14')

  if (patientQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-medical-slate-800" />
          <p className="text-medical-slate-400">Загрузка карточки пациента…</p>
        </div>
      </div>
    )
  }

  if (patientQuery.isError || !patientQuery.data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Пациент не найден</h1>
        <p className="text-medical-slate-400 mb-6">
          {extractApiError(patientQuery.error, 'Невозможно загрузить данные')}
        </p>
        <Button variant="default" onClick={() => navigate('/patients')}>
          К списку пациентов <ArrowLeft className="ml-2 w-4 h-4" />
        </Button>
      </div>
    )
  }

  const patient = patientQuery.data
  const scans = scansQuery.data ?? []
  const stages = stagesQuery.data ?? []

  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault()
    setStageError(null)
    const days = Number.parseInt(newStageDays, 10)
    if (Number.isNaN(days) || days < 1 || days > 90) {
      setStageError('Срок ношения должен быть от 1 до 90 дней')
      return
    }
    try {
      await createStage.mutateAsync({
        position: stages.length + 1,
        description: newStageDesc.trim(),
        wear_days: days,
      })
      setNewStageDesc('')
      setNewStageDays('14')
    } catch (err) {
      setStageError(extractApiError(err, 'Не удалось создать этап'))
    }
  }

  const handleUploadScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.stl')) {
      alert('Допускаются только .stl файлы')
      e.target.value = ''
      return
    }
    try {
      await uploadScan.mutateAsync(file)
    } catch (err) {
      alert(extractApiError(err, 'Не удалось загрузить скан'))
    } finally {
      e.target.value = ''
    }
  }

  const stageLabels: Record<string, string> = {
    planned: 'Запланирован',
    in_production: 'В производстве',
    produced: 'Произведено',
    in_treatment: 'В лечении',
    done: 'Завершён',
  }

  const scanLabels: Record<string, string> = {
    pending: 'В очереди',
    processing: 'Обработка',
    ready: 'Готов',
    failed: 'Ошибка',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-medical-slate-800/50 pb-6">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
            <ArrowLeft className="w-3 h-3 mr-1" /> Назад к списку
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">{patient.full_name}</h1>
            <Badge variant="info" className="text-[11px] px-3 py-1.5">
              ID: {patient.id.slice(0, 8)}...
            </Badge>
          </div>
          <p className="text-medical-slate-400">
            Год рожд.: {patient.birth_year} • {patient.doctor_id.slice(0, 8)}...
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Scan className="w-3 h-3 mr-1" /> Сканы
          </Button>
          <Button variant="emerald" size="sm" onClick={() => setNewStageDesc('')}>
            <Plus className="w-3 h-3 mr-1" /> Этап
          </Button>
        </div>
      </div>

      <Card padding="lg" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Информация о пациенте</CardTitle>
            <CardDescription>Клинические данные и история лечения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-medical-slate-800/30 border border-medical-slate-700/30">
                <p className="text-xs text-medical-slate-500 uppercase tracking-wider">Год рождения</p>
                <p className="text-xl font-bold text-slate-200">{patient.birth_year}</p>
              </div>
              <div className="p-4 rounded-xl bg-medical-slate-800/30 border border-medical-slate-700/30">
                <p className="text-xs text-medical-slate-500 uppercase tracking-wider">Статус</p>
                <Badge variant="success" className="text-[11px] px-3 py-1.5">
                  {stageLabels[patient.status] ?? patient.status}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-medical-slate-800/30 border border-medical-slate-700/30">
                <p className="text-xs text-medical-slate-500 uppercase tracking-wider">Диагноз</p>
                <p className="text-lg font-medium text-slate-200">{patient.diagnosis || 'Не указан'}</p>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="lg:col-span-1">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label htmlFor="scan-upload" className="flex items-center gap-3 w-full cursor-pointer group">
                <input
                  id="scan-upload"
                  type="file"
                  accept=".stl"
                  className="sr-only"
                  onChange={handleUploadScan}
                />
                <div className="w-full py-3 rounded-xl bg-medical-sky-500/10 border border-medical-sky-500/20 flex items-center justify-center group-hover:bg-medical-sky-500/20 transition-colors">
                  <File className="w-4 h-4 text-medical-sky-400 mr-2" />
                  <span>Загрузить STL скан</span>
                </div>
                {uploadScan.isPending && <span className="text-xs text-medical-sky-400 animate-pulse">Загрузка…</span>}
              </label>
              <form onSubmit={handleAddStage} className="space-y-3">
                <div>
                  <label className="block text-xs text-medical-slate-500 mb-1">Описание этапа</label>
                  <input
                    type="text"
                    value={newStageDesc}
                    onChange={(e) => setNewStageDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-medical-slate-800/50 border border-medical-slate-700 text-slate-200 focus:border-medical-sky-500 focus:outline-none"
                    placeholder="Например: первоначальное выравнивание"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-medical-slate-500 mb-1">Срок (дней)</label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={newStageDays}
                      onChange={(e) => setNewStageDays(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-medical-slate-800/50 border border-medical-slate-700 text-slate-200 focus:border-medical-sky-500 focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="default" disabled={createStage.isPending} className="w-full">
                    {createStage.isPending ? '…' : 'Добавить'}
                  </Button>
                </div>
                {stageError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                    {stageError}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </Card>

      <Card padding="none">
        <CardHeader className="px-6 py-4 border-none bg-transparent">
          <CardTitle className="text-white">3D просмотрщик сканов</CardTitle>
          <CardDescription className="text-medical-slate-400">
            Интерактивная визуализация STL-моделей с измерениями
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video bg-medical-slate-900 rounded-xl border border-medical-slate-700 overflow-hidden relative">
            {scans.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-medical-slate-800 flex items-center justify-center text-medical-slate-500 mb-4">
                  <Scan className="w-8 h-8" />
                </div>
                <p className="text-medical-slate-400">Сканов пока нет</p>
                <p className="text-xs text-medical-slate-500 mt-1">
                  Загрузите .stl файл для 3D визуализации
                </p>
              </div>
            )}
            {scans.map((scan) => (
              <div key={scan.id} className="absolute inset-0">
                <ScanViewer3D scan={scan} />
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-medical-slate-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scans.map((scan) => (
                <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl bg-medical-slate-800/30 border border-medical-slate-700/30">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-medical-sky-500/10 flex items-center justify-center text-medical-sky-400">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{scan.filename}</p>
                    <p className="text-xs text-medical-slate-500">{scan.size_bytes} байт</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {scanLabels[scan.status] ?? scan.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <TreatmentTimeline stages={stages} />

      <RobotProductionPanel patientId={id ?? ''} stages={stages} />
    </div>
  )
}
