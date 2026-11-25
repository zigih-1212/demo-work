import { cn } from '../../lib/utils'

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'info'
  children: React.ReactNode
}

export function Badge({
  className,
  variant = 'default',
  children,
}: BadgeProps) {
  const variants = {
    default: 'bg-medical-slate-100 text-medical-slate-800 dark:bg-medical-slate-800 dark:text-medical-slate-200',
    secondary:
      'bg-medical-slate-200 text-medical-slate-700 dark:bg-medical-slate-700 dark:text-slate-300',
    destructive: 'bg-red-500 text-white',
    outline:
      'border border-medical-slate-300 dark:border-medical-slate-700 bg-transparent text-medical-slate-700 dark:text-slate-300',
    success: 'bg-medical-emerald-100 text-medical-emerald-800 dark:bg-medical-emerald-900/50 dark:text-medical-emerald-300',
    warning: 'bg-medical-amber-100 text-medical-amber-800 dark:bg-medical-amber-900/50 dark:text-medical-amber-300',
    info: 'bg-medical-sky-100 text-medical-sky-800 dark:bg-medical-sky-900/50 dark:text-medical-sky-300',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
