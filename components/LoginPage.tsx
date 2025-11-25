
import React, { useState } from 'react';
import { LogoIcon, GoogleIcon, AppleIcon, SparklesIcon, CameraIcon } from './Icons';

interface LoginPageProps {
  onLogin: (isGuest?: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B1120] text-slate-200 font-sans">
      
      {/* --- MOBILE HERO (Visible only on Mobile) --- */}
      <div className="lg:hidden relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 opacity-60">
            <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Ferretería/Herramientas" />
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Cosmética/Farmacia" />
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Ecommerce" />
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Moda" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 pb-8 z-10">
           <div className="inline-flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-3 py-1 mb-3">
              <SparklesIcon className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-wider">IA Profesional 2.5</span>
           </div>
           <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
             Fotos que venden solas. <br/>Sin estudio.
           </h1>
           <p className="text-sm text-slate-300 leading-relaxed">
             La herramienta secreta de ferreterías, farmacias y e-commerces para facturar más.
           </p>
        </div>
      </div>

      {/* --- LEFT COLUMN: FORM (All Screens) --- */}
      <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col justify-center px-8 py-8 sm:px-12 md:px-16 relative z-10 bg-[#0B1120] lg:bg-transparent -mt-6 lg:mt-0 rounded-t-3xl lg:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.5)] lg:shadow-none">
        
        <div className="mb-8 lg:mb-10 flex flex-col items-center lg:items-start">
          <div className="flex items-center space-x-2 mb-4 lg:mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-2 rounded-lg shadow-lg">
              <LogoIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Nicrolabs<span className="text-yellow-400">.AI</span>
            </span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 text-center lg:text-left">
            {isRegistering ? "Crea fotos de clase mundial" : "Bienvenido de nuevo"}
          </h2>
          <p className="text-slate-400 text-sm text-center lg:text-left leading-relaxed">
            {isRegistering 
              ? "Únete a miles de negocios que ahorran tiempo y dinero en fotografía." 
              : "Tu estudio virtual está listo. Continúa creando."}
          </p>
        </div>

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
            {isRegistering ? "Empezar Gratis Ahora" : "Acceder al Estudio"}
          </button>
        </form>

        <div className="mt-4">
          <button 
            type="button" 
            onClick={() => onLogin(true)} 
            className="w-full bg-slate-800/30 hover:bg-slate-800 text-slate-300 font-medium py-3 rounded-xl border border-dashed border-slate-600 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2 group text-sm"
          >
            <span className="text-yellow-500 group-hover:scale-110 transition-transform">⚡</span>
            <span className="group-hover:text-white transition-colors">Prueba Rápida (Invitado)</span>
          </button>
          <p className="text-center text-[10px] text-slate-600 mt-2">Acceso instantáneo. Resultados con marca de agua.</p>
        </div>

        <div className="relative my-6 lg:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0B1120] px-4 text-slate-500 font-medium">O ingresa con</span>
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
              {isRegistering ? "Inicia Sesión" : "Crea tu cuenta gratis"}
            </button>
          </p>
        </div>
      </div>

      {/* --- RIGHT COLUMN: VALUE PROP (Desktop Only) --- */}
      <div className="hidden lg:block w-7/12 xl:w-2/3 bg-slate-900 relative overflow-hidden group">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
           <div className="space-y-4 pt-12 animate-[slideUp_25s_linear_infinite]">
              <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80" className="w-full h-72 object-cover rounded-2xl shadow-2xl" alt="Ferretería" />
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" className="w-full h-64 object-cover rounded-2xl shadow-2xl" alt="Shoes" />
              <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80" className="w-full h-64 object-cover rounded-2xl shadow-2xl" alt="Tech" />
           </div>
           <div className="space-y-4 animate-[slideDown_25s_linear_infinite]">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" className="w-full h-64 object-cover rounded-2xl shadow-2xl" alt="Cosmetic" />
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" className="w-full h-80 object-cover rounded-2xl shadow-2xl" alt="Food" />
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" className="w-full h-64 object-cover rounded-2xl shadow-2xl" alt="Furniture" />
           </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-[#0B1120]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/40 to-transparent"></div>

        {/* Persuasive Copy - Alex Hormozi Style */}
        <div className="absolute bottom-16 left-16 max-w-2xl z-20">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6">
            <CameraIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">Sin fotógrafos • Sin esperas</span>
          </div>
          
          <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
            Transforma fotos de celular en <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">imanes de ventas.</span>
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-slate-300 font-light leading-relaxed">
              ¿Tienes una <strong className="text-white">Ferretería</strong>, una <strong className="text-white">Farmacia</strong> o vendes <strong className="text-white">Comida</strong>?
              Deja de subir fotos oscuras y aburridas que ignoran tus clientes.
            </p>
            <p className="text-lg text-slate-300 font-light leading-relaxed">
              Nicrolabs.AI analiza tu producto y lo transporta digitalmente a un estudio de $10,000 USD. <br/>
              <span className="text-yellow-400 font-medium">Resultado inmediato. Costo casi cero.</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">10x</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wide">Más rápido</span>
             </div>
             <div className="w-px h-10 bg-slate-700"></div>
             <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">100%</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wide">IA Automatizada</span>
             </div>
             <div className="w-px h-10 bg-slate-700"></div>
             <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">Top 1%</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wide">Calidad Visual</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
