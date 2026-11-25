import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-sky-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-medical-sky-500 text-white hover:bg-medical-sky-600 shadow-medical',
        emerald:
          'bg-medical-emerald-500 text-white hover:bg-medical-emerald-600 shadow-[0_0_40px_-10px_rgba(16,185,129,0.35)]',
        amber:
          'bg-medical-amber-500 text-white hover:bg-medical-amber-600',
        slate:
          'bg-medical-slate-700 text-white hover:bg-medical-slate-600',
        ghost:
          'bg-transparent text-medical-slate-600 hover:bg-medical-slate-100 dark:hover:bg-medical-slate-800',
        outline:
          'border border-medical-slate-300 dark:border-medical-slate-700 bg-transparent text-medical-slate-700 dark:text-slate-300 hover:bg-medical-slate-50 dark:hover:bg-medical-slate-900',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export type ButtonVariant = VariantProps<typeof buttonVariants>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant['variant']
  size?: ButtonVariant['size']
}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
