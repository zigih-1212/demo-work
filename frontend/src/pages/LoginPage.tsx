import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useLogin } from '../lib/queries'
import { extractApiError } from '../lib/queries'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-medical-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-medical-sky-500/20 flex items-center justify-center text-medical-sky-400 mb-4">
            <span className="text-[14px] font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">OrthoDent</h1>
          <p className="text-medical-slate-400 mt-2">
            Управление ортодонтическим лечением
          </p>
        </div>

        <Card padding="lg" className="glass">
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>
              Введите свои учётные данные для доступа к клинике
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-300 text-sm"
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-medical-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-slate-500" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-medical-slate-900 border border-medical-slate-700 text-slate-200 placeholder-medical-slate-500 focus:border-medical-sky-500 focus:outline-none focus:ring-1 focus:ring-medical-sky-500 transition-all"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-medical-slate-300">
                    Пароль
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-medical-sky-400 hover:text-medical-sky-300 transition-colors"
                  >
                    {showPassword ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-medical-slate-900 border border-medical-slate-700 text-slate-200 placeholder-medical-slate-500 focus:border-medical-sky-500 focus:outline-none focus:ring-1 focus:ring-medical-sky-500 transition-all"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
                <Button
                type="submit"
                variant="default"
                className="w-full py-3 shadow-[0_0_40px_-10px_rgba(14,165,233,0.3)]"
                disabled={login.isPending}
              >
                {login.isPending ? (
                  <ArrowRight className="w-4 h-4 animate-spin" />
                ) : (
                  'Войти'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-medical-slate-400">
              Нет аккаунта?{' '}
              <Link
                to="/register"
                className="text-medical-sky-400 hover:text-medical-sky-300 font-medium"
              >
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
