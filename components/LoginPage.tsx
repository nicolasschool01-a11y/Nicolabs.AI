
import React, { useState } from 'react';
import { LogoIcon, GoogleIcon, AppleIcon, SparklesIcon, CameraIcon, ChevronRightIcon, ChevronDownIcon, UploadIcon, WandIcon, ImageIcon, CheckCircleIcon } from './Icons';
import PoliciesModal from './PoliciesModal';

interface LoginPageProps {
  onLogin: (isGuest?: boolean) => void;
}

const FAQS = [
  {
    question: "¿Cómo funcionan los 7 días gratis?",
    answer: "Te registras hoy y obtienes acceso total a todas las funciones PRO (Cámaras 8K, Estilos Premium, Sin Marca de Agua). Si no te convence, puedes cancelar en cualquier momento antes de los 7 días y no se te cobrará nada."
  },
  {
    question: "Tengo una ferretería o farmacia con productos 'aburridos', ¿me sirve?",
    answer: "¡Es donde más brillamos! Nicrolabs convierte un simple tornillo, una caja de remedios o un repuesto industrial en una imagen de catálogo premium. Elevamos el valor percibido de cualquier objeto físico al instante."
  },
  {
    question: "¿Necesito cámara profesional o saber de iluminación?",
    answer: "Absolutamente no. La IA actúa como tu Director de Arte, Iluminador y Fotógrafo. Tú solo tomas la foto con tu celular (incluso con mala luz) y Nicrolabs reconstruye la escena con iluminación de estudio perfecta."
  },
  {
    question: "¿Las fotos se ven reales o parecen 'generadas por robot'?",
    answer: "Usamos el motor Gemini 2.5 calibrado ópticamente. Mantenemos la textura real de tu producto (etiquetas, materiales, logos) mientras generamos un entorno fotorrealista. Tus clientes no notarán la diferencia con una foto real."
  },
  {
    question: "¿Puedo usar las imágenes para publicidad (Ads)?",
    answer: "Totalmente. Las imágenes generadas son libres de derechos de autor y tuyas para usar en Facebook Ads, Instagram, Catálogos impresos o tu tienda Shopify/MercadoLibre en alta resolución."
  }
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Policies Modal State
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openPolicy = (type: 'privacy' | 'terms') => {
    setPolicyType(type);
    setShowPolicyModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans overflow-x-hidden flex flex-col">
      
      <PoliciesModal 
        isOpen={showPolicyModal} 
        onClose={() => setShowPolicyModal(false)} 
        type={policyType} 
      />

      <div className="flex-grow">
      {/* --- MAIN HERO SECTION --- */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* --- MOBILE HERO (Visible only on Mobile) --- */}
        <div className="lg:hidden relative h-[50vh] w-full overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 opacity-90">
              <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Ferretería/Herramientas" />
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Cosmética/Farmacia" />
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Ecommerce" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Moda" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 pb-8 z-10">
            <div className="inline-flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-3 py-1 mb-3">
                <SparklesIcon className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-wider">Prueba 7 días Gratis</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
              Fotos que venden solas. <br/>Sin estudio.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              La solución ideal para pequeños negocios y personas que quieren elevar su presencia en redes con produccion de fotografias de estudio con una interfaz sencilla y rapida y amigable.
            </p>
          </div>
        </div>

        {/* --- LEFT COLUMN: FORM (All Screens) --- */}
        <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col justify-center px-8 py-12 sm:px-12 md:px-16 relative z-10 bg-[#0B1120] lg:bg-transparent -mt-6 lg:mt-0 rounded-t-3xl lg:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.5)] lg:shadow-none">
          
          <div className="mb-6 lg:mb-8 flex flex-col items-center lg:items-start">
            <div className="flex items-center space-x-2 mb-4 lg:mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-2 rounded-lg shadow-lg">
                <LogoIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Nicrolabs<span className="text-yellow-400">.AI</span>
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 text-center lg:text-left">
              {isRegistering ? "Empieza tu Prueba Gratis" : "Bienvenido de nuevo"}
            </h2>
            <p className="text-slate-400 text-sm text-center lg:text-left leading-relaxed">
              {isRegistering 
                ? "Disfruta de 7 días de acceso completo. Sin cargos hasta que termine la prueba." 
                : "Tu estudio virtual está listo. Continúa creando."}
            </p>
          </div>

          {/* TRIAL BANNER */}
          {isRegistering && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
               <div className="bg-yellow-500/20 p-2 rounded-full">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
               </div>
               <div>
                 <h4 className="text-yellow-400 text-sm font-bold mb-1">Oferta Especial Activada</h4>
                 <p className="text-slate-300 text-xs leading-snug">
                   Obtén <strong className="text-white">7 Días de Acceso Premium</strong> totalmente gratis. Cancela cuando quieras.
                 </p>
               </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1">Email Profesional</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600 text-sm"
                placeholder="nombre@empresa.com"
                required={!isRegistering} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600 text-sm"
                placeholder="••••••••"
                required={!isRegistering}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-[0.99] mt-2 text-sm uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {isRegistering ? "Comenzar mis 7 Días Gratis" : "Acceder al Estudio"}
            </button>
          </form>

          {isRegistering && (
             <div className="mt-4 flex items-center justify-center space-x-4 text-[10px] text-slate-500">
               <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3 text-green-500" /> Sin cobros hoy</span>
               <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3 text-green-500" /> Cancela cuando quieras</span>
             </div>
          )}

          <div className="mt-6">
            <button 
              type="button" 
              onClick={() => onLogin(true)} 
              className="w-full bg-slate-800/30 hover:bg-slate-800 text-slate-300 font-medium py-3 rounded-xl border border-dashed border-slate-600 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2 group text-sm"
            >
              <span className="text-yellow-500 group-hover:scale-110 transition-transform">⚡</span>
              <span className="group-hover:text-white transition-colors">Prueba Rápida (Invitado)</span>
            </button>
            <p className="text-center text-[10px] text-slate-600 mt-2">Acceso limitado con marca de agua.</p>
          </div>

          <div className="relative my-6 lg:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0B1120] px-4 text-slate-500 font-medium">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button onClick={() => onLogin(false)} className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all">
              <GoogleIcon className="w-4 h-4" />
              <span className="font-medium text-xs lg:text-sm">Google</span>
            </button>
            <button onClick={() => onLogin(false)} className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all">
              <AppleIcon className="w-4 h-4 mb-0.5" />
              <span className="font-medium text-xs lg:text-sm">Apple</span>
            </button>
          </div>

          <div className="mt-6 lg:mt-8 text-center">
            <p className="text-slate-400 text-sm">
              {isRegistering ? "¿Ya tienes cuenta?" : "¿Nuevo en Nicrolabs?"}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-yellow-400 font-semibold ml-2 hover:underline"
              >
                {isRegistering ? "Inicia Sesión" : "Obtén 7 días Gratis"}
              </button>
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: VALUE PROP (Desktop Only) --- */}
        <div className="hidden lg:block w-7/12 xl:w-2/3 bg-slate-900 relative overflow-hidden group">
          {/* Background Grid - OPTIMIZED FOR CLARITY */}
          <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-90 transition-all duration-1000">
            <div className="space-y-4 pt-12 animate-[slideUp_45s_linear_infinite]">
                <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1200&q=95" className="w-full h-80 object-cover rounded-2xl shadow-2xl brightness-110" alt="Ferretería Pro" />
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=95" className="w-full h-72 object-cover rounded-2xl shadow-2xl brightness-110" alt="Shoes Pro" />
                <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=95" className="w-full h-72 object-cover rounded-2xl shadow-2xl brightness-110" alt="Tech Pro" />
                <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&w=1200&q=95" className="w-full h-72 object-cover rounded-2xl shadow-2xl brightness-110" alt="Drinks Pro" />
            </div>
            <div className="space-y-4 animate-[slideDown_45s_linear_infinite]">
                <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=95" className="w-full h-72 object-cover rounded-2xl shadow-2xl brightness-110" alt="Cosmetic Pro" />
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=95" className="w-full h-96 object-cover rounded-2xl shadow-2xl brightness-110" alt="Food Pro" />
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=95" className="w-full h-72 object-cover rounded-2xl shadow-2xl brightness-110" alt="Furniture Pro" />
                 <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=95" className="w-full h-72 object-cover rounded-2xl shadow-2xl brightness-110" alt="Watches Pro" />
            </div>
          </div>

          {/* Gradients - Adjusted for visibility + readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/60 to-transparent"></div>

          {/* Persuasive Copy */}
          <div className="absolute bottom-20 left-16 max-w-2xl z-20">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6 shadow-xl">
              <CameraIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">Prueba Gratis x 7 Días</span>
            </div>
            
            <h2 className="text-6xl font-extrabold text-white leading-[1.05] mb-6 drop-shadow-2xl">
              Transforma fotos de celular en <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">imanes de ventas.</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-xl text-slate-100 font-normal leading-relaxed drop-shadow-md">
                ¿Tienes una <strong className="text-white border-b-2 border-yellow-500/50">Ferretería</strong>, una <strong className="text-white border-b-2 border-yellow-500/50">Farmacia</strong> o vendes <strong className="text-white border-b-2 border-yellow-500/50">Comida</strong>?
                Deja de subir fotos oscuras que ignoran tus clientes.
              </p>
              <p className="text-lg text-slate-200 font-light leading-relaxed drop-shadow-md">
                Nicrolabs.AI analiza tu producto y lo transporta digitalmente a un estudio de $10,000 USD. <br/>
                <span className="text-yellow-400 font-medium">Resultado inmediato. Costo casi cero.</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-8 bg-[#0B1120]/80 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 inline-flex">
              <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">10x</span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wide">Más ventas</span>
              </div>
              <div className="w-px h-10 bg-slate-600"></div>
              <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">100%</span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wide">IA Automatizada</span>
              </div>
              <div className="w-px h-10 bg-slate-600"></div>
              <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">Top 1%</span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wide">Calidad Visual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS & POSSIBILITIES --- */}
      <section className="py-20 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-bold uppercase tracking-wider text-xs mb-2 block">El Proceso Mágico</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tu estudio profesional en 3 pasos</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Step 1 */}
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-yellow-500/30 transition-all text-center group">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all">
                <UploadIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Sube tu Foto</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Toma una foto con tu celular. No importa si el fondo es tu mesa de cocina o el piso del local. La IA extraerá el producto.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-yellow-500/30 transition-all text-center group">
               <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all">
                <ImageIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Elige el Estilo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Selecciona tu rubro (Gastronomía, Ferretería, Moda, etc.) y la atmósfera deseada. ¿Quieres lujo minimalista o industrial rústico?
              </p>
            </div>

             {/* Step 3 */}
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-yellow-500/30 transition-all text-center group">
               <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all">
                <WandIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Genera Magia</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                En segundos, nuestro motor Gemini 2.5 analiza la luz y geometría para integrar tu producto en un escenario 8K fotorrealista.
              </p>
            </div>
          </div>

          {/* Professional Reach Block */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                   <h3 className="text-2xl font-bold text-white mb-4">Alcance Profesional Ilimitado</h3>
                   <p className="text-slate-300 mb-6 leading-relaxed">
                     Nicrolabs democratiza la fotografía de alto nivel. Ya no necesitas alquilar estudios, comprar luces softbox ni aprender Photoshop complejo.
                   </p>
                   <ul className="space-y-3">
                     <li className="flex items-start gap-3">
                       <div className="bg-green-500/20 p-1 rounded text-green-400"><ChevronRightIcon className="w-4 h-4" /></div>
                       <span className="text-sm text-slate-300"><strong>E-commerce:</strong> Sube tus ventas en MercadoLibre y Shopify con fotos limpias.</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="bg-green-500/20 p-1 rounded text-green-400"><ChevronRightIcon className="w-4 h-4" /></div>
                       <span className="text-sm text-slate-300"><strong>Redes Sociales:</strong> Crea contenido viral para Instagram y TikTok sin salir de casa.</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <div className="bg-green-500/20 p-1 rounded text-green-400"><ChevronRightIcon className="w-4 h-4" /></div>
                       <span className="text-sm text-slate-300"><strong>Catálogos Impresos:</strong> Resolución 8K apta para impresión física de alta calidad.</span>
                     </li>
                   </ul>
                </div>
                <div className="bg-black/40 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
                   <p className="italic text-slate-400 text-center text-sm mb-4">"Antes gastaba $500 dólares por sesión de fotos para mis zapatos. Ahora hago 50 fotos por semana con Nicrolabs por una fracción del costo y mejor calidad."</p>
                   <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
                      </div>
                      <div className="text-left">
                        <div className="text-white text-xs font-bold">Carlos M.</div>
                        <div className="text-slate-500 text-[10px]">Dueño de Zapatería Urbana</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 px-6 lg:px-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-bold uppercase tracking-wider text-xs mb-2 block">Dudas Comunes</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Es Nicrolabs para mi negocio?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Diseñado específicamente para dueños de negocios que necesitan resultados profesionales sin complicaciones técnicas.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-600"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-white text-lg pr-4">{faq.question}</span>
                  <div className={`p-2 rounded-full bg-slate-700 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 bg-yellow-500 text-black' : 'text-slate-400'}`}>
                    <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-slate-400 leading-relaxed border-t border-slate-700/50 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1 transition-all"
            >
              <span>Comenzar mi Prueba Gratis</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>
      </div>

      {/* --- FOOTER & POLICIES --- */}
      <footer className="bg-[#0B1120] border-t border-slate-800 py-8 px-6 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-4">
          <button 
            onClick={() => openPolicy('privacy')}
            className="text-slate-500 text-xs hover:text-white transition-colors"
          >
            Política de Privacidad
          </button>
          <span className="text-slate-700 hidden md:block">•</span>
          <button 
             onClick={() => openPolicy('terms')}
             className="text-slate-500 text-xs hover:text-white transition-colors"
          >
            Términos y Condiciones
          </button>
        </div>
        <p className="text-[10px] text-slate-600">
          &copy; {new Date().getFullYear()} Nicrolabs.AI - Todos los derechos reservados.
        </p>
      </footer>

    </div>
  );
};

export default LoginPage;
