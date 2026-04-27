import React from 'react'
import { ShieldCheck, FileCheck, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BORROWER_PORTAL_CONTENT } from '@/data/mockData'
import { motion } from 'framer-motion'

interface ConsentFlowProps {
  onGrant: () => void
}

export const ConsentFlow: React.FC<Readonly<ConsentFlowProps>> = ({ onGrant }) => {
  const { consent } = BORROWER_PORTAL_CONTENT

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 h-full flex flex-col"
    >
      <div className="flex items-start gap-4 p-5 bg-pramaan-blue/5 border border-pramaan-blue/10 rounded-sm">
        <div className="p-2 bg-white rounded-sm border border-pramaan-blue/20">
          <ShieldCheck className="text-pramaan-blue w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-pramaan-blue uppercase tracking-tight">{consent.title}</h3>
          <p className="text-sm text-dossier-ink/80 mt-1 leading-relaxed">
            {consent.description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-muted-signal uppercase">Data Access Manifest</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consent.requestedData.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-4 border border-security-border rounded-sm bg-white hover:border-pramaan-blue/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-sm bg-steel-surface flex items-center justify-center group-hover:bg-pramaan-blue/5 transition-colors">
                <FileCheck className="w-4 h-4 text-pramaan-blue" />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight leading-none">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[40px]" />

      <div className="flex justify-between items-center pt-6 border-t border-security-border">
        <p className="text-[10px] text-muted-signal italic max-w-[240px]">
          Consent is valid for 15 minutes. Data is purged automatically upon session termination.
        </p>
        <Button 
          onClick={onGrant}
          className="min-w-[200px]"
        >
          GRANT CONSENT <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
