import { Users, Target, Rocket } from 'lucide-react';

interface KPICardProps {
  count: number;
}

export function KPICards({ count }: KPICardProps) {
  const cards = [
    {
      label: 'Total de Inscritos',
      value: count,
      icon: Users,
      color: '#FFD700',
    },
    {
      label: 'Meta do Evento',
      value: 230,
      icon: Target,
      color: '#FFD700',
    },
    {
      label: 'Progresso Real',
      value: `${Math.round((count / 230) * 100)}%`,
      icon: Rocket,
      color: '#FFD700',
    },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {cards.map((card, index) => (
        <div 
          key={card.label}
          className="group glass-panel p-8 rounded-[2rem] flex items-center justify-between relative overflow-hidden flex-1"
          style={{ transitionDelay: `${index * 0.1}s` }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gold-gradient opacity-20" />
          <div className="relative z-10">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-3">
              {card.label}
            </p>
            <h3 className="font-heading text-4xl font-black text-gold-gradient tracking-tight">
              {card.value}
            </h3>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[#FFD700] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <card.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
