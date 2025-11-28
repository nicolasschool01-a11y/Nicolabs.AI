import React from 'react';
import { DownloadIcon, SparklesIcon } from './Icons';

interface ResultDisplayProps {
  imageUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nicrolabs-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-xl overflow-hidden group min-h-[400px]">
      {/* Dynamic Image Container - Ensures image is fully visible without strict aspect ratio forcing */}
      <img
        src={imageUrl}
        alt="Generada"
        className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-2xl rounded-lg"
      />
      
      {/* Overlay Actions - Bottom Right */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Descargar HD</span>
        </button>
      </div>

       {/* Overlay Badge - Top Left */}
       <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-yellow-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          <SparklesIcon className="w-3 h-3" />
          <span>Nicrolabs Studio</span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;