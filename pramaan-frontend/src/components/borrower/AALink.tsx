import React from 'react'
import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BORROWER_PORTAL_CONTENT } from '@/data/mockData'
import { motion } from 'framer-motion'

interface AALinkProps {
  onLink: () => void
}

export const AALink: React.FC<Readonly<AALinkProps>> = ({ onLink }) => {
  const { aaLink } = BORROWER_PORTAL_CONTENT

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center text-center py-12"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-pramaan-blue/5 border border-pramaan-blue/10 rounded-full flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-pramaan-blue" />
        </div>
        <div className="absolute inset-0 bg-pramaan-blue/10 rounded-full animate-ping -z-10" />
      </div>

      <div className="max-w-md space-y-2 mb-10">
        <h2 className="text-2xl font-bold uppercase tracking-tight">{aaLink.title}</h2>
        <p className="text-sm text-muted-signal leading-relaxed">
          {aaLink.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
        {aaLink.banks.map((bank) => (
          <button 
            key={bank}
            onClick={onLink}
            className="p-4 border border-security-border bg-white rounded-sm hover:border-pramaan-blue hover:bg-pramaan-blue/5 transition-all text-[10px] font-bold tracking-widest uppercase text-left group flex justify-between items-center"
          >
            {bank}
            <div className="w-1.5 h-1.5 bg-security-border rounded-full group-hover:bg-pramaan-blue" />
          </button>
        ))}
      </div>
      
      <div className="mt-12 text-[9px] font-mono text-muted-signal">
        SECURE CHANNEL VIA SAHAMATI FIP PROTOCOL
      </div>
    </motion.div>
  )
}
