import React from 'react';
import { X, MapPin, Clock, Phone, Mail, Navigation, Store, PackageCheck } from 'lucide-react';

export const LocationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C251C] text-stone-100 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#2D3B2D] shadow-2xl relative flex flex-col">
        
        {/* Header Hero */}
        <div className="relative p-8 md:p-10 bg-gradient-to-br from-[#1E5128] via-[#143B1D] to-[#0D2613] rounded-t-3xl border-b border-[#2D3B2D] overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#C85A2A] text-white shadow-lg shadow-[#C85A2A]/30 mb-3">
            <Store className="w-3.5 h-3.5" />
            Tiendas Físicas & Puntos de Recolección
          </span>

          <h2 className="text-3xl md:text-4xl font-bold font-serif-remoda text-white tracking-tight leading-tight">
            Nuestra Ubicación
          </h2>
          <p className="mt-2 text-stone-300 text-sm md:text-base max-w-xl leading-relaxed">
            Visítanos en nuestras sucursales para conocer las prendas exclusivas, entregar ropa para donación o recoger tu pedido personalizado.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Main Store Location Card */}
          <div className="bg-[#243024] p-6 rounded-2xl border border-[#2F3F2F] space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 mb-2">
                  SUCURSAL PRINCIPAL & ECO-HUB
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C85A2A]" />
                  ReModa Flagship Store - Equipetrol
                </h3>
              </div>
              
              <a
                href="https://maps.google.com/?q=-17.7765,-63.1950"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                <Navigation className="w-3.5 h-3.5" />
                Abrir en Google Maps
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-300 pt-2 border-t border-[#2D3B2D]">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Av. San Martín #450, entre 3er y 4to Anillo, Equipetrol. Santa Cruz de la Sierra, Bolivia.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+591 3 345 6789 / WhatsApp: +591 7 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>contacto@remoda.bo</span>
                </div>
              </div>

              <div className="space-y-2 bg-[#1A231A] p-4 rounded-xl border border-[#273627]">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Clock className="w-4 h-4 text-amber-400" /> Horarios de Atención:
                </div>
                <ul className="space-y-1 text-stone-300 text-[11px]">
                  <li className="flex justify-between"><span>Lunes a Viernes:</span> <span className="font-semibold text-white">09:00 - 20:00</span></li>
                  <li className="flex justify-between"><span>Sábados:</span> <span className="font-semibold text-white">10:00 - 18:00</span></li>
                  <li className="flex justify-between"><span>Domingos:</span> <span className="text-amber-400 font-semibold">Cerrado (Solo pedidos online)</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Drop-off points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[#243024] p-5 rounded-2xl border border-[#2F3F2F]">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                Punto de Acopio - Centro Histórico
              </div>
              <p className="text-xs text-stone-300 leading-relaxed mb-3">
                Calle René Moreno #120, a media cuadra de la Plaza 24 de Septiembre.
              </p>
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" /> Lun - Vie: 10:00 a 18:00
              </div>
            </div>

            <div className="bg-[#243024] p-5 rounded-2xl border border-[#2F3F2F]">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                <PackageCheck className="w-4 h-4 text-[#C85A2A]" />
                Taller Upcycling - Zona Sur
              </div>
              <p className="text-xs text-stone-300 leading-relaxed mb-3">
                Av. Bush #890, entre 1er y 2do Anillo (Taller de confección y entregas).
              </p>
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" /> Lun - Sáb: 08:30 a 16:30
              </div>
            </div>

          </div>

          {/* Visual Map graphic representation */}
          <div className="relative h-44 rounded-2xl overflow-hidden border border-[#2D3B2D] bg-[#141C14] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1E5128_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative text-center p-4">
              <MapPin className="w-10 h-10 text-[#C85A2A] mx-auto animate-bounce mb-2" />
              <div className="text-sm font-bold text-white">Santa Cruz de la Sierra, Bolivia</div>
              <div className="text-xs text-stone-400 mt-0.5">Envíos a todo el país vía transporte expreso</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-[#161D16] rounded-b-3xl border-t border-[#2D3B2D] flex items-center justify-between">
          <span className="text-xs text-stone-400">¿Tienes dudas sobre cómo llegar? Contáctanos al +591 71234567</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
