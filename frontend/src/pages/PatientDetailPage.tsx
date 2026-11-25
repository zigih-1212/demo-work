import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  extractApiError,
  useCreateRobotJob,
  useCreateStage,
  usePatient,
  useScans,
  useStages,
  useUploadScan,
} from '../lib/queries'

const STAGE_STATUS_LABELS: Record<string, string> = {
  planned: 'Запланирован',
  in_production: 'В производстве',
  produced: 'Произведено',
  in_treatment: 'В лечении',
  done: 'Завершён',
}

const PATIENT_STATUS_LABELS: Record<string, string> = {
  active: 'Активен',
  completed: 'Завершён',
  archived: 'Архив',
}

const STAGE_STATUS_STYLES: Record<string, string> = {
  planned: 'bg-slate-100 text-slate-800',
  in_production: 'bg-amber-100 text-amber-800',
  produced: 'bg-medical-emerald-100 text-medical-emerald-800',
  in_treatment: 'bg-medical-sky-100 text-medical-sky-800',
  done: 'bg-emerald-100 text-emerald-800',
}

const SCAN_STATUS_LABELS: Record<string, string> = {
  pending: 'В очереди',
  processing: 'Обработка',
  ready: 'Готов',
  failed: 'Ошибка',
}

const SCAN_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-800',
  processing: 'bg-amber-100 text-amber-800',
  ready: 'bg-medical-emerald-100 text-medical-emerald-800',
  failed: 'bg-red-100 text-red-800',
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ru-RU')
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stageError, setStageError] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [jobError, setJobError] = useState<string | null>(null)
  const [stageDescription, setStageDescription] = useState('')
  const [stageWearDays, setStageWearDays] = useState('14')

  const patientQuery = usePatient(id)
  const stagesQuery = useStages(id)
  const scansQuery = useScans(id)
  const createStage = useCreateStage(id ?? '')
  const uploadScan = useUploadScan(id ?? '')
  const createRobotJob = useCreateRobotJob(id ?? '')

  if (patientQuery.isLoading) {
    return (
      <div className="py-16 text-center text-slate-500" role="status">
        Загружаем карточку пациента…
      </div>
    )
  }

  if (patientQuery.isError) {
    return (
      <div className="py-12 text-center" role="alert">
        <p className="text-red-700">
          {extractApiError(patientQuery.error, 'Не удалось загрузить пациента')}
        </p>
        <Link to="/" className="mt-4 inline-block text-medical-sky-600 hover:underline">
          ← К списку пациентов
        </Link>
      </div>
    )
  }

  const patient = patientQuery.data
  if (!patient) {
    return (
      <div className="py-12 text-center text-slate-500">
        Пациент не найден.
        <Link to="/" className="mt-4 block text-medical-sky-600 hover:underline">
          ← К списку пациентов
        </Link>
      </div>
    )
  }

  const stages = stagesQuery.data ?? []
  const scans = scansQuery.data ?? []

  const handleCreateStage = async (e: React.FormEvent) => {
    e.preventDefault()
    setStageError(null)
    const wearDays = Number.parseInt(stageWearDays, 10)
    if (!Number.isFinite(wearDays) || wearDays < 1 || wearDays > 90) {
      setStageError('Срок ношения должен быть от 1 до 90 дней')
      return
    }
    try {
      await createStage.mutateAsync({
        position: stages.length + 1,
        description: stageDescription.trim(),
        wear_days: wearDays,
      })
      setStageDescription('')
      setStageWearDays('14')
    } catch (err) {
      setStageError(extractApiError(err, 'Не удалось создать этап'))
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanError(null)
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setScanError('Допускаются только .stl файлы')
      e.target.value = ''
      return
    }
    try {
      await uploadScan.mutateAsync(file)
    } catch (err) {
      setScanError(extractApiError(err, 'Не удалось загрузить скан'))
    } finally {
      e.target.value = ''
    }
  }

  const handleSendToProduction = async (stageId: string) => {
    setJobError(null)
    try {
      await createRobotJob.mutateAsync(stageId)
    } catch (err) {
      setJobError(extractApiError(err, 'Не удалось отправить этап в производство'))
    }
  }

  const cardClass = 'rounded-lg bg-white p-6 shadow-md'

  return (
    <div className="space-y-6">
      <Link to="/" className="font-medium text-medical-sky-600 hover:text-medical-sky-900">
        ← Назад к списку пациентов
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{patient.full_name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Добавлен {formatDate(patient.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className={cardClass} aria-labelledby="patient-info-heading">
          <h2 id="patient-info-heading" className="mb-4 text-xl font-semibold text-slate-900">
            Информация о пациенте
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-slate-500">Год рождения</dt>
              <dd className="text-base text-slate-900">{patient.birth_year}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Диагноз</dt>
              <dd className="text-base text-slate-900">
                {patient.diagnosis || <span className="text-slate-400">Не указан</span>}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Статус лечения</dt>
              <dd className="text-base text-slate-900">
                {PATIENT_STATUS_LABELS[patient.status] ?? patient.status}
              </dd>
            </div>
          </dl>
        </section>

        <section className={cardClass} aria-labelledby="scans-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="scans-heading" className="text-xl font-semibold text-slate-900">
              Сканы пациента
            </h2>
            <div>
              <input
                ref={fileInputRef}
                id="scan-file"
                type="file"
                accept=".stl"
                className="sr-only"
                onChange={handleUpload}
              />
              <label
                htmlFor="scan-file"
                className="cursor-pointer rounded-md bg-medical-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-medical-sky-600"
              >
                {uploadScan.isPending ? 'Загружаем…' : '+ Загрузить .stl'}
              </label>
            </div>
          </div>

          {scanError && (
            <div
              role="alert"
              className="mb-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {scanError}
            </div>
          )}

          {scansQuery.isLoading && (
            <p className="py-8 text-center text-slate-500" role="status">
              Загружаем сканы…
            </p>
          )}

          {!scansQuery.isLoading && scans.length === 0 && (
            <p className="rounded-md border border-dashed border-slate-300 py-8 text-center text-slate-500">
              Сканов пока нет. Загрузите STL-модель для анализа.
            </p>
          )}

          <ul className="space-y-3">
            {scans.map((scan) => (
              <li
                key={scan.id}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{scan.filename}</p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(scan.size_bytes)} • {formatDate(scan.created_at)}
                  </p>
                  {scan.error && <p className="mt-1 text-xs text-red-600">{scan.error}</p>}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                    SCAN_STATUS_STYLES[scan.status] ?? 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {SCAN_STATUS_LABELS[scan.status] ?? scan.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={cardClass} aria-labelledby="stages-heading">
        <h2 id="stages-heading" className="mb-4 text-xl font-semibold text-slate-900">
          Этапы лечения
        </h2>

        {jobError && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {jobError}
          </div>
        )}

        {stagesQuery.isLoading && (
          <p className="py-8 text-center text-slate-500" role="status">
            Загружаем этапы…
          </p>
        )}

        {!stagesQuery.isLoading && stages.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 py-8 text-center text-slate-500">
            План лечения пока не создан. Добавьте первый этап.
          </p>
        )}

        <ul className="space-y-3">
          {stages.map((stage) => (
            <li
              key={stage.id}
              className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-medical-sky-600">#{stage.position}</span>
                  <p className="min-w-0 break-words text-sm font-medium text-slate-900">
                    {stage.description || 'Без описания'}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Плановый срок ношения: {stage.wear_days} дн.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    STAGE_STATUS_STYLES[stage.status] ?? 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {STAGE_STATUS_LABELS[stage.status] ?? stage.status}
                </span>

                {stage.status === 'planned' && (
                  <button
                    type="button"
                    onClick={() => handleSendToProduction(stage.id)}
                    disabled={createRobotJob.isPending}
                    className="rounded-md border border-medical-sky-300 px-3 py-1.5 text-sm font-medium text-medical-sky-700 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    На производство
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCreateStage} className="mt-6 space-y-3 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-semibold text-slate-900">Добавить этап</h3>

          {stageError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {stageError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="stage-description" className="mb-2 block text-sm font-medium text-slate-700">
                Описание
              </label>
              <input
                id="stage-description"
                type="text"
                value={stageDescription}
                onChange={(e) => setStageDescription(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40"
                placeholder="Например: первоначальное выравнивание"
              />
            </div>

            <div>
              <label htmlFor="stage-wear-days" className="mb-2 block text-sm font-medium text-slate-700">
                Срок ношения, дн.
              </label>
              <input
                id="stage-wear-days"
                type="number"
                min={1}
                max={90}
                value={stageWearDays}
                onChange={(e) => setStageWearDays(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createStage.isPending}
            className="rounded-md bg-medical-sky-500 px-5 py-2 font-semibold text-white transition-colors hover:bg-medical-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createStage.isPending ? 'Добавляем…' : 'Добавить этап'}
          </button>
        </form>
      </section>
    </div>
  )
}
