import { Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-medical-slate-950 p-8 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 rounded-full bg-medical-slate-900 border border-medical-slate-700 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-medical-sky-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-medical-slate-400 mb-2">Страница не найдена</p>
        <p className="text-medical-slate-500 mb-8">
          Запрашиваемый адрес не существует. Вернитесь на главную.
        </p>
        <Button variant="default" className="shadow-[0_0_40px_-10px_rgba(14,165,233,0.3)]">
          <Link to="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> На главную
          </Link>
        </Button>
      </div>
    </div>
  )
}
