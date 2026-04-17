import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function Step3Feed({ formData, update, onNext, onBack }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full bg-white md:my-10 md:rounded-3xl md:shadow-xl md:border md:border-gray-100">
      <div className="mb-8">
         <span className="inline-block px-3 py-1 bg-green-100 text-green-600 font-bold text-xs rounded-full uppercase tracking-wide mb-4">
            STEP 3: FEED & OPERATIONAL INPUTS
         </span>
         <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Fine-tune your daily operations</h2>
         <p className="text-gray-500">Adjust recurring costs to get a precise profitability forecast for your poultry venture.</p>
      </div>

      <div className="bg-green-50 rounded-2xl p-6 flex gap-4 border border-green-100 mb-10 items-start">
         <Lightbulb className="text-green-500 w-6 h-6 shrink-0 mt-0.5" />
         <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Pro-Tip: Using Regional Defaults</h4>
            <p className="text-sm text-gray-600 leading-relaxed">If you're unsure about specific costs, you can skip these inputs. The wizard will automatically apply current regional averages for your specified location.</p>
            <button className="text-green-600 font-bold text-sm mt-2 flex items-center hover:text-green-700">View regional data map →</button>
         </div>
      </div>

      <div className="space-y-6">
         {/* Average Feed Price */}
         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h4 className="font-bold text-slate-900 text-lg">Average Feed Price</h4>
                  <p className="text-sm text-gray-500">Cost per 50kg bag (Standard Layer Feed)</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">MANUAL OVERRIDE</span>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center mb-6">
               <span className="text-gray-400 font-bold text-xl mr-2">₦</span>
               <input 
                 type="number"
                 value={formData.averageFeedPrice}
                 onChange={(e) => update({ averageFeedPrice: Number(e.target.value) })}
                 className="bg-transparent border-none outline-none text-4xl font-extrabold text-slate-900 w-full"
               />
            </div>

            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
               <span>ECONOMIC RANGE</span>
               <span>PREMIUM RANGE</span>
            </div>
            <input 
              type="range"
              min="10000"
              max="50000"
              value={formData.averageFeedPrice * 1000} // converting to mock higher number for slider visualization
              onChange={() => {}} // mock logic
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
         </div>

         {/* Labor and Electricity */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">👥</span>
                  <h4 className="font-bold text-slate-900">Labor Cost</h4>
               </div>
               <p className="text-xs text-gray-500 mb-4">Monthly wages for farm assistants</p>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center mb-6">
                  <span className="text-gray-400 font-bold mr-2">₦</span>
                  <input 
                    type="number"
                    value={formData.laborCost}
                    onChange={(e) => update({ laborCost: Number(e.target.value) })}
                    className="bg-transparent border-none outline-none text-xl font-bold text-slate-900 w-full"
                  />
               </div>
               <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500" />
            </div>

            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">⚡</span>
                  <h4 className="font-bold text-slate-900">Electricity Cost</h4>
               </div>
               <p className="text-xs text-gray-500 mb-4">Estimated monthly utility bill</p>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center mb-6">
                  <span className="text-gray-400 font-bold mr-2">₦</span>
                  <input 
                    type="number"
                    value={formData.electricityCost}
                    onChange={(e) => update({ electricityCost: Number(e.target.value) })}
                    className="bg-transparent border-none outline-none text-xl font-bold text-slate-900 w-full"
                  />
               </div>
               <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500" />
            </div>
         </div>
      </div>

      <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          Back: Housing
        </button>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-all">
             Save Draft
           </button>
           <button 
             onClick={onNext}
             className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30 flex items-center gap-2"
           >
             Next Step: Health <span>→</span>
           </button>
        </div>
      </div>
    </div>
  );
}
