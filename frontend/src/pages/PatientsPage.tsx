import { useState } from 'react'
import PatientTable from '../components/PatientTable'

interface Patient {
  id: string
  full_name: string
  birth_year: number
  diagnosis: string
  status: 'active' | 'completed' | 'archived'
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock data для демонстрации
  const patients: Patient[] = [
    {
      id: '1',
      full_name: 'Иванов Иван Иванович',
      birth_year: 1985,
      diagnosis: 'Перекрестный прикус, класс II по Энглю',
      status: 'active'
    },
    {
      id: '2',
      full_name: 'Петрова Мария Сергеевна',
      birth_year: 1990,
      diagnosis: 'Глубокий прикус, асимметрия нижней челюсти',
      status: 'active'
    },
    {
      id: '3',
      full_name: 'Сидоров Алексей Петрович',
      birth_year: 1978,
      diagnosis: 'Открытый прикус верхней челюсти',
      status: 'completed'
    },
    {
      id: '4',
      full_name: 'Козлова Елена Андреевна',
      birth_year: 1995,
      diagnosis: 'Скученность зубов, ретенция клыков',
      status: 'archived'
    }
  ]

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-medical-slate-900">Пациенты</h1>
        <button className="bg-medical-sky-500 hover:bg-medical-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 shadow-sm">
          + Добавить пациента
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Поиск по имени или диагнозу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-medical-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-sky-500 focus:border-transparent"
          />
        </div>

        <PatientTable patients={filteredPatients} />
      </div>
    </div>
  )
}
