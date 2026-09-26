import React from 'react';
import { X, Leaf, Recycle, Heart, Users, Award, ShieldCheck, Sparkles, Target } from 'lucide-react';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C251C] text-stone-100 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#2D3B2D] shadow-2xl relative flex flex-col">
        
        {/* Header Hero Banner */}
        <div className="relative p-8 md:p-10 bg-gradient-to-br from-[#1E5128] via-[#143B1D] to-[#0D2613] rounded-t-3xl border-b border-[#2D3B2D] overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#C85A2A]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#C85A2A] text-white shadow-lg shadow-[#C85A2A]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Nuestra Historia & Propósito
          </span>

          <h2 className="text-3xl md:text-4xl font-bold font-serif-remoda text-white tracking-tight leading-tight">
            Sobre Re<span className="text-[#C85A2A]">Moda</span>
          </h2>
          <p className="mt-2 text-stone-300 text-sm md:text-base max-w-xl leading-relaxed">
            Reescribimos el futuro de la moda en Bolivia a través de la sostenibilidad, la creatividad upcycling y el comercio justo comunitario.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#243024] p-5 rounded-2xl border border-[#2F3F2F] hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nuestra Misión</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Reducir el desperdicio textil en Bolivia transformando prendas usadas en piezas exclusivas de alta calidad, empoderando a artesanos locales y promoviendo el consumo responsable.
              </p>
            </div>

            <div className="bg-[#243024] p-5 rounded-2xl border border-[#2F3F2F] hover:border-[#C85A2A]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C85A2A]/10 flex items-center justify-center text-[#C85A2A] mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nuestra Visión</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Ser el ecosistema líder de moda circular en Latinoamérica, donde cada prenda cuente una historia de regeneración, diseño sostenible e impacto social positivo.
              </p>
            </div>
          </div>

          {/* Impact Stats Banner */}
          <div className="bg-gradient-to-r from-[#192D1B] to-[#1F3A22] p-6 rounded-2xl border border-[#2F4D32] shadow-inner">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-center mb-4">
              Nuestro Impacto Eco-Social acumulado
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-2xl font-black text-white">+5,000</div>
                <div className="text-[11px] text-stone-400">Prendas salvadas</div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-2xl font-black text-emerald-400">12,500L</div>
                <div className="text-[11px] text-stone-400">Agua ahorrada</div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-2xl font-black text-[#C85A2A]">+45</div>
                <div className="text-[11px] text-stone-400">Artesanos aliados</div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-2xl font-black text-amber-400">100%</div>
                <div className="text-[11px] text-stone-400">Moda consciente</div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Nuestros Pilares Fundamentales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#243024] p-4 rounded-xl border border-[#2F3F2F]">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
                  <Recycle className="w-4 h-4" /> Upcycling Creativo
                </div>
                <p className="text-xs text-stone-300">
                  No reciclamos, remendamos con arte. Cada diseño es único e irrepetible.
                </p>
              </div>

              <div className="bg-[#243024] p-4 rounded-xl border border-[#2F3F2F]">
                <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-sm">
                  <Users className="w-4 h-4" /> Comercio Justo
                </div>
                <p className="text-xs text-stone-300">
                  Garantizamos pago justo y digno a las costureras y diseñadores independientes.
                </p>
              </div>

              <div className="bg-[#243024] p-4 rounded-xl border border-[#2F3F2F]">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                  <Award className="w-4 h-4" /> Calidad & Garantía
                </div>
                <p className="text-xs text-stone-300">
                  Inspeccionamos minuciosamente cada prenda para asegurar durabilidad y estilo.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 bg-[#161D16] rounded-b-3xl border-t border-[#2D3B2D] flex items-center justify-between">
          <span className="text-xs text-stone-400">ReModa Bolivia · Hecho con ♥ y telas recuperadas</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
