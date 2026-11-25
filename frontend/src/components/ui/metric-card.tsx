import { cn } from '../../lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
  accent?: 'sky' | 'emerald' | 'amber' | 'slate'
}

const ACCENT_COLORS = {
  sky: 'text-medical-sky-500 border-medical-sky-500/30 dark:text-medical-sky-400',
  emerald: 'text-medical-emerald-500 border-medical-emerald-500/30 dark:text-medical-emerald-400',
  amber: 'text-medical-amber-500 border-medical-amber-500/30 dark:text-medical-amber-400',
  slate: 'text-medical-slate-500 border-medical-slate-500/30 dark:text-medical-slate-400',
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  icon,
  accent = 'sky',
}: MetricCardProps) {
  const trendLabels = {
    up: 'рост',
    down: 'снижение',
    neutral: 'без изменений',
  }

  const trendStyles = {
    up: 'text-medical-emerald-600 dark:text-medical-emerald-400',
    down: 'text-red-500 dark:text-red-400',
    neutral: 'text-medical-slate-500 dark:text-medical-slate-400',
  }

  return (
    <div className="rounded-2xl border border-medical-slate-200/50 dark:border-medical-slate-700/50 bg-white dark:bg-medical-slate-900 shadow-glass p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          {icon && (
            <div
              className={cn(
                'rounded-lg p-2 bg-medical-slate-100 dark:bg-medical-slate-800/50',
                ACCENT_COLORS[accent],
              )}
            >
              {icon}
            </div>
          )}
          <div className="ml-auto text-right min-w-0">
            {trend && trendValue && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn('flex h-1.5 w-1.5 rounded-full', trendStyles[trend])} />
                <span className={cn(trendStyles[trend])}>
                  {trendValue} {trendLabels[trend]}
                </span>
              </div>
            )}
            <p className="text-sm font-medium text-medical-slate-700 dark:text-slate-300">
              {title}
            </p>
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-medical-slate-900 dark:text-slate-100">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-medical-slate-500 dark:text-medical-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
