import React from 'react';
import { Target, Leaf, CheckCircle2 } from 'lucide-react';

export const MisionVisionView = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-28 animate-in fade-in duration-700">

      {/* Giant Hero Banner */}
      <section className="relative bg-stone-950 text-white py-32 md:py-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
          <div className="flex justify-center">
             <span className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-black bg-white/10 text-white backdrop-blur-md border border-white/20 uppercase tracking-[0.2em]">
              <Target className="w-4 h-4 text-amber-400" />
              Nuestro Propósito Supremo
            </span>
          </div>

          {/* Clean, Massive Title */}
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-stone-200 to-stone-500 drop-shadow-2xl">
            Misión <span className="font-light italic text-amber-500">&</span> Visión
          </h1>

          <p className="max-w-3xl mx-auto text-stone-300 text-xl sm:text-2xl leading-relaxed font-light pt-6">
            Guiamos cada paso bajo el compromiso innegociable de lograr una economía textil circular, justa para los artesanos y transformadora para Bolivia.
          </p>
        </div>
      </section>

      {/* Main Content Grid with Massive Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 space-y-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Mission Card - Extra Large */}
          <div className="bg-white/80 backdrop-blur-2xl p-10 sm:p-14 lg:p-16 rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] transition-all duration-500 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
              <Target className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-900 leading-tight">
                Misión
              </h2>
            </div>

            <p className="text-stone-600 text-lg sm:text-xl leading-relaxed font-medium">
              Ofrecer ropa nueva y única hecha con tela reciclada, con diseño moderno, calidad y precio accesible, contribuyendo a reducir la contaminación textil y generando empleo digno para personas que recolectan, costuran en Santa Cruz de la Sierra.
            </p>

            <ul className="space-y-5 text-base sm:text-lg font-semibold text-stone-800 pt-8 border-t border-stone-100">
              <li className="flex items-center gap-4"><CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" /> Rescate activo de ropa en desuso</li>
              <li className="flex items-center gap-4"><CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" /> Remuneración justa a modistas locales</li>
              <li className="flex items-center gap-4"><CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" /> Productos duraderos con garantía de calidad</li>
            </ul>
          </div>

          {/* Vision Card - Extra Large */}
          <div className="bg-white/80 backdrop-blur-2xl p-10 sm:p-14 lg:p-16 rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(245,158,11,0.15)] transition-all duration-500 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="w-24 h-24 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
              <Leaf className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-900 leading-tight">
                Visión
              </h2>
            </div>

            <p className="text-stone-600 text-lg sm:text-xl leading-relaxed font-medium">
              Ser la marca líder de moda circular en Bolivia, reconocida por su compromiso con el medio ambiente, la calidad de sus productos y su impacto social positivo, expandiendo sus operaciones a las principales ciudades del país.
            </p>

            <ul className="space-y-5 text-base sm:text-lg font-semibold text-stone-800 pt-8 border-t border-stone-100">
              <li className="flex items-center gap-4"><CheckCircle2 className="w-7 h-7 text-amber-500 shrink-0" /> Red nacional de talleres comunitarios</li>
              <li className="flex items-center gap-4"><CheckCircle2 className="w-7 h-7 text-amber-500 shrink-0" /> Certificación de huella neutra en agua y CO2</li>
              <li className="flex items-center gap-4"><CheckCircle2 className="w-7 h-7 text-amber-500 shrink-0" /> Educación activa en moda sostenible</li>
            </ul>
          </div>

        </div>

        {/* Impact Bar Banner - Minimal & Premium */}
        <div className="bg-stone-950 text-white p-14 sm:p-16 rounded-[3rem] shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400">+5K</div>
            <div className="text-xs sm:text-sm text-stone-400 font-bold uppercase tracking-[0.2em]">Prendas Salvadas</div>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400">12K</div>
            <div className="text-xs sm:text-sm text-stone-400 font-bold uppercase tracking-[0.2em]">Litros de Agua</div>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400">+45</div>
            <div className="text-xs sm:text-sm text-stone-400 font-bold uppercase tracking-[0.2em]">Artesanos</div>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400">100%</div>
            <div className="text-xs sm:text-sm text-stone-400 font-bold uppercase tracking-[0.2em]">Transparencia</div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default MisionVisionView;
