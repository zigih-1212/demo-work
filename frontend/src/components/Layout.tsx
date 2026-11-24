import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from '../lib/auth'
import { useCurrentUser } from '../lib/queries'

const NAV_LINKS = [
  { to: '/', label: 'Пациенты', end: true },
]

export default function Layout() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()

  const handleLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-medical-sky-600">
              OrthoDent
            </Link>
            <nav className="hidden gap-1 md:flex" aria-label="Основная навигация">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-medical-sky-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medical-sky-600"
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
