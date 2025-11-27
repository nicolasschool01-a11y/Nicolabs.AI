
import React from 'react';
import { ChevronRightIcon, UploadIcon, WandIcon, ImageIcon, CheckCircleIcon } from './Icons';

interface OnboardingProps {
  onClose: () => void;
}

const STEPS = [
  {
    id: 1,
    title: "1. Sube tu Producto",
    desc: "Saca una foto con tu celular. Ya sea una herramienta, una crema o un repuesto. No importa si el fondo es feo, la IA lo arregla.",
    icon: <UploadIcon className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 2,
    title: "2. Elige el Estilo",
    desc: "Selecciona una tarjeta visual: 'Ferretería', 'Farmacia', 'Instagram Viral'. Sin configuraciones complicadas.",
    icon: <ImageIcon className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 3,
    title: "3. Listo en Segundos",
    desc: "Nicrolabs genera una imagen de catálogo profesional. Descárgala y úsala en tus redes o tienda online.",
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#0F172A] border border-yellow-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-slate-700 shadow-xl">
            {STEPS[currentStep].icon}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            {STEPS[currentStep].title}
          </h3>
          
          <p className="text-slate-300 mb-8 text-sm leading-relaxed max-w-[280px]">
            {STEPS[currentStep].desc}
          </p>
          
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleNext}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2 transform active:scale-95"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <span>¡Empezar Ahora!</span>
                  <CheckCircleIcon className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Siguiente</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-white transition-colors py-2 uppercase tracking-wide font-medium"
            >
              Omitir Intro
            </button>
          </div>
        </div>
        
        {/* Dots */}
        <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-center gap-2">
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep ? 'bg-yellow-500 scale-125' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
