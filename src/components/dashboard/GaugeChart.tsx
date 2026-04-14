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
  const startAngle = 150; // Start at 7 o'clock
  const totalSweep = 240; // Sweep to 5 o'clock
  const circumference = 2 * Math.PI * r * (totalSweep / 360);

  // Polar to Cartesian conversion (0 is right, 90 is bottom)
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Count-up animation
  useEffect(() => {
    const duration = 1200;
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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
    } else {
      startTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  // Dashoffset calculation
  const dashOffset = circumference * (1 - Math.min(value, MAX_VALUE) / MAX_VALUE);

  return (
    <div className="relative w-full max-w-[400px] mx-auto flex flex-col items-center">
      <svg 
        viewBox="0 0 300 240" 
        className="w-full h-auto drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <path
          d={`M ${polarToCartesian(cx, cy, r, startAngle).x} ${polarToCartesian(cx, cy, r, startAngle).y} 
             A ${r} ${r} 0 1 1 ${polarToCartesian(cx, cy, r, startAngle + totalSweep).x} ${polarToCartesian(cx, cy, r, startAngle + totalSweep).y}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {[0, 60, 129, 230].map((threshold) => {
          const angle = startAngle + (threshold / MAX_VALUE) * totalSweep;
          const p1 = polarToCartesian(cx, cy, r - 12, angle);
          const p2 = polarToCartesian(cx, cy, r + 12, angle);
          const labelPos = polarToCartesian(cx, cy, r + 32, angle);
          
          return (
            <g key={threshold}>
              <line
                x1={p1.x} y1={p1.y}
                x2={p2.x} y2={p2.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="rgba(255,255,255,0.4)"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
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
          stroke={currentZone.color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: dashOffset,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.6s ease',
            filter: `drop-shadow(0 0 8px ${currentZone.color})`
          }}
        />

        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          className="font-heading font-bold transition-all duration-700"
          style={{ fill: currentZone.color, fontSize: '56px' }}
        >
          {displayValue}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="10"
          className="font-mono uppercase tracking-[0.2em]"
        >
          Inscritos
        </text>

        <g transform={`translate(${cx - 35}, ${cy + 35})`}>
          <rect
            width="70"
            height="18"
            rx="9"
            fill={currentZone.trackColor}
            className="transition-colors duration-600"
          />
          <text
            x="35"
            y="12"
            textAnchor="middle"
            fill={currentZone.color}
            fontSize="9"
            className="font-mono font-bold uppercase tracking-wider transition-colors duration-600"
          >
            {currentZone.label}
          </text>
        </g>
      </svg>
    </div>
  );
}
