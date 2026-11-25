import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Play, RotateCcw, CheckCircle2, Factory } from 'lucide-react'

const STAGE_LABELS: Record<string, string> = {
  planned: 'Запланирован',
  in_production: 'В производстве',
  produced: 'Произведено',
  in_treatment: 'В лечении',
  done: 'Завершён',
}

const STAGE_COLORS: Record<string, string> = {
  planned: 'text-medical-slate-400 border-medical-slate-700/50 bg-medical-slate-800/30',
  in_production: 'text-medical-amber-400 border-medical-amber-500/20 bg-medical-amber-500/10',
  produced: 'text-medical-emerald-400 border-medical-emerald-500/20 bg-medical-emerald-500/10',
  in_treatment: 'text-medical-sky-400 border-medical-sky-500/20 bg-medical-sky-500/10',
  done: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
}

const STAGE_STATUS_BADGE: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
  planned: 'default',
  in_production: 'warning',
  produced: 'success',
  in_treatment: 'info',
  done: 'success',
}

interface Stage {
  id: string
  patient_id: string
  position: number
  description: string
  wear_days: number
  status: string
  created_at: string
}

interface TreatmentTimelineProps {
  stages: Stage[]
}

export function TreatmentTimeline({ stages }: TreatmentTimelineProps) {
  const sorted = [...stages].sort((a, b) => a.position - b.position)
  const totalStages = sorted.length
  const completedStages = sorted.filter((s) => s.status === 'done' || s.status === 'produced').length
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">План лечения</h2>
          <p className="text-medical-slate-400 text-sm">
            {totalStages} этапов • {completedStages} завершено
          </p>
        </div>
        <div className="w-24 h-24 rounded-full border-4 border-medical-slate-800/50 border-medical-emerald-500/{progress} flex items-center justify-center relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full conic-gradient from-medical-emerald-500 via-medical-sky-500 to-medical-emerald-500" style={{ transform: `rotate(${progress * 3.6}deg)` }} />
            <div className="w-14 h-14 rounded-full bg-medical-slate-950 flex items-center justify-center border border-medical-slate-800">
              <span className="text-lg font-bold text-medical-emerald-400">{progress}%</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-medical-slate-700/30" />
        {sorted.map((stage, index) => {
          const isLast = index === sorted.length - 1
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12 pb-8"
            >
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-medical-slate-700 bg-medical-slate-900 z-10" />
              {!isLast && (
                <div className="absolute left-1.5 top-8 bottom-2 w-0.5 bg-medical-slate-700/30" />
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg ${STAGE_COLORS[stage.status]}`}
                >
                  <span className="text-[10px] font-bold">{stage.position}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-200">{`${stage.position}. ${stage.description}`}</h3>
                    <Badge variant={STAGE_STATUS_BADGE[stage.status]} className="text-[10px] px-2 py-1">
                      {STAGE_LABELS[stage.status] ?? stage.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-medical-slate-500">
                    Срок ношения: {stage.wear_days} дн.
                  </p>
                  {stage.status === 'planned' && (
                    <button className="mt-2 inline-flex items-center gap-1 text-medical-sky-400 text-xs font-medium hover:text-medical-sky-300 transition-colors">
                      <RotateCcw className="w-3 h-3" /> Отправить в производство
                    </button>
                  )}
                  {stage.status === 'produced' && (
                    <button className="mt-2 inline-flex items-center gap-1 text-medical-emerald-400 text-xs font-medium hover:text-medical-emerald-300 transition-colors">
                      <CheckCircle2 className="w-3 h-3" /> Готово к примерке
                    </button>
                  )}
                  {stage.status === 'in_treatment' && (
                    <button className="mt-2 inline-flex items-center gap-1 text-medical-sky-400 text-xs font-medium hover:text-medical-sky-300 transition-colors">
                      <Play className="w-3 h-3" /> В лечении
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
        {sorted.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-medical-slate-800 flex items-center justify-center mx-auto text-medical-slate-500 mb-3">
              <Factory className="w-6 h-6" />
            </div>
            <p className="text-medical-slate-500 text-sm">План лечения пока не создан</p>
          </div>
        )}
      </div>
    </div>
  )
}
