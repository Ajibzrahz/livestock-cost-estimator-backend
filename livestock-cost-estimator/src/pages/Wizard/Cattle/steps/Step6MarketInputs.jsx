import React from 'react';
import { ArrowLeft, ArrowRight, Banknote, Droplet, CheckCircle2 } from 'lucide-react';

export default function Step6MarketInputs({ formData, update, onBack, onSubmit }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 pb-24">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">4</div>
              <h2 className="text-sm font-bold text-slate-900">Step 4 of 4: Market Analysis</h2>
           </div>
           <div className="text-sm font-bold text-green-500">100% Complete</div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
           <div className="h-full bg-green-500 w-full"></div>
        </div>
        <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
           <div className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center font-serif leading-none italic pb-0.5 text-gray-400">i</div>
           CURRENT PHASE: MARKET INPUTS
        </div>
      </div>

      <div className="mb-8">
         <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Market Valuation</h1>
         <p className="text-gray-500 text-lg max-w-xl">Enter your expected local market prices. These values will be used to calculate your projected annual revenue and net profit margins.</p>
      </div>

      <div className="space-y-6 mb-12">
         {/* Beef Production */}
         <div className={`bg-white rounded-xl border p-6 transition-all ${formData.productionType === 'Beef' ? 'border-green-200 shadow-sm' : 'border-gray-200 opacity-60'}`}>
            <div className="flex justify-between items-start mb-6">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                     <Banknote className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">Beef Production</h3>
                     <p className="text-sm text-gray-500">Live weight or carcass pricing</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">USE MARKET AVG</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.beefMarketAvg}
                        onChange={(e) => update({ beefMarketAvg: e.target.checked })}
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-200"></div>
                  </label>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Expected selling price per kg (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-sans">₦</span>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="5.50"
                      disabled={formData.beefMarketAvg}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                      value={formData.beefPrice}
                      onChange={(e) => update({ beefPrice: e.target.value })}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Carcass Yield (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="54"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 pr-10"
                      value={formData.beefYield}
                      onChange={(e) => update({ beefYield: e.target.value })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium font-sans">%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-8 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:bg-gray-100 hover:text-slate-900 transition-colors border border-gray-200 rounded-lg px-6 py-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
           <button className="text-sm font-bold text-slate-600 hover:text-slate-900">Save Draft</button>
           <button 
             onClick={onSubmit}
             className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-sm shadow-green-500/20 flex items-center gap-2 transition-all active:scale-95"
           >
             Finish <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-200 pt-8">
         <div className="flex items-center gap-2 font-bold text-emerald-600/70">
            <CheckCircle2 className="w-4 h-4" /> Market data verified daily from Global Ag Services
         </div>
         <div className="flex gap-4 font-bold">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Data Usage</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
         </div>
      </div>
    </div>
  );
}
