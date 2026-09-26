import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GateService } from '../services/gateService';
import type { RailwayGate, GateStatus } from '../types/gate';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProbabilityBadge } from '../components/common/ProbabilityBadge';
import {
  ArrowLeft,
  Star,
  MapPin,
  Train,
  Clock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Send,
  Navigation,
  Sliders
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customMarkerIcon = L.divIcon({
  html: `<div class="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg"><span class="w-1.5 h-1.5 rounded-full bg-slate-950"></span></div>`,
  className: 'custom-gate-pin',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export const GateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gate, setGate] = useState<RailwayGate | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<GateStatus>('OPEN');
  const [statusMessage, setStatusMessage] = useState('');

  const loadGate = () => {
    if (!id) return;
    const found = GateService.getGateById(id);
    if (found) {
      setGate(found);
      setOverrideStatus(found.status);
    }
  };

  useEffect(() => {
    loadGate();
  }, [id]);

  if (!gate) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-400" />
        <h2 className="text-base font-bold text-slate-200 uppercase">Crossing ID Not Found</h2>
        <p className="text-xs text-slate-400">The gate ID "{id}" is invalid or unlisted.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded bg-slate-800 text-white font-mono font-bold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    GateService.toggleFavorite(gate.id);
    loadGate();
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    GateService.updateGateStatus(gate.id, overrideStatus);
    setStatusMessage(`Signal Telemetry updated to ${overrideStatus}`);
    loadGate();
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto font-sans">
      {/* Top Nav Back button */}
      <div className="flex items-center justify-between font-mono">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← BACK TO OPERATIONS CONSOLE</span>
        </button>

        <button
          onClick={handleToggleFavorite}
          className={`flex items-center gap-2 px-3 py-1 rounded border text-xs font-bold font-mono transition-all ${
            gate.isFavorite
              ? 'bg-amber-950/60 border-amber-700 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${gate.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{gate.isFavorite ? 'WATCHLIST SAVED' : 'ADD TO WATCHLIST'}</span>
        </button>
      </div>

      {/* Main Telemetry Header Card */}
      <div className="railway-panel rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white font-mono">{gate.name}</h1>
              <StatusBadge status={gate.status} size="lg" />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="text-slate-300 font-bold">CODE: {gate.code}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {gate.locationName}, {gate.district}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProbabilityBadge probability={gate.closureProbability} confidence={gate.confidence} size="lg" />
            <Link
              to="/emergency"
              className="px-3.5 py-1.5 rounded bg-red-950 border border-red-700 text-red-200 font-mono font-bold text-xs flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>REPORT HAZARD</span>
            </Link>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#090D14] border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Railway Line</span>
            <span className="font-bold text-slate-200">{gate.railwayLine}</span>
          </div>
          <div className="p-2.5 rounded bg-[#090D14] border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Daily Traffic</span>
            <span className="font-bold text-slate-200">{gate.dailyTrainCount} trains/day</span>
          </div>
          <div className="p-2.5 rounded bg-[#090D14] border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Est. Closure Window</span>
            <span className="font-bold text-amber-400">{gate.expectedDuration} mins</span>
          </div>
          <div className="p-2.5 rounded bg-[#090D14] border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Avg Wait Time</span>
            <span className="font-bold text-slate-300">{gate.avgWaitTimeMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Telemetry Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Console Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Signal Forecast Gauge */}
          <div className="railway-panel rounded-xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase">AI Closure Probability Model</h3>
              </div>
              <span className="text-xs text-violet-400 font-mono">Confidence: {gate.confidence}%</span>
            </div>

            {/* Probability Progress Bar */}
            <div className="space-y-2 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Predicted Barrier Closure Risk</span>
                <span className="text-white font-bold">{gate.closureProbability}%</span>
              </div>
              <div className="w-full h-2.5 rounded bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    gate.closureProbability >= 80
                      ? 'bg-rose-500'
                      : gate.closureProbability >= 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${gate.closureProbability}%` }}
                />
              </div>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded bg-[#090D14] border border-slate-800 flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Est. Time Remaining to Barrier Down</span>
                  <span className="text-base font-bold text-amber-300">
                    {gate.status === 'CLOSED'
                      ? 'BARRIER DOWN - GATE CLOSED'
                      : gate.timeToClose > 0
                      ? `${gate.timeToClose} minutes remaining`
                      : 'CLOSURE IMPENDING'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">REFRESH: 5s</span>
            </div>
          </div>

          {/* Approaching Train Telemetry */}
          {gate.upcomingTrain && (
            <div className="railway-panel rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-slate-300" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase">Approaching Train Sensor Feed</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                  SENSOR ACTIVE
                </span>
              </div>

              <div className="p-3.5 rounded bg-[#090D14] border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Train Identifier</span>
                  <span className="font-bold text-white text-sm">{gate.upcomingTrain.name}</span>
                  <span className="text-slate-400 block font-mono">#{gate.upcomingTrain.trainNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Telemetry Speed</span>
                  <span className="font-bold text-amber-300 text-sm">{gate.upcomingTrain.speedKmh} km/h</span>
                  <span className="text-slate-400 block text-[10px]">{gate.upcomingTrain.direction}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Crossing ETA</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {gate.upcomingTrain.etaMinutes} mins
                  </span>
                  <span className="text-slate-500 block text-[10px]">Track Sensor #SWR-88</span>
                </div>
              </div>
            </div>
          )}

          {/* Rerouting Advisory */}
          <div className="railway-panel rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase">Traffic Rerouting Telemetry</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {gate.status === 'CLOSED' || gate.status === 'CLOSING'
                ? `Level crossing barrier is currently ${gate.status.toLowerCase()}. Commuters advised to divert via Outer Ring Grade Separator (1.8 km detour, +4m transit time). Est. waiting time saved: ${gate.expectedDuration} minutes.`
                : 'Level crossing barrier is currently OPEN. Traffic flowing smoothly. Next expected closure window in 20+ minutes.'}
            </p>
          </div>
        </div>

        {/* Right Console Column */}
        <div className="space-y-5">
          {/* Micro Location Map */}
          <div className="railway-panel rounded-xl p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 px-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> GIS Location
              </span>
              <span className="text-[10px] text-slate-400">
                {gate.latitude}, {gate.longitude}
              </span>
            </div>

            <div className="w-full h-44 rounded overflow-hidden border border-slate-800">
              <MapContainer
                center={[gate.latitude, gate.longitude]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={[gate.latitude, gate.longitude]} icon={customMarkerIcon}>
                  <Popup>{gate.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Signal Master Simulation Console */}
          <div className="railway-panel rounded-xl p-4 border border-slate-800 bg-[#0C111C] space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase">Signal Override Panel</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Simulate sensor state changes for hackathon evaluation:
            </p>

            <form onSubmit={handleStatusUpdate} className="space-y-3 font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Target Simulated State</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as GateStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="OPEN">OPEN (Normal Flow)</option>
                  <option value="CLOSING">CLOSING (Warning Siren)</option>
                  <option value="CLOSED">CLOSED (Barrier Down)</option>
                  <option value="ALERT">ALERT (Track Hazard)</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>EXECUTE STATE OVERRIDE</span>
              </button>

              {statusMessage && (
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[11px] font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
