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
  { 
    key: 'red', 
    min: 0, 
    max: 59, 
    label: 'Fase Inicial', 
    sublabel: 'Abyss',
    color: '#FFD700', 
    glowColor: 'rgba(255, 215, 0, 0.3)',
    trackColor: 'rgba(255, 215, 0, 0.05)'
  },
  { 
    key: 'orange', 
    min: 60, 
    max: 70, 
    label: 'Engajamento', 
    sublabel: 'Ascensão',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.5)',
    trackColor: 'rgba(255, 215, 0, 0.1)'
  },
  { 
    key: 'yellow', 
    min: 71, 
    max: 129, 
    label: 'Tração Elevada', 
    sublabel: 'Ouro',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.7)',
    trackColor: 'rgba(255, 215, 0, 0.15)'
  },
  { 
    key: 'green', 
    min: 130, 
    max: 230, 
    label: 'Meta Máxima', 
    sublabel: 'Domínio',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 1)',
    trackColor: 'rgba(255, 215, 0, 0.2)'
  },
];

export const MAX_VALUE = 230;

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
}

export function getInsight(count: number): Insight {
  const zone = getZone(count);
  
  if (zone.key === 'red') {
    return {
      headline: 'A Profundidade do Filtro',
      message: `O dashboard iniciou o rastreamento. Atualmente com ${count} logins validados.`,
      action: "Fomentar o acesso à plataforma"
    };
  }
  
  if (zone.key === 'orange') {
    return {
      headline: 'Ponto de Inflexão',
      message: `O engajamento está subindo. ${230 - count} para a meta final.`,
      action: "Acelerar conversão de convidados"
    };
  }
  
  if (zone.key === 'yellow') {
    return {
      headline: 'A Era do Ouro',
      message: `Momentum de crescimento forte. Alcançamos tração premium.`,
      action: "Manter a exclusividade da jornada"
    };
  }
  
  return {
    headline: 'Domínio Estratégico',
    message: "Meta alcançada. O sistema está em sua capacidade máxima de operação.",
    action: "Preparar logística de reserva"
  };
}

export interface ProgressInfo {
  percent: number;
  remaining: number;
  nextZone: Zone | null;
}

export function getProgressToNext(count: number): ProgressInfo {
  if (count >= MAX_VALUE) {
    return { percent: 100, remaining: 0, nextZone: null };
  }
  const nextTarget = count < 60 ? 60 : (count < 130 ? 130 : 230);
  const startCap = count < 60 ? 0 : (count < 130 ? 60 : 130);
  const range = nextTarget - startCap;
  const progress = count - startCap;
  return {
    percent: Math.min(100, (progress / range) * 100),
    remaining: nextTarget - count,
    nextZone: ZONES.find(z => z.min === nextTarget) || null
  };
}

export function getGaugePercent(count: number): number {
  return Math.min(1, Math.max(0, count / MAX_VALUE));
}
