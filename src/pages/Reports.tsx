import React, { useState, useEffect } from 'react';
import { GateService } from '../services/gateService';
import type { CommunityReport, GateStatus } from '../types/gate';
import { StatusBadge } from '../components/common/StatusBadge';
import { Users, MessageSquare, ThumbsUp, PlusCircle, CheckCircle, Send } from 'lucide-react';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const gates = GateService.getGates();
  const [selectedGateId, setSelectedGateId] = useState(gates[0]?.id || '');
  const [reportedStatus, setReportedStatus] = useState<GateStatus>('CLOSED');
  const [reporterName, setReporterName] = useState('');
  const [comment, setComment] = useState('');

  const loadReports = () => {
    setReports(GateService.getReports());
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpvote = (id: string) => {
    GateService.upvoteReport(id);
    loadReports();
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const gateObj = gates.find((g) => g.id === selectedGateId);
    if (!gateObj) return;

    GateService.addReport({
      gateId: gateObj.id,
      gateName: gateObj.name,
      reportedStatus,
      reporterName: reporterName.trim() || 'Commuter Observer',
      comment: comment.trim() || 'Reported level crossing status.'
    });

    setShowModal(false);
    setComment('');
    setReporterName('');
    loadReports();
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="railway-panel rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">
              Crowdsourced Level Crossing Observations
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time status reports submitted by commuters, drivers, and field observations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>LOG OBSERVATION</span>
        </button>
      </div>

      {/* Reports Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="railway-panel rounded-xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2 font-mono">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 font-sans">{rep.gateName}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    By {rep.reporterName} • {rep.timestamp}
                  </span>
                </div>
                <StatusBadge status={rep.reportedStatus} size="sm" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#090D14] p-3 rounded border border-slate-800 font-sans">
                "{rep.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <div>
                {rep.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle className="w-3 h-3" /> SENSOR MATCHED
                  </span>
                )}
              </div>

              <button
                onClick={() => handleUpvote(rep.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                <span>CONFIRM ({rep.upvotes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Submitting Report */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="railway-panel rounded-xl p-5 border border-slate-700 w-full max-w-md bg-[#0B0F17] space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Log Crossing Observation
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Select Railway Crossing</label>
                <select
                  value={selectedGateId}
                  onChange={(e) => setSelectedGateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none"
                >
                  {gates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Observed Barrier State</label>
                <select
                  value={reportedStatus}
                  onChange={(e) => setReportedStatus(e.target.value as GateStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="OPEN">OPEN (Traffic Moving)</option>
                  <option value="CLOSING">CLOSING (Siren Active)</option>
                  <option value="CLOSED">CLOSED (Barrier Down)</option>
                  <option value="ALERT">HAZARD ALERT (Obstruction)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Reporter Identifier</label>
                <input
                  type="text"
                  placeholder="e.g., Alex K. (Local Commuter)"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Observation Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Describe queue length, traffic speed, or barrier state..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 font-sans focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT LOG</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
