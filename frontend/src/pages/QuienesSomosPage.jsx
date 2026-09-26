import React, { useState, useEffect } from 'react';
import { Sparkles, Target, Leaf, Users, ShieldCheck, Heart, Award, ArrowRight, Mail, CheckCircle2, ChevronRight, Star, Globe, Share2 } from 'lucide-react';

export const QuienesSomosPage = ({ initialSection = 'historia', setCurrentTab, onOpenCollectionModal, onOpenCustomModal }) => {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
      const timer = setTimeout(() => {
        const elem = document.getElementById(initialSection);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
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
      social: { linkedin: '#', instagram: '#', email: 'sofia@remoda.bo' },
      badgeBg: 'bg-emerald-600',
      badgeText: 'Fundadora',
    },
    {
      id: 2,
      name: 'Luis Rene Sequeiro Khonangh',
      role: 'Director de Diseño Upcycling',
      tag: 'Alta Costura Reciclada',
      image: '/images/team/luis-rene.jpeg',
      bio: 'Diseñador de moda con especialización en confección de autor. Mateo transforma prendas en desuso en chaquetas y abrigos vanguardistas de nivel de pasarela.',
      quote: '"No vemos ropa vieja; vemos lienzos listos para ser reinventados."',
      social: { linkedin: '#', instagram: '#', email: 'rene@remoda.bo' },
      badgeBg: 'bg-[#C85A2A]',
      badgeText: 'Diseño de Autor',
    },
    {
      id: 3,
      name: 'Yilda Carballo Solis',
      role: 'Directora de Sostenibilidad e Impacto',
      tag: 'Estrategia Ambiental',
      image: '/images/team/yilda.jpg',
      bio: 'Ingeniera ambiental enfocada en análisis de ciclo de vida del producto. Garantiza que cada proceso en ReModa tenga la menor huella hídrica y de carbono.',
      quote: '"Cada litro de agua ahorrado es un regalo para las futuras generaciones."',
      social: { linkedin: '#', instagram: '#', email: 'camila@remoda.bo' },
      badgeBg: 'bg-teal-600',
      badgeText: 'Eco Impacto',
    },
    {
      id: 4,
      name: 'Stacy Katherine Córdova Rojas',
      role: 'Maestro Artesano & Jefe de Taller',
      tag: 'Confección & Sastrería',
      image: '/images/team/companera.jpg',
      bio: 'Sastre con más de 25 años de oficio. Lidera el equipo de confección y capacita a jóvenes aprendices en técnicas de costura de alta precisión.',
      quote: '"La calidad de una prenda se mide en el alma y dedicación que pones en cada puntada."',
      social: { linkedin: '#', instagram: '#', email: 'jacinto@remoda.bo' },
      badgeBg: 'bg-[#1E5128]',
      badgeText: 'Maestro Sastre',
    },
    {
      id: 5,
      name: 'Lucía Benítez',
      role: 'Gerente de Comunidad y Alianzas',
      tag: 'Impacto Social & Donaciones',
      image: '/images/team/community.jpg',
      bio: 'Especialista en desarrollo comunitario. Coordina la red de donantes, talleres sociales y alianzas con colectivos locales de economía circular.',
      quote: '"ReModa es de todos: donantes, creadores y clientes que eligen con el corazón."',
      social: { linkedin: '#', instagram: '#', email: 'lucia@remoda.bo' },
      badgeBg: 'bg-purple-600',
      badgeText: 'Comunidad',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-stone-900 pb-24 animate-fade-in">
      
      {/* Hero Banner with Dynamic Gradient */}
      <section className="relative bg-gradient-to-br from-[#163E1F] via-[#1E5128] to-[#0D2613] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#C85A2A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#C85A2A] text-white shadow-xl shadow-[#C85A2A]/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Conoce Todo Sobre ReModa Bolivia
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif-remoda tracking-tight leading-tight">
            Nuestra Historia, Misión y el <span className="text-emerald-400 underline decoration-[#C85A2A]">Equipo Extraordinario</span>
          </h1>

          <p className="max-w-3xl mx-auto text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            Somos un movimiento boliviano de moda circular que fusiona el diseño de autor, el empoderamiento artesanal y la sostenibilidad ambiental para transformar la ropa descartada en arte vestible.
          </p>

          {/* Section Navigation Tabs Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button
              onClick={() => {
                setActiveSection('historia');
                document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                activeSection === 'historia'
                  ? 'bg-white text-[#1E5128] scale-105 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className="w-4 h-4" /> 1. Quiénes Somos
            </button>

            <button
              onClick={() => {
                setActiveSection('mision-vision');
                document.getElementById('mision-vision')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                activeSection === 'mision-vision'
                  ? 'bg-white text-[#1E5128] scale-105 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Target className="w-4 h-4" /> 2. Misión y Visión
            </button>

            <button
              onClick={() => {
                setActiveSection('equipo');
                document.getElementById('equipo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                activeSection === 'equipo'
                  ? 'bg-white text-[#1E5128] scale-105 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-4 h-4" /> 3. Nuestro Equipo (5)
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: QUIÉNES SOMOS ────────────────────────────────────────── */}
      <section id="historia" className="max-w-6xl mx-auto px-4 py-20 border-b border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-[#1E5128] text-xs font-extrabold rounded-full tracking-wider uppercase">
              1. QUIÉNES SOMOS
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900 leading-tight">
              Reescribimos la historia de la moda en Bolivia a través del <span className="text-[#C85A2A]">Upcycling</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Nacimos en Santa Cruz de la Sierra con una misión clara: convertir el residuo textil en una oportunidad de creación artísitca y justicia social. Cada año se desperdician toneladas de prendas utilizables; en ReModa rescatamos estos insumos y los transformamos con técnicas artesanales únicas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1E5128] flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">100% Circular</h4>
                  <p className="text-xs text-stone-500">Cero prendas al vertedero</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#C85A2A] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Diseños Exclusivos</h4>
                  <p className="text-xs text-stone-500">Piezas irrepetibles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive visual feature box */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#1C251C] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#2D3B2D] space-y-6 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-2xl font-bold font-serif-remoda text-emerald-400">
                Nuestra Filosofía de Trabajo
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm text-stone-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Rescate & Selección:</strong> Filtramos prendas usadas de primera calidad para garantizar telas suaves y duraderas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Desarmado & Rediseño:</strong> Modistas locales re-patronan las piezas fusionando cortes modernos con detalles autóctonos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Impacto Transparente:</strong> Calculamos los litros de agua salvados y el CO2 evitado en cada prenda confeccionada.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-[#2F3F2F] flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium">ReModa Bolivia · Moda con propósito</span>
                <button
                  onClick={() => setCurrentTab('catalogo')}
                  className="px-5 py-2.5 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Ver Catálogo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─── SECTION 2: MISIÓN Y VISIÓN ──────────────────────────────────────── */}
      <section id="mision-vision" className="max-w-6xl mx-auto px-4 py-20 border-b border-stone-200">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-block px-3 py-1 bg-amber-100 text-[#C85A2A] text-xs font-extrabold rounded-full tracking-wider uppercase">
            2. MISIÓN Y VISIÓN
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-stone-900">
            Los Motores que Guían Nuestro Impacto
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Buscamos transformar la relación que las personas tienen con su guardarropa a través de la economía circular.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#1E5128]">
              <Target className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold font-serif-remoda text-stone-900">Nuestra Misión</h3>

            <p className="text-stone-600 text-sm leading-relaxed">
              Reducir drásticamente el desperdicio textil en Bolivia mediante la recolección, desinfección y confección upcycling de prendas descartadas. Brindamos empleo digno a artesanos locales y ofrecemos productos exclusivos de alta costura accesible para la comunidad.
            </p>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs font-bold text-stone-800">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> +5,000 prendas salvadas este año</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Comercio justo garantizado</div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-[#C85A2A]">
              <Leaf className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold font-serif-remoda text-stone-900">Nuestra Visión</h3>

            <p className="text-stone-600 text-sm leading-relaxed">
              Posicionarnos como el ecosistema de moda sostenible líder en Latinoamérica, inspirando a la industria textil a adoptar modelos circulares de cero desperdicio y consolidando a Bolivia como potencia de diseño responsable e innovador.
            </p>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs font-bold text-stone-800">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C85A2A]" /> Red nacional de talleres comunitarios</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C85A2A]" /> Certificación de huella hídrica neutra</div>
            </div>
          </div>

        </div>

        {/* Impact Bar */}
        <div className="mt-12 bg-gradient-to-r from-[#1E5128] to-[#143B1D] text-white p-8 rounded-3xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-white">+5,000</div>
            <div className="text-xs text-stone-300 mt-1 font-medium">Prendas recuperadas</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400">12,500 L</div>
            <div className="text-xs text-stone-300 mt-1 font-medium">Agua ahorrada</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#C85A2A]">+45</div>
            <div className="text-xs text-stone-300 mt-1 font-medium">Artesanos aliados</div>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400">100%</div>
            <div className="text-xs text-stone-300 mt-1 font-medium">Transparencia</div>
          </div>
        </div>

      </section>


      {/* ─── SECTION 3: NUESTRO EQUIPO (5 INTEGRANTES FUL ESTILO) ────────────── */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 py-20 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1E5128] text-white text-xs font-extrabold rounded-full tracking-wider uppercase shadow-md">
            <Users className="w-4 h-4" /> 3. NUESTRO EQUIPO
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-serif-remoda text-stone-900 tracking-tight">
            Los 5 Creadores Detrás de <span className="text-[#C85A2A]">ReModa</span>
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Conoce a las mentes, manos y corazones apasionados que hacen posible la moda sostenible en Bolivia.
          </p>
        </div>

        {/* Grid of 5 Team Members with Full Style Glassmorphism & High-end Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-2 ${
                index === 0 ? 'lg:col-span-1 border-2 border-emerald-500/30' : ''
              }`}
            >
              {/* Photo Area with overlay gradient & badge */}
              <div className="relative aspect-[4/4] overflow-hidden bg-stone-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Role Badge Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold text-white ${member.badgeBg} shadow-lg backdrop-blur-md`}>
                    {member.badgeText}
                  </span>
                </div>

                {/* Social icons top right */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 transition-all backdrop-blur-md shadow-md"
                    title="Enviar Correo"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Name & Role overlay bottom */}
                <div className="absolute bottom-4 inset-x-4 z-10 text-white">
                  <h3 className="text-2xl font-bold font-serif-remoda leading-tight text-white drop-shadow-md">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-300 tracking-wide uppercase mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4 bg-white">
                
                <div className="space-y-3">
                  <div className="inline-block text-[11px] font-extrabold text-[#C85A2A] uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-lg">
                    {member.tag}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Quote Box */}
                <div className="bg-[#F9F6F0] p-3.5 rounded-2xl border border-stone-200 italic text-[11px] text-stone-700 font-serif-remoda leading-relaxed">
                  {member.quote}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Banner join movement */}
        <div className="bg-gradient-to-br from-[#1C251C] to-[#141C14] text-white p-10 rounded-3xl border border-[#2D3B2D] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-bold font-serif-remoda text-emerald-400">¿Quieres unirte o colaborar con nuestro equipo?</h3>
            <p className="text-stone-300 text-sm max-w-xl">Buscamos siempre artesanos, diseñadores y aliados comprometidos con el planeta.</p>
          </div>
          <button
            onClick={onOpenCustomModal}
            className="px-8 py-4 bg-[#C85A2A] hover:bg-[#b04d22] text-white font-bold text-xs rounded-2xl transition-all shadow-xl shrink-0 cursor-pointer"
          >
            Contactar al Equipo
          </button>
        </div>

      </section>

    </div>
  );
};

export default QuienesSomosPage;
