import React from 'react';
import { DownloadIcon, SparklesIcon } from './Icons';

interface ResultDisplayProps {
  imageUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nicolabs-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square bg-slate-900 rounded-xl overflow-hidden border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] group">
      <img
        src={imageUrl}
        alt="Generada"
        className="w-full h-full object-contain"
      />
      
      {/* Overlay Actions */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2 rounded-full font-semibold transition-colors shadow-lg"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Descargar</span>
        </button>
      </div>

       <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          <SparklesIcon className="w-3 h-3" />
          <span>Gemini 2.5 Flash</span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;