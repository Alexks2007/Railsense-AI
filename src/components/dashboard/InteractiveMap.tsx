import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RailwayGate, GateStatus } from '../../types/gate';
import { StatusBadge } from '../common/StatusBadge';
import { ProbabilityBadge } from '../common/ProbabilityBadge';
import { Layers, ArrowRight, Radio, Train } from 'lucide-react';

interface InteractiveMapProps {
  gates: RailwayGate[];
  selectedGateId?: string;
  onSelectGate?: (gate: RailwayGate) => void;
}

// Custom Industrial Signal Marker DivIcon
const createCustomMarker = (status: GateStatus, isSelected: boolean) => {
  let bgClass = 'bg-emerald-500 border-emerald-300';
  let pulseClass = 'bg-emerald-400';

  if (status === 'CLOSING') {
    bgClass = 'bg-amber-500 border-amber-300';
    pulseClass = 'bg-amber-400';
  } else if (status === 'CLOSED') {
    bgClass = 'bg-rose-600 border-rose-300';
    pulseClass = 'bg-rose-500';
  } else if (status === 'ALERT') {
    bgClass = 'bg-red-600 border-red-200';
    pulseClass = 'bg-red-500';
  } else if (status === 'MAINTENANCE') {
    bgClass = 'bg-slate-500 border-slate-300';
    pulseClass = 'bg-slate-400';
  }

  const selectedRing = isSelected ? 'ring-2 ring-white scale-125 z-50' : '';

  const html = `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-6 h-6 rounded-full ${pulseClass} opacity-60 animate-ping"></span>
      <div class="relative w-6 h-6 rounded-full ${bgClass} border-2 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-125 cursor-pointer ${selectedRing}">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="8"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-railway-signal-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  map.flyTo(center, 13, { duration: 1.2 });
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  gates,
  selectedGateId,
  onSelectGate
}) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<GateStatus | 'ALL'>('ALL');

  const filteredGates = gates.filter((g) => {
    if (filterStatus === 'ALL') return true;
    return g.status === filterStatus;
  });

  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const selectedGate = gates.find((g) => g.id === selectedGateId);
  const activeCenter: [number, number] = selectedGate
    ? [selectedGate.latitude, selectedGate.longitude]
    : defaultCenter;

  return (
    <div className="railway-panel rounded-xl overflow-hidden flex flex-col h-[580px] relative border border-slate-800">
      {/* Map Control Bar */}
      <div className="p-3 bg-[#0A0E17] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
              Railway GIS Level Crossing Map
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              CartoDB Dark Matter GIS • {filteredGates.length} Signals Tracked
            </p>
          </div>
        </div>

        {/* Signal Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {(['ALL', 'OPEN', 'CLOSING', 'CLOSED', 'ALERT'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                filterStatus === st
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-900 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapContainer
          center={activeCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          <MapRecenter center={activeCenter} />

          {filteredGates.map((gate) => (
            <Marker
              key={gate.id}
              position={[gate.latitude, gate.longitude]}
              icon={createCustomMarker(gate.status, gate.id === selectedGateId)}
              eventHandlers={{
                click: () => onSelectGate && onSelectGate(gate)
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs space-y-2 font-sans">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-xs text-white">{gate.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{gate.code} • {gate.locationName}</p>
                    </div>
                    <StatusBadge status={gate.status} size="sm" />
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-mono text-[10px]">AI Prediction:</span>
                      <ProbabilityBadge probability={gate.closureProbability} confidence={gate.confidence} size="sm" />
                    </div>

                    {gate.upcomingTrain && (
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                        <Train className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          <strong>{gate.upcomingTrain.name}</strong> ETA: {gate.upcomingTrain.etaMinutes}m
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/gate/${gate.id}`)}
                    className="w-full mt-2 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Open Telemetry Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] p-2.5 rounded bg-[#090D14] border border-slate-800 text-[10px] font-mono hidden sm:block">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1.5 uppercase">
            <Layers className="w-3 h-3 text-slate-400" /> Signal Status Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Open
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Closing
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Closed
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Track Hazard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
