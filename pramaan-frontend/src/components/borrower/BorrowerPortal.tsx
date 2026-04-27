import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { BORROWER_PORTAL_CONTENT } from '@/data/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Sub-components
import { ConsentFlow } from './ConsentFlow'
import { AALink } from './AALink'
import { EvidenceAnalyzer } from './EvidenceAnalyzer'
import { DecisionView } from './DecisionView'

export const BorrowerPortal: React.FC = () => {
  const [step, setStep] = useState(1)
  const { steps } = BORROWER_PORTAL_CONTENT

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">Underwriting Portal</h1>
          <p className="text-sm text-muted-signal mt-1">EVIDENCE-BASED CREDIT DISCOVERY CHANNEL</p>
        </div>
        <div className="flex gap-1.5">
           <div className="h-1 w-8 bg-pramaan-blue rounded-full" />
           <div className="h-1 w-8 bg-security-border rounded-full" />
           <div className="h-1 w-8 bg-security-border rounded-full" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-12 relative px-2">
        <div className="absolute top-4 left-0 w-full h-[1px] bg-security-border -z-10" />
        {steps.map((s) => (
          <div 
            key={s.id}
            className={cn(
              "flex flex-col items-center gap-3 transition-all",
              step >= s.id ? "text-pramaan-blue" : "text-muted-signal"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all bg-white",
              step === s.id ? "border-pramaan-blue text-pramaan-blue scale-110 shadow-lg shadow-pramaan-blue/10" : 
              step > s.id ? "border-pramaan-blue bg-pramaan-blue text-white" : "border-security-border"
            )}>
              {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="min-h-[520px] flex flex-col relative overflow-hidden border-2 shadow-2xl shadow-slate-200/50 p-8">
        <div className="absolute top-0 left-0 w-1 h-full bg-pramaan-blue/20" />
        
        <AnimatePresence mode="wait">
          {step === 1 && <ConsentFlow key="step1" onGrant={() => setStep(2)} />}
          {step === 2 && <AALink key="step2" onLink={() => setStep(3)} />}
          {step === 3 && <EvidenceAnalyzer key="step3" onComplete={() => setStep(4)} />}
          {step === 4 && <DecisionView key="step4" onReset={() => setStep(1)} />}
        </AnimatePresence>
      </Card>
      
      <div className="mt-8 flex justify-center gap-12 text-[10px] font-mono text-muted-signal/60 tracking-widest uppercase">
         <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> DPDP COMPLIANT</div>
         <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> AES-256 ENCRYPTED</div>
         <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> REBIT V2.0</div>
      </div>
    </div>
  )
}
