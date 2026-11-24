import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-medical-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-medical-sky-600">
                OrthoDent
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-medical-sky-600 hover:bg-slate-100"
                >
                  Пациенты
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-medical-slate-600 hover:text-medical-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
