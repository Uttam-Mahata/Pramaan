import React from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export const TimelineChart: React.FC = () => {
  return (
    <Card className="p-8 shadow-sm overflow-hidden relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.2em]">Cashflow Timeline (90 Days)</h3>
          <p className="text-[9px] text-muted-signal/60 mt-1 uppercase tracking-wider">Historical Transaction Distribution</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-pramaan-blue/30 border border-pramaan-blue/40 rounded-sm" />
            <span className="text-[9px] font-black text-muted-signal uppercase tracking-widest">Inflows</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-400/30 border border-red-400/40 rounded-sm" />
            <span className="text-[9px] font-black text-muted-signal uppercase tracking-widest">Outflows</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full flex items-end justify-between gap-1.5 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
           {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-dossier-ink" />)}
        </div>

        {Array.from({ length: 45 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col gap-[2px] h-full justify-end group cursor-crosshair">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 50 + 10}%` }}
              transition={{ delay: i * 0.01, type: "spring", stiffness: 100 }}
              className="w-full bg-pramaan-blue/20 group-hover:bg-pramaan-blue/40 transition-colors border-t border-pramaan-blue/30"
            />
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 30 + 5}%` }}
              transition={{ delay: i * 0.01 + 0.2, type: "spring", stiffness: 100 }}
              className="w-full bg-red-400/20 group-hover:bg-red-400/40 transition-colors border-b border-red-400/30"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 border-t border-security-border pt-4 text-[9px] font-mono font-bold text-muted-signal uppercase tracking-widest">
        <span>27 JAN 2026</span>
        <span>26 FEB 2026</span>
        <span>27 MAR 2026</span>
        <span className="text-pramaan-blue">LIVE SESSION DATA</span>
      </div>
    </Card>
  )
}
