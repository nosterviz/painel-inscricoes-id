import { useEffect, useState, useRef } from 'react';
import { MAX_VALUE, getZone } from '../../utils/dashboard/insightsEngine';

interface GaugeChartProps {
  value: number;
}

export function GaugeChart({ value }: GaugeChartProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const currentZone = getZone(value);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Geometry constants
  const cx = 150;
  const cy = 160;
  const r = 110;
  const startAngle = 150; 
  const totalSweep = 240; 
  const circumference = 2 * Math.PI * r * (totalSweep / 360);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  useEffect(() => {
    const duration = 1500;
    const startValue = displayValue;
    const endValue = value;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      const easedProgress = easeOutCubic(progress);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easedProgress));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  const dashOffset = circumference * (1 - Math.min(value, MAX_VALUE) / MAX_VALUE);

  return (
    <div className="relative w-full max-w-[600px] mx-auto flex flex-col items-center">
      <svg 
        viewBox="0 0 300 240" 
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6623" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F9E076" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6623" />
          </linearGradient>
        </defs>

        <path
          d={`M ${polarToCartesian(cx, cy, r, startAngle).x} ${polarToCartesian(cx, cy, r, startAngle).y} 
             A ${r} ${r} 0 1 1 ${polarToCartesian(cx, cy, r, startAngle + totalSweep).x} ${polarToCartesian(cx, cy, r, startAngle + totalSweep).y}`}
          fill="none"
          stroke="rgba(212, 175, 55, 0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {[0, 60, 130, 230].map((threshold) => {
          const angle = startAngle + (threshold / MAX_VALUE) * totalSweep;
          const labelPos = polarToCartesian(cx, cy, r + 30, angle);
          
          return (
            <g key={threshold}>
              <circle
                cx={polarToCartesian(cx, cy, r, angle).x}
                cy={polarToCartesian(cx, cy, r, angle).y}
                r="3"
                fill={value >= threshold ? "#D4AF37" : "rgba(255,255,255,0.1)"}
                className="transition-colors duration-1000"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="rgba(255,255,255,0.3)"
                fontSize="10"
                fontWeight="500"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono tracking-tighter"
              >
                {threshold}
              </text>
            </g>
          );
        })}

        <path
          d={`M ${polarToCartesian(cx, cy, r, startAngle).x} ${polarToCartesian(cx, cy, r, startAngle).y} 
             A ${r} ${r} 0 1 1 ${polarToCartesian(cx, cy, r, startAngle + totalSweep).x} ${polarToCartesian(cx, cy, r, startAngle + totalSweep).y}`}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: dashOffset,
            transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: `drop-shadow(0 0 12px rgba(212, 175, 55, 0.3))`
          }}
        />

        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="white"
          className="font-heading font-black"
          style={{ fontSize: '64px', letterSpacing: '-0.02em' }}
        >
          {displayValue}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="#D4AF37"
          fontSize="10"
          className="font-mono font-bold uppercase tracking-[0.4em]"
        >
          Logins Ativos
        </text>

        <g transform={`translate(${cx - 50}, ${cy + 35})`}>
          <text
            x="50"
            y="12"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="9"
            className="font-heading font-semibold uppercase tracking-widest"
          >
            {currentZone.label}
          </text>
        </g>
      </svg>
    </div>
  );
}
