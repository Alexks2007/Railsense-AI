import React from 'react';
import type { GateStatus } from '../../types/gate';
import { CheckCircle2, Clock, AlertTriangle, ShieldAlert, Wrench } from 'lucide-react';

interface StatusBadgeProps {
  status: GateStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'OPEN':
        return {
          bg: 'bg-emerald-950/60 border-emerald-600/40 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
          label: 'OPEN'
        };
      case 'CLOSING':
        return {
          bg: 'bg-amber-950/70 border-amber-500/50 text-amber-300 animate-pulse',
          dot: 'bg-amber-400',
          icon: Clock,
          label: 'CLOSING SOON'
        };
      case 'CLOSED':
        return {
          bg: 'bg-rose-950/70 border-rose-600/50 text-rose-400',
          dot: 'bg-rose-500',
          icon: AlertTriangle,
          label: 'CLOSED'
        };
      case 'ALERT':
        return {
          bg: 'bg-red-950 border-red-500 text-red-300 font-bold',
          dot: 'bg-red-400 animate-ping',
          icon: ShieldAlert,
          label: 'TRACK HAZARD'
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-slate-900 border-slate-700 text-slate-400',
          dot: 'bg-slate-400',
          icon: Wrench,
          label: 'MAINTENANCE'
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  const sizeClasses = {
    sm: 'text-[10px] font-mono px-2 py-0.5 space-x-1 tracking-wider',
    md: 'text-xs font-mono font-bold px-2.5 py-1 space-x-1.5 tracking-wider',
    lg: 'text-xs font-mono font-extrabold px-3 py-1.5 space-x-2 tracking-wider'
  };

  return (
    <span
      className={`inline-flex items-center rounded border ${style.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{style.label}</span>
    </span>
  );
};
