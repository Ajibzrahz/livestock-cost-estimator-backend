import React from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, Scale, Droplet } from 'lucide-react';

export default function Step4ProductionTarget({ formData, update, onNext, onBack }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
           <div className="text-sm font-bold text-slate-900">Step 4 of 6</div>
           <div className="text-sm font-bold text-green-500">80% Complete</div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
           <div className="h-full bg-green-500 w-[80%]"></div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Production Target</h2>
        <p className="text-gray-500 text-lg">Define the expected output goals for your livestock to optimize estimation accuracy.</p>
      </div>

      <div className="mb-4 flex gap-6 border-b border-gray-200">
         <div className={`py-3 border-b-2 font-bold text-sm tracking-wide uppercase flex items-center gap-2 ${formData.productionType === 'Beef' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400'}`}>
            <Scale className="w-4 h-4" /> Beef Production
         </div>
         <div className={`py-3 border-b-2 font-bold text-sm tracking-wide uppercase flex items-center gap-2 ${formData.productionType === 'Dairy' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400'}`}>
            <Droplet className="w-4 h-4" /> Dairy Production
         </div>
      </div>

      <div className="space-y-12 mb-12">
         {/* Weight Parameters */}
         <div>
            <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Weight Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Initial Weight (Optional)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-left pr-12"
                      value={formData.initialWeight}
                      onChange={(e) => update({ initialWeight: e.target.value })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">kg</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Current average weight per head</p>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Target Market Weight</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="450.00"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-left pr-12"
                      value={formData.targetWeight}
                      onChange={(e) => update({ targetWeight: e.target.value })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-bold text-sm">kg</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Desired weight at time of sale</p>
               </div>
            </div>
         </div>

         {/* Milk Yield Targets */}
         <div className={formData.productionType === 'Beef' ? 'opacity-50' : ''}>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center">
                     <Droplet className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Milk Yield Targets</h3>
               </div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded">Optimal for Dairy</span>
            </div>
            
            <div className="max-w-xs">
               <label className="block text-sm font-bold text-slate-900 mb-2">Expected Milk Yield per Cow</label>
               <div className="relative">
                 <input 
                   type="number" 
                   placeholder="25"
                   disabled={formData.productionType === 'Beef'}
                   className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-16 disabled:bg-gray-50 disabled:text-gray-400"
                   value={formData.milkYield}
                   onChange={(e) => update({ milkYield: e.target.value })}
                 />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">L/day</span>
               </div>
               <p className="text-xs text-gray-400 mt-2">This field is typically used for Dairy focus operations.</p>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between mt-8 mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors px-6 py-3 border border-gray-200 hover:bg-gray-50 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 flex items-start gap-4">
         <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
             <Lightbulb className="w-5 h-5 text-green-600" />
         </div>
         <div>
            <h4 className="font-bold text-slate-900 mb-1">Estimation Tip</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Defining accurate target weights helps our wizard calculate precise nutritional requirements and growth timelines for your herd.</p>
         </div>
      </div>
    </div>
  );
}
