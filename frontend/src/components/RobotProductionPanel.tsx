import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Factory, Clock, CheckCircle2 } from 'lucide-react'
import { useCreateRobotJob } from '../lib/queries'
import { Button } from './ui/button'

interface Stage {
  id: string
  patient_id: string
  position: number
  description: string
  wear_days: number
  status: string
  created_at: string
}

interface RobotProductionPanelProps {
  patientId: string
  stages: Stage[]
}

export function RobotProductionPanel({ patientId, stages }: RobotProductionPanelProps) {
  const createRobotJob = useCreateRobotJob(patientId)

  const handleSendToProduction = async (stageId: string) => {
    try {
      await createRobotJob.mutateAsync(stageId)
    } catch {
      // Error handled by react-query toast equivalent
    }
  }

  const plannedStages = stages.filter((s) => s.status === 'planned')
  const productionStages = stages.filter((s) => s.status === 'in_production' || s.status === 'produced')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Производство роботов</h2>
          <p className="text-medical-slate-400 text-sm">
            Очередь задач на фрезеровку и термоформовку капп
          </p>
        </div>
        <Badge variant="info" className="text-[11px] px-3 py-1.5">
          Активных задач: {productionStages.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue of planned stages */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-medical-slate-800/30 border border-medical-slate-700/30">
            <Factory className="w-4 h-4 text-medical-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Очередь на производство</h3>
          </div>
          {plannedStages.length > 0 ? (
            <div className="space-y-2">
              {plannedStages.map((stage) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-medical-slate-800/50 border border-medical-slate-700/30 group hover:bg-medical-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-medical-slate-700 flex items-center justify-center text-[10px] text-medical-slate-400">
                      #{stage.position}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{stage.description}</p>
                      <p className="text-xs text-medical-slate-500">{stage.wear_days} дней ношения</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSendToProduction(stage.id)}
                    size="sm"
                    variant="default"
                    disabled={createRobotJob.isPending}
                    className="px-3 py-1.5 text-xs"
                  >
                    {createRobotJob.isPending ? '…' : 'В производство'}
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-medical-slate-500">Нет этапов в очереди</p>
            </div>
          )}
        </div>

        {/* Active production */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-medical-slate-800/30 border border-medical-slate-700/30">
            <Clock className="w-4 h-4 text-medical-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">В производстве</h3>
          </div>
          {productionStages.length > 0 ? (
            <div className="space-y-2">
              {productionStages.map((stage) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-medical-amber-500/10 border border-medical-amber-500/20 group hover:bg-medical-amber-500/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-medical-amber-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{stage.description}</p>
                      <p className="text-xs text-medical-amber-300">Этап #{stage.position} • фрезеровка</p>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-[10px] px-2 py-1">
                    Выполняется
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-medical-slate-500">Ничего не выполняется</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed history */}
      <div className="border-t border-medical-slate-700/30 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-medical-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">История завершённых задач</h3>
        </div>
        <div className="h-32 overflow-y-auto space-y-2">
          {stages
            .filter((s) => s.status === 'done')
            .map((stage) => (
              <div key={stage.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-medical-slate-800/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-medical-emerald-500" />
                  <span className="text-xs text-slate-300">{stage.description}</span>
                </div>
                <span className="text-xs text-medical-slate-500">{stage.wear_days} дн.</span>
              </div>
            ))}
          {stages.filter((s) => s.status === 'done').length === 0 && (
            <div className="px-4 py-4 text-center">
              <p className="text-xs text-medical-slate-500">Пока нет завершённых задач</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
