import React from 'react';
import { Bird, Box } from 'lucide-react';

export default function Step1Production({ formData, update, onNext, onCancel }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full bg-white md:mx-10 md:my-10 md:rounded-3xl md:shadow-xl md:border md:border-gray-100">
      <div className="flex justify-between items-center mb-6">
         <span className="text-green-500 font-bold text-sm tracking-wide">STEP 1 OF 5</span>
         <span className="text-gray-400 font-medium text-sm">20% Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-8">
         <div className="h-full bg-green-500 rounded-full" style={{ width: '20%' }}></div>
      </div>

      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Production Setup</h2>
        <p className="text-lg text-gray-500">Configure your poultry operation baseline for precise ROI estimations.</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block font-bold text-slate-900 mb-3">Production Type</label>
          <div className="flex gap-4">
             <button 
                onClick={() => update({ productionType: 'Broiler', cycleDuration: 10 })}
                className={`flex-1 py-4 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-lg ${formData.productionType === 'Broiler' ? 'border-green-500 bg-green-50 shadow-sm text-green-600' : 'border-gray-200 hover:border-green-200 text-slate-700 bg-slate-50'}`}
             >
                <Bird className={formData.productionType === 'Broiler' ? "text-green-500" : "text-gray-400"} />
                Broiler
             </button>
             <button 
                onClick={() => update({ productionType: 'Layer', cycleDuration: 72 })}
                className={`flex-1 py-4 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-lg ${formData.productionType === 'Layer' ? 'border-green-500 bg-green-50 shadow-sm text-green-600' : 'border-gray-200 hover:border-green-200 text-slate-700 bg-slate-50'}`}
             >
                <DropletIcon active={formData.productionType === 'Layer'} />
                Layer
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block font-bold text-slate-900 mb-3">Production System</label>
             <div className="relative">
                <select 
                  value={formData.productionSystem}
                  onChange={(e) => update({ productionSystem: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-slate-900 font-medium appearance-none shadow-sm"
                >
                   <option value="">Select system...</option>
                   <option value="Deep Litter System">Deep Litter System</option>
                   <option value="Battery Cage System">Battery Cage System</option>
                   <option value="Semi-Intensive">Semi-Intensive</option>
                   <option value="Intensive">Extensive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                   <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
             </div>
           </div>
           <div>
             <label className="block font-bold text-slate-900 mb-3">Number of Birds</label>
             <div className="relative">
                <input 
                  type="number"
                  value={formData.numBirds}
                  onChange={(e) => update({ numBirds: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full pl-5 pr-12 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-slate-900 font-medium shadow-sm"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400">🐔</div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block font-bold text-slate-900 mb-3">Farm Location</label>
             <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400">📍</div>
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => update({ location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-slate-900 font-medium shadow-sm"
                />
             </div>
           </div>
           <div>
             <label className="block font-bold text-slate-900 mb-3">Cycle Duration (Weeks)</label>
             <div className="relative">
                <input 
                  type="number"
                  value={formData.cycleDuration}
                  onChange={(e) => update({ cycleDuration: e.target.value })}
                  placeholder="8"
                  className="w-full pl-5 pr-12 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-slate-900 font-medium shadow-sm"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400">⏱️</div>
             </div>
           </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100 pt-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 max-w-sm">
           <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           <span>Estimations will be based on regional climate data for <span className="text-green-500 font-medium">selected location</span>.</span>
        </div>
        <div className="flex gap-4 self-end">
           <button 
             onClick={onCancel}
             className="px-8 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-slate-700 rounded-xl font-bold transition-all"
           >
             Cancel
           </button>
           <button 
             onClick={onNext}
             disabled={!formData.productionType || !formData.numBirds}
             className="px-8 py-3.5 bg-green-500 disabled:opacity-50 disabled:hover:scale-100 hover:bg-green-600 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30 flex items-center gap-2"
           >
             Next Step <span>→</span>
           </button>
        </div>
      </div>

      
    </div>
  );
}

function DropletIcon({ active }) {
  return (
    <svg className={active ? "text-green-500" : "text-gray-400"} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
