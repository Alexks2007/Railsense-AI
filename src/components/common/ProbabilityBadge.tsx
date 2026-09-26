import React from 'react';
import { Cpu } from 'lucide-react';

interface ProbabilityBadgeProps {
  probability: number;
  confidence?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProbabilityBadge: React.FC<ProbabilityBadgeProps> = ({
  probability,
  confidence,
  label = 'AI Forecast',
  size = 'md'
}) => {
  const getColor = (prob: number) => {
    if (prob >= 80) return 'text-rose-400 border-slate-700 bg-slate-900';
    if (prob >= 50) return 'text-amber-400 border-slate-700 bg-slate-900';
    return 'text-emerald-400 border-slate-700 bg-slate-900';
  };

  const style = getColor(probability);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-xs px-3 py-1.5'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded border ${style} ${sizeClasses[size]}`}>
      <Cpu className="w-3.5 h-3.5 text-violet-400" />
      <span className="text-slate-400 font-mono text-[10px]">{label}:</span>
      <span className="font-bold font-mono text-white">{probability}%</span>
      {confidence !== undefined && (
        <span className="text-[10px] text-violet-400 font-mono pl-1 border-l border-slate-800">
          (Conf {confidence}%)
        </span>
      )}
    </div>
  );
};
