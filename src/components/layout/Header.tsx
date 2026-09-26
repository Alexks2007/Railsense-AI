import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Menu, Search, Radio, Shield } from 'lucide-react';
import { GateService } from '../../services/gateService';

interface HeaderProps {
  onMenuToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  searchQuery = '',
  onSearchChange
}) => {
  const navigate = useNavigate();
  const alerts = GateService.getAlerts().filter((a) => !a.acknowledged);
  const unreadAlertCount = alerts.length;

  return (
    <header className="sticky top-0 z-40 bg-[#0A0E17] border-b border-slate-800 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded bg-slate-900 border border-slate-700 text-emerald-400">
              <Shield className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider font-mono text-white">
                  RAILSENSE<span className="text-violet-400">.AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                  SYS-ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Level Crossing Operations & Closure Forecast Console
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by gate code, corridor line, or station..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-[#0D131F] border border-slate-800 focus:border-slate-600 rounded pl-9 pr-4 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Operations Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Signal Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded bg-[#0D131F] border border-slate-800 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 text-[11px]">8 Feeds Active</span>
          </div>

          {/* Alerts Bell */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 rounded bg-[#0D131F] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="View Safety Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center text-[10px] font-bold bg-amber-500 text-black rounded font-mono">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Emergency SOS Button */}
          <Link
            to="/emergency"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-mono font-bold text-xs transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">EMERGENCY SOS</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
