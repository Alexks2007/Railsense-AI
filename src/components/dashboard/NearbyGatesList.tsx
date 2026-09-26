import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { RailwayGate } from '../../types/gate';
import { StatusBadge } from '../common/StatusBadge';
import { ProbabilityBadge } from '../common/ProbabilityBadge';
import { Star, MapPin, Train, Clock, Search, ChevronRight } from 'lucide-react';
import { GateService } from '../../services/gateService';

interface NearbyGatesListProps {
  gates: RailwayGate[];
  selectedGateId?: string;
  onSelectGate?: (gate: RailwayGate) => void;
  onGatesChange?: () => void;
}

export const NearbyGatesList: React.FC<NearbyGatesListProps> = ({
  gates,
  selectedGateId,
  onSelectGate,
  onGatesChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleToggleFavorite = (gateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    GateService.toggleFavorite(gateId);
    if (onGatesChange) onGatesChange();
  };

  const filteredGates = gates.filter((gate) => {
    const matchesSearch =
      gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gate.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || gate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="railway-panel rounded-xl p-4 border border-slate-800 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Track Crossing Telemetry Directory
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Real-time level crossing telemetry & AI risk index</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by crossing code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D131F] border border-slate-800 focus:border-slate-600 rounded pl-8 pr-3 py-1 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0D131F] border border-slate-800 text-xs font-mono text-slate-300 rounded px-2.5 py-1 focus:outline-none focus:border-slate-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="CLOSING">CLOSING SOON</option>
            <option value="CLOSED">CLOSED</option>
            <option value="ALERT">TRACK HAZARD</option>
          </select>
        </div>
      </div>

      {/* Gates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredGates.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500 font-mono text-xs">
            No railway level crossings match filter criteria.
          </div>
        ) : (
          filteredGates.map((gate) => {
            const isSelected = gate.id === selectedGateId;
            return (
              <div
                key={gate.id}
                onClick={() => onSelectGate && onSelectGate(gate)}
                className={`p-3.5 rounded border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#141C2B] border-slate-600 shadow-md'
                    : 'bg-[#0D131F] border-slate-800 hover:border-slate-700 hover:bg-[#121927]'
                }`}
              >
                {/* Top Row: Name + Favorite */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-sans">
                      {gate.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {gate.code} • {gate.locationName}
                    </span>
                  </div>

                  <button
                    onClick={(e: React.MouseEvent) => handleToggleFavorite(gate.id, e)}
                    className="p-1 rounded text-slate-500 hover:text-amber-400 transition-colors"
                    title={gate.isFavorite ? 'Remove from Saved' : 'Save Gate'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        gate.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Status & Probability Badges */}
                <div className="flex items-center justify-between gap-2 my-2.5">
                  <StatusBadge status={gate.status} size="sm" />
                  <ProbabilityBadge probability={gate.closureProbability} confidence={gate.confidence} size="sm" />
                </div>

                {/* Metrics detail */}
                <div className="p-2 rounded bg-[#090D14] border border-slate-800/80 text-[11px] font-mono space-y-1 my-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" /> Closure Window:
                    </span>
                    <span className="font-bold text-amber-400">
                      {gate.status === 'CLOSED'
                        ? 'CLOSED NOW'
                        : gate.timeToClose > 0
                        ? `in ${gate.timeToClose}m`
                        : 'Immediate'}
                    </span>
                  </div>

                  {gate.upcomingTrain && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Train className="w-3 h-3 text-slate-400" /> Approaching Train:
                      </span>
                      <span className="font-medium text-slate-200 truncate max-w-[120px]">
                        {gate.upcomingTrain.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Link footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                  <span className="text-slate-400">Est Delay: ~{gate.expectedDuration}m</span>
                  <Link
                    to={`/gate/${gate.id}`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="font-bold text-slate-300 hover:text-white flex items-center gap-0.5"
                  >
                    <span>Console</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
