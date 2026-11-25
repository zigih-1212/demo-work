import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, User, LayoutDashboard, Scan, Settings, RotateCcw } from 'lucide-react'
import { clearToken } from '../lib/auth'

const NAV_ITEMS = [
  { to: '/', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/patients', label: 'Пациенты', icon: User },
  { to: '/scans', label: '3D сканы', icon: Scan },
  { to: '/production', label: 'Производство', icon: RotateCcw },
  { to: '/settings', label: 'Настройки', icon: Settings },
]

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-medical-slate-950 text-slate-100 selection:bg-medical-sky-500/30">
      <header className="border-b border-medical-slate-800/50 bg-medical-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 bg-medical-sky-500/10 p-2 rounded-xl border border-medical-sky-500/20 hover:border-medical-sky-400/30 transition-all group"
            >
              <div
                className="w-7 h-7 rounded-lg bg-medical-sky-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500"
              >
                <span className="text-[10px] font-bold text-white">O</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-medical-sky-400 to-medical-emerald-400 bg-clip-text text-transparent">
                OrthoDent
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-medical-sky-500/10 text-medical-sky-400 border border-medical-sky-500/20'
                          : 'text-medical-slate-400 hover:text-medical-slate-200 hover:bg-medical-slate-800/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-medical-slate-400 hover:text-medical-slate-200 hover:bg-medical-slate-800 transition-all border border-transparent hover:border-medical-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Выход
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 relative">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
