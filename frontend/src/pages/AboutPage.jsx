import React, { useEffect, useRef, useState } from 'react';
import { Leaf, Recycle, Heart, Users, Award, ShieldCheck, Sparkles, Target, ArrowRight, CheckCircle2, Zap, TreePine, Droplets, TrendingUp } from 'lucide-react';

/* ── Animated Counter ──────────────────────────────────────── */
const AnimatedCounter = ({ end, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const endNum = parseFloat(String(end).replace(/[^0-9.]/g, ''));
        const step = endNum / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= endNum) { setCount(endNum); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const processSteps = [
  {
    number: '01',
    title: 'Recolección & Clasificación',
    desc: 'Recibimos donaciones e insumos textiles descartados, higienizamos minuciosamente cada prenda y seleccionamos las telas de mayor durabilidad.',
    icon: '📦',
    color: 'from-[#1E5128] to-emerald-700',
    textColor: 'text-[#1E5128]',
    borderColor: 'border-emerald-200',
  },
  {
    number: '02',
    title: 'Rediseño & Upcycling',
    desc: 'Nuestros diseñadores y artesanos re-patronan las piezas, interviniendo bordados, parches y cortes modernos para crear prendas de autor.',
    icon: '✂️',
    color: 'from-[#C85A2A] to-amber-500',
    textColor: 'text-[#C85A2A]',
    borderColor: 'border-amber-200',
  },
  {
    number: '03',
    title: 'Impacto & Nueva Historia',
    desc: 'La prenda ingresa a nuestro catálogo online y tiendas físicas. Quien la viste contribuye a evitar la basura textil y promueve la moda ética.',
    icon: '🌱',
    color: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-600',
    borderColor: 'border-teal-200',
  },
];

const pillars = [
  {
    icon: Recycle,
    title: 'Economía Circular',
    desc: 'Cada prenda tiene una segunda vida. Diseñamos procesos que eliminan el desperdicio en cada etapa de producción.',
    gradient: 'from-emerald-500 to-[#1E5128]',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-[#1E5128]',
  },
  {
    icon: Heart,
    title: 'Impacto Social',
    desc: 'Empoderamos artesanas y costureras locales con salarios justos, formación y un entorno de trabajo digno.',
    gradient: 'from-rose-400 to-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    icon: ShieldCheck,
    title: 'Transparencia Total',
    desc: 'Reportamos cada litro de agua ahorrado y cada kg de CO₂ evitado. Nada se oculta, todo se mide.',
    gradient: 'from-blue-400 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    icon: Award,
    title: 'Calidad de Autor',
    desc: 'No somos segunda mano: somos alta costura circular. Cada pieza es única, irrepetible y de alta calidad artesanal.',
    gradient: 'from-[#C85A2A] to-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconColor: 'text-[#C85A2A]',
  },
];

const stats = [
  { icon: TreePine, value: 5000, suffix: '+', label: 'Prendas salvadas', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { icon: Droplets, value: 12500, suffix: 'L', label: 'Agua ahorrada', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { icon: Users, value: 45, suffix: '+', label: 'Artesanos aliados', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { icon: TrendingUp, value: 100, suffix: '%', label: 'Transparencia', color: 'text-rose-400', bg: 'bg-rose-500/15' },
];

export const AboutPage = ({ setCurrentTab, onOpenCollectionModal, onOpenCustomModal }) => {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-stone-900 pb-24">

      {/* ─── CINEMATIC HERO ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0D1A10] via-[#163E1F] to-[#1E5128] text-white overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] -mr-64 -mt-48 rounded-full bg-gradient-to-bl from-emerald-400/15 to-transparent blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 -ml-24 -mb-24 rounded-full bg-[#C85A2A]/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-amber-400/5 rounded-full blur-2xl pointer-events-none animate-float-slow" style={{ animationDelay: '1.5s' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 relative z-10 text-center space-y-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold border border-[#C85A2A]/40 bg-[#C85A2A]/20 text-amber-200 shadow-xl shadow-[#C85A2A]/20 backdrop-blur-md animate-slide-in-down">
            <Sparkles className="w-4 h-4 animate-sparkle text-amber-300" />
            Moda Circular & Sostenible en Bolivia
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif-remoda tracking-tight leading-tight animate-fade-in-up">
            Transformamos el<br />
            <span className="text-gradient-animated">futuro textil</span><br />
            con propósito y arte
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            En ReModa no desechamos: reimaginamos. Damos una segunda vida a las prendas recuperadas combinando diseño contemporáneo, conciencia ecológica y trabajo artesanal justo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <button
              onClick={() => setCurrentTab('catalogo')}
              className="group px-8 py-3.5 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold rounded-2xl transition-all shadow-xl shadow-[#C85A2A]/30 flex items-center gap-2 cursor-pointer active:scale-95 animate-glow-orange"
            >
              Explorar Colecciones <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onOpenCollectionModal}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all border border-white/20 cursor-pointer active:scale-95"
            >
              Donar Ropa Usada
            </button>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 64L80 53.3C160 42.7 320 21.3 480 16C640 10.7 800 21.3 960 26.7C1120 32 1280 32 1360 32L1440 32V64H1360C1280 64 1120 64 960 64C800 64 640 64 480 64C320 64 160 64 80 64H0Z" fill="#FBF8F3"/>
          </svg>
        </div>
      </section>

      {/* ─── FLOATING STATS ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-2 relative z-10 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`animate-scale-in stagger-${i + 1} bg-white rounded-3xl p-6 shadow-xl border border-stone-100 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group`}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-black ${stat.color}`}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-stone-500 mt-1 font-semibold">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── WHY REMODA ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 animate-fade-in-up">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E5128]">Nuestra Esencia</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900">
            ¿Por qué existe <span className="text-gradient-gold">ReModa</span>?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            La industria textil tradicional es una de las más contaminantes del mundo. ReModa nace como una respuesta creativa, boliviana y sostenible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <div className="group relative bg-white p-8 rounded-3xl border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 animate-slide-in-left">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-[#1E5128]" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#1E5128] border border-emerald-200 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-serif-remoda">Nuestra Misión</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Reducir el desperdicio textil en Bolivia transformando prendas descartadas en piezas exclusivas de alta calidad. Fomentamos una economía circular inclusiva que empodera a costureras locales y promueve el consumo responsable.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2">
                {['Reducción efectiva de huella de carbono', 'Pagos dignos a artesanas y modistas', 'Garantía de calidad en cada costura'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative bg-white p-8 rounded-3xl border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 animate-slide-in-right">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C85A2A] to-amber-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-[#C85A2A] border border-amber-200 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-serif-remoda">Nuestra Visión</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Consolidarnos como el principal referente de moda upcycling y circular en Bolivia y la región, inspirando a miles de personas a vestirse con estilo sin comprometer el planeta.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2">
                {['Talleres comunitarios de confección', 'Trazabilidad completa de insumos', 'Diseños únicos que no se repiten'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C85A2A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`group bg-white rounded-3xl p-6 border ${pillar.border} shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 animate-scale-in stagger-${i + 1}`}
              >
                <div className={`w-12 h-12 ${pillar.bg} rounded-2xl flex items-center justify-center mb-4 border ${pillar.border} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <div className={`h-0.5 w-8 bg-gradient-to-r ${pillar.gradient} rounded-full mb-3`} />
                <h4 className="text-base font-bold text-stone-900 mb-2">{pillar.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── PROCESS TIMELINE ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-stone-100 to-[#EDE7DC] py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 animate-fade-in-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E5128]">El Proceso ReModa</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900">
              ¿Cómo le damos <span className="text-gradient-gold">nueva vida</span> a tu ropa?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#1E5128] via-[#C85A2A] to-emerald-500 opacity-30" />

            {processSteps.map((step, i) => (
              <div
                key={i}
                className={`group relative bg-white p-7 rounded-3xl border ${step.borderColor} shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-scale-in stagger-${i + 1}`}
              >
                {/* Step number badge */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-black text-xl shadow-lg shadow-stone-300 mb-5 group-hover:scale-110 transition-transform`}>
                  {step.number}
                </div>

                <div className="text-3xl mb-3">{step.icon}</div>
                <h4 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>

                {/* Hover accent bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="relative bg-gradient-to-br from-[#141C14] via-[#1B271D] to-[#0E150F] text-white p-10 sm:p-14 rounded-3xl shadow-2xl overflow-hidden text-center space-y-6">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C85A2A]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" /> Únete al movimiento circular
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-white leading-tight">
              ¿Tienes prendas que ya no usas<br />
              o deseas un <span className="text-gradient-gold">diseño exclusivo</span>?
            </h2>

            <p className="text-stone-300 text-sm max-w-xl mx-auto">
              Únete al movimiento de moda circular. Dona tus prendas o solicita una prenda hecha a tu medida.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={onOpenCustomModal}
                className="group px-8 py-4 bg-gradient-to-r from-[#C85A2A] to-amber-500 hover:from-[#b04d22] hover:to-amber-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-[#C85A2A]/30 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                Solicitar Personalización <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentTab('ubicacion')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all border border-white/20 cursor-pointer active:scale-95"
              >
                Ver Nuestras Tiendas
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
