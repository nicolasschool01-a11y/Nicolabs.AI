
import React, { useRef } from 'react';
import { UploadIcon, XIcon } from './Icons';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImageAdd: (file: File, slotId: number) => void;
  onImageRemove: (slotId: number) => void;
}

const ImageSlot: React.FC<{
  id: number;
  image?: UploadedImage;
  onAdd: (file: File) => void;
  onRemove: () => void;
}> = ({ id, image, onAdd, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!image) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdd(e.target.files[0]);
    }
  };

  return (
    <div className="relative group w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-slate-700 bg-slate-800/50 transition-all duration-300 hover:border-yellow-500/50 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:-translate-y-1">
      {image ? (
        <>
          <img
            src={image.previewUrl}
            alt={`Referencia ${id}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all animate-in zoom-in"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-white/10 shadow-lg">
            Imagen {id}
          </div>
        </>
      ) : (
        <div
          onClick={handleClick}
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="bg-slate-700/50 p-3 rounded-full mb-2 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all duration-300">
             <UploadIcon className="w-6 h-6 text-slate-500 group-hover:text-yellow-400 transition-colors" />
          </div>
          <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-wide">
            Subir Foto {id}
          </span>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[120px] leading-tight">
            {id === 1 ? "Tu foto principal (Buena luz)" : "Ángulo o detalle extra"}
          </p>
        </div>
      )}
    </div>
  );
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImageAdd, onImageRemove }) => {
  const getSlotImage = (id: number) => images.find(img => img.id === id);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((id) => (
        <ImageSlot
          key={id}
          id={id}
          image={getSlotImage(id)}
          onAdd={(file) => onImageAdd(file, id)}
          onRemove={() => onImageRemove(id)}
        />
      ))}
    </div>
  );
};

export default ImageUploader;
