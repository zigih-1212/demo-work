import { Link } from 'react-router-dom'
import type { Patient } from '../types'

interface PatientTableProps {
  patients: Patient[]
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Активен',
  completed: 'Завершён',
  archived: 'Архив',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-medical-emerald-100 text-medical-emerald-800',
  completed: 'bg-medical-sky-100 text-medical-sky-800',
  archived: 'bg-medical-slate-100 text-medical-slate-800',
}

export default function PatientTable({ patients }: PatientTableProps) {
  if (patients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-slate-700">Пациентов пока нет</p>
        <p className="mt-1 text-sm text-slate-500">
          Добавьте первого пациента, чтобы начать вести лечение.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Пациент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Год рождения
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Диагноз
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {patients.map((patient) => (
              <tr key={patient.id} className="transition-colors hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{patient.full_name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {patient.birth_year}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {patient.diagnosis || <span className="text-slate-400">—</span>}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      STATUS_STYLES[patient.status] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {STATUS_LABELS[patient.status] ?? patient.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    to={`/patients/${patient.id}`}
                    className="text-medical-sky-600 hover:text-medical-sky-900"
                  >
                    Подробнее →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
