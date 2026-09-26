import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Target, Leaf, Users, ShieldCheck, Heart, Award, ArrowRight, Mail, CheckCircle2, ChevronRight, Star, Globe, Zap, TreePine, Droplets, TrendingUp } from 'lucide-react';

/* ── Animated Counter component ───────────────────────────── */
const AnimatedCounter = ({ end, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const endNum = parseFloat(end.toString().replace(/[^0-9.]/g, ''));
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

export const QuienesSomosPage = ({ initialSection = 'historia', setCurrentTab, onOpenCollectionModal, onOpenCustomModal }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [activeTeamMember, setActiveTeamMember] = useState(null);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
      const timer = setTimeout(() => {
        const elem = document.getElementById(initialSection);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  const teamMembers = [
    {
      id: 1,
      name: 'Vivian Heidy Heredia Tangara',
      role: 'Fundadora & CEO',
      tag: 'Liderazgo & Visión Circular',
      image: '/images/team/vivian-heidy.jpg',
      bio: 'Visionaria boliviana apasionada por la sostenibilidad. Tras 8 años en la industria textil internacional, volvió a Bolivia para crear ReModa y erradicar la basura textil.',
      quote: '"La verdadera elegancia no destruye el planeta; lo regenera con cada prenda."',
      social: { email: 'sofia@remoda.bo' },
      accent: 'from-emerald-500 to-[#1E5128]',
      badgeColor: 'bg-emerald-600',
      badgeText: 'Fundadora',
      emoji: '🌱',
    },
    {
      id: 2,
      name: 'Luis Rene Sequeiro Khonangh',
      role: 'Director de Diseño Upcycling',
      tag: 'Alta Costura Reciclada',
      image: '/images/team/luis-rene.jpeg',
      bio: 'Diseñador de moda con especialización en confección de autor. Transforma prendas en desuso en chaquetas y abrigos vanguardistas de nivel de pasarela.',
      quote: '"No vemos ropa vieja; vemos lienzos listos para ser reinventados."',
      social: { email: 'rene@remoda.bo' },
      accent: 'from-[#C85A2A] to-amber-500',
      badgeColor: 'bg-[#C85A2A]',
      badgeText: 'Diseño de Autor',
      emoji: '✂️',
    },
    {
      id: 3,
      name: 'Yilda Carballo Solis',
      role: 'Directora de Sostenibilidad e Impacto',
      tag: 'Estrategia Ambiental',
      image: '/images/team/yilda.jpg',
      bio: 'Ingeniera ambiental enfocada en análisis de ciclo de vida del producto. Garantiza que cada proceso en ReModa tenga la menor huella hídrica y de carbono.',
      quote: '"Cada litro de agua ahorrado es un regalo para las futuras generaciones."',
      social: { email: 'camila@remoda.bo' },
      accent: 'from-teal-500 to-emerald-700',
      badgeColor: 'bg-teal-600',
      badgeText: 'Eco Impacto',
      emoji: '🌍',
    },
    {
      id: 4,
      name: 'Stacy Katherine Córdova Rojas',
      role: 'Maestro Artesano & Jefe de Taller',
      tag: 'Confección & Sastrería',
      image: '/images/team/companera.jpg',
      bio: 'Sastre con más de 25 años de oficio. Lidera el equipo de confección y capacita a jóvenes aprendices en técnicas de costura de alta precisión.',
      quote: '"La calidad de una prenda se mide en el alma y dedicación que pones en cada puntada."',
      social: { email: 'jacinto@remoda.bo' },
      accent: 'from-[#1E5128] to-green-900',
      badgeColor: 'bg-[#1E5128]',
      badgeText: 'Maestro Sastre',
      emoji: '🧵',
    },
    {
      id: 5,
      name: 'Gloria Suarez',
      role: 'Gerente de Comunidad y Alianzas',
      tag: 'Impacto Social & Donaciones',
      image: '/images/team/companera2.jpg',
      bio: 'Especialista en desarrollo comunitario. Coordina la red de donantes, talleres sociales y alianzas con colectivos locales de economía circular.',
      quote: '"ReModa es de todos: donantes, creadores y clientes que eligen con el corazón."',
      social: { email: 'lucia@remoda.bo' },
      accent: 'from-purple-600 to-violet-800',
      badgeColor: 'bg-purple-600',
      badgeText: 'Comunidad',
      emoji: '💜',
    }
  ];

  const navTabs = [
    { id: 'historia', label: 'Quiénes Somos', icon: Heart },
    { id: 'mision-vision', label: 'Misión y Visión', icon: Target },
    { id: 'equipo', label: `Nuestro Equipo (${teamMembers.length})`, icon: Users },
  ];

  const impactStats = [
    { icon: TreePine, value: 5000, suffix: '+', label: 'Prendas recuperadas', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { icon: Droplets, value: 12500, suffix: ' L', label: 'Agua ahorrada', color: 'text-blue-400', bg: 'bg-blue-500/15' },
    { icon: Users, value: 45, suffix: '+', label: 'Artesanos aliados', color: 'text-[#C85A2A]', bg: 'bg-orange-500/15' },
    { icon: TrendingUp, value: 100, suffix: '%', label: 'Transparencia', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  ];

  const philosophyPoints = [
    { title: 'Rescate & Selección', desc: 'Filtramos prendas usadas de primera calidad para garantizar telas suaves y duraderas.', icon: '🔍' },
    { title: 'Desarmado & Rediseño', desc: 'Modistas locales re-patronan las piezas fusionando cortes modernos con detalles autóctonos.', icon: '✂️' },
    { title: 'Impacto Transparente', desc: 'Calculamos los litros de agua salvados y el CO₂ evitado en cada prenda confeccionada.', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-stone-900 pb-24">

      {/* ─── CINEMATIC HERO ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0D1A10] via-[#163E1F] to-[#1E5128] text-white overflow-hidden">
        {/* Decorative animated orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -mr-48 -mt-48 rounded-full bg-gradient-to-bl from-emerald-500/20 via-emerald-800/10 to-transparent blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 -ml-32 -mb-32 rounded-full bg-gradient-to-tr from-[#C85A2A]/25 to-transparent blur-3xl pointer-events-none" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 -ml-32 -mt-32 rounded-full bg-emerald-400/5 blur-2xl pointer-events-none animate-float-slow" style={{ animationDelay: '2s' }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
          <div className="text-center space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-bold border border-[#C85A2A]/50 bg-[#C85A2A]/20 text-amber-200 shadow-2xl shadow-[#C85A2A]/20 animate-slide-in-down backdrop-blur-md">
              <Sparkles className="w-4 h-4 animate-sparkle text-amber-300" />
              Conoce Todo Sobre ReModa Bolivia
              <Sparkles className="w-4 h-4 animate-sparkle text-amber-300" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-serif-remoda tracking-tight leading-tight animate-fade-in-up">
              Nuestra Historia,<br />
              <span className="text-gradient-animated">Misión y Equipo</span>
            </h1>

            {/* Sub */}
            <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              Somos un movimiento boliviano de moda circular que fusiona el diseño de autor, el empoderamiento artesanal y la sostenibilidad ambiental para transformar la ropa descartada en arte vestible.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <button
                onClick={() => setCurrentTab('catalogo')}
                className="group px-8 py-3.5 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold rounded-2xl transition-all shadow-xl shadow-[#C85A2A]/30 flex items-center gap-2 cursor-pointer active:scale-95 animate-glow-orange"
              >
                Ver Catálogo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenCollectionModal}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all border border-white/20 cursor-pointer active:scale-95"
              >
                Donar Ropa Usada
              </button>
            </div>

            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              {navTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveSection(id);
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${activeSection === id
                      ? 'bg-white text-[#1E5128] scale-105 shadow-xl shadow-black/20'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 64L48 56C96 48 192 32 288 26.7C384 21.3 480 26.7 576 32C672 37.3 768 42.7 864 42.7C960 42.7 1056 37.3 1152 32C1248 26.7 1344 21.3 1392 18.7L1440 16V64H1392C1344 64 1248 64 1152 64C1056 64 960 64 864 64C768 64 672 64 576 64C480 64 384 64 288 64C192 64 96 64 48 64H0Z" fill="#FBF8F3" />
          </svg>
        </div>
      </section>

      {/* ─── IMPACT STATS BAR ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-2 relative z-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`animate-scale-in stagger-${i + 1} bg-white rounded-3xl p-6 shadow-xl border border-stone-100 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group`}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-black ${stat.color} animate-counter-up`}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-stone-500 mt-1 font-semibold">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECTION 1: QUIÉNES SOMOS ──────────────────────────────── */}
      <section id="historia" className="max-w-6xl mx-auto px-4 pb-24 border-b border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6 animate-slide-in-left">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-[#1E5128] text-xs font-extrabold rounded-full tracking-wider uppercase border border-emerald-200">
              <Heart className="w-3.5 h-3.5" /> 1. QUIÉNES SOMOS
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-remoda text-stone-900 leading-tight">
              Reescribimos la historia de la moda en Bolivia a través del{' '}
              <span className="text-gradient-gold">Upcycling</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Nacimos en Santa Cruz de la Sierra con una misión clara: convertir el residuo textil en una oportunidad de creación artística y justicia social. Cada año se desperdician toneladas de prendas utilizables; en ReModa rescatamos estos insumos y los transformamos con técnicas artesanales únicas.
            </p>

            {/* Philosophy points */}
            <div className="space-y-3 pt-2">
              {philosophyPoints.map((p, i) => (
                <div
                  key={i}
                  className={`group flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 animate-fade-in-up stagger-${i + 1}`}
                >
                  <span className="text-2xl">{p.emoji || '✅'}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#1E5128] transition-colors">{p.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dark philosophy card */}
          <div className="lg:col-span-6 animate-slide-in-right">
            <div className="relative bg-gradient-to-br from-[#141C15] to-[#0E150F] text-white p-8 sm:p-10 rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/30">
              {/* Glow orb */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C85A2A]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-sparkle" />
                  </div>
                  <h3 className="text-xl font-bold font-serif-remoda text-emerald-400">
                    Nuestra Filosofía de Trabajo
                  </h3>
                </div>

                <ul className="space-y-4">
                  {philosophyPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/40 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-stone-300 leading-relaxed">
                        <strong className="text-white">{p.title}:</strong> {p.desc}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Eco pillars */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: '♻️', label: '100% Circular', sub: 'Cero prendas al vertedero' },
                    { icon: '🏆', label: 'Diseños Exclusivos', sub: 'Piezas irrepetibles' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 hover:bg-white/10 transition-colors">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-xs text-stone-400">{item.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">ReModa Bolivia · Moda con propósito</span>
                  <button
                    onClick={() => setCurrentTab('catalogo')}
                    className="px-5 py-2.5 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    Ver Catálogo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: MISIÓN Y VISIÓN ────────────────────────────── */}
      <section id="mision-vision" className="max-w-6xl mx-auto px-4 py-24 border-b border-stone-200">

        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-[#C85A2A] text-xs font-extrabold rounded-full tracking-wider uppercase border border-amber-200">
            <Target className="w-3.5 h-3.5" /> 2. MISIÓN Y VISIÓN
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900">
            Los Motores que <span className="text-gradient-gold">Guían Nuestro Impacto</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Buscamos transformar la relación que las personas tienen con su guardarropa a través de la economía circular.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Mission Card */}
          <div className="group relative bg-white p-8 rounded-3xl border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500 space-y-5 overflow-hidden animate-slide-in-left hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-[#1E5128]" />
            <div className="relative z-10 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-[#1E5128] border border-emerald-200 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif-remoda text-stone-900">Nuestra Misión</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Reducir drásticamente el desperdicio textil en Bolivia mediante la recolección, desinfección y confección upcycling de prendas descartadas. Brindamos empleo digno a artesanos locales y ofrecemos productos exclusivos de alta costura accesible para la comunidad.
              </p>
              <div className="pt-4 border-t border-stone-100 space-y-2">
                {['+5,000 prendas salvadas este año', 'Comercio justo garantizado'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative bg-white p-8 rounded-3xl border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500 space-y-5 overflow-hidden animate-slide-in-right hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C85A2A] to-amber-400" />
            <div className="relative z-10 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-[#C85A2A] border border-amber-200 group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif-remoda text-stone-900">Nuestra Visión</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Posicionarnos como el ecosistema de moda sostenible líder en Latinoamérica, inspirando a la industria textil a adoptar modelos circulares de cero desperdicio y consolidando a Bolivia como potencia de diseño responsable e innovador.
              </p>
              <div className="pt-4 border-t border-stone-100 space-y-2">
                {['Red nacional de talleres comunitarios', 'Certificación de huella hídrica neutra'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-[#C85A2A] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Bar with animated counters */}
        <div className="relative bg-gradient-to-r from-[#1E5128] via-[#163E1F] to-[#1E5128] text-white p-10 rounded-3xl shadow-2xl overflow-hidden animate-gradient-shift">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C85A2A]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
            {impactStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="space-y-2">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black ${s.color}`}>
                    <AnimatedCounter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-stone-300 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: NUESTRO EQUIPO ─────────────────────────────── */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 py-24 space-y-16">

        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1E5128] text-white text-xs font-extrabold rounded-full tracking-wider uppercase shadow-md shadow-[#1E5128]/30">
            <Users className="w-4 h-4" /> 3. NUESTRO EQUIPO
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-serif-remoda text-stone-900 tracking-tight">
            Los 5 Creadores Detrás de <span className="text-gradient-gold">ReModa</span>
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Conoce a las mentes, manos y corazones apasionados que hacen posible la moda sostenible en Bolivia.
          </p>
        </div>

        {/* Team Grid — 3 cols + centered last 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              onClick={() => setActiveTeamMember(activeTeamMember === member.id ? null : member.id)}
              className={`group relative bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer hover:-translate-y-2 animate-scale-in stagger-${(index % 3) + 1} ${index === 0 ? 'lg:col-span-1 ring-2 ring-emerald-400/20' : ''
                }`}
            >
              {/* Top gradient accent bar */}
              <div className={`h-1.5 bg-gradient-to-r ${member.accent} w-full`} />

              {/* Photo with overlay */}
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                  style={{ transform: 'scale(1)', transition: 'transform 700ms ease-out' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold text-white ${member.badgeColor} shadow-lg`}>
                    <span>{member.emoji}</span>
                    {member.badgeText}
                  </span>
                </div>

                {/* Email icon */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={`mailto:${member.social.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-white/25 hover:bg-white text-white hover:text-stone-900 transition-all backdrop-blur-md"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-4 inset-x-4 z-10 text-white">
                  <h3 className="text-lg font-bold font-serif-remoda leading-tight drop-shadow-md">{member.name}</h3>
                  <p className="text-xs font-semibold text-emerald-300 tracking-wide uppercase mt-0.5">{member.role}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-block text-[11px] font-extrabold text-[#C85A2A] uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                    {member.tag}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{member.bio}</p>
                </div>

                {/* Quote */}
                <div className="bg-gradient-to-br from-[#F9F6F0] to-stone-50 p-4 rounded-2xl border border-stone-100 italic text-[11px] text-stone-600 font-serif-remoda leading-relaxed">
                  <span className="text-2xl text-[#C85A2A] leading-none mr-1 font-serif not-italic">"</span>
                  {member.quote.replace(/["""]/g, '')}
                  <span className="text-2xl text-[#C85A2A] leading-none ml-0.5 font-serif not-italic">"</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join the team banner */}
        <div className="relative bg-gradient-to-br from-[#141C14] to-[#0E150F] text-white p-10 rounded-3xl border border-emerald-900/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#C85A2A]/8 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" /> Únete al movimiento
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-remoda text-emerald-400">
              ¿Quieres unirte o colaborar con nuestro equipo?
            </h3>
            <p className="text-stone-300 text-sm max-w-xl">
              Buscamos siempre artesanos, diseñadores y aliados comprometidos con el planeta.
            </p>
          </div>

          <button
            onClick={onOpenCustomModal}
            className="relative z-10 px-8 py-4 bg-gradient-to-r from-[#C85A2A] to-amber-500 hover:from-[#b04d22] hover:to-amber-600 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-[#C85A2A]/30 shrink-0 cursor-pointer active:scale-95 flex items-center gap-2"
          >
            Contactar al Equipo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>
    </div>
  );
};

export default QuienesSomosPage;
