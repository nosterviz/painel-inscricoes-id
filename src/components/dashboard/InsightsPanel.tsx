import React from 'react';
import { Lightbulb, CheckCircle2, Sliders } from 'lucide-react';
import { getZone, getInsight, getProgressToNext, ZONES } from '../../utils/dashboard/insightsEngine';

interface InsightsPanelProps {
  count: number;
}

export function InsightsPanel({ count }: InsightsPanelProps) {
  const zone = getZone(count);
  const insight = getInsight(count);
  const progress = getProgressToNext(count);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-[#061A1F] rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row relative">
        <div className="w-1.5 shrink-0" style={{ backgroundColor: zone.color }} />
        <div className="p-8 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/5">
              <Lightbulb className="w-5 h-5 text-[#FFD700]" />
            </div>
            <h4 className="font-heading text-xl font-bold text-white">
              {insight.headline}
            </h4>
          </div>
          <p className="text-zinc-400 text-lg leading-relaxed mb-6">
            "{insight.message}"
          </p>
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-xs uppercase tracking-wider"
            style={{ 
              backgroundColor: zone.trackColor, 
              borderColor: `${zone.color}33`,
              color: zone.color
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            Recomendação: {insight.action}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-[#061A1F] p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
          <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-[0.2em] mb-2">Janela de Oportunidade</span>
          <div className="text-4xl font-heading font-black text-white leading-none mb-1">
            {progress.daysRemaining}
          </div>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Dias para o evento</span>
        </div>

        {progress.nextZone && (
          <div className="bg-[#061A1F] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-end mb-4">
              <span className="font-mono text-[10px] text-zinc-500 uppercase">
                Próximo Alvo: {progress.nextZone.label}
              </span>
              <span className="font-mono text-xs text-white">
                -{progress.remaining}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${progress.percent}%`,
                  backgroundColor: '#FFD700',
                  boxShadow: `0 0 10px rgba(255, 215, 0, 0.4)`
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-[#061A1F] p-6 rounded-2xl border border-white/5 flex-1">
          <p className="font-mono text-[10px] text-zinc-500 uppercase mb-4 tracking-widest">
            Zonas de Desempenho
          </p>
          <div className="space-y-3">
            {ZONES.map((z) => {
              const isActive = z.key === zone.key;
              return (
                <div 
                  key={z.key}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all duration-500 ${
                    isActive ? 'bg-white/5' : 'opacity-40'
                  }`}
                  style={isActive ? { border: `1px solid ${z.color}33` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: z.color, boxShadow: `0 0 6px ${z.color}` }} 
                    />
                    <span className="text-[11px] font-medium text-zinc-300 uppercase">
                      {z.label}
                    </span>
                  </div>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: z.color }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
