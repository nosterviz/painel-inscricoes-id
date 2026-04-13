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
    label: 'Abaixo do Mínimo', 
    sublabel: 'Crítico',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    trackColor: 'rgba(239, 68, 68, 0.15)'
  },
  { 
    key: 'orange', 
    min: 60, 
    max: 70, 
    label: 'Mínimo', 
    sublabel: 'Atenção',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    trackColor: 'rgba(249, 115, 22, 0.15)'
  },
  { 
    key: 'yellow', 
    min: 71, 
    max: 129, 
    label: 'Regular', 
    sublabel: 'Em crescimento',
    color: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    trackColor: 'rgba(234, 179, 8, 0.15)'
  },
  { 
    key: 'green', 
    min: 130, 
    max: 230, 
    label: 'Ideal', 
    sublabel: 'Meta atingida',
    color: '#22C55E',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    trackColor: 'rgba(34, 197, 94, 0.15)'
  },
];

export const MAX_VALUE = 230;

export function getZone(count: number): Zone {
  const zone = ZONES.find(z => count >= z.min && count <= z.max);
  if (count > MAX_VALUE) return ZONES[ZONES.length - 1];
  return zone || ZONES[0];
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
      headline: 'Ação imediata necessária',
      message: count === 0 
        ? "Nenhuma inscrição registrada ainda. Inicie a divulgação agora."
        : `Faltam ${60 - count} inscrições para o mínimo viável. Intensifique a divulgação.`,
      action: "Urgente: ampliar alcance da comunicação"
    };
  }
  
  if (zone.key === 'orange') {
    return {
      headline: 'No limiar mínimo',
      message: `Você está na zona mínima. ${130 - count} inscrições para a zona ideal.`,
      action: "Manter cadência de comunicação diária"
    };
  }
  
  if (zone.key === 'yellow') {
    return {
      headline: 'Crescimento constante',
      message: `Bom ritmo! Faltam ${130 - count} inscrições para a zona ideal.`,
      action: `${130 - count} para o ideal — acelere a divulgação`
    };
  }
  
  if (count < 230) {
    return {
      headline: 'Meta atingida!',
      message: `Com ${count} inscritos, o evento está garantido.`,
      action: "Manter engajamento da audiência"
    };
  }
  
  return {
    headline: 'Meta atingida!',
    message: "Capacidade máxima atingida. Considere lista de espera.",
    action: "Considerar lista de espera"
  };
}

export interface ProgressInfo {
  percent: number;
  remaining: number;
  nextZone: Zone | null;
}

export function getProgressToNext(count: number): ProgressInfo {
  const currentZone = getZone(count);
  const currentIndex = ZONES.findIndex(z => z.key === currentZone.key);
  
  if (currentZone.key === 'green') {
    return {
      percent: Math.min(100, (count / MAX_VALUE) * 100),
      remaining: 0,
      nextZone: null
    };
  }
  
  const nextZone = ZONES[currentIndex + 1];
  const range = nextZone.min - currentZone.min;
  const progress = count - currentZone.min;
  
  return {
    percent: Math.min(100, (progress / range) * 100),
    remaining: nextZone.min - count,
    nextZone
  };
}

export function getGaugePercent(count: number): number {
  return Math.min(1, Math.max(0, count / MAX_VALUE));
}
