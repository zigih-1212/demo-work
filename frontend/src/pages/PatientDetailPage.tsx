import { useParams } from 'react-router-dom'

export default function PatientDetailPage() {
  const { id } = useParams() as { id: string }

  // Mock data для демонстрации
  const patient = {
    id,
    full_name: 'Иванов Иван Иванович',
    birth_year: 1985,
    diagnosis: 'Перекрестный прикус, класс II по Энглю',
    status: 'active',
    scans: [
      { id: '1', filename: 'scan_001.stl', size: '12.4 MB', uploadedAt: '2026-11-20', status: 'ready' },
      { id: '2', filename: 'scan_002.stl', size: '8.7 MB', uploadedAt: '2026-11-21', status: 'processing' }
    ],
    stages: [
      { id: '1', position: 1, description: 'Первоначальное выравнивание зубов', wearDays: 90, status: 'planned' },
      { id: '2', position: 2, description: 'Коррекция межзубных промежутков', wearDays: 60, status: 'in_production' },
      { id: '3', position: 3, description: 'Финишная корректировка прикуса', wearDays: 30, status: 'planned' }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-slate-100 text-slate-800'
      case 'in_production':
        return 'bg-amber-100 text-amber-800'
      case 'produced':
        return 'bg-medical-emerald-100 text-medical-emerald-800'
      case 'in_treatment':
        return 'bg-medical-sky-100 text-medical-sky-800'
      case 'done':
        return 'bg-emerald-100 text-emerald-800'
      case 'ready':
        return 'bg-medical-emerald-100 text-medical-emerald-800'
      case 'processing':
        return 'bg-amber-100 text-amber-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => window.history.back()}
        className="text-medical-sky-600 hover:text-medical-sky-900 font-medium"
      >
        ← Назад к списку пациентов
      </button>

      <h1 className="text-3xl font-bold text-medical-slate-900">{patient.full_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-medical-slate-900 mb-4">Информация о пациенте</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-medical-slate-500">Год рождения</dt>
              <dd className="text-base text-medical-slate-900">{patient.birth_year}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-medical-slate-500">Диагноз</dt>
              <dd className="text-base text-medical-slate-900">{patient.diagnosis}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-medical-slate-500">Статус лечения</dt>
              <dd className="text-base text-medical-slate-900 capitalize">
                {patient.status === 'active' && 'Активен'}
                {patient.status === 'completed' && 'Завершён'}
                {patient.status === 'archived' && 'Архив'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-medical-slate-900 mb-4">Сканы пациента</h2>
          <div className="space-y-3">
            {patient.scans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-medical-slate-200">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{scan.filename}</p>
                  <p className="text-xs text-slate-500">{scan.size} • {scan.uploadedAt}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scan.status)}`}>
                  {scan.status === 'ready' && 'Готов'}
                  {scan.status === 'processing' && 'Обработка'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-medical-slate-900 mb-4">Этапы лечения</h2>
        <div className="space-y-3">
          {patient.stages.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-medical-slate-200">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-medical-sky-600">#{stage.position}</span>
                  <p className="text-sm font-medium text-slate-900">{stage.description}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">Плановый срок: {stage.wearDays} дней</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(stage.status)}`}>
                {stage.status === 'planned' && 'Запланирован'}
                {stage.status === 'in_production' && 'В производстве'}
                {stage.status === 'produced' && 'Произведено'}
                {stage.status === 'in_treatment' && 'В лечении'}
                {stage.status === 'done' && 'Завершен'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
