import React from 'react';
import { Sparkles, Leaf, Award, ArrowRight, Heart, CheckCircle2, ShieldCheck, Recycle, Compass, Globe } from 'lucide-react';

export const QuienesSomosView = ({ setCurrentTab, onOpenCollectionModal, onOpenCustomModal }) => {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-stone-900 pb-24 animate-in fade-in duration-500">
      
      {/* Hero Banner — Emerald Forest Theme */}
      <section className="relative bg-gradient-to-br from-[#0B2310] via-[#1E5128] to-[#143E1F] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-2xl">
        {/* Animated background glow orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-[#1E5128] text-white shadow-xl shadow-emerald-900/40 backdrop-blur-md border border-emerald-400/30">
            <Heart className="w-4 h-4 fill-white animate-bounce" />
            1. QUIÉNES SOMOS · HISTORIA & FILOSOFÍA
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif-remoda tracking-tight leading-tight text-white drop-shadow-md">
            Reimaginamos el futuro textil con <span className="text-emerald-400 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-200">arte, ciencia y conciencia</span>
          </h1>

          <p className="max-w-3xl mx-auto text-emerald-100/90 text-base sm:text-lg leading-relaxed font-light">
            Somos el primer ecosistema boliviano de moda circular. En ReModa no descartamos prendas: las rescatamos, desarmamos a mano y re-creamos en piezas de alta costura de autor.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={() => setCurrentTab('catalogo')}
              className="px-8 py-4 bg-gradient-to-r from-[#C85A2A] to-amber-600 hover:scale-105 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-[#C85A2A]/30 flex items-center gap-2 cursor-pointer"
            >
              Explorar Catálogo Upcycling <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCollectionModal}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 hover:scale-105 text-white font-extrabold text-sm rounded-2xl backdrop-blur-md transition-all border border-white/25 shadow-lg cursor-pointer"
            >
              Donar Ropa Usada
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3.5 py-1 bg-emerald-100 text-[#1E5128] text-xs font-black rounded-full tracking-widest uppercase border border-emerald-300">
              NUESTRA RAZÓN DE SER
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900 leading-tight">
              Transformamos toneladas de prendas descartadas en ropa <span className="text-[#C85A2A]">exclusiva</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              En Bolivia se desechan miles de toneladas de ropa cada año. ReModa nació en Santa Cruz de la Sierra para rescatar estos valiosos insumos textiles, higienizarlos bajo estándares internacionales y entregarlos a artesanos y diseñadores para crear chaquetas, pantalones y accesorios únicos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md hover:border-emerald-500/40 transition-all flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-[#1E5128] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Zero Waste Real</h4>
                  <p className="text-xs text-stone-500">Cero telas al vertedero</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md hover:border-[#C85A2A]/40 transition-all flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C85A2A] to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Moda de Autor</h4>
                  <p className="text-xs text-stone-500">Piezas irrepetibles</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative bg-[#132215] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#27452A] space-y-6 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-2xl font-bold font-serif-remoda text-emerald-400 flex items-center gap-2">
                <Recycle className="w-6 h-6" /> El Método ReModa Upcycling
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-stone-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1. Rescate Textil:</strong> Clasificamos ropa de primera calidad para garantizar máxima durabilidad y suavidad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>2. Rediseño Artesanal:</strong> Maestros sastres re-patronan las piezas combinando bordados autóctonos con cortes modernos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>3. Trazabilidad Ecológica:</strong> Medimos los litros de agua salvados y el CO2 evitado por prenda.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-[#233B26] flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium">ReModa Bolivia · Hecho con propósito</span>
                <button
                  onClick={onOpenCustomModal}
                  className="px-5 py-2.5 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  Personalizar Prenda <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};

export default QuienesSomosView;
