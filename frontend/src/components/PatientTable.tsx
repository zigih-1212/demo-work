import { Link } from 'react-router-dom'

interface Patient {
  id: string
  full_name: string
  birth_year: number
  diagnosis: string
  status: 'active' | 'completed' | 'archived'
}

interface PatientTableProps {
  patients: Patient[]
}

export default function PatientTable({ patients }: PatientTableProps) {
  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'active':
        return 'bg-medical-emerald-100 text-medical-emerald-800'
      case 'completed':
        return 'bg-medical-sky-100 text-medical-sky-800'
      case 'archived':
        return 'bg-medical-slate-100 text-medical-slate-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-medical-slate-200">
          <thead className="bg-medical-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-medical-slate-500 uppercase tracking-wider">
                Пациент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-medical-slate-500 uppercase tracking-wider">
                Год рождения
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-medical-slate-500 uppercase tracking-wider">
                Диагноз
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-medical-slate-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-medical-slate-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-medical-slate-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {patient.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {patient.birth_year}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {patient.diagnosis}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status === 'active' && 'Активен'}
                    {patient.status === 'completed' && 'Завершён'}
                    {patient.status === 'archived' && 'Архив'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

      {patients.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Нет пациентов для отображения
        </div>
      )}
    </div>
  )
}
