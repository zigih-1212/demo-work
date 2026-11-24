import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { extractApiError, useLogin } from '../lib/queries'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const login = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login.mutateAsync(formData)
      navigate('/', { replace: true })
    } catch (err) {
      setError(extractApiError(err, 'Не удалось войти'))
    }
  }

  const fieldClass =
    'w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-medical-sky-600">OrthoDent</span>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">Вход в систему</h1>
          <p className="mt-1 text-sm text-slate-500">
            Управление ортодонтическим лечением пациентов
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={fieldClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-md bg-medical-sky-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-medical-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {login.isPending ? 'Входим…' : 'Войти'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Нет аккаунта?{' '}
          <Link
            to="/register"
            className="font-medium text-medical-sky-600 hover:text-medical-sky-800"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
