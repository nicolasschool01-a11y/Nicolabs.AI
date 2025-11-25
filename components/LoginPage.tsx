import React, { useState } from 'react';
import { LogoIcon, GoogleIcon, AppleIcon } from './Icons';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for frontend demo
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B1120] text-slate-200">
      
      {/* Left Column: Form */}
      <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col justify-center p-8 sm:p-12 md:p-16 relative z-10">
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-2 rounded-lg shadow-lg">
              <LogoIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Nicolabs<span className="text-yellow-400">.AI</span>
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            {isRegistering ? "Crea tu cuenta" : "Bienvenido de nuevo"}
          </h1>
          <p className="text-slate-400">
            {isRegistering 
              ? "Comienza a transformar tus fotos hoy mismo." 
              : "Ingresa tus datos para acceder al estudio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1">Email Profesional</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
              placeholder="nombre@empresa.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-[0.99] mt-2"
          >
            {isRegistering ? "Registrarse Gratis" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0B1120] px-4 text-slate-500 font-medium">O continúa con</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={onLogin} className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all">
            <GoogleIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Google</span>
          </button>
          <button onClick={onLogin} className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all">
            <AppleIcon className="w-5 h-5 mb-0.5" />
            <span className="font-medium text-sm">Apple</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            {isRegistering ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-yellow-400 font-semibold ml-2 hover:underline"
            >
              {isRegistering ? "Inicia Sesión" : "Regístrate"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="hidden lg:block w-7/12 xl:w-2/3 bg-slate-900 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-60">
           <div className="space-y-4 pt-12">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" 
                alt="Food" 
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" 
                alt="Product" 
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
           </div>
           <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80" 
                alt="Beauty" 
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Interior" 
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
           </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-transparent to-transparent"></div>

        {/* Floating Content */}
        <div className="absolute bottom-16 left-16 max-w-lg z-20">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">Tecnología Gemini 2.5 Flash</span>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-4">
            Fotografía de estudio profesional al alcance de un clic.
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Elimina las costosas sesiones de fotos. Nicolabs.AI utiliza inteligencia artificial avanzada para situar tus productos en escenarios fotorrealistas de alto impacto. Ideal para gastronomía, e-commerce y moda.
          </p>
          
          <div className="mt-8 flex items-center space-x-4 text-sm text-slate-400 font-medium">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0B1120]"></div>
                <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#0B1120]"></div>
                <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-[#0B1120]"></div>
             </div>
             <span>Únete a más de 2,000 negocios locales</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;