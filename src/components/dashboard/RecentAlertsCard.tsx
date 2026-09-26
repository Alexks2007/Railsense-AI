import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertOctagon, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import type { GateAlert } from '../../types/gate';
import { GateService } from '../../services/gateService';

interface RecentAlertsCardProps {
  alerts: GateAlert[];
  onAlertUpdated?: () => void;
}

export const RecentAlertsCard: React.FC<RecentAlertsCardProps> = ({ alerts, onAlertUpdated }) => {
  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    GateService.acknowledgeAlert(id);
    if (onAlertUpdated) onAlertUpdated();
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-red-800 bg-red-950/40 text-red-300';
      case 'WARNING':
        return 'border-amber-800 bg-amber-950/40 text-amber-300';
      default:
        return 'border-slate-800 bg-slate-900/60 text-slate-300';
    }
  };

  return (
    <div className="railway-panel rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-4 h-[580px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Safety Alerts Feed
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Live Track & Signal Anomaly Log</p>
          </div>
        </div>

        <Link
          to="/alerts"
          className="text-xs font-mono font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs space-y-2">
            <ShieldAlert className="w-8 h-8 mx-auto text-slate-600" />
            <p>No active safety anomalies logged.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded border text-xs space-y-1.5 font-sans transition-all ${getSeverityStyle(
                alert.severity
              )} ${alert.acknowledged ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="truncate">{alert.title}</span>
                </div>
                <span className="text-[10px] opacity-75 shrink-0 font-mono">{alert.timestamp}</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">{alert.message}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono">
                <Link
                  to={`/gate/${alert.gateId}`}
                  className="font-bold text-slate-300 hover:text-white underline"
                >
                  {alert.gateName} →
                </Link>

                {!alert.acknowledged ? (
                  <button
                    onClick={(e) => handleAcknowledge(alert.id, e)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>ACK</span>
                  </button>
                ) : (
                  <span className="text-slate-500 italic">ACKNOWLEDGED</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
