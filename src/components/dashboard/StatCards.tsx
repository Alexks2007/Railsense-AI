import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, Cpu, ArrowUpRight, TrendingDown } from 'lucide-react';
import type { DashboardStats } from '../../types/gate';

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'MONITORED LEVEL CROSSINGS',
      value: stats.totalGates,
      subtitle: 'Active Telemetry Sensors',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      badge: '100% ONLINE',
      badgeClass: 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
    },
    {
      title: 'CURRENT GATE CLOSURES',
      value: stats.activeClosures,
      subtitle: 'Gates Currently Blocked',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      badge: 'LIVE SENSORS',
      badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800'
    },
    {
      title: 'AVG WAIT SAVED PER VEHICLE',
      value: `${stats.avgWaitTime}m`,
      subtitle: 'Commuter Detour Routing',
      icon: Clock,
      iconColor: 'text-slate-300',
      badge: '-18% CONGESTION',
      badgeClass: 'bg-slate-900 text-slate-300 border-slate-700',
      trendIcon: TrendingDown
    },
    {
      title: 'AI FORECAST ACCURACY',
      value: `${stats.aiModelAccuracy}%`,
      subtitle: 'LSTM Time-Series Engine',
      icon: Cpu,
      iconColor: 'text-violet-400',
      badge: 'AI MODEL v1.4',
      badgeClass: 'bg-slate-900 text-violet-400 border-slate-700',
      trendIcon: ArrowUpRight
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={idx}
            className="railway-panel railway-panel-hover rounded-lg p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                {card.title}
              </span>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="my-3">
              <div className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{card.subtitle}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${card.badgeClass}`}
              >
                {TrendIcon && <TrendIcon className="w-3 h-3" />}
                {card.badge}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1m ago</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
