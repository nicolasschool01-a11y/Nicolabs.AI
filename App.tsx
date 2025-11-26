
import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import LoginPage from './components/LoginPage';
import Onboarding from './components/Onboarding';
import GalleryModal from './components/GalleryModal';
import StyleAssistantModal from './components/StyleAssistantModal';
import { WandIcon, SparklesIcon, LogoIcon, ArrowLeftIcon, PinterestIcon, UploadIcon, XIcon, CheckCircleIcon, LayoutIcon, HdIcon, LightbulbIcon, BookOpenIcon, ChevronDownIcon, FaceIcon, RefreshIcon, CameraIcon, GridIcon, TrashIcon, BotIcon } from './components/Icons';
import { editImageWithGemini, fileToBase64, addWatermark, getStyleSuggestions } from './services/geminiService';
import { ProcessingState, UploadedImage, StyleOptions, GeneratedImage } from './types';

// --- CONFIGURATION DATA PRO ---

const LOADING_MESSAGES = [
  "Calibrando lentes virtuales 85mm...",
  "Configurando esquema de iluminación de 3 puntos...",
  "Analizando geometría y materiales del producto...",
  "Renderizando texturas en resolución 8K...",
  "Aplicando corrección de color cinemática...",
  "Finalizando post-producción digital..."
];

const PRESET_FORMATS = [
  { 
    id: "post_square", 
    label: "Post (1:1)", 
    desc: "Redes Sociales",
    prompt: "Composición cuadrada centrada, ideal para Instagram Feed." 
  },
  { 
    id: "story", 
    label: "Story (9:16)", 
    desc: "Instagram/TikTok", 
    prompt: "Composición vertical (Portrait 9:16). DEJA ESPACIO NEGATIVO EN LA PARTE SUPERIOR E INFERIOR para texto. El producto debe estar centrado verticalmente." 
  },
  { 
    id: "flyer", 
    label: "Flyer (3:4)", 
    desc: "Volante Publicitario", 
    prompt: "Diseño de Flyer Publicitario Vertical (3:4). Composición gráfica limpia con espacio negativo claro en la parte superior para titulares grandes. Fondo atractivo que guíe la vista al producto." 
  },
  { 
    id: "cover", 
    label: "Portada (16:9)", 
    desc: "Facebook/YouTube", 
    prompt: "Composición panorámica horizontal (16:9). El producto debe estar a la izquierda o derecha (Regla de Tercios), dejando un gran espacio negativo lateral para poner títulos y logos." 
  },
  { 
    id: "thumbnail", 
    label: "Miniatura (16:9)", 
    desc: "YouTube Thumb", 
    prompt: "Estilo Miniatura de YouTube de alto impacto (16:9). Fondo contrastante, colores vibrantes, silueta del producto muy definida, espacio para texto grande." 
  }
];

// Mapping formats to Gemini API aspect ratios
const FORMAT_MAP: Record<string, string> = {
  'post_square': '1:1',
  'story': '9:16',
  'flyer': '3:4',
  'cover': '16:9',
  'thumbnail': '16:9'
};

