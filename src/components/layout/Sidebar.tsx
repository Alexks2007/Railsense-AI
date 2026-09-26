import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  AlertOctagon,
  Users,
  Star,
  Activity,
  Cpu,
  ChevronRight,
  X
} from 'lucide-react';
import { GateService } from '../../services/gateService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const stats = GateService.getDashboardStats();
  const favoriteCount = GateService.getGates().filter((g) => g.isFavorite).length;

  const navItems = [
    {
      to: '/',
      label: 'Operations Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/alerts',
      label: 'Safety Alerts Feed',
      icon: Bell,
      badge: stats.highRiskAlerts > 0 ? `${stats.highRiskAlerts}` : null,
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      to: '/emergency',
      label: 'Emergency SOS Console',
      icon: AlertOctagon,
      badge: 'SOS',
      badgeColor: 'bg-red-950 text-red-300 border-red-800'
    },
    {
      to: '/reports',
      label: 'Community Reports',
      icon: Users,
      badge: null
    },
    {
      to: '/favorites',
      label: 'Saved Crossing Watchlist',
      icon: Star,
      badge: favoriteCount > 0 ? `${favoriteCount}` : null,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B0F17] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <span className="font-bold text-xs font-mono text-slate-300 uppercase tracking-wider">Control Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            Control Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === '/'}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono font-semibold transition-all group ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Telemetry Status Widget */}
        <div className="p-3.5 border-t border-slate-800 m-3 rounded bg-[#0F1522] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">System Telemetry</span>
            </div>
            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-900 text-violet-400 border border-slate-800">
              AI v1.4
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Active Closures:</span>
              <span className="font-bold text-amber-400">{stats.activeClosures}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Wait Saved:</span>
              <span className="font-bold text-slate-200">{stats.avgWaitTime}m</span>
            </div>
            <div className="flex justify-between">
              <span>AI Accuracy:</span>
              <span className="font-bold text-violet-400">{stats.aiModelAccuracy}%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-slate-400" /> Sensor Network 100%
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
          </div>
        </div>
      </aside>
    </>
  );
};
