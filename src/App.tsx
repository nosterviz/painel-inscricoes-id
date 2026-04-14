import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { PasswordGate } from './components/dashboard/PasswordGate';
import { GaugeChart } from './components/dashboard/GaugeChart';
import { KPICards } from './components/dashboard/KPICards';
import { InsightsPanel } from './components/dashboard/InsightsPanel';
import { NamesGrid } from './components/dashboard/NamesGrid';
import { useRegistrations } from './hooks/useRegistrations';
import { getZone } from './utils/dashboard/insightsEngine';

export default function App() {
  return (
    <PasswordGate>
      <DashboardContent />
    </PasswordGate>
  );
}

function DashboardContent() {
  const { data, loading, error, lastUpdated, refresh } = useRegistrations();
  const [timeAgo, setTimeAgo] = useState('agora mesmo');

  const zone = getZone(data?.inscritos || 0);

  useEffect(() => {
    const updateTime = () => {
      if (!lastUpdated) return;
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (seconds < 10) setTimeAgo('agora mesmo');
      else if (seconds < 60) setTimeAgo(`há ${seconds}s`);
      else {
        const mins = Math.floor(seconds / 60);
        setTimeAgo(`há ${mins}min`);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="min-h-screen bg-[#050A0F] text-white selection:bg-[#FFD700]/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 transition-all duration-1000" style={{ background: `radial-gradient(circle at 50% -20%, ${zone.color}33, transparent 70%)` }} />
      <header className="sticky top-0 z-40 bg-[#050A0F]/90 backdrop-blur-xl border-b border-white/5 h-[60px] flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: zone.color, boxShadow: `0 0 12px ${zone.color}` }} />
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#FFD700] uppercase block leading-none mb-1">O GRANDE FILTRO</span>
              <h1 className="text-sm font-bold uppercase tracking-tight text-white">Painel de <span className="text-gold-gradient">Inscrições</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase">
              <Clock className="w-3 h-3" />
              Atualizado {timeAgo}
            </div>
            <button onClick={() => refresh()} disabled={loading} className="flex items-center gap-2 px-6 py-2 rounded-full bg-gold-gradient hover:scale-105 transition-all disabled:opacity-50 text-black">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-mono text-[10px] uppercase tracking-wider font-extrabold">{loading ? 'Sincronizando...' : 'Atualizar'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 md:pt-12 space-y-12">
        {error && (
          <div className="bg-[#EF4444]/10 border-l-[3px] border-[#EF4444] p-4 rounded-r-xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-[#EF4444] w-5 h-5" />
              <p className="text-sm font-medium">Data desatualizada. {error}</p>
            </div>
            <button onClick={() => refresh()} className="text-xs font-bold uppercase text-[#EF4444] hover:underline">Repetir</button>
          </div>
        )}

        <div className="flex flex-col items-center space-y-16">
          <section className="w-full max-w-4xl reveal flex flex-col items-center">
            <GaugeChart value={data?.inscritos || 0} />
          </section>

          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-12">
            <section className="reveal" style={{ transitionDelay: '0.1s' }}>
              <KPICards count={data?.inscritos || 0} />
            </section>
            <section className="reveal" style={{ transitionDelay: '0.2s' }}>
              <InsightsPanel count={data?.inscritos || 0} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
