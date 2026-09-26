import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GateService } from '../services/gateService';
import type { RailwayGate } from '../types/gate';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProbabilityBadge } from '../components/common/ProbabilityBadge';
import { Star, Clock, ArrowRight, Train, ShieldCheck } from 'lucide-react';

export const Favorites: React.FC = () => {
  const [favoriteGates, setFavoriteGates] = useState<RailwayGate[]>([]);

  const loadFavorites = () => {
    const allGates = GateService.getGates();
    setFavoriteGates(allGates.filter((g) => g.isFavorite));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    GateService.toggleFavorite(id);
    loadFavorites();
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="railway-panel rounded-xl p-5 border border-slate-800 flex items-center justify-between gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">
              Saved Railway Crossings Watchlist
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Priority level crossings saved for fast daily telemetry monitoring.
          </p>
        </div>

        <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-slate-200 border border-slate-800">
          {favoriteGates.length} SAVED
        </span>
      </div>

      {/* Grid of Saved Gates */}
      {favoriteGates.length === 0 ? (
        <div className="railway-panel rounded-xl py-16 text-center text-slate-400 font-mono space-y-4">
          <Star className="w-12 h-12 mx-auto text-slate-600" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase">No Saved Crossings</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
              Click the star icon on any level crossing card on the operations console to add it to your daily watchlist.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>EXPLORE OPERATIONS CONSOLE</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteGates.map((gate) => (
            <div
              key={gate.id}
              className="railway-panel railway-panel-hover rounded-xl p-4 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{gate.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {gate.code} • {gate.locationName}
                  </span>
                </div>

                <button
                  onClick={(e) => handleRemoveFavorite(gate.id, e)}
                  className="p-1 rounded text-amber-400 hover:text-rose-400 transition-colors"
                  title="Remove from saved watchlist"
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 my-2">
                <StatusBadge status={gate.status} size="md" />
                <ProbabilityBadge probability={gate.closureProbability} confidence={gate.confidence} size="md" />
              </div>

              <div className="p-3 rounded bg-[#090D14] border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Closure Window:
                  </span>
                  <span className="font-bold text-amber-400">
                    {gate.status === 'CLOSED'
                      ? 'GATE CLOSED NOW'
                      : gate.timeToClose > 0
                      ? `in ${gate.timeToClose}m`
                      : 'Immediate'}
                  </span>
                </div>

                {gate.upcomingTrain && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Train className="w-3.5 h-3.5 text-slate-400" /> Approaching Train:
                    </span>
                    <span className="font-medium text-slate-200 truncate max-w-[150px]">
                      {gate.upcomingTrain.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <span className="text-slate-400">Est Delay: {gate.expectedDuration}m</span>
                <Link
                  to={`/gate/${gate.id}`}
                  className="font-bold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <span>Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
