import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import LoginPage from './components/LoginPage';
import Onboarding from './components/Onboarding';
import GalleryModal from './components/GalleryModal';
import TipsTicker from './components/TipsTicker';
import { WandIcon, SparklesIcon, LogoIcon, GridIcon, BoltIcon, PaletteIcon, CheckCircleIcon } from './components/Icons';
import { editImageWithGemini, fileToBase64, addWatermark } from './services/geminiService';
import { ProcessingState, UploadedImage, StyleOptions, GeneratedImage, ViewMode, QuickPreset } from './types';

// --- CONSTANTS & CONFIG ---

const LOADING_MESSAGES = [
  "Analizando tu producto...",
  "Configurando iluminación de estudio...",
  "Mejorando texturas y reflejos...",
  "Renderizando en alta definición...",
  "Aplicando toque final profesional..."
];

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: "gastro_pro",
    label: "Gastronomía",
    description: "Platos deliciosos y frescos",
    icon: <span className="text-2xl">🍔</span>,
    imageHint: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80",
    config: { business: "Gastronomía Gourmet", vibe: "Orgánico & Natural", lighting: "Luz de Ventana", format: "post_square" }
  },
  {
    id: "insta_viral",
    label: "Instagram Viral",
    description: "Estilo Influencer / Lifestyle",
    icon: <span className="text-2xl">📸</span>,
    imageHint: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    config: { business: "Marca Personal / Influencer", vibe: "Urbano & Street", lighting: "Golden Hour", format: "story" }
  },
  {
    id: "ecommerce_clean",
    label: "Catálogo E-com",
    description: "Fondo limpio y nítido",
    icon: <span className="text-2xl">🛍️</span>,
    imageHint: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
    config: { business: "E-commerce Pro", vibe: "Lujo Minimalista", lighting: "Estudio Softbox", format: "post_square" }
  },
  {
    id: "hardware_pro",
    label: "Ferretería / Taller",
    description: "Herramientas con poder",
    icon: <span className="text-2xl">🔧</span>,
    imageHint: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=200&q=80",
    config: { business: "Automotriz / Autos", vibe: "Dark & Moody", lighting: "Dramático (Chiaroscuro)", format: "post_square" }
  },
  {
    id: "beauty_glam",
    label: "Cosmética & Belleza",
    description: "Lujo, agua y espejos",
    icon: <span className="text-2xl">💄</span>,
    imageHint: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80",
    config: { business: "Belleza & Cosmética", vibe: "Lujo Minimalista", lighting: "Estudio Softbox", format: "story" }
  },
  {
    id: "auto_showroom",
    label: "Venta de Auto",
    description: "Showroom Brillante",
    icon: <span className="text-2xl">🚗</span>,
    imageHint: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80",
    config: { business: "Automotriz / Autos", vibe: "Lujo Minimalista", lighting: "Estudio Softbox", format: "post_square", is4K: true }
  }
];

const PRESET_FORMATS = [
  { id: "post_square", label: "Post (1:1)", desc: "Instagram/Facebook", prompt: "Composición cuadrada." },
  { id: "story", label: "Story (9:16)", desc: "TikTok/Reels", prompt: "Vertical, espacio para texto arriba." },
  { id: "flyer", label: "Flyer (3:4)", desc: "Volantes/Print", prompt: "Vertical 3:4." },
  { id: "cover", label: "Portada (16:9)", desc: "Web/YouTube", prompt: "Panorámico 16:9." }
];

const FORMAT_MAP: Record<string, string> = {
  'post_square': '1:1', 'story': '9:16', 'flyer': '3:4', 'cover': '16:9', 'thumbnail': '16:9'
};

