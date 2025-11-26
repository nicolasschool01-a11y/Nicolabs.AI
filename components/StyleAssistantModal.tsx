
import React, { useState } from 'react';
import { BotIcon, SparklesIcon, XIcon } from './Icons';

interface StyleAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (description: string) => Promise<void>;
}

const StyleAssistantModal: React.FC<StyleAssistantModalProps> = ({ isOpen, onClose, onAnalyze }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setIsAnalyzing(true);
    await onAnalyze(description);
    setIsAnalyzing(false);
    onClose();
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in-95">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 border-b border-indigo-500/30 flex items-start justify-between">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                 <BotIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-white">Asistente de Estilo IA</h3>
                 <p className="text-xs text-indigo-200">Tu Director Creativo Virtual</p>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
             <XIcon className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6">
          <label className="block text-sm text-slate-300 mb-3 font-medium">
            Cuéntame sobre tu negocio y qué buscas lograr:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: 'Vendo zapatillas urbanas para jóvenes y quiero fotos agresivas y callejeras para Instagram' o 'Soy una pastelería fina y busco fotos elegantes y luminosas para mi web'."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none mb-6"
          />
          
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !description.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analizando tu marca...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>Auto-Configurar Estudio</span>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-indigo-900/10 p-4 border-t border-indigo-500/10 text-center">
          <p className="text-[10px] text-indigo-300/70">
            La IA analizará tu texto y seleccionará automáticamente la mejor iluminación, cámara y estilo.
          </p>
        </div>

      </div>
    </div>
  );
};

export default StyleAssistantModal;
