import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { PasswordGate } from './components/dashboard/PasswordGate';
import { GaugeChart } from './components/dashboard/GaugeChart';
import { KPICards } from './components/dashboard/KPICards';
import { InsightsPanel } from './components/dashboard/InsightsPanel';
import { useRegistrations } from './hooks/useRegistrations';
import { getZone, getProgressToNext } from './utils/dashboard/insightsEngine';

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
  const progress = getProgressToNext(data?.inscritos || 0);

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
      
      <header className="sticky top-0 z-40 bg-[#050A0F]/90 backdrop-blur-xl border-b border-white/5 h-[70px] flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: zone.color, boxShadow: `0 0 12px ${zone.color}` }} />
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#FFD700] uppercase block leading-none mb-1">O GRANDE FILTRO</span>
              <h1 className="text-lg font-heading font-black uppercase tracking-tight text-white/90">
                Dashboard <span className="text-gold-gradient tracking-normal">Analytics</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              Sincronizado {timeAgo}
            </div>
            <button 
              onClick={() => refresh()} 
              disabled={loading} 
              className="group flex items-center gap-3 px-8 py-2.5 rounded-full bg-gold-gradient hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-heading text-xs uppercase tracking-wider font-black">{loading ? '...' : 'Fixar Dados'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 md:py-16 space-y-10">
        {error && (
          <div className="bg-[#EF4444]/10 border-l-[3px] border-[#EF4444] p-4 rounded-r-xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-[#EF4444] w-5 h-5" />
              <p className="text-sm font-medium">Link instável. {error}</p>
            </div>
            <button onClick={() => refresh()} className="text-[10px] font-black uppercase text-[#EF4444] tracking-widest hover:underline">Repetir Fetch</button>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto space-y-10">
          {/* Main Hero Section: Gauge & Primary Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left: Key Metrics Column */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <KPICards count={data?.inscritos || 0} />
            </div>

            {/* Center: The Core Visualization */}
            <div className="lg:col-span-6 glass-panel rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-60" />
              <div className="w-full max-w-[500px]">
                <GaugeChart value={data?.inscritos || 0} />
              </div>
            </div>

            {/* Right: Insights & Urgency Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="glass-panel p-10 rounded-[2.5rem] flex flex-col items-center text-center justify-center flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-30" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-6">Métrica de Prazo</span>
                <div className="text-7xl font-heading font-black text-white leading-none mb-4 tracking-tighter">
                  {progress.daysRemaining}
                </div>
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em]">Dias para o Filtro</span>
                
                <div className="mt-12 pt-12 border-t border-white/5 w-full space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Performance Global</span>
                    <span className="text-[#FFD700]">{Math.round((data?.inscritos || 0) / 230 * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-gradient transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.3)]" style={{ width: `${(data?.inscritos || 0) / 230 * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Strategy Row */}
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <InsightsPanel count={data?.inscritos || 0} />
          </div>
        </div>
      </main>
    </div>
  );
}
