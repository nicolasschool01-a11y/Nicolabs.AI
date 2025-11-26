
import React from 'react';
import { DownloadIcon, TrashIcon, XIcon } from './Icons';
import { GeneratedImage } from '../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GeneratedImage[];
  onDelete: (id: string) => void;
  onSelect: (image: GeneratedImage) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, images, onDelete, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[90vh] bg-[#0F172A] border border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-2xl font-bold text-white">Galería de Sesión</h3>
            <p className="text-sm text-slate-400">Tus creaciones recientes ({images.length})</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/30">
          {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <div className="w-24 h-24 border-2 border-dashed border-slate-600 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl">📷</span>
              </div>
              <p>No hay imágenes generadas aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div key={img.id} className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-yellow-500/50 transition-all">
                  <div className="aspect-square relative cursor-pointer" onClick={() => onSelect(img)}>
                    <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">Ver / Editar</button>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 flex justify-between items-center border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 truncate max-w-[100px] font-mono">
                      {new Date(img.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = img.imageUrl;
                          link.download = `nicrolabs-${img.id}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded transition-colors"
                        title="Descargar"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(img.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GalleryModal;