const PRESET_STYLES = {
  business: [
    { id: "automotive", label: "🚗 Automotriz", desc: "Autos y Motos", value: "Fotografía automotriz profesional..." },
    { id: "personal_brand", label: "📸 Marca Personal", desc: "Influencers", value: "Lifestyle influencer portrait..." },
    { id: "gastro", label: "🍔 Gastronomía", desc: "Comida", value: "Fotografía gastronómica..." },
    { id: "ecommerce", label: "🛍️ E-commerce", desc: "Productos", value: "Packshot clean studio..." },
    { id: "fashion", label: "👗 Moda", desc: "Ropa", value: "Fashion editorial..." },
    { id: "beauty", label: "💄 Belleza", desc: "Cosmética", value: "Cosmetic luxury..." },
    { id: "realestate", label: "🏠 Deco", desc: "Muebles", value: "Interior design..." },
    { id: "tech", label: "📱 Tech", desc: "Gadgets", value: "Tech futuristic..." },
  ],
  lighting: [
    { label: "☀️ Golden Hour", desc: "", value: "Golden hour..." },
    { label: "💡 Estudio", desc: "", value: "Studio lighting..." },
    { label: "🌓 Dramático", desc: "", value: "Dramatic contrast..." },
  ]
};

// --- COMPONENTS ---

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="w-full max-w-xl mx-auto mb-10">
    <div className="flex justify-between items-center relative">
      <div className="absolute left-0 top-4 w-full h-1 bg-slate-800 -z-10"></div>
      
      {[1, 2, 3].map((step) => {
        const isActive = step <= currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={step} className="flex flex-col items-center gap-2 bg-[#0B1120] px-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${isActive ? 'bg-yellow-500 border-yellow-500 text-black scale-110' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
              {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : step}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-white' : 'text-slate-600'}`}>
              {step === 1 ? '1. Sube tu producto' : step === 2 ? '2. Elige el estilo' : '3. Genera la foto'}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const App: React.FC = () => {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('quick'); // Default to Quick Mode
  
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [styleReference, setStyleReference] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState('');
  
  const [selectedStyles, setSelectedStyles] = useState<StyleOptions>({
    business: '', vibe: '', lighting: '', camera: '', angle: '', format: 'post_square', is4K: false, isFaceSwap: false
  });
  
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({ isLoading: false, error: null, statusMessage: '' });

  const loadingIntervalRef = useRef<number | null>(null);

  // --- DERIVED STATE ---
  const currentStep = images.length === 0 ? 1 : (prompt || selectedStyles.business) ? 2 : 2;

  // --- HANDLERS ---

  const handleLogin = (guestMode: boolean = false) => {
    setIsGuest(guestMode);
    setIsAuthenticated(true);
    if (!localStorage.getItem('nicrolabs_onboarding_seen')) {
      setShowOnboarding(true);
      localStorage.setItem('nicrolabs_onboarding_seen', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false); setImages([]); setStyleReference(null); setPrompt(''); setHistory([]); setCurrentImage(null);
  };

  const handleImageAdd = (file: File, id: number) => {
    const newImage: UploadedImage = { id, file, previewUrl: URL.createObjectURL(file) };
    setImages(prev => [...prev.filter(img => img.id !== id), newImage].sort((a, b) => a.id - b.id));
  };

  const applyQuickPreset = (preset: QuickPreset) => {
    setSelectedStyles(prev => ({ ...prev, ...preset.config, isFaceSwap: false }));
    setPrompt(`Estilo ${preset.label}: ${preset.description}.`);
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    setProcessingState({ isLoading: true, error: null });
    
    let index = 0;
    setProcessingState(prev => ({ ...prev, statusMessage: LOADING_MESSAGES[0] }));
    loadingIntervalRef.current = window.setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setProcessingState(prev => ({ ...prev, statusMessage: LOADING_MESSAGES[index] }));
    }, 2000);

    try {
      const isProModel = FORMAT_MAP[selectedStyles.format] !== '1:1' || selectedStyles.is4K;
      if (isProModel) {
        const aistudio = (window as any).aistudio;
        if (aistudio && !(await aistudio.hasSelectedApiKey())) {
           await aistudio.openSelectKey();
        }
      }

      const imagesPayload = await Promise.all(images.map(async (img) => ({
        base64: await fileToBase64(img.file), mimeType: img.file.type
      })));

      let styleRefPayload = undefined;
      if (styleReference) {
        styleRefPayload = { base64: await fileToBase64(styleReference.file), mimeType: styleReference.file.type };
      }

      let finalPrompt = "";
      if (selectedStyles.isFaceSwap) {
         finalPrompt = `ACT AS EXPERT RETOUCHER. FACE SWAP TASK. Instruction: "${prompt}". Match lighting and skin tone perfectly. Photorealistic.`;
      } else {
         finalPrompt = `Role: Pro Product Photographer. Goal: Integrate product into scene.\n`;
         if (selectedStyles.business) finalPrompt += `Context: ${selectedStyles.business}.\n`;
         finalPrompt += `Scene Description: "${prompt}".\n`;
         if (selectedStyles.vibe) finalPrompt += `Style: ${selectedStyles.vibe}. Lighting: ${selectedStyles.lighting}.\n`;
         if (selectedStyles.format) finalPrompt += `Format: ${PRESET_FORMATS.find(f => f.id === selectedStyles.format)?.prompt}`;
      }

      let resultUrl = await editImageWithGemini(
        imagesPayload, finalPrompt, styleRefPayload, FORMAT_MAP[selectedStyles.format] || '1:1', selectedStyles.is4K || false
      );

      if (isGuest) resultUrl = await addWatermark(resultUrl);

      const newCreation = { id: Date.now().toString(), imageUrl: resultUrl, prompt: prompt, timestamp: Date.now() };
      setHistory(prev => [newCreation, ...prev]);
      setCurrentImage(newCreation);
      setProcessingState({ isLoading: false, error: null, statusMessage: '' });

    } catch (error: any) {
      setProcessingState({ isLoading: false, error: error.message || "Error", statusMessage: '' });
    } finally {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans pb-20">
      
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
      
      <GalleryModal 
        isOpen={showGallery} onClose={() => setShowGallery(false)} images={history} 
        onDelete={(id) => { setHistory(prev => prev.filter(i => i.id !== id)); if(currentImage?.id === id) setCurrentImage(null); }}
        onSelect={(img) => { setCurrentImage(img); setShowGallery(false); }}
      />

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500 p-1.5 rounded-lg"><LogoIcon className="w-5 h-5 text-black" /></div>
            <span className="font-bold text-lg text-white">Nicrolabs<span className="text-yellow-400">.AI</span></span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
              <span className="text-xs font-bold text-yellow-400">🎁 Prueba gratis: 7 días restantes</span>
            </div>
            <button onClick={() => setShowGallery(true)} className="p-2 text-slate-400 hover:text-white relative">
              <GridIcon className="w-5 h-5" />
              {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>}
            </button>
            <button onClick={handleLogout} className="text-xs font-medium text-slate-400 hover:text-white">Salir</button>
          </div>
        </div>
      </header>

      <TipsTicker />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* STEPPER */}
        <StepIndicator currentStep={images.length > 0 ? (processingState.isLoading || currentImage ? 3 : 2) : 1} />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: INPUTS (7/12) --- */}
          <div className="lg:col-span-7 space-y-6 animate-in slide-in-from-left duration-500">
            
            {/* STEP 1: UPLOAD */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                   Paso 1: Sube tus Fotos
                 </h3>
                 <span className="text-xs text-slate-500">Máx 3 imágenes</span>
              </div>
              <ImageUploader images={images} onImageAdd={handleImageAdd} onImageRemove={(id) => setImages(prev => prev.filter(img => img.id !== id))} />
            </section>

            {/* MODE TOGGLE - HIDDEN BY DEFAULT TO SIMPLIFY, SHOWN AS A TAB */}
            <div className="flex justify-center">
              <div className="bg-slate-900 p-1 rounded-full border border-slate-800 flex shadow-inner">
                <button 
                  onClick={() => setViewMode('quick')}
                  className={`px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'quick' ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <BoltIcon className="w-4 h-4" /> Modo Rápido
                </button>
                <button 
                  onClick={() => setViewMode('pro')}
                  className={`px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'pro' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <PaletteIcon className="w-4 h-4" /> Opciones Avanzadas
                </button>
              </div>
            </div>

            {/* STEP 2: STYLE SELECTION */}
            <section className={`space-y-6 transition-all duration-500 ${images.length === 0 ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
              
              {/* QUICK MODE UI */}
              {viewMode === 'quick' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Paso 2: Elige el Estilo
                     </h3>
                  </div>
                  
                  {/* Visual Preset Cards */}
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                    {QUICK_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyQuickPreset(preset)}
                        className={`
                          relative flex-shrink-0 w-32 md:w-40 bg-slate-800 rounded-xl overflow-hidden border-2 transition-all snap-start text-left group
                          ${selectedStyles.business === preset.config.business && prompt.includes(preset.label) 
                            ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] scale-105' 
                            : 'border-slate-700 hover:border-slate-500 hover:scale-105'
                          }
                        `}
                      >
                         <div className="h-24 md:h-32 bg-slate-700 relative">
                            <img src={preset.imageHint} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt={preset.label} />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full border border-white/20">
                                  {preset.icon}
                               </div>
                            </div>
                         </div>
                         <div className="p-3">
                            <h4 className="text-xs font-bold text-white leading-tight mb-1">{preset.label}</h4>
                            <p className="text-[10px] text-slate-400 leading-tight">{preset.description}</p>
                         </div>
                         {selectedStyles.business === preset.config.business && prompt.includes(preset.label) && (
                           <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1 rounded-full shadow-lg">
                             <CheckCircleIcon className="w-3 h-3" />
                           </div>
                         )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PRO MODE UI */}
              {viewMode === 'pro' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                     Configuración Manual
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs text-slate-500 block mb-1">Negocio</label>
                       <select 
                         className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs"
                         onChange={(e) => setSelectedStyles(p => ({...p, business: e.target.value}))}
                       >
                         <option value="">Seleccionar...</option>
                         {PRESET_STYLES.business.map(b => <option key={b.id} value={b.value}>{b.label}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="text-xs text-slate-500 block mb-1">Iluminación</label>
                       <select 
                         className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs"
                         onChange={(e) => setSelectedStyles(p => ({...p, lighting: e.target.value}))}
                       >
                         <option value="">Seleccionar...</option>
                         {PRESET_STYLES.lighting.map(l => <option key={l.label} value={l.value}>{l.label}</option>)}
                       </select>
                     </div>
                  </div>
                  
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Escribe tu prompt detallado aquí..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm h-28 focus:border-yellow-500"
                  />
                  
                  <div className="flex items-center gap-4">
                     <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={selectedStyles.is4K} onChange={(e) => setSelectedStyles(p => ({...p, is4K: e.target.checked}))} />
                        <span className="text-blue-400 font-bold">Activar 4K Ultra HD</span>
                     </label>
                     <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={selectedStyles.isFaceSwap} onChange={(e) => setSelectedStyles(p => ({...p, isFaceSwap: e.target.checked}))} />
                        <span className="text-purple-400 font-bold">Modo Face Swap</span>
                     </label>
                  </div>
                </div>
              )}
            </section>

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={images.length === 0 || (!prompt && !selectedStyles.business) || processingState.isLoading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]
                ${(images.length === 0 || (!prompt && !selectedStyles.business) || processingState.isLoading)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 hover:shadow-orange-500/20 hover:-translate-y-1'
                }
              `}
            >
              {processingState.isLoading ? (
                <>
                   <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                   <span>{processingState.statusMessage}</span>
                </>
              ) : (
                <>
                   <WandIcon className="w-6 h-6" />
                   <span>Generar Foto Mágica</span>
                </>
              )}
            </button>

          </div>

          {/* --- RIGHT COLUMN: RESULT (5/12) --- */}
          <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-right duration-500 delay-100">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
               
               {/* Header */}
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                     Resultado
                  </h3>
                  {currentImage && <span className="text-[10px] text-green-400 border border-green-500/30 px-2 rounded-full">Listo</span>}
               </div>

               {/* Canvas */}
               <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#050912] p-4 flex items-center justify-center relative">
                  {currentImage ? (
                    <div className="w-full h-full animate-in zoom-in-95 duration-500">
                       <ResultDisplay imageUrl={currentImage.imageUrl} />
                    </div>
                  ) : (
                    <div className={`text-center p-8 opacity-30 flex flex-col items-center`}>
                       <SparklesIcon className="w-12 h-12 mb-4" />
                       <p className="text-sm font-medium">Aquí aparecerá tu magia</p>
                    </div>
                  )}
               </div>
            </div>
            
            {/* History Strip */}
            {history.length > 0 && (
               <div className="flex gap-2 overflow-x-auto pb-2">
                 {history.map(img => (
                   <img 
                     key={img.id} 
                     src={img.imageUrl} 
                     onClick={() => setCurrentImage(img)}
                     className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 transition-all ${currentImage?.id === img.id ? 'border-yellow-500 opacity-100' : 'border-slate-700 opacity-60'}`} 
                   />
                 ))}
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;