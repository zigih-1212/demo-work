import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { extractApiError, useLogin, useRegister } from '../lib/queries'

interface RegisterForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const register = useRegister()
  const login = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    if (formData.password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов')
      return
    }

    try {
      await register.mutateAsync({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      })
      // Log the freshly created doctor in so the workflow stays linear.
      await login.mutateAsync({ email: formData.email, password: formData.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(extractApiError(err, 'Не удалось зарегистрироваться'))
    }
  }

  const fieldClass =
    'w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-medical-sky-500 focus:outline-none focus:ring-2 focus:ring-medical-sky-500/40'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-medical-sky-600">OrthoDent</span>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">Регистрация врача</h1>
          <p className="mt-1 text-sm text-slate-500">
            Создайте рабочее место для ведения пациентов
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
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
              ФИО
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={fieldClass}
              required
            />
          </div>

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
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={fieldClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={register.isPending || login.isPending}
            className="w-full rounded-md bg-medical-sky-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-medical-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {register.isPending ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-medical-sky-600 hover:text-medical-sky-800">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
