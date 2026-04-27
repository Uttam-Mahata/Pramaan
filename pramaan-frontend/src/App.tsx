import React, { useState } from 'react'
import { 
  UserCircle
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Feature Components
import { LandingPage } from './components/LandingPage'
import { BorrowerPortal } from './components/borrower/BorrowerPortal'
import { OfficerDashboard } from './components/officer/OfficerDashboard'
import { PramaanLogo } from './components/ui/PramaanLogo'

type ViewMode = 'landing' | 'borrower' | 'officer'

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing')

  return (
    <div className="min-h-screen bg-evidence-white text-dossier-ink font-sans selection:bg-pramaan-blue/10 selection:text-pramaan-blue">
      {/* GLOBAL HEADER */}
      <nav className="border-b border-security-border bg-white sticky top-0 z-50 h-20 flex items-center">
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 flex justify-between items-center">
          <button onClick={() => setViewMode('landing')} className="flex items-center group cursor-pointer">
            <PramaanLogo variant="horizontal" theme="light" className="h-10 w-auto transition-transform group-hover:scale-[1.02]" animate={false} />
          </button>

          <div className="flex items-center gap-8">
            <div className="flex bg-steel-surface p-1.5 rounded-sm border border-security-border">
              <button 
                onClick={() => setViewMode('borrower')}
                className={cn(
                  "px-6 py-2 text-[10px] font-black transition-all rounded-sm tracking-widest uppercase",
                  viewMode === 'borrower' ? "bg-white shadow-md text-pramaan-blue ring-1 ring-black/5" : "text-muted-signal hover:text-dossier-ink"
                )}
              >
                BORROWER PORTAL
              </button>
              <button 
                onClick={() => setViewMode('officer')}
                className={cn(
                  "px-6 py-2 text-[10px] font-black transition-all rounded-sm tracking-widest uppercase",
                  viewMode === 'officer' ? "bg-white shadow-md text-pramaan-blue ring-1 ring-black/5" : "text-muted-signal hover:text-dossier-ink"
                )}
              >
                OFFICER DASHBOARD
              </button>
            </div>
            <div className="h-8 w-px bg-security-border hidden md:block" />
            <div className="hidden md:flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-tight">HACKATHON-DEMO</div>
                  <div className="text-[8px] font-bold text-muted-signal uppercase tracking-widest">UCO-IITKGP-01</div>
               </div>
               <button className="w-10 h-10 rounded-full border border-security-border flex items-center justify-center hover:bg-steel-surface transition-all group">
                 <UserCircle className="w-6 h-6 text-muted-signal group-hover:text-pramaan-blue transition-colors" />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className={cn(
        "max-w-[1440px] mx-auto",
        viewMode === 'landing' ? "" : "px-6 lg:px-12 py-12"
      )}>
        <AnimatePresence mode="wait">
          {viewMode === 'landing' ? (
            <LandingPage key="landing" onNavigate={setViewMode} />
          ) : viewMode === 'borrower' ? (
            <BorrowerPortal key="borrower" />
          ) : (
            <OfficerDashboard key="officer" />
          )}
        </AnimatePresence>
      </main>

      {/* COMPLIANCE FOOTER */}
      <footer className="border-t border-security-border py-12 bg-white/80">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <PramaanLogo variant="icon" theme="light" className="w-6 h-6" animate={false} />
                <span className="font-display font-black text-sm tracking-tighter uppercase">Pramaan System Architecture</span>
             </div>
             <p className="text-[10px] text-muted-signal max-w-sm leading-relaxed font-medium uppercase tracking-tight">
                An evidence-based underwriting copilot for PSU banks. 
                Compliant with DPDP Act 2023, RBI Digital Lending Guidelines, and ReBIT FI Schema specifications.
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4">
             <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-dossier-ink">Protocols</h4>
                <div className="flex flex-col gap-1">
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">Account Aggregator</a>
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">Sahamati FIU/FIP</a>
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">GSTN API V2</a>
                </div>
             </div>
             <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-dossier-ink">Compliance</h4>
                <div className="flex flex-col gap-1">
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">DPDP Act 2023</a>
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">RBI Master Dir.</a>
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">Data Minimization</a>
                </div>
             </div>
             <div className="space-y-2 hidden md:block">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-dossier-ink">Technical</h4>
                <div className="flex flex-col gap-1">
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">XGBoost/SHAP</a>
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">GraphSAGE GNN</a>
                   <a href="#" className="text-[9px] font-bold text-muted-signal hover:text-pramaan-blue transition-colors uppercase">Platt Calibration</a>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-security-border flex justify-between items-center">
           <div className="text-[9px] font-mono font-bold text-muted-signal/50 uppercase tracking-widest">
              &copy; 2026 PRAMAAN // UCO BANK &times; IIT KHARAGPUR HACKATHON
           </div>
           <div className="text-[9px] font-mono font-bold text-muted-signal/50 uppercase tracking-widest">
              BUILD: 2026.04.27.1206.REL
           </div>
        </div>
      </footer>
    </div>
  )
}

export default App
