import React from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'

interface EvidenceAnalyzerProps {
  onComplete: () => void
}

export const EvidenceAnalyzer: React.FC<Readonly<EvidenceAnalyzerProps>> = ({ onComplete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 h-full flex flex-col"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tight">Analyzing Evidence</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pramaan-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pramaan-blue"></span>
          </span>
          <span className="text-[9px] font-mono font-bold text-pramaan-blue tracking-[0.2em]">LIVE DATA STREAM</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="p-6 bg-steel-surface/50 border border-security-border rounded-sm">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted-signal uppercase">Evidence Sufficiency</span>
              <div className="text-sm font-bold text-pramaan-blue mt-0.5">OPTIMIZING CONFIDENCE</div>
            </div>
            <span className="text-3xl font-mono font-bold tracking-tighter">78<span className="text-sm text-muted-signal">/100</span></span>
          </div>
          <Progress value={78} className="h-1.5" />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {[
            { label: "6 Months Statement History", value: "942 TXNS", status: "success" },
            { label: "Income Regularity Pattern", value: "6 CYCLES", status: "success" },
            { label: "GST Verification (MSME Track)", value: "MISSING", status: "warning" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center justify-between p-4 border border-security-border rounded-sm bg-white"
            >
              <div className="flex items-center gap-3">
                {item.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-risk-amber" />
                )}
                <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  item.status === 'success' ? "text-muted-signal" : "text-risk-amber"
                )}>
                  {item.value}
                </span>
                {item.status === 'warning' && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-[9px] uppercase font-bold tracking-widest">
                    FIX NOW
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="pt-6 border-t border-security-border flex justify-between items-center">
        <p className="text-[10px] text-muted-signal italic max-w-[280px]">
          Partial evidence (e.g. missing GST) may result in lower credit limits.
        </p>
        <Button onClick={onComplete} className="min-w-[200px]">
          PROCEED TO SCORE
        </Button>
      </div>
    </motion.div>
  )
}

import { cn } from '@/lib/utils'
