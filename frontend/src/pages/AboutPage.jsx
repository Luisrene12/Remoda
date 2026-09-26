import React from 'react';
import { Leaf, Recycle, Heart, Users, Award, ShieldCheck, Sparkles, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPage = ({ setCurrentTab, onOpenCollectionModal, onOpenCustomModal }) => {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-stone-900 pb-20 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E5128] via-[#143B1D] to-[#0D2613] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#C85A2A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#C85A2A] text-white shadow-xl shadow-[#C85A2A]/30">
            <Sparkles className="w-4 h-4" />
            Moda Circular & Sostenible en Bolivia
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif-remoda tracking-tight leading-tight">
            Transformamos el futuro textil con <span className="text-emerald-400 underline decoration-[#C85A2A]">propósito y arte</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            En ReModa no desechamos: reimaginamos. Damos una segunda vida a las prendas recuperadas combinando diseño contemporáneo, conciencia ecológica y trabajo artesanal justo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentTab('catalogo')}
              className="px-8 py-3.5 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#C85A2A]/25 flex items-center gap-2 cursor-pointer"
            >
              Explorar Colecciones <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCollectionModal}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all border border-white/20 cursor-pointer"
            >
              Donar Ropa Usada
            </button>
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="max-w-6xl mx-auto -mt-10 px-4 relative z-20">
        <div className="bg-[#1C251C] text-white rounded-3xl p-8 shadow-2xl border border-[#2D3B2D] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">+5,000</div>
            <div className="text-xs text-stone-400 font-medium">Prendas salvadas del vertedero</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">12,500L</div>
            <div className="text-xs text-stone-400 font-medium">Agua ahorrada en producción</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#C85A2A]">+45</div>
            <div className="text-xs text-stone-400 font-medium">Artesanos y diseñadores aliados</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
            <div className="text-xs text-stone-400 font-medium">Transparencia y comercio justo</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1E5128]">
            Nuestra Esencia
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900">
            ¿Por qué existe ReModa?
          </h3>
          <p className="text-stone-600 text-sm sm:text-base">
            La industria textil tradicional es una de las más contaminantes del mundo. ReModa nace como una respuesta creativa, boliviana y sostenible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#1E5128]">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold text-stone-900 font-serif-remoda">Nuestra Misión</h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              Reducir el desperdicio textil en Bolivia transformando prendas descartadas en piezas exclusivas de alta calidad. Fomentamos una economía circular inclusiva que empodera a costureras locales y promueve el consumo responsable.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reducción efectiva de huella de carbono</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pagos dignos a artesanas y modistas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Garantía de calidad en cada costura</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-[#C85A2A]">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold text-stone-900 font-serif-remoda">Nuestra Visión</h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              Consolidarnos como el principal referentes de moda upcycling y circular en Bolivia y la región, inspirando a miles de personas a vestirse con estilo sin comprometer el planeta.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C85A2A]" /> Talleres comunitarios de confección</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C85A2A]" /> Trazabilidad completa de insumos</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C85A2A]" /> Diseños únicos que no se repiten</li>
            </ul>
          </div>

        </div>

      </section>

      {/* Process / Pillars */}
      <section className="bg-stone-100 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#1E5128]">
              El Proceso ReModa
            </h2>
            <h3 className="text-3xl font-bold font-serif-remoda text-stone-900">
              ¿Cómo le damos nueva vida a tu ropa?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E5128] text-white flex items-center justify-center font-bold">1</div>
              <h5 className="text-lg font-bold text-stone-900">Recolección & Clasificación</h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                Recibimos donaciones e insumos textiles descartados, higienizamos minuciosamente cada prenda y seleccionamos las telas de mayor durabilidad.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C85A2A] text-white flex items-center justify-center font-bold">2</div>
              <h5 className="text-lg font-bold text-stone-900">Rediseño & Upcycling</h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nuestros diseñadores y artesanos re-patronan las piezas, interviniendo bordados, parches y cortes modernos para crear prendas de autor.
              </p>
            </div>

            <div className="bg-[#1C251C] text-white p-6 rounded-2xl border border-[#2D3B2D] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">3</div>
              <h5 className="text-lg font-bold text-white">Impacto & Nueva Historia</h5>
              <p className="text-xs text-stone-300 leading-relaxed">
                La prenda ingresa a nuestro catálogo online y tiendas físicas. Quien la viste contribuye a evitar la basura textil y promueve la moda ética.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Call to action section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <h3 className="text-3xl font-bold font-serif-remoda text-stone-900">
          ¿Tienes prendas que ya no usas o deseas un diseño exclusivo?
        </h3>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          Únete al movimiento de moda circular. Dona tus prendas o solicita una prenda hecha a tu medida.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={onOpenCustomModal}
            className="px-6 py-3 bg-[#1E5128] hover:bg-[#163E1F] text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
          >
            Solicitar Personalización
          </button>
          <button
            onClick={() => setCurrentTab('ubicacion')}
            className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            Ver Nuestras Tiendas Físicas
          </button>
        </div>
      </section>

    </div>
  );
};
