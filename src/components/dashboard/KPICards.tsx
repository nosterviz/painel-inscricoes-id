import React from 'react';
import { Users, Target, TrendingUp } from 'lucide-react';
import { getZone, MAX_VALUE } from '../../utils/dashboard/insightsEngine';

interface KPICardsProps {
  count: number;
}

export function KPICards({ count }: KPICardsProps) {
  const zone = getZone(count);
  const progressPercent = Math.min(100, Math.floor((count / MAX_VALUE) * 100));

  const cards = [
    {
      label: 'Total de Inscritos',
      value: count,
      icon: Users,
      color: zone.color,
      bg: zone.trackColor,
    },
    {
      label: 'Meta do Evento',
      value: MAX_VALUE,
      icon: Target,
      color: '#FFD700',
      bg: 'rgba(43, 189, 206, 0.1)',
    },
    {
      label: 'Progresso para Meta',
      value: `${progressPercent}%`,
      icon: TrendingUp,
      color: zone.color,
      bg: zone.trackColor,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx}
          className="group relative bg-[#061A1F] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD700]/40 overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
        >
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#FFD700] transition-all duration-500 group-hover:w-full" />
          
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                {card.label}
              </p>
              <h3 
                className="font-heading text-4xl font-black transition-transform duration-300 group-hover:scale-105 origin-left text-gold-gradient"
              >
                {card.value}
              </h3>
            </div>
            <div 
              className="p-3 rounded-xl transition-colors duration-300"
              style={{ backgroundColor: card.bg }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
          </div>

          <div className="absolute -right-4 -bottom-4 opacity-[0.03] transition-transform duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2">
            <card.icon size={80} />
          </div>
        </div>
      ))}
    </div>
  );
}
