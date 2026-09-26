import React, { useState } from 'react';
import {
  PhoneCall,
  Radio,
  Siren,
  Send,
  CheckCircle2,
  Car,
  AlertOctagon,
  Flame,
  LifeBuoy
} from 'lucide-react';
import { GateService } from '../services/gateService';

export const EmergencyMode: React.FC = () => {
  const gates = GateService.getGates();
  const [selectedGateId, setSelectedGateId] = useState(gates[0]?.id || '');
  const [hazardType, setHazardType] = useState<'STUCK_VEHICLE' | 'BARRIER_FAILURE' | 'LONG_WAIT'>('STUCK_VEHICLE');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    const gateObj = gates.find((g) => g.id === selectedGateId);
    if (!gateObj) return;

    GateService.addReport({
      gateId: gateObj.id,
      gateName: gateObj.name,
      reportedStatus: 'ALERT',
      reporterName: 'EMERGENCY SOS DISPATCH',
      comment: `[HIGH PRIORITY SOS] ${hazardType.replace('_', ' ')}: ${description || 'Vehicle or obstacle on track.'}`,
      hazardType
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
    }, 4000);
  };

  const emergencyContacts = [
    { name: 'Railway Protection Force (RPF)', number: '139', note: '24/7 National Emergency Toll-Free' },
    { name: 'National Disaster Response (NDRF)', number: '1078', note: 'Track obstruction & emergency relief' },
    { name: 'State Traffic Control Room', number: '112', note: 'Emergency dispatch & road detours' },
    { name: 'Section Signal Master Direct Line', number: '1800-111-139', note: 'Immediate signal stop command' }
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto font-sans">
      {/* High Visibility Industrial SOS Banner */}
      <div className="relative rounded-xl overflow-hidden border border-red-800 bg-[#170B0E] p-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: 'url(/assets/images/railway_crossing_night.jpg)' }}
        />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-red-600 text-white font-mono font-bold text-xs animate-bounce shadow-lg">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-mono font-black text-white tracking-wider uppercase">
                  EMERGENCY TRACK HAZARD DISPATCH
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-200 border border-red-700">
                  PRIORITY LEVEL 1
                </span>
              </div>
              <p className="text-xs text-red-200/90 font-mono mt-0.5">
                Direct Emergency Signal Override & Railway Protection Force (RPF) Dispatch Interface
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: SOS Broadcast Form + Emergency Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SOS Broadcast Form */}
        <div className="lg:col-span-2 railway-panel rounded-xl p-5 border border-red-900/60 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <h2 className="text-xs font-bold text-white uppercase">Transmit Immediate Track Hazard Broadcast</h2>
          </div>

          {submitted ? (
            <div className="p-6 rounded bg-red-950/60 border border-red-800 text-center space-y-3 font-mono">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white uppercase">HAZARD SIGNAL TRANSMITTED!</h3>
              <p className="text-xs text-slate-300 font-sans">
                Hazard telemetry dispatched to Section Signal Controller & approaching trains. RPF unit alerted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitEmergency} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">
                  Target Level Crossing
                </label>
                <select
                  value={selectedGateId}
                  onChange={(e) => setSelectedGateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  required
                >
                  {gates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code}) - {g.locationName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Hazard Classification</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { type: 'STUCK_VEHICLE', label: 'Vehicle Stuck on Track', icon: Car },
                    { type: 'BARRIER_FAILURE', label: 'Barrier Mechanical Defect', icon: AlertOctagon },
                    { type: 'LONG_WAIT', label: 'Extreme Barrier Delay', icon: Flame }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = hazardType === item.type;
                    return (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => setHazardType(item.type as any)}
                        className={`p-3 rounded border text-xs font-mono font-bold flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-red-950 border-red-600 text-red-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-red-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">
                  Remarks & Location Particulars
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify vehicle license, exact track position, or defect observation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 font-sans focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded bg-red-800 hover:bg-red-700 text-white font-mono font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>BROADCAST EMERGENCY SIGNAL NOW</span>
              </button>
            </form>
          )}
        </div>

        {/* Emergency Hotline Directory */}
        <div className="railway-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase">Hotline Directory</h2>
          </div>

          <div className="space-y-2.5 font-mono">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{contact.name}</span>
                  <a
                    href={`tel:${contact.number}`}
                    className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold hover:bg-emerald-900 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{contact.number}</span>
                  </a>
                </div>
                <p className="text-[10px] text-slate-400">{contact.note}</p>
              </div>
            ))}
          </div>

          {/* Safety Rule Box */}
          <div className="p-3 rounded bg-amber-950/40 border border-amber-800 space-y-1 text-xs text-amber-300 font-mono">
            <div className="flex items-center gap-1.5 font-bold">
              <LifeBuoy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Track Safety Protocol:</span>
            </div>
            <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-0.5 font-sans pl-1">
              <li>Evacuate all passengers from vehicle immediately.</li>
              <li>Move 45° diagonally away towards oncoming train direction.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
