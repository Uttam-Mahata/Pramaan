import React from 'react'
import { UserCircle, FileCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { OFFICER_DASHBOARD_DATA } from '@/data/mockData'

export const AnalysisHeader: React.FC = () => {
  const { activeApplication } = OFFICER_DASHBOARD_DATA

  return (
    <Card className="bg-white border-2 border-security-border p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-pramaan-blue/5 border border-pramaan-blue/10 flex items-center justify-center rounded-sm">
          <UserCircle className="w-10 h-10 text-pramaan-blue" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tighter uppercase">{activeApplication.id}</h2>
            <span className="text-[10px] font-mono font-bold bg-steel-surface px-2 py-0.5 border border-security-border rounded-sm text-muted-signal tracking-widest">{activeApplication.segment}</span>
          </div>
          <p className="text-[10px] text-muted-signal flex items-center gap-1.5 font-bold uppercase tracking-widest">
            <FileCheck className="w-3.5 h-3.5 text-pramaan-blue" /> VERIFIED AA CONSENT: <span className="font-mono text-dossier-ink">{activeApplication.consentTimestamp}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12 w-full lg:w-auto">
        <div className="text-center lg:text-left space-y-1">
          <div className="text-[9px] font-bold text-muted-signal uppercase tracking-[0.2em]">Pramaan Score</div>
          <div className="text-4xl font-mono font-black text-pramaan-blue tracking-tighter">{activeApplication.score}</div>
        </div>
        <div className="text-center lg:text-left space-y-1">
          <div className="text-[9px] font-bold text-muted-signal uppercase tracking-[0.2em]">Risk Prob.</div>
          <div className="text-4xl font-mono font-black tracking-tighter">{activeApplication.probability}</div>
        </div>
        <div className="text-center lg:text-left space-y-1">
          <div className="text-[9px] font-bold text-muted-signal uppercase tracking-[0.2em]">Confidence</div>
          <div className="text-4xl font-mono font-black text-green-600 tracking-tighter">{activeApplication.confidence}</div>
        </div>
      </div>
    </Card>
  )
}
