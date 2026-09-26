import React from 'react';
import { HelpCircle, Heart, Recycle, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = ({ setCurrentTab, onOpenCollectionModal, onOpenCustomModal }) => {
  return (
    <footer className="bg-[#181816] text-[#A6A6A6] pt-16 pb-12 border-t border-[#2C2C2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif-remoda tracking-tight text-white">
                Re<span className="text-[#C85A2A]">Moda</span>
              </span>
            </div>
            <p className="text-sm max-w-sm text-[#A6A6A6] leading-relaxed">
              Moda circular con propósito. Transformamos lo usado en algo nuevo y único, reduciendo la huella textil en Bolivia.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#7A7A77]">
              <span>© {new Date().getFullYear()} ReModa Inc.</span>
              <span>·</span>
              <span>Santa Cruz, Bolivia</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Navegar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('catalogo')} className="hover:text-white transition-colors cursor-pointer">
                  Catálogo
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('quienes-somos')} className="hover:text-white transition-colors cursor-pointer">
                  Quiénes Somos
                </button>
              </li>
              <li>
                <button onClick={onOpenCustomModal} className="hover:text-white transition-colors cursor-pointer">
                  Personalización
                </button>
              </li>
              <li>
                <button onClick={onOpenCollectionModal} className="hover:text-white transition-colors cursor-pointer">
                  Donar Ropa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#C85A2A]" />
                <span>hola@remoda.bo</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#C85A2A]" />
                <span>+591 7 123 4567</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentTab('ubicacion')}>
                <MapPin className="w-4 h-4 text-[#C85A2A]" />
                <span>Santa Cruz, Bolivia</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Floating Help Button matching screenshot */}
      <button 
        onClick={() => alert("Centro de Ayuda ReModa: Escríbenos a hola@remoda.bo o WhatsApp +591 71234567")}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-white text-[#1C1C1C] shadow-lg border border-[#E8E1D5] flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform z-30"
        title="Ayuda y soporte"
      >
        ?
      </button>
    </footer>
  );
};
