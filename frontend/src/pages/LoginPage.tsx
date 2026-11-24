import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', formData.email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-medical-slate-900 mb-8">
          OrthoDent — Вход
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-medical-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-sky-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-medical-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-sky-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-medical-sky-500 hover:bg-medical-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Войти
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-medical-sky-500 hover:text-medical-sky-600 font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
