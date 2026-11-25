import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glass?: boolean
}

export function Card({
  children,
  className,
  padding = 'md',
  glass = false,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-medical-slate-200/50 dark:border-medical-slate-700/50 bg-white dark:bg-medical-slate-900 shadow-glass transition-all',
        glass && 'backdrop-blur-md bg-white/80 dark:bg-medical-slate-900/80 border-white/20 dark:border-medical-slate-800/50',
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-6', className)}>{children}</div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-2xl font-semibold tracking-tight text-medical-slate-900 dark:text-slate-100',
        className,
      )}
    >
      {children}
    </h3>
  )
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-sm text-medical-slate-500 dark:text-medical-slate-400',
        className,
      )}
    >
      {children}
    </p>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={cn('pt-0', className)}>{children}</div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn('mt-6 flex items-center gap-4 border-t border-medical-slate-100 dark:border-medical-slate-800/50 pt-6', className)}
    >
      {children}
    </div>
  )
}
