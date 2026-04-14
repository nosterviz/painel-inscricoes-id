export type ZoneKey = 'red' | 'orange' | 'yellow' | 'green';

export interface Zone {
  key: ZoneKey;
  min: number;
  max: number;
  label: string;
  sublabel: string;
  color: string;
  glowColor: string;
  trackColor: string;
}

export const ZONES: Zone[] = [
  { key: 'red', min: 0, max: 59, label: 'Fase Inicial', sublabel: 'Abyss', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.3)', trackColor: 'rgba(255, 215, 0, 0.05)' },
  { key: 'orange', min: 60, max: 70, label: 'Engajamento', sublabel: 'Ascensão', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.5)', trackColor: 'rgba(255, 215, 0, 0.1)' },
  { key: 'yellow', min: 71, max: 129, label: 'Tração Elevada', sublabel: 'Ouro', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.7)', trackColor: 'rgba(255, 215, 0, 0.15)' },
  { key: 'green', min: 130, max: 230, label: 'Meta Máxima', sublabel: 'Domínio', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 1)', trackColor: 'rgba(255, 215, 0, 0.2)' },
];

export const MAX_VALUE = 230;
export const EVENT_DATE = new Date('2026-05-25T09:00:00');

export function getDaysRemaining(): number {
  const diff = EVENT_DATE.getTime() - new Date().getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getZone(count: number): Zone {
  if (count >= 130) return ZONES[3];
  if (count >= 71) return ZONES[2];
  if (count >= 60) return ZONES[1];
  return ZONES[0];
}

export interface Insight {
  headline: string;
  message: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export function getInsight(count: number): Insight {
  const days = getDaysRemaining();
  const remainingInscriptions = MAX_VALUE - count;
  const velocityNeeded = days > 0 ? (remainingInscriptions / days).toFixed(1) : 'N/A';
  
  if (days <= 7 && count < 130) {
    return {
      headline: 'Reta Final: Pressão Crítica',
      message: `Faltam apenas ${days} dias para o evento. Para atingir a meta, precisamos de ${velocityNeeded} inscrições/dia.`,
      action: "Executar plano de contingência e remarketing agressivo",
      priority: 'high'
    };
  }

  if (count < 60) {
    return {
      headline: 'Horizonte de Inscrições',
      message: `Temos ${days} dias de janela. O ritmo ideal agora é de ${velocityNeeded} conversões diárias para o sucesso pleno.`,
      action: "Sólida base estratégica necessária",
      priority: 'medium'
    };
  }
  
  return {
    headline: 'Trajetória de Sucesso',
    message: `Faltam ${days} dias. Com ${count} inscritos, a velocidade necessária baixou para ${velocityNeeded} inscrições por dia.`,
    action: "Manter exclusividade e valor premium",
    priority: 'low'
  };
}

export interface ProgressInfo {
  percent: number;
  remaining: number;
  nextZone: Zone | null;
  daysRemaining: number;
}

export function getProgressToNext(count: number): ProgressInfo {
  const days = getDaysRemaining();
  if (count >= MAX_VALUE) {
    return { percent: 100, remaining: 0, nextZone: null, daysRemaining: days };
  }
  const nextTarget = count < 60 ? 60 : (count < 130 ? 130 : 230);
  const startCap = count < 60 ? 0 : (count < 130 ? 60 : 130);
  const range = nextTarget - startCap;
  const progress = count - startCap;
  return {
    percent: Math.min(100, (progress / range) * 100),
    remaining: nextTarget - count,
    nextZone: ZONES.find(z => z.min === nextTarget) || null,
    daysRemaining: days
  };
}
