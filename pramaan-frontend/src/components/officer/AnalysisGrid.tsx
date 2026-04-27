import React from 'react'
import { CheckCircle2, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { OFFICER_DASHBOARD_DATA } from '@/data/mockData'
import { cn } from '@/lib/utils'

export const AnalysisGrid: React.FC = () => {
  const { activeApplication } = OFFICER_DASHBOARD_DATA

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Final Recommendation */}
      <Card className="border-l-4 border-l-green-600 flex flex-col h-full relative overflow-hidden shadow-sm group">
        <div className="p-8 pb-0">
          <h3 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.2em] mb-4">Final Recommendation</h3>
          <div className="text-3xl font-black text-green-700 uppercase tracking-tighter mb-2">APPROVE</div>
          <p className="text-xs text-dossier-ink/70 leading-relaxed font-medium">
            High-confidence low-risk profile. Meets all primary cashflow benchmarks for current exposure.
          </p>
        </div>
        <div className="mt-auto p-8 pt-0 flex gap-3">
          <Button className="flex-1 bg-green-600 hover:bg-green-700 h-10 uppercase tracking-widest text-[10px]">DISBURSE</Button>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
            <ShieldAlert className="w-4 h-4 text-muted-signal" />
          </Button>
        </div>
      </Card>

      {/* 2. Evidence Sufficiency */}
      <Card className="p-8 flex flex-col h-full shadow-sm">
        <h3 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.2em] mb-6">Evidence Sufficiency</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-5xl font-mono font-black tracking-tighter">{activeApplication.evidence.sufficiency}</span>
            <span className="text-xs font-bold text-muted-signal tracking-widest uppercase mb-1">/ 100 PTS</span>
          </div>
          <Progress value={activeApplication.evidence.sufficiency} className="h-1" />
          <div className="grid grid-cols-1 gap-3 pt-2">
            {[
              { label: "History Length", value: activeApplication.evidence.historyLength },
              { label: "Txn Depth", value: activeApplication.evidence.txnDepth },
              { label: "GST Status", value: activeApplication.evidence.gstStatus, warning: true },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-security-border last:border-0">
                <span className="text-[9px] font-bold text-muted-signal uppercase tracking-wider">{item.label}</span>
                <span className={cn(
                  "text-[10px] font-mono font-black",
                  item.warning ? "text-risk-amber" : "text-dossier-ink"
                )}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 3. SHAP Explainer */}
      <Card className="p-8 flex flex-col h-full shadow-sm">
        <h3 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.2em] mb-6">Risk Explainer (SHAP)</h3>
        <div className="space-y-4 flex-1">
          {activeApplication.shapReasons.map((reason, i) => (
            <div key={i} className="flex items-center justify-between group">
              <span className="text-[11px] font-bold text-dossier-ink uppercase tracking-tight">{reason.label}</span>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-12 h-1 bg-steel-surface rounded-full overflow-hidden",
                  reason.pos ? "bg-green-100" : "bg-red-100"
                )}>
                  <div 
                    className={cn("h-full", reason.pos ? "bg-green-500" : "bg-red-500")}
                    style={{ width: `${Math.abs(parseFloat(reason.impact)) * 4}%` }}
                  />
                </div>
                <span className={cn(
                  "font-mono text-[10px] font-black w-12 text-right tracking-tighter",
                  reason.pos ? "text-green-600" : "text-red-600"
                )}>
                  {reason.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-security-border flex justify-center">
           <Button variant="link" size="sm" className="text-[9px] font-black uppercase tracking-widest text-pramaan-blue">View Full Feature Contribution</Button>
        </div>
      </Card>

      {/* 4. Proposed Loan Terms */}
      <Card className="md:col-span-2 p-8 shadow-sm">
        <h3 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.2em] mb-8">Proposed Loan Terms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Max Limit", value: activeApplication.proposedTerms.limit, accent: true },
            { label: "Tenor", value: activeApplication.proposedTerms.tenor },
            { label: "Int. Rate", value: activeApplication.proposedTerms.rate, primary: true },
            { label: "EIR", value: activeApplication.proposedTerms.eir },
          ].map((term, i) => (
            <div key={i} className="space-y-2">
              <div className="text-[9px] font-black text-muted-signal uppercase tracking-[0.2em]">{term.label}</div>
              <div className={cn(
                "text-2xl font-mono font-black tracking-tighter",
                term.primary ? "text-pramaan-blue" : "text-dossier-ink"
              )}>{term.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Integrity Check */}
      <Card className="p-8 bg-green-50/20 border-green-100 flex flex-col h-full shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
           <CheckCircle2 className="w-12 h-12 text-green-600/10" />
        </div>
        <h3 className="text-[10px] font-bold text-green-700 uppercase tracking-[0.2em] mb-6">Integrity Check</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-sm bg-green-100 flex items-center justify-center border border-green-200">
             <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-xs font-black text-green-800 tracking-tight uppercase">NO ANOMALIES DETECTED</div>
        </div>
        <p className="text-[10px] text-green-700/80 leading-relaxed font-medium">
          Anti-inflation and synthetic regularity filters passed. No signs of statement tampering detected via metadata hash verification.
        </p>
        <div className="mt-auto pt-6">
           <Badge variant="outline" className="bg-white border-green-200 text-green-700">VERIFIED CLEAN</Badge>
        </div>
      </Card>
    </div>
  )
}
