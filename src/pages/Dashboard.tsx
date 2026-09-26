import React, { useState, useEffect } from 'react';
import { GateService } from '../services/gateService';
import type { RailwayGate, GateAlert, DashboardStats } from '../types/gate';
import { StatCards } from '../components/dashboard/StatCards';
import { InteractiveMap } from '../components/dashboard/InteractiveMap';
import { RecentAlertsCard } from '../components/dashboard/RecentAlertsCard';
import { NearbyGatesList } from '../components/dashboard/NearbyGatesList';
import { Radio, RefreshCw } from 'lucide-react';

interface DashboardProps {
  globalSearchQuery?: string;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [gates, setGates] = useState<RailwayGate[]>([]);
  const [alerts, setAlerts] = useState<GateAlert[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGates: 0,
    activeClosures: 0,
    highRiskAlerts: 0,
    avgWaitTime: 0,
    aiModelAccuracy: 96.4
  });
  const [selectedGate, setSelectedGate] = useState<RailwayGate | undefined>();

  const loadData = () => {
    const fetchedGates = GateService.getGates();
    const fetchedAlerts = GateService.getAlerts();
    const fetchedStats = GateService.getDashboardStats();

    setGates(fetchedGates);
    setAlerts(fetchedAlerts);
    setStats(fetchedStats);

    if (!selectedGate && fetchedGates.length > 0) {
      setSelectedGate(fetchedGates[0]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-5">
      {/* Top Operations Header Banner with Cinematic Infrastructure Image Backdrop */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0F1522] p-5">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: 'url(/assets/images/railway_signal_dark.jpg)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg lg:text-xl font-mono font-black text-white uppercase tracking-wider">
                Level Crossing Operations & AI Forecast Console
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-emerald-400 border border-slate-700">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
              Continuous IoT barrier sensor monitoring, LSTM time-series closure risk forecasting, and automated commuter detour guidance across active rail corridors.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadData}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>REFRESH FEEDS</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-semibold text-slate-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>AI PREDICTOR v1.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <StatCards stats={stats} />

      {/* Main Feature: Leaflet Map as Visual Centerpiece + Safety Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <InteractiveMap
            gates={gates}
            selectedGateId={selectedGate?.id}
            onSelectGate={(gate) => setSelectedGate(gate)}
          />
        </div>

        <div className="lg:col-span-1">
          <RecentAlertsCard alerts={alerts} onAlertUpdated={loadData} />
        </div>
      </div>

      {/* Telemetry Directory */}
      <NearbyGatesList
        gates={gates}
        selectedGateId={selectedGate?.id}
        onSelectGate={(gate) => setSelectedGate(gate)}
        onGatesChange={loadData}
      />
    </div>
  );
};
