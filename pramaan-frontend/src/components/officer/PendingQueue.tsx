import React from 'react'
import { Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OFFICER_DASHBOARD_DATA } from '@/data/mockData'
import { cn } from '@/lib/utils'

export const PendingQueue: React.FC = () => {
  const { pendingQueue } = OFFICER_DASHBOARD_DATA

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-signal">Application Queue</h3>
        <span className="text-[10px] font-mono font-bold bg-pramaan-blue text-white px-2 py-0.5 rounded-full">{pendingQueue.length}</span>
      </div>
      
      <div className="relative group px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-signal group-focus-within:text-pramaan-blue transition-colors" />
        <input 
          type="text" 
          placeholder="SEARCH ID / SEGMENT..."
          className="w-full pl-10 pr-4 py-2.5 text-[10px] font-bold tracking-wider border border-security-border bg-white rounded-sm focus:ring-1 focus:ring-pramaan-blue focus:border-pramaan-blue outline-none transition-all placeholder:text-muted-signal/50 uppercase"
        />
      </div>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-2 px-1">
          {pendingQueue.map((app) => (
            <button 
              key={app.id}
              className={cn(
                "w-full text-left p-4 border border-security-border rounded-sm transition-all hover:border-pramaan-blue/50 hover:bg-white group relative overflow-hidden",
                app.id === 'TXN-9421' ? "bg-white border-pramaan-blue/30 shadow-md ring-1 ring-pramaan-blue/10" : "bg-steel-surface/30"
              )}
            >
              {app.id === 'TXN-9421' && <div className="absolute top-0 left-0 w-1 h-full bg-pramaan-blue" />}
              
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-bold text-dossier-ink uppercase tracking-tighter">{app.id}</span>
                <div className={cn(
                  "text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-tighter uppercase",
                  app.risk === 'LOW' ? "bg-green-100 text-green-800" : 
                  app.risk === 'MED' ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                )}>
                  {app.risk} RISK
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-signal uppercase tracking-tight">{app.segment}</span>
                <div className="flex items-center gap-1.5">
                   <span className="text-[9px] text-muted-signal/60 font-bold tracking-tighter">SCORE</span>
                   <span className="font-mono text-sm font-black text-pramaan-blue tracking-tighter">{app.score}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
