import React from 'react';

export default function Step5Market({ formData, update, onBack, onSubmit }) {
  return (
    <div className="max-w-[1100px] mx-auto py-12 px-4 flex flex-col xl:flex-row gap-10 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Form */}
      <div className="flex-1 w-full bg-white md:bg-transparent">
         <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
               <span className="text-green-500 font-bold text-sm tracking-wide">STEP 5 OF 5</span>
               <span className="text-gray-400 font-medium text-sm">100% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
               <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Market Inputs</h2>
            <p className="text-gray-500 text-lg">Provide expected pricing to finalize your poultry estimation and calculate projected margins.</p>
         </div>

         <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h4 className="font-bold text-slate-900 text-xl">Expected selling price per kg</h4>
                     <p className="text-sm text-gray-500">Based on live weight at farm gate</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-sm font-bold text-slate-700">Use market average</span>
                     <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                     </div>
                  </div>
               </div>
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center">
                  <span className="text-gray-400 font-bold text-2xl mr-3 font-mono">$</span>
                  <input 
                     type="number"
                     value={formData.sellPriceKg}
                     onChange={(e) => update({ sellPriceKg: Number(e.target.value) })}
                     className="bg-transparent border-none outline-none text-4xl font-extrabold text-slate-900 w-full"
                  />
               </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
               <div className="mb-6 flex items-center gap-3">
                  <h4 className="font-bold text-slate-900 text-xl">Egg price per crate</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded">Layers Specific</span>
               </div>
               <p className="text-sm text-gray-500 mb-6 -mt-4">Standard crate size of 30 eggs</p>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center">
                  <span className="text-gray-400 font-bold text-2xl mr-3 font-mono">₦</span>
                  <input 
                     type="number"
                     value={formData.eggPriceCrate}
                     onChange={(e) => update({ eggPriceCrate: Number(e.target.value) })}
                     className="bg-transparent border-none outline-none text-4xl font-extrabold text-slate-900 w-full"
                  />
               </div>
            </div>
         </div>

         <div className="mt-10">
            <button 
               onClick={onSubmit} 
               className="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] flex justify-center items-center gap-2"
            >
               Review Estimation <span className="transform translate-y-[1px]">→</span>
            </button>
         </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-80 space-y-8 mt-10 xl:mt-0 xl:pt-14">
         <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📊</span>
            <h3 className="font-bold text-slate-900 text-xl">Risk Summary</h3>
         </div>
         
         <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
               <span className="font-bold text-green-600 text-sm">Stable Impact</span>
            </div>
            <p className="text-green-800 text-sm leading-relaxed">Market input impact is currently stable. Your entered prices align with the seasonal average (±2%).</p>
         </div>

         <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Projected Breakdown</div>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-slate-700"><span className="w-4 h-4 bg-gray-100 rounded text-[8px] flex items-center justify-center">📉</span> Broiler Economics</span>
                  <span className="font-bold text-slate-900">Active</span>
               </div>
               <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-2 text-slate-700"><span className="text-gray-400">📈</span> Profit Margin</span>
                  <span className="font-bold text-green-500">24.2%</span>
               </div>
               <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-2 text-slate-700"><span className="text-gray-400">$</span> Est. Revenue</span>
                  <span className="font-bold text-slate-900">$42,850</span>
               </div>
            </div>
         </div>

         <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl font-bold text-sm text-slate-700 transition-colors flex justify-center items-center gap-2">
            📄 View Detailed Risk Report
         </button>

         <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video">
            <div className="absolute inset-0 bg-amber-900/40 mix-blend-multiply rounded-2xl z-10"></div>
            {/* Mock image replacement */}
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
               <span className="text-white/20 text-4xl">🐔</span>
            </div>
            <div className="absolute bottom-4 left-4 z-20">
               <span className="px-2 py-0.5 bg-white/90 text-slate-900 font-bold text-[10px] uppercase rounded mb-2 inline-block">Pro Tip</span>
               <p className="text-white font-bold text-sm">Check local grain indices weekly.</p>
            </div>
         </div>
      </div>

    </div>
  );
}
