import { useMemo, useState } from 'react'
import PatientTable from '../components/PatientTable'
import { extractApiError, useCreatePatient, usePatients } from '../lib/queries'

const PAGE_SIZE = 20

interface NewPatientForm {
  full_name: string
  birth_year: string
  diagnosis: string
}

const EMPTY_FORM: NewPatientForm = { full_name: '', birth_year: '', diagnosis: '' }

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewPatientForm>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, isLoading, isError, error, refetch } = usePatients({
    limit: PAGE_SIZE,
    offset,
  })
  const createPatient = useCreatePatient()

  const patients = useMemo(() => {
    const items = data?.items ?? []
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter(
      (p) =>
        p.full_name.toLowerCase().includes(query) ||
        (p.diagnosis ?? '').toLowerCase().includes(query),
    )
  }, [data?.items, search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setActionError(null)

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
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err) {
      setFormError(extractApiError(err, 'Не удалось создать пациента'))
    }
  }

  const total = data?.total ?? 0
  const canGoBack = offset > 0
  const canGoNext = offset + PAGE_SIZE < total

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Пациенты</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? 'Загрузка…' : `Всего в базе: ${total}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev)
            setFormError(null)
          }}
          className="rounded-md bg-medical-sky-500 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-medical-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-sky-600"
        >
          {showForm ? 'Отменить' : '+ Добавить пациента'}
        </button>
      </div>

      {actionError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white p-6 shadow-md"
          noValidate
        >
          <h2 className="text-lg font-semibold text-slate-900">Новый пациент</h2>

          {formError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">
                ФИО пациента
              </label>
              <input
                id="full_name"
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40"
                required
              />
            </div>

            <div>
              <label htmlFor="birth_year" className="mb-2 block text-sm font-medium text-slate-700">
                Год рождения
              </label>
              <input
                id="birth_year"
                type="number"
                min={1900}
                max={2100}
                value={form.birth_year}
                onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40"
                required
              />
            </div>

            <div>
              <label htmlFor="diagnosis" className="mb-2 block text-sm font-medium text-slate-700">
                Диагноз
              </label>
              <input
                id="diagnosis"
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createPatient.isPending}
            className="rounded-md bg-medical-sky-500 px-5 py-2 font-semibold text-white transition-colors hover:bg-medical-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createPatient.isPending ? 'Сохраняем…' : 'Сохранить пациента'}
          </button>
        </form>
      )}

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Поиск по имени или диагнозу
          </label>
          <input
            id="search"
            type="search"
            placeholder="Поиск по имени или диагнозу…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-md border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40"
          />
        </div>

        {isLoading && (
          <div className="py-16 text-center text-slate-500" role="status">
            Загружаем список пациентов…
          </div>
        )}

        {isError && (
          <div className="py-12 text-center" role="alert">
            <p className="text-red-700">{extractApiError(error, 'Не удалось загрузить пациентов')}</p>
            <button
              type="button"
              onClick={() => {
                setActionError(null)
                void refetch()
              }}
              className="mt-4 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Повторить
            </button>
          </div>
        )}

        {!isLoading && !isError && <PatientTable patients={patients} />}

        {!isLoading && !isError && total > PAGE_SIZE && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Показано {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} из {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canGoBack}
                onClick={() => setOffset((prev) => Math.max(0, prev - PAGE_SIZE))}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Назад
              </button>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
