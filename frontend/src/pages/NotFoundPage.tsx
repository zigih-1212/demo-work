import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-medical-sky-500">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Страница не найдена</h1>
        <p className="mt-2 text-slate-600">Проверьте адрес или вернитесь к списку пациентов.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-medical-sky-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-medical-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-sky-600"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
