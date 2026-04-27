import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight, Database, BrainCircuit, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PramaanLogo } from '@/components/ui/PramaanLogo'

interface LandingPageProps {
  onNavigate: (view: 'borrower' | 'officer') => void
}

export const LandingPage: React.FC<Readonly<LandingPageProps>> = ({ onNavigate }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-security-border">
        <div className="absolute inset-0 bg-steel-surface/30 pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pramaan-blue/5 to-transparent pointer-events-none -z-10" />
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div variants={item} className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-pramaan-blue/10 text-pramaan-blue border border-pramaan-blue/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                PSB Hackathon 2026
              </span>
            </motion.div>
            
            <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[1.1] mb-6">
              Evidence-Based <br/>
              <span className="text-pramaan-blue">Credit Discovery</span> <br/>
              for PSU Banks.
            </motion.h1>
            
            <motion.p variants={item} className="text-lg text-muted-signal leading-relaxed mb-10 max-w-2xl font-medium">
              Pramaan is a consent-first underwriting copilot that enables public sector banks to safely extend credit to thin-file individuals and MSMEs. By leveraging India's Account Aggregator infrastructure and governed AI, we shift the focus from traditional bureau scores to real-time cashflow evidence.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => onNavigate('borrower')} className="group text-xs uppercase tracking-widest">
                Launch Borrower Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('officer')} className="text-xs uppercase tracking-widest">
                Access Officer Desk
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-24 bg-white border-b border-security-border">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.3em] mb-3">Core Philosophy</h2>
            <h3 className="text-3xl font-display font-black tracking-tight">Judgment over intelligence.<br/>Safety over accuracy.<br/>Consent over data.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Bureau-Agnostic Scoring",
                desc: "High-fidelity risk assessment for the 160M Indians with zero bureau history, powered by raw Account Aggregator data."
              },
              {
                icon: BrainCircuit,
                title: "Uncertainty-Aware Decisions",
                desc: "Calibrated risk probability mapped to a staged exposure model. Instead of binary decisions, we issue safe Starter Loans."
              },
              {
                icon: Lock,
                title: "Privacy-First (DPDP Act)",
                desc: "Stateless scoring at the processing layer. Raw financial data is purged immediately after the session to guarantee privacy."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-security-border bg-steel-surface/30 rounded-sm hover:border-pramaan-blue/30 transition-colors">
                <div className="w-12 h-12 bg-white border border-security-border flex items-center justify-center rounded-sm mb-6 shadow-sm">
                  <feature.icon className="w-6 h-6 text-pramaan-blue" />
                </div>
                <h4 className="text-lg font-bold mb-3">{feature.title}</h4>
                <p className="text-sm text-muted-signal leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack & Architecture */}
      <section className="py-24 bg-dossier-ink text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-[10px] font-bold text-muted-signal uppercase tracking-[0.3em] mb-3">Architecture</h2>
              <h3 className="text-3xl font-display font-black tracking-tight mb-6">Governed AI Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Pramaan is a layered, microservices-oriented system with clear separation between data ingestion, scoring, decisioning, and presentation. 
                Our Meta-Learner stacks a Cashflow Champion, Graph Challenger, and Psychometric Booster to synthesize a calibrated confidence score.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "Frontend", value: "React 19 / Tailwind v4" },
                   { label: "Backend", value: "FastAPI / Python 3.12" },
                   { label: "Models", value: "XGBoost / PyTorch Geo" },
                   { label: "Security", value: "AES-256-GCM / OAuth 2" },
                 ].map((tech, i) => (
                   <div key={i} className="border border-slate-800 p-4 rounded-sm bg-slate-900/50">
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">{tech.label}</div>
                      <div className="text-sm font-mono font-bold">{tech.value}</div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm font-mono text-[10px] leading-relaxed text-slate-400 overflow-x-auto relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <PramaanLogo variant="icon" theme="dark" className="w-32 h-32" animate={false} />
              </div>
<pre>
┌──────────────────────────────────────────┐
│             PRESENTATION LAYER           │
│ Borrower Portal  │ Officer Dashboard     │
├──────────────────────────────────────────┤
│             DECISION ENGINE              │
│ Uncertainty Router │ Starter Calculator  │
├──────────────────────────────────────────┤
│             SCORING LAYER                │
│ Cash Flow │ Graph Challenger │ Booster   │
├──────────────────────────────────────────┤
│             DATA INGESTION               │
│ AA Gateway (ReBIT) │ Consent Manager     │
└──────────────────────────────────────────┘
</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
