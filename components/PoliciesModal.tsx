
import React from 'react';
import { ShieldIcon, XIcon } from './Icons';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | null;
}

const PoliciesModal: React.FC<PoliciesModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
               <ShieldIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {type === 'privacy' ? 'Política de Privacidad' : 'Términos y Condiciones'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto text-sm text-slate-300 space-y-6 leading-relaxed custom-scrollbar">
          
          {type === 'privacy' ? (
            <>
              <section>
                <h4 className="text-white font-bold mb-2">1. Recopilación de Información</h4>
                <p>En Nicrolabs.AI, recopilamos la información mínima necesaria para operar. Esto incluye tu dirección de correo electrónico para la gestión de cuentas y las imágenes que subes ("Contenido de Usuario") para procesarlas mediante nuestros algoritmos de Inteligencia Artificial.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">2. Uso de las Imágenes</h4>
                <p>Las imágenes que subes se utilizan exclusivamente para generar las versiones procesadas que solicitas. <strong>No vendemos ni compartimos tus fotos con terceros para fines publicitarios.</strong> Las imágenes pueden ser procesadas temporalmente en servidores seguros (Google Cloud Platform) para ejecutar los modelos de IA.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">3. Seguridad de Datos</h4>
                <p>Implementamos cifrado SSL/TLS estándar de la industria para proteger tus datos en tránsito. Sin embargo, recuerda que ningún sistema en internet es 100% invulnerable.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">4. Cookies</h4>
                <p>Utilizamos cookies esenciales para mantener tu sesión iniciada y preferencias de configuración. No utilizamos cookies de rastreo invasivas.</p>
              </section>
            </>
          ) : (
             <>
              <section>
                <h4 className="text-white font-bold mb-2">1. Aceptación de los Términos</h4>
                <p>Al registrarte y usar Nicrolabs.AI, aceptas estos términos. Si no estás de acuerdo, no debes usar el servicio.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">2. Prueba Gratuita de 7 Días</h4>
                <p>Ofrecemos un periodo de prueba de 7 días con acceso completo. Al finalizar este periodo, tu cuenta puede requerir una suscripción para continuar generando imágenes sin marca de agua. Puedes cancelar en cualquier momento sin penalización.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">3. Propiedad Intelectual</h4>
                <p><strong>Tú eres el dueño de las imágenes que generas.</strong> Nicrolabs.AI te cede todos los derechos comerciales sobre las imágenes resultantes para que las uses en tu negocio, publicidad o redes sociales.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">4. Uso Aceptable</h4>
                <p>Está prohibido usar el servicio para generar contenido ilegal, ofensivo, pornográfico o que infrinja derechos de terceros. Nos reservamos el derecho de suspender cuentas que violen esta política.</p>
              </section>
              <section>
                <h4 className="text-white font-bold mb-2">5. Limitación de Responsabilidad</h4>
                <p>El servicio se ofrece "tal cual". Nicrolabs.AI no garantiza que los resultados de la IA sean siempre perfectos o libres de errores visuales.</p>
              </section>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};

export default PoliciesModal;
