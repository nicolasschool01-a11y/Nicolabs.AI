
import React from 'react';

const TIPS = [
  "💡 Tip: Usa luz natural para tu foto original para mejores resultados.",
  "🔥 Nuevo: Prueba el modo 'Cambio de Rostro' para fotos virales.",
  "📸 Consejo: Sube una referencia de Pinterest para copiar la iluminación exacta.",
  "🚀 Pro: El modo 'Dark & Moody' es ideal para productos de lujo.",
  "✨ Truco: Si usas 'Vista de Dron', asegúrate que el objeto se vea completo.",
  "💎 Valor: Las fotos con fondo simple se procesan más rápido.",
  "🎨 Idea: Usa el modo 'Moda Editorial' para ropa y accesorios."
];

const TipsTicker: React.FC = () => {
  return (
    <div className="bg-[#0B1120] border-b border-slate-800 h-9 flex items-center overflow-hidden relative z-40 select-none">
       <div className="flex animate-ticker whitespace-nowrap">
          {/* Double the list for seamless loop */}
          {[...TIPS, ...TIPS, ...TIPS].map((tip, i) => (
            <div key={i} className="mx-8 text-[10px] md:text-xs font-medium text-slate-400 flex items-center gap-2">
               <span>{tip}</span>
            </div>
          ))}
       </div>
       {/* Gradients to fade edges */}
       <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0B1120] to-transparent pointer-events-none"></div>
       <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0B1120] to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TipsTicker;
