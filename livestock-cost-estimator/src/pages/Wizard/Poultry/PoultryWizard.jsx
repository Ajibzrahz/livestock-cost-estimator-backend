import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import Step1Production from './steps/Step1Production';
import Step2Housing from './steps/Step2Housing';
import Step3Feed from './steps/Step3Feed';
import Step4Health from './steps/Step4Health';
import Step5Market from './steps/Step5Market';

export default function PoultryWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productionType: '',
    productionSystem: '',
    numBirds: '',
    location: '',
    cycleDuration: '',
    hasHousing: '',
    housingType: '',
    housingCapacity: '',
    infrastructure: [],
    averageFeedPrice: 24.50,
    laborCost: 850,
    electricityCost: 120,
    expectedMortality: 5.0,
    vaccineProgram: 'Standard',
    vetFrequency: 'Occasionally (Monthly checkups)',
    medicationIntensity: 'Medium',
    diseaseRisk: 'Low',
    sellPriceKg: 4.25,
    eggPriceCrate: 12.50
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const navItems = [
    { id: 1, name: '1. Production Setup', shortName: 'Production Setup' },
    { id: 2, name: '2. Housing & Infrastructure', shortName: 'Housing Costs' },
    { id: 3, name: '3. Feed & Ops', shortName: 'Feed & Ops' },
    { id: 4, name: '4. Health & Meds', shortName: 'Health & Meds' },
    { id: 5, name: '5. Summary', shortName: 'Summary' }
  ];

  const renderContent = () => {
    switch(currentStep) {
      case 1: return <Step1Production formData={formData} update={updateFormData} onNext={nextStep} onCancel={() => navigate('/estimate')} />;
      case 2: return <Step2Housing formData={formData} update={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 3: return <Step3Feed formData={formData} update={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step4Health formData={formData} update={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step5Market formData={formData} update={updateFormData} onBack={prevStep} onSubmit={() => alert('Done!')} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-center px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
             
             <span className="font-bold text-lg text-slate-900 tracking-tight">Poultry Estimation Wizard</span>
          </div>
         
      </header>

      <div className="flex flex-1 overflow-hidden relative max-w-[1400px] w-full mx-auto">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col pt-8 pb-6 shrink-0 hidden md:flex overflow-y-auto">
           <div className="px-6 mb-8">
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Current Progress</div>
              <div className="flex items-end justify-between mb-2">
                 <span className="text-4xl font-extrabold text-green-500 leading-none">{((currentStep - 1) / 5 * 100) + 20}%</span>
                 <span className="text-xs font-medium text-gray-400 mb-1">Step {currentStep} of 5</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${((currentStep - 1) / 4) * 100}%`}}></div>
              </div>
           </div>

           <div className="px-4 flex-1">
              {navItems.map(item => (
                <div key={item.id} className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 cursor-pointer transition-colors ${currentStep === item.id ? 'bg-green-50 text-green-600 font-bold' : currentStep > item.id ? 'text-slate-700 hover:bg-gray-50 font-medium' : 'text-gray-400 font-medium'}`} onClick={() => currentStep > item.id && setCurrentStep(item.id)}>
                   <div className="flex items-center gap-3">
                      {currentStep > item.id ? (
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                         <div className={`w-1.5 h-1.5 rounded-full ${currentStep === item.id ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                      {item.name}
                   </div>
                </div>
              ))}
           </div>

           {/* Live Estimation Mock box */}
           {/* <div className="px-6 mt-auto pt-6">
              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5">
                 <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Live Estimation</div>
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-sm text-gray-500 font-medium">Fixed Costs</span>
                   <span className="font-bold text-slate-900">₦12,450</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500 font-medium">Projected ROI</span>
                   <span className="font-bold text-green-500">+18.4%</span>
                 </div>
              </div>
           </div> */}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white md:bg-transparent overflow-y-auto w-full relative">
           {renderContent()}
        </div>
      </div>
    </div>
  );
}