const PRESET_STYLES = {
  business: [
    { 
      id: "gastro",
      label: "🍔 Gastronomía Gourmet", 
      desc: "Platillos, postres y bebidas. Enfoque en texturas deliciosas.",
      value: "Fotografía gastronómica de alta gama (Michelin Star style). Iluminación que resalta la frescura, el brillo de las salsas y la textura de los ingredientes. Profundidad de campo suave." 
    },
    { 
      id: "ecommerce",
      label: "🛍️ E-commerce Pro", 
      desc: "Fondo limpio y nítido. Ideal para Amazon, Shopify y Catálogos.",
      value: "Fotografía de producto comercial (Packshot) de ultra alta definición. Fondo limpio, iluminación de estudio perfectamente blanca y difusa, enfoque nítido en todo el producto (focus stacking)." 
    },
    { 
      id: "fashion",
      label: "👗 Moda Editorial", 
      desc: "Ropa, joyería y accesorios. Estilo revista de lujo.",
      value: "Fotografía de moda editorial estilo Vogue. Iluminación dramática pero favorecedora, poses dinámicas si hay modelos, texturas de tela ricas y detalladas. Estética sofisticada." 
    },
    { 
      id: "beauty",
      label: "💄 Belleza & Cosmética", 
      desc: "Cremas, perfumes y maquillaje. Sensación de pureza y lujo.",
      value: "Fotografía publicitaria de cosméticos premium. Superficies reflectantes (vidrio, agua, espejos), iluminación etérea y suave, sensación de higiene, pureza y lujo absoluto." 
    },
    { 
      id: "realestate",
      label: "🏠 Deco & Inmobiliaria", 
      desc: "Muebles y espacios. Gran angular y luz natural.",
      value: "Fotografía de arquitectura e interiorismo (Architectural Digest). Lentes gran angular rectilíneos, luz natural abundante, espacios perfectamente organizados y acogedores." 
    },
    { 
      id: "tech",
      label: "📱 Tech & Gadgets", 
      desc: "Electrónica y gadgets. Luces neón y acabados metálicos.",
      value: "Fotografía tecnológica futurista. Iluminación con acentos de color (rim light), reflejos metálicos nítidos, fondo oscuro y elegante, sensación de innovación." 
    },
  ],
  vibe: [
    { label: "💎 Lujo Minimalista", desc: "Menos es más. Fondos mármol, seda, neutros.", value: "Estética minimalista de lujo, paleta de colores neutra (beige, blanco, gris), materiales nobles como mármol o seda." },
    { label: "🌿 Orgánico & Natural", desc: "Luz solar, plantas, madera, aire libre.", value: "Estilo biofílico y orgánico. Luz solar dura o filtrada por árboles, sombras naturales, elementos de madera, piedra y plantas vivas." },
    { label: "🌆 Urbano & Street", desc: "Concreto, ciudad, asfalto, moderno.", value: "Estilo urbano callejero (Streetwear). Fondos de concreto, ciudad desenfocada, luz de día nublado o atardecer urbano." },
    { label: "🎨 Pop & Color Block", desc: "Colores vibrantes, sólidos y divertidos.", value: "Estilo Pop Art moderno. Fondos de colores sólidos vibrantes y contrastantes, iluminación dura, sombras definidas, energía juvenil." },
    { label: "🌑 Dark & Moody", desc: "Oscuro, elegante, misterioso y premium.", value: "Estilo 'Dark Academy' o Moody. Clave baja, fondo oscuro o negro texturizado, iluminación puntual que recorta la silueta, muy elegante." },
    { label: "🕰️ Retro Vintage", desc: "Nostalgia, grano de película, calidez.", value: "Estética retro analógica. Colores ligeramente desaturados, calidez, grano de película sutil, sensación de nostalgia." },
  ],
  lighting: [
    { label: "☀️ Golden Hour", desc: "Atardecer cálido", value: "Iluminación de hora dorada (Golden Hour). Luz solar baja, cálida y anaranjada, sombras largas y estéticas, destellos de lente (lens flare) sutiles." },
    { label: "💡 Estudio Softbox", desc: "Luz perfecta difusa", value: "Iluminación de estudio profesional con Softbox gigante. Luz envolvente, sombras extremadamente suaves, perfecto para ver todos los detalles." },
    { label: "🌓 Dramático (Chiaroscuro)", desc: "Alto contraste", value: "Iluminación de alto contraste (Chiaroscuro). Sombras profundas y luces brillantes, crea volumen y drama, muy artístico." },
    { label: "☁️ Luz de Ventana", desc: "Natural y suave", value: "Iluminación natural de ventana norte. Luz blanca, fría y suave, muy realista y honesta." },
    { label: "🟣 Neón Cyberpunk", desc: "Azul y Rosa", value: "Iluminación creativa con geles de color. Luces de borde azules y magentas (estilo Cyberpunk), fondo oscuro." },
  ],
  camera: [
    { label: "Macro (Detalle)", desc: "Primer plano extremo", value: "Lente Macro 100mm. Primerísimo primer plano, desenfoque de fondo (bokeh) cremoso y extremo, enfoque crítico en el detalle principal." },
    { label: "Retrato (50mm-85mm)", desc: "Visión natural", value: "Lente Prime de 50mm u 85mm. Compresión de perspectiva natural, desenfoque de fondo agradable, look estándar profesional." },
    { label: "Gran Angular", desc: "Espacioso", value: "Lente Gran Angular 24mm. Sensación de amplitud, líneas dinámicas, ideal para mostrar el entorno completo." },
    { label: "Acción / GoPro", desc: "Inmersivo", value: "Lente ultra gran angular tipo cámara de acción (Fisheye). Perspectiva curva inmersiva, todo en foco, estilo deporte extremo." },
    { label: "Cine Anamórfico", desc: "Look de película", value: "Lente Anamórfico de Cine. Destellos horizontales, bokeh ovalado, relación de aspecto cinemática, look de producción de Hollywood." },
  ],
  angle: [
    { label: "Frontal (Héroe)", desc: "A nivel de ojos", value: "Ángulo a nivel de los ojos o ligeramente contrapicado (Hero Shot). Hace que el producto se vea imponente y majestuoso." },
    { label: "Zenital (Flat Lay)", desc: "Desde arriba", value: "Vista totalmente cenital (Flat Lay) a 90 grados. Composición geométrica, ordenado, ideal para mostrar conjuntos de objetos." },
    { label: "45 Grados (Isométrico)", desc: "Clásico", value: "Ángulo de 45 grados (tres cuartos). Muestra volumen, profundidad y lados del producto simultáneamente." },
    { label: "🚁 Vista de Dron", desc: "Aérea panorámica", value: "Vista aérea panorámica (Drone Shot). Plano general lejano desde el cielo, mostrando el producto integrado en un paisaje vasto." },
    { label: "Contrapicado (Low Angle)", desc: "Poderoso", value: "Ángulo bajo (Low Angle Shot) mirando hacia arriba. Otorga poder y grandiosidad al objeto, haciéndolo parecer monumental." },
  ]
};

