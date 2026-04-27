import React from 'react'
import { Bell, Menu, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Sub-components
import { PendingQueue } from './PendingQueue'
import { AnalysisHeader } from './AnalysisHeader'
import { AnalysisGrid } from './AnalysisGrid'
import { TimelineChart } from './TimelineChart'

export const OfficerDashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
    >
      {/* 1. Left Sidebar: Queue */}
      <div className="lg:col-span-3 flex flex-col h-[calc(100vh-140px)] sticky top-24">
        <PendingQueue />
      </div>

      {/* 2. Main Analysis: 9 columns */}
      <div className="lg:col-span-9 space-y-8 pb-12">
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-bold uppercase tracking-tighter">Underwriting Desk</h1>
              <p className="text-sm text-muted-signal font-bold tracking-widest uppercase">Copilot: <span className="text-pramaan-blue">Assist Mode Active</span></p>
           </div>
           <div className="flex items-center gap-4 mb-1">
              <button className="p-2 border border-security-border rounded-sm hover:bg-steel-surface transition-all relative">
                <Bell className="w-4 h-4 text-muted-signal" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-security-border" />
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest">OFFICER #402</div>
                    <div className="text-[8px] font-bold text-muted-signal uppercase">ZONAL OFFICE: KOLKATA</div>
                 </div>
                 <UserCircle className="w-8 h-8 text-muted-signal" />
              </div>
           </div>
        </div>

        <AnalysisHeader />
        
        <AnalysisGrid />
        
        <TimelineChart />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
           <div className="p-8 border-2 border-dashed border-security-border rounded-sm flex flex-col items-center justify-center text-center space-y-4 group hover:border-pramaan-blue/30 transition-all cursor-pointer bg-white">
              <div className="w-12 h-12 rounded-full bg-steel-surface flex items-center justify-center group-hover:bg-pramaan-blue/5 transition-colors">
                 <Menu className="w-6 h-6 text-muted-signal" />
              </div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Policy Exception Handler</h4>
                 <p className="text-[10px] text-muted-signal mt-1 max-w-[200px]">Submit for human override with mandatory reason codes</p>
              </div>
           </div>

           <div className="p-8 border-2 border-dashed border-security-border rounded-sm flex flex-col items-center justify-center text-center space-y-4 group hover:border-pramaan-blue/30 transition-all cursor-pointer bg-white">
              <div className="w-12 h-12 rounded-full bg-steel-surface flex items-center justify-center group-hover:bg-pramaan-blue/5 transition-colors">
                 <Bell className="w-6 h-6 text-muted-signal" />
              </div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest">Investigation Log</h4>
                 <p className="text-[10px] text-muted-signal mt-1 max-w-[200px]">View immutable audit trail of evidence collection</p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
