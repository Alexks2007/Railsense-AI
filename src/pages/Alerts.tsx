import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GateService } from '../services/gateService';
import type { GateAlert } from '../types/gate';
import { Bell, AlertOctagon, CheckCircle2, Search, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<GateAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAlerts = () => {
    setAlerts(GateService.getAlerts());
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = (id: string) => {
    GateService.acknowledgeAlert(id);
    loadAlerts();
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.gateName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING' && !a.acknowledged).length;

  return (
    <div className="space-y-5 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="railway-panel rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              Railway Safety & Anomaly Log Feed
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Track obstruction warnings, extended barrier dwell alerts, and signal speed anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 font-bold">
            {criticalCount} CRITICAL
          </div>
          <div className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-bold">
            {warningCount} WARNINGS
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts by crossing or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D131F] border border-slate-800 focus:border-slate-600 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all ${
                severityFilter === sev
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="railway-panel rounded-xl py-12 text-center text-slate-400 font-mono space-y-2">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase">ALL CORRIDORS CLEAR</h3>
            <p className="text-[11px] text-slate-400">No active safety alerts match current filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`railway-panel rounded-xl p-4 border transition-all ${
                  isCritical
                    ? 'border-red-800 bg-red-950/20'
                    : isWarning
                    ? 'border-amber-800 bg-amber-950/20'
                    : 'border-slate-800 bg-[#0F1522]'
                } ${alert.acknowledged ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-red-950 border border-red-700 text-red-300'
                          : isWarning
                          ? 'bg-amber-950 border border-amber-700 text-amber-300'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <AlertOctagon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap font-mono">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCritical
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : isWarning
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-900 text-slate-300'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono">{alert.title}</h3>
                        <span className="text-xs text-slate-500">• {alert.timestamp}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{alert.message}</p>

                      <div className="pt-1 font-mono text-xs">
                        <Link
                          to={`/gate/${alert.gateId}`}
                          className="font-bold text-slate-300 hover:text-white underline inline-flex items-center gap-1"
                        >
                          <span>Target Location: {alert.gateName}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="self-end sm:self-center shrink-0 font-mono">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ACKNOWLEDGE</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">ACKNOWLEDGED</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