// Smart Templates based on Business Category
const PROMPT_TEMPLATES: Record<string, string[]> = {
  "gastro": [
    "Sobre una mesa de madera rústica envejecida en una terraza italiana.",
    "Flotando dinámicamente con ingredientes frescos volando alrededor (splash).",
    "Primer plano macro con vapor saliendo, fondo oscuro de cocina profesional."
  ],
  "fashion": [
    "Modelo invisible (Ghost Mannequin) en un entorno de estudio blanco puro.",
    "Colocado sobre rocas volcánicas negras en una playa al atardecer.",
    "En una calle de París con arquitectura clásica desenfocada al fondo."
  ],
  "ecommerce": [
    "Sobre un podio cilíndrico color pastel con sombras duras modernas.",
    "Fondo infinito blanco puro (RGB 255,255,255) con reflejo sutil en el suelo.",
    "Composición geométrica con formas abstractas de vidrio y metal."
  ],
  "beauty": [
    "Rodeado de flores frescas y gotas de agua sobre una superficie de espejo.",
    "Sobre una textura de seda satinada color champagne con luz suave.",
    "En un baño de mármol blanco de lujo con luz de mañana."
  ],
  "realestate": [
    "Estilo nórdico minimalista, luz de día, alfombras y plantas verdes.",
    "Loft industrial con paredes de ladrillo y grandes ventanales de hierro.",
    "Salón nocturno acogedor con chimenea encendida y luces cálidas."
  ],
  "tech": [
    "Sobre una superficie de metal cepillado con luces de neón azules de fondo.",
    "Flotando en un espacio oscuro con particulas de luz (estilo Matrix).",
    "Escritorio setup minimalista de madera con plantas y luz natural."
  ]
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showStyleAssistant, setShowStyleAssistant] = useState(false);
  
  // State for images
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [styleReference, setStyleReference] = useState<UploadedImage | null>(null);
  
  const [prompt, setPrompt] = useState('');
  
  // State for IDs to match the new structure
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<StyleOptions>({
    business: '',
    vibe: '',
    lighting: '',
    camera: '',
    angle: '',
    format: 'post_square',
    is4K: false,
    isFaceSwap: false // Default to Product mode
  });
  
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    statusMessage: ''
  });

  const loadingIntervalRef = useRef<number | null>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---

  const handleLogin = (guestMode: boolean = false) => {
    setIsGuest(guestMode);
    setIsAuthenticated(true);
    
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('nicrolabs_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('nicrolabs_onboarding_seen', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setImages([]);
    setStyleReference(null);
    setPrompt('');
    setHistory([]);
    setCurrentImage(null);
  }

  const handleImageAdd = (file: File, id: number) => {
    const newImage: UploadedImage = {
      id,
      file,
      previewUrl: URL.createObjectURL(file)
    };
    setImages(prev => [...prev.filter(img => img.id !== id), newImage].sort((a, b) => a.id - b.id));
  };

  const handleImageRemove = (id: number) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleStyleRefAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setStyleReference({
        id: 999,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const selectBusiness = (id: string, value: string) => {
    setSelectedBusinessId(id === selectedBusinessId ? '' : id);
    setSelectedStyles(prev => ({ ...prev, business: id === selectedBusinessId ? '' : value }));
  };

  const toggleStyle = (category: keyof StyleOptions, value: any) => {
     if (typeof value === 'boolean') {
        setSelectedStyles(prev => ({ ...prev, [category]: value }));
     } else {
        setSelectedStyles(prev => ({ ...prev, [category]: prev[category as keyof StyleOptions] === value ? '' : value }));
     }
  };

  const toggleFaceSwapMode = (enabled: boolean) => {
    setSelectedStyles(prev => ({ ...prev, isFaceSwap: enabled }));
    // Reset business if switching to face swap to clear product prompts
    if (enabled) {
      setSelectedBusinessId('');
      setPrompt('');
    }
  };

  const applyTemplate = (templateText: string) => {
    setPrompt(templateText);
  };

  const openPinterest = () => {
    window.open('https://www.pinterest.com/search/pins/?q=professional%20product%20photography%20ideas', '_blank');
  };

  const handleStyleAnalysis = async (description: string) => {
    const suggestions = await getStyleSuggestions(description, {
      business: PRESET_STYLES.business,
      vibe: PRESET_STYLES.vibe,
      lighting: PRESET_STYLES.lighting,
      camera: PRESET_STYLES.camera,
      angle: PRESET_STYLES.angle,
      format: PRESET_FORMATS
    });

    if (suggestions) {
      // Find business value from ID
      const businessVal = PRESET_STYLES.business.find(b => b.id === suggestions.businessId)?.value || '';

      setSelectedBusinessId(suggestions.businessId);
      setSelectedStyles(prev => ({
        ...prev,
        business: businessVal,
        vibe: suggestions.vibeValue,
        lighting: suggestions.lightingValue,
        camera: suggestions.cameraValue,
        angle: suggestions.angleValue,
        format: suggestions.formatId || 'post_square'
      }));

      if (suggestions.suggestedPromptAddon) {
        setPrompt(suggestions.suggestedPromptAddon);
      }
    }
  };

  const handleDeleteImage = (id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  };

  const startLoadingMessages = () => {
    let index = 0;
    setProcessingState(prev => ({ ...prev, statusMessage: LOADING_MESSAGES[0] }));
    loadingIntervalRef.current = window.setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setProcessingState(prev => ({ ...prev, statusMessage: LOADING_MESSAGES[index] }));
    }, 2500);
  };

  const stopLoadingMessages = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0 || !prompt.trim()) return;

    setProcessingState({ isLoading: true, error: null });
    startLoadingMessages();

    try {
      const imagesPayload = await Promise.all(images.map(async (img) => ({
        base64: await fileToBase64(img.file),
        mimeType: img.file.type
      })));

      let styleRefPayload = undefined;
      if (styleReference) {
        styleRefPayload = {
          base64: await fileToBase64(styleReference.file),
          mimeType: styleReference.file.type
        };
      }

      // --- ADVANCED PROMPT ENGINEERING PRO STUDIO ---
      let finalPrompt = "";
      
      if (selectedStyles.isFaceSwap) {
        // --- FACE SWAP / IDENTITY MODE ---
        finalPrompt += `ACT AS AN EXPERT PHOTO EDITOR AND RETOUCHER. `;
        finalPrompt += `TASK: FACE SWAP / IDENTITY TRANSFER. `;
        finalPrompt += `SOURCE IMAGES: The uploaded images [Image 1, Image 2, Image 3] contain the Source Identities and Target Bodies. `;
        finalPrompt += `USER INSTRUCTION: "${prompt}" `;
        finalPrompt += `\nCRITICAL EXECUTION RULES: `;
        finalPrompt += `1. Seamlessly replace the face/head as requested in the instruction. `;
        finalPrompt += `2. MATCH skin tone, lighting direction, grain, and noise of the target image perfectly. `;
        finalPrompt += `3. Preserve the expression if requested, otherwise adapt source face expression to target body context. `;
        finalPrompt += `4. Result must be PHOTOREALISTIC. No cartoonish artifacts. `;
      } else {
        // --- PRODUCT STUDIO MODE (STANDARD) ---
        finalPrompt += `Actúa como un fotógrafo de clase mundial y director de arte experto. `;
        finalPrompt += `Tu objetivo es crear una imagen comercial galardonada. `;
        
        // Reference Handling (Subject)
        if (images.length > 0) {
          const imageRefs = images.map(img => `[Imagen ${img.id}]`).join(', ');
          finalPrompt += `SUJETO PRINCIPAL: Utiliza ${imageRefs} como los productos o sujetos protagonistas. `;
          finalPrompt += `CRÍTICO: Debes mantener la identidad, logotipos, formas y detalles del sujeto principal EXACTAMENTE como en las referencias. `;
        }

        // Reference Handling (Style)
        if (styleReference) {
          finalPrompt += `\nREFERENCIA DE ESTILO: Utiliza la imagen de referencia de estilo proporcionada SOLAMENTE como guía para la iluminación, la composición, el ángulo y la atmósfera (mood). NO copies el objeto de esta imagen, solo su estética. `;
        }

        // Context & Style
        if (selectedStyles.business) finalPrompt += `\nCONTEXTO DE NEGOCIO: ${selectedStyles.business}`;
        
        // User Instruction
        finalPrompt += `\n\nESCENA DESEADA: "${prompt}"`;

        // Technical Params
        const technicalParams = [];
        if (selectedStyles.vibe) technicalParams.push(`Estilo Visual: ${selectedStyles.vibe}`);
        if (selectedStyles.lighting) technicalParams.push(`Iluminación: ${selectedStyles.lighting}`);
        if (selectedStyles.camera) technicalParams.push(`Óptica: ${selectedStyles.camera}`);
        if (selectedStyles.angle) technicalParams.push(`Ángulo: ${selectedStyles.angle}`);
        
        // FORMAT INJECTION
        if (selectedStyles.format) {
           const formatPrompt = PRESET_FORMATS.find(f => f.id === selectedStyles.format)?.prompt;
           if (formatPrompt) {
              technicalParams.push(`FORMATO Y COMPOSICIÓN: ${formatPrompt}`);
           }
        }
        
        if (technicalParams.length > 0) {
          finalPrompt += `\n\nESPECIFICACIONES TÉCNICAS:\n${technicalParams.join('\n')}`;
        }
      }
      
      // High Quality Enforcers (Shared)
      finalPrompt += `\n\nCALIDAD DE SALIDA:\n`;
      if (selectedStyles.is4K) {
         finalPrompt += `- RESOLUCIÓN EXTREMA 4K/8K.\n- Renderizado RAW sin compresión.\n- Máximo detalle de textura.`;
      } else {
         finalPrompt += `- Resolución 8K, texturas hiperrealistas.\n`;
         finalPrompt += `- Color grading cinematográfico profesional.\n`;
      }
      finalPrompt += `- Integración perfecta de luces y sombras.\n`;

      console.log("Generando con prompt:", finalPrompt);

      // Determine Ratio
      const aspectRatio = FORMAT_MAP[selectedStyles.format] || '1:1';

      let resultUrl = await editImageWithGemini(
        imagesPayload, 
        finalPrompt, 
        styleRefPayload, 
        aspectRatio, 
        selectedStyles.is4K || false
      );
      
      // Apply Watermark if Guest
      if (isGuest) {
        setProcessingState(prev => ({ ...prev, statusMessage: "Aplicando marca de agua (Modo Demo)..." }));
        resultUrl = await addWatermark(resultUrl);
      }
      
      // Success Handling
      const newCreation: GeneratedImage = {
        id: Date.now().toString(),
        imageUrl: resultUrl,
        prompt: prompt,
        timestamp: Date.now()
      };

      setHistory(prev => [newCreation, ...prev]);
      setCurrentImage(newCreation);
      setProcessingState({ isLoading: false, error: null, statusMessage: '' });

    } catch (error: any) {
      setProcessingState({ 
        isLoading: false, 
        error: error.message || "Error al generar la imagen.",
        statusMessage: ''
      });
    } finally {
      stopLoadingMessages();
    }
  };

  // --- RENDER HELPERS ---

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentTemplates = selectedBusinessId ? PROMPT_TEMPLATES[selectedBusinessId] : [];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 selection:bg-yellow-500/30 pb-20 font-sans">
      
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
      
      <GalleryModal 
        isOpen={showGallery} 
        onClose={() => setShowGallery(false)} 
        images={history} 
        onDelete={handleDeleteImage}
        onSelect={(img) => {
          setCurrentImage(img);
          setShowGallery(false);
        }}
      />

      <StyleAssistantModal
        isOpen={showStyleAssistant}
        onClose={() => setShowStyleAssistant(false)}
        onAnalyze={handleStyleAnalysis}
      />

      {/* --- HEADER --- */}
      <header className="border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isGuest && (
              <button onClick={handleLogout} className="mr-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                Nicrolabs<span className="text-yellow-400">.AI</span>
              </h1>
              <span className="text--[10px] text-slate-400 tracking-wider font-medium uppercase block -mt-0.5">Studio v2.5</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            
            <button 
              onClick={() => setShowGallery(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative"
            >
              <GridIcon className="w-5 h-5" />
              {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>}
            </button>

            {/* FREE TRIAL BADGE */}
            {!isGuest && (
              <div className="hidden md:flex flex-col items-end mr-2 border-r border-slate-700 pr-4">
                 <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                   <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                   Prueba Gratuita Activa
                 </div>
                 <span className="text-xs text-yellow-500 font-semibold tracking-wide">Quedan 7 días de regalo</span>
              </div>
            )}

            <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${isGuest ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
              <span>{isGuest ? 'Modo Demo' : 'Gemini Pro'}</span>
            </div>
            {isGuest ? (
              <button onClick={handleLogout} className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-semibold hover:bg-yellow-500 hover:text-black transition-all">
                Registrarse (Quitar Marca)
              </button>
            ) : (
               <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition-colors">
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {isGuest && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 text-center py-2 px-4 animate-in slide-in-from-top duration-500">
          <p className="text-xs font-medium text-yellow-300">
            🔒 <strong>Modo Demo:</strong> Tus imágenes tendrán marca de agua. 
            <button onClick={handleLogout} className="underline ml-1 font-bold hover:text-white">Crea una cuenta gratis</button> para resultados profesionales limpios.
          </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Onboarding Intro */}
        <div className="mb-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-bold text-white mb-1">Crea fotos de producto que vendan</h2>
             <p className="text-sm text-slate-400">
               1. Sube tu producto. 2. Elige el estilo. 3. La IA integra todo en un escenario fotorrealista.
             </p>
           </div>
           <button 
             onClick={openPinterest}
             className="flex items-center space-x-2 px-4 py-2 bg-[#E60023] hover:bg-[#ad081b] text-white rounded-full text-xs font-bold shadow-lg transition-transform hover:scale-105"
           >
             <PinterestIcon className="w-4 h-4" />
             <span>Buscar Ideas en Pinterest</span>
           </button>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: CONTROLS (7/12) --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. PRODUCT UPLOADER & MODE SELECTOR */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 {/* Mode Tabs */}
                 <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 inline-flex">
                   <button 
                     onClick={() => toggleFaceSwapMode(false)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${!selectedStyles.isFaceSwap ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <CameraIcon className="w-4 h-4" />
                     Modo Producto
                   </button>
                   <button 
                     onClick={() => toggleFaceSwapMode(true)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${selectedStyles.isFaceSwap ? 'bg-yellow-500 text-black shadow' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <FaceIcon className="w-4 h-4" />
                     Cambio de Rostro
                   </button>
                 </div>
              </div>

              {selectedStyles.isFaceSwap ? (
                 <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3">
                    <FaceIcon className="w-6 h-6 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Modo Intercambio de Rostro Activado</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Sube las fotos y usa el cuadro de texto para indicar qué cara va en qué cuerpo. 
                        Ej: <em>"Pon la cara de la Imagen 1 en el cuerpo de la persona de la Imagen 2"</em>.
                      </p>
                    </div>
                 </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-yellow-500 text-black w-5 h-5 rounded flex items-center justify-center text-xs">1</span>
                    Sube tus Productos
                  </h3>
                  <span className="text-xs text-slate-500">El protagonista (Máx 3)</span>
                </div>
              )}
              
              <ImageUploader 
                images={images}
                onImageAdd={handleImageAdd}
                onImageRemove={handleImageRemove}
              />
            </section>

             {/* 2. STYLE REFERENCE (Disabled in Face Swap Mode) */}
             {!selectedStyles.isFaceSwap && (
             <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="bg-yellow-500 text-black w-5 h-5 rounded flex items-center justify-center text-xs">2</span>
                  Referencias de Estilo (Moodboard)
                </h3>
                <span className="text-xs text-slate-500">Opcional</span>
              </div>
              
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-3">
                  ¿Tienes una foto que te inspira? Súbela aquí y la IA copiará la iluminación y el ángulo, pero usando TU producto.
                </p>
                <input 
                  type="file" 
                  ref={styleInputRef} 
                  onChange={handleStyleRefAdd} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {styleReference ? (
                  <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-slate-600 group">
                    <img src={styleReference.previewUrl} alt="Style Ref" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">Referencia Activa</span>
                    </div>
                    <button 
                      onClick={() => setStyleReference(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => styleInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-lg text-slate-400 hover:text-white transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <UploadIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">Cargar foto de inspiración (Ej: Pinterest)</span>
                  </button>
                )}
              </div>
            </section>
            )}

            {/* 3. STYLE SELECTOR */}
            <section className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-500 text-black w-5 h-5 rounded flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedStyles.isFaceSwap ? "Ajustes de Renderizado" : "Configuración del Estudio"}
                  </h3>
                </div>
                
                {!selectedStyles.isFaceSwap && (
                  <button 
                    onClick={() => setShowStyleAssistant(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] font-bold shadow-lg shadow-indigo-500/20 transition-all border border-indigo-400/30"
                  >
                    <BotIcon className="w-3 h-3" />
                    <span>Auto-Configurar con IA</span>
                  </button>
                )}
              </div>

               {/* New Format Section (Available in both modes) */}
               <div className="space-y-3 mb-6">
                <label className="text-xs font-semibold text-slate-400 ml-1 flex items-center gap-2">
                  <LayoutIcon className="w-3 h-3 text-yellow-500" />
                  Formato y Uso (Flyers & Portadas)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {PRESET_FORMATS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleStyle('format', f.id)}
                      className={`
                        p-2 rounded-lg text-center border transition-all flex flex-col items-center justify-center gap-1
                        ${selectedStyles.format === f.id
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }
                      `}
                    >
                      <span className="text-[10px] font-bold uppercase">{f.label}</span>
                      <span className="text-[9px] opacity-60 leading-none">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-px bg-slate-800 w-full mb-6"></div>

              {/* HIDE BUSINESS, VIBE, LIGHTING IN FACE SWAP MODE */}
              {!selectedStyles.isFaceSwap && (
                <>
                {/* Business Type Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 ml-1">Contexto del Negocio</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRESET_STYLES.business.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => selectBusiness(s.id, s.value)}
                        className={`
                          relative group p-4 rounded-xl text-left border transition-all duration-200
                          ${selectedBusinessId === s.id
                            ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'
                          }
                        `}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-slate-100">{s.label}</span>
                          {selectedBusinessId === s.id && <span className="text-yellow-400 text-xs">●</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight group-hover:text-slate-300 transition-colors">
                          {s.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-800 w-full my-4"></div>

                {/* Vibe & Lighting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vibe */}
                  <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-400 ml-1">Atmósfera Visual</label>
                      <div className="flex flex-col gap-2">
                        {PRESET_STYLES.vibe.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => toggleStyle('vibe', s.value)}
                            className={`
                              px-3 py-2 rounded-lg text-xs text-left border transition-all flex justify-between items-center
                              ${selectedStyles.vibe === s.value 
                                ? 'bg-purple-500/20 border-purple-500 text-purple-100' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                              }
                            `}
                          >
                            <span className="font-medium">{s.label}</span>
                          </button>
                        ))}
                      </div>
                  </div>

                  {/* Lighting */}
                  <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-400 ml-1">Iluminación de Estudio</label>
                      <div className="flex flex-col gap-2">
                        {PRESET_STYLES.lighting.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => toggleStyle('lighting', s.value)}
                            className={`
                              px-3 py-2 rounded-lg text-xs text-left border transition-all flex justify-between items-center
                              ${selectedStyles.lighting === s.value 
                                ? 'bg-orange-500/20 border-orange-500 text-orange-100' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                              }
                            `}
                          >
                            <span className="font-medium">{s.label}</span>
                            <span className="text-[10px] opacity-60 ml-2 hidden sm:inline-block truncate max-w-[100px]">{s.desc}</span>
                          </button>
                        ))}
                      </div>
                  </div>
                </div>
                </>
              )}

              {/* Advanced Technical */}
               <div className="pt-4 border-t border-slate-800 mt-4">
                  <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-500 ml-1">
                        {selectedStyles.isFaceSwap ? "Calidad de Fusión" : "Cámara y Ajustes Avanzados"}
                      </label>
                      <button 
                        onClick={() => toggleStyle('is4K', !selectedStyles.is4K)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedStyles.is4K ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                      >
                         <HdIcon className="w-3 h-3" />
                         <span>{selectedStyles.is4K ? '4K Ultra ON' : '4K OFF'}</span>
                      </button>
                  </div>
                  
                  {/* Hide camera/angle presets in Face Swap as they are less relevant or might confuse the prompt */}
                  {!selectedStyles.isFaceSwap && (
                    <div className="flex flex-wrap gap-2">
                      {[...PRESET_STYLES.camera, ...PRESET_STYLES.angle].map((s) => {
                        const isCamera = PRESET_STYLES.camera.some(c => c.label === s.label);
                        const type = isCamera ? 'camera' : 'angle';
                        const isSelected = selectedStyles[type] === s.value;
                        
                        return (
                          <button
                            key={s.label}
                            onClick={() => toggleStyle(type, s.value)}
                            className={`
                              px-3 py-1.5 rounded text-[11px] font-medium border transition-all
                              ${isSelected
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                              }
                            `}
                          >
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
               </div>

            </section>

            {/* 4. PROMPT & GENERATE */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-black w-5 h-5 rounded flex items-center justify-center text-xs font-bold">4</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {selectedStyles.isFaceSwap ? "Instrucción de Intercambio" : "Prompt Mágico"}
                </h3>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                
                {/* Smart Templates (Product Mode Only) */}
                {!selectedStyles.isFaceSwap && selectedBusinessId && currentTemplates && (
                  <div className="mb-4">
                    <p className="text-[11px] uppercase font-bold text-yellow-500/80 mb-2 flex items-center">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      Ideas rápidas para {PRESET_STYLES.business.find(b => b.id === selectedBusinessId)?.label.split(' ')[1]}:
                    </p>
                    <div className="flex flex-col gap-2">
                      {currentTemplates.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => applyTemplate(template)}
                          className="text-left text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 p-2.5 rounded-lg transition-colors group"
                        >
                          <span className="opacity-50 group-hover:opacity-100 mr-2 transition-opacity">✨</span>
                          "{template}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      selectedStyles.isFaceSwap 
                        ? "Ej: 'Toma la cara de la Imagen 1 y ponla en la persona de la Imagen 2. Mantén el peinado original de la Imagen 2.'"
                        : "Ej: 'Mi producto está sobre una mesa de mármol blanco, con luz de atardecer entrando por la ventana y un florero desenfocado atrás'..."
                    }
                    className="w-full h-28 bg-black/30 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono">
                    NICROLABS PRO
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={handleGenerate}
                    disabled={images.length === 0 || !prompt || processingState.isLoading}
                    className={`
                      w-full py-4 rounded-xl font-bold text-base shadow-xl flex items-center justify-center space-x-2 transition-all duration-300
                      ${(images.length === 0 || !prompt || processingState.isLoading)
                        ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-slate-900 hover:shadow-orange-500/30 hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {processingState.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                        <span>{processingState.statusMessage || 'Renderizando...'}</span>
                      </>
                    ) : (
                      <>
                        {selectedStyles.isFaceSwap ? <RefreshIcon className="w-5 h-5" /> : <WandIcon className="w-5 h-5" />}
                        <span>
                           {selectedStyles.isFaceSwap ? "Intercambiar Rostro" : "Generar Fotografía Pro"}
                        </span>
                      </>
                    )}
                  </button>
                  {processingState.error && (
                    <div className="mt-3 text-xs text-red-400 text-center bg-red-900/10 p-2 rounded border border-red-900/30">
                      ⚠️ {processingState.error}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: RESULT (5/12) --- */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden sticky top-24 min-h-[500px] flex flex-col shadow-2xl ring-1 ring-white/5">
              <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center backdrop-blur-sm">
                 <h3 className="font-bold text-white flex items-center space-x-2 text-sm">
                  <span className="bg-yellow-500 text-black w-5 h-5 rounded flex items-center justify-center text-xs">5</span>
                  <span>Resultado Final</span>
                </h3>
                {currentImage && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] font-mono">RENDER 8K</span>
                )}
              </div>

              <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#050912] flex items-center justify-center relative p-4 group min-h-[400px]">
                {currentImage ? (
                  <div className="w-full flex flex-col transition-all duration-500 animate-in fade-in zoom-in-95">
                    <ResultDisplay imageUrl={currentImage.imageUrl} />
                  </div>
                ) : (
                  <div className="text-center p-8 opacity-30 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <SparklesIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Lienzo vacío</p>
                    <p className="text-xs text-slate-600 mt-2 max-w-[200px]">Sube tus fotos y configura el estudio.</p>
                  </div>
                )}
              </div>

              {/* Session History Strip */}
              {history.length > 0 && (
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tus Tomas Recientes</p>
                    <span className="text-[10px] text-slate-600">{history.length}</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentImage(item)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all snap-start ${
                          currentImage?.id === item.id 
                          ? 'border-yellow-500 ring-2 ring-yellow-500/20 scale-105 z-10' 
                          : 'border-slate-700 hover:border-slate-500 grayscale hover:grayscale-0 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="History" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pro Tips with Rotation */}
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                <h4 className="text-yellow-500 font-bold text-xs uppercase mb-2 flex items-center">
                    <SparklesIcon className="w-3 h-3 mr-1" />
                    Consejos de Experto
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span><strong>Tip #1:</strong> Sube una imagen de referencia de estilo (paso 2) para copiar la luz exacta de una foto que te guste de internet.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span><strong>Tip #2:</strong> Las fotos de producto funcionan mejor si el fondo original es simple.</span>
                    </li>
                    {selectedStyles.isFaceSwap && (
                       <li className="flex items-start gap-2">
                          <span className="text-yellow-500">⚠</span>
                          <span><strong>Face Swap:</strong> Para mejores resultados, usa fotos donde ambas caras miren en una dirección similar (frente/frente).</span>
                      </li>
                    )}
                </ul>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
