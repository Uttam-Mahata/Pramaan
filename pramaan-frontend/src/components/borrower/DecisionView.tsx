import React from 'react'
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface DecisionViewProps {
  onReset: () => void
}

export const DecisionView: React.FC<Readonly<DecisionViewProps>> = ({ onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 flex-1 flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 p-8 bg-pramaan-blue/5 border border-pramaan-blue/20 flex flex-col items-center justify-center text-center rounded-sm space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-muted-signal uppercase">Pramaan Score</span>
          <div className="text-6xl font-mono font-bold text-pramaan-blue tracking-tighter">720</div>
          <div className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-widest rounded-full">HEALTHY PROFILE</div>
          <div className="pt-4 flex flex-col items-center gap-1">
             <div className="text-[9px] font-bold text-muted-signal">CALIBRATED CONFIDENCE</div>
             <div className="text-sm font-mono font-bold">0.82</div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold uppercase tracking-tight">Recommended Terms</h3>
            <p className="text-xs text-muted-signal">Starter loan based on evidence-based exposure control.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Limit", value: "₹45,000", sub: "EXPOSURE CAP" },
              { label: "Tenor", value: "12 MONTHS", sub: "STAGED REPAYMENT" },
              { label: "Interest Rate", value: "11.5%", sub: "BASE + 2.5% SPREAD" },
              { label: "EIR", value: "12.2%", sub: "EFFECTIVE RATE" },
            ].map((term, i) => (
              <div key={i} className="p-4 border border-security-border bg-steel-surface/30 rounded-sm">
                <div className="text-[9px] font-bold text-muted-signal uppercase tracking-wider mb-1">{term.label}</div>
                <div className="text-xl font-mono font-bold">{term.value}</div>
                <div className="text-[8px] font-bold text-muted-signal/60 uppercase mt-1 tracking-tighter">{term.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-muted-signal" />
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-muted-signal uppercase">Evidence Explanation (SHAP)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-4 p-4 border-l-2 border-green-600 bg-green-50/30">
            <ArrowUpRight className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-bold text-green-700 uppercase mb-1">Impact: Positive</div>
              <p className="text-xs font-bold leading-snug">Consistent monthly surplus identified in bank statements (+12.4% score lift).</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border-l-2 border-red-600 bg-red-50/30">
            <ArrowDownRight className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-bold text-red-700 uppercase mb-1">Impact: Negative</div>
              <p className="text-xs font-bold leading-snug">Limited credit history length increases uncertainty (-2.8% risk weight).</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[20px]" />

      <div className="pt-8 border-t border-security-border flex justify-between items-center mt-auto">
        <Button 
          variant="link" 
          onClick={onReset}
          className="text-[10px] font-bold uppercase tracking-widest text-muted-signal hover:text-red-600"
        >
          REVOKE CONSENT & PURGE DATA
        </Button>
        <div className="flex gap-4">
           <Button variant="outline" className="min-w-[140px]">DOWNLOAD KFS</Button>
           <Button className="min-w-[200px] shadow-lg shadow-pramaan-blue/20">ACCEPT LOAN TERMS</Button>
        </div>
      </div>
    </motion.div>
  )
}
