import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают')
      return
    }
    console.log('Registration attempt:', formData.email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-medical-slate-900 mb-8">
          OrthoDent — Регистрация
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
              ФИО
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-medical-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-sky-500 focus:border-transparent"
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-medical-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-sky-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-medical-sky-500 hover:bg-medical-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-medical-sky-500 hover:text-medical-sky-600 font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
