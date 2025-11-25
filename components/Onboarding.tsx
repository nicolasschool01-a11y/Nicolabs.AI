import React from 'react';
import { ChevronRightIcon, UploadIcon, WandIcon, ImageIcon, CheckCircleIcon } from './Icons';

interface OnboardingProps {
  onClose: () => void;
}

const STEPS = [
  {
    id: 1,
    title: "Sube tu Producto",
    desc: "Toma una foto con tu celular. No importa el fondo. La IA identificará el objeto principal.",
    icon: <UploadIcon className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 2,
    title: "Define el Estilo",
    desc: "Elige entre Gastronomía, Moda, etc. También puedes subir una foto de referencia para copiar la iluminación.",
    icon: <ImageIcon className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 3,
    title: "Genera Magia",
    desc: "Nicrolabs creará un entorno de estudio 8K. Puedes descargar la imagen o generar nuevas versiones.",
    icon: <WandIcon className="w-8 h-8 text-yellow-400" />
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            {STEPS[currentStep].icon}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {STEPS[currentStep].title}
          </h3>
          
          <p className="text-slate-400 mb-8 min-h-[80px]">
            {STEPS[currentStep].desc}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <span>Comenzar a Crear</span>
                  <CheckCircleIcon className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Siguiente Paso</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-white transition-colors py-2"
            >
              Saltar Tutorial
            </button>
          </div>
        </div>
        
        {/* Step Indicators */}
        <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-center gap-2">
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep ? 'bg-yellow-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;