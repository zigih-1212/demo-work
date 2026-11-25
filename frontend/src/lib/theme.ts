/**
 * OrthoDent — Design tokens (dark medical theme).
 * Mirrors backend schemas where applicable.
 */

export const MEDICAL_COLORS = {
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

export const STATUS_CONFIG = {
  patient: {
    active: { label: 'Активен', color: 'emerald', badge: 'bg-medical-emerald-100 text-medical-emerald-800' },
    completed: { label: 'Завершён', color: 'sky', badge: 'bg-medical-sky-100 text-medical-sky-800' },
    archived: { label: 'Архив', color: 'slate', badge: 'bg-medical-slate-100 text-medical-slate-800' },
  },
  stage: {
    planned: { label: 'Запланирован', color: 'slate', badge: 'bg-medical-slate-100 text-medical-slate-800' },
    in_production: { label: 'В производстве', color: 'amber', badge: 'bg-medical-amber-100 text-medical-amber-800' },
    produced: { label: 'Произведено', color: 'emerald', badge: 'bg-medical-emerald-100 text-medical-emerald-800' },
    in_treatment: { label: 'В лечении', color: 'sky', badge: 'bg-medical-sky-100 text-medical-sky-800' },
    done: { label: 'Завершён', color: 'emerald', badge: 'bg-emerald-100 text-emerald-800' },
  },
  scan: {
    pending: { label: 'В очереди', color: 'slate', badge: 'bg-medical-slate-100 text-medical-slate-800' },
    processing: { label: 'Обработка', color: 'amber', badge: 'bg-medical-amber-100 text-medical-amber-800' },
    ready: { label: 'Готов', color: 'emerald', badge: 'bg-medical-emerald-100 text-medical-emerald-800' },
    failed: { label: 'Ошибка', color: 'red', badge: 'bg-red-100 text-red-800' },
  },
  job: {
    queued: { label: 'В очереди', color: 'slate', badge: 'bg-medical-slate-100 text-medical-slate-800' },
    running: { label: 'Выполняется', color: 'sky', badge: 'bg-medical-sky-100 text-medical-sky-800' },
    completed: { label: 'Готово', color: 'emerald', badge: 'bg-medical-emerald-100 text-medical-emerald-800' },
    failed: { label: 'Ошибка', color: 'red', badge: 'bg-red-100 text-red-800' },
  },
} as const;

export const GRADIENTS = {
  medical: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
  medicalDark: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
} as const;
