import React from 'react';
import { Users, Mail, Sparkles, Heart, ArrowRight, Star, ShieldCheck } from 'lucide-react';

export const EquipoView = ({ setCurrentTab, onOpenCustomModal }) => {
  const teamMembers = [
    {
      id: 1,
      name: 'Vivian Heidy Heredia Tangara',
      role: 'Fundadora & CEO',
      tag: 'Liderazgo & Visión Circular',
      image: '/images/team/vivian-heidy.jpg',
      bio: 'Visionaria boliviana apasionada por la sostenibilidad. Tras 8 años en la industria textil internacional, volvió a Bolivia para crear ReModa y erradicar la basura textil.',
      quote: '"La verdadera elegancia no destruye el planeta; lo regenera con cada prenda."',
      email: 'sofia@remoda.bo',
      badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-700',
      badgeText: '★ Fundadora',
    },
    {
      id: 2,
      name: 'Luis Rene Sequeiro Khonangh',
      role: 'Director de Diseño Upcycling',
      tag: 'Alta Costura Reciclada',
      image: '/images/team/luis-rene.jpeg',
      bio: 'Diseñador de moda con especialización en confección de autor. Luis Rene transforma prendas en desuso en chaquetas y abrigos vanguardistas de nivel de pasarela.',
      quote: '"No vemos ropa vieja; vemos lienzos listos para ser reinventados."',
      email: 'rene@remoda.bo',
      badgeBg: 'bg-gradient-to-r from-[#C85A2A] to-amber-600',
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
      email: 'camila@remoda.bo',
      badgeBg: 'bg-gradient-to-r from-teal-600 to-emerald-700',
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
      email: 'jacinto@remoda.bo',
      badgeBg: 'bg-gradient-to-r from-[#1E5128] to-emerald-900',
      badgeText: 'Maestro Sastre',
    },
    {
      id: 5,
      name: 'Gloria Suarez',
      role: 'Gerente de Comunidad y Alianzas',
      tag: 'Impacto Social & Donaciones',
      image: '/images/team/companera2.jpg',
      bio: 'Especialista en desarrollo comunitario. Coordina la red de donantes, talleres sociales y alianzas con colectivos locales de economía circular.',
      quote: '"ReModa es de todos: donantes, creadores y clientes que eligen con el corazón."',
      email: 'lucia@remoda.bo',
      badgeBg: 'bg-gradient-to-r from-purple-600 to-indigo-700',
      badgeText: 'Comunidad',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F3FB] text-stone-900 pb-24 animate-in fade-in duration-500">

      {/* Hero Banner — Ultra Chic Dark Violet Fashion Theme */}
      <section className="relative bg-gradient-to-br from-[#120B1C] via-[#381B54] to-[#1D1429] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold bg-purple-600 text-white shadow-xl shadow-purple-900/50 backdrop-blur-md border border-purple-300">
            <Users className="w-4 h-4 fill-white animate-bounce" />
            3. NUESTRO EQUIPO · LOS 5 CREADORES
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif-remoda tracking-tight leading-tight text-white drop-shadow-lg">
            Conoce a Nuestro <span className="text-purple-300 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-400">Equipo Creador</span>
          </h1>

          <p className="max-w-3xl mx-auto text-purple-100/90 text-base sm:text-lg leading-relaxed font-light">
            Las mentes, manos y corazones apasionados que hacen posible la revolución de la moda circular en Bolivia.
          </p>
        </div>
      </section>

      {/* Grid of 5 Team Members */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-3 ${index === 0 ? 'lg:col-span-1 border-2 border-purple-500/30' : ''
                }`}
            >
              {/* Photo Area with glowing aura effect */}
              <div className="relative aspect-[4/4] overflow-hidden bg-purple-950">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Role Badge Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold text-white ${member.badgeBg} shadow-lg backdrop-blur-md`}>
                    {member.badgeText}
                  </span>
                </div>

                {/* Email contact top right */}
                <div className="absolute top-4 right-4 z-10">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-purple-900 transition-all backdrop-blur-md shadow-md block hover:scale-110"
                    title="Contactar por correo"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                {/* Name & Role overlay bottom */}
                <div className="absolute bottom-4 inset-x-4 z-10 text-white space-y-0.5">
                  <h3 className="text-2xl font-bold font-serif-remoda leading-tight text-white drop-shadow-md">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-purple-300 tracking-wider uppercase">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4 bg-white">

                <div className="space-y-3">
                  <div className="inline-block text-[11px] font-extrabold text-purple-800 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                    {member.tag}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Quote Box */}
                <div className="bg-[#FAF7FD] p-4 rounded-2xl border border-purple-100 italic text-[11px] text-purple-900 font-serif-remoda leading-relaxed">
                  {member.quote}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Join team CTA banner */}
        <div className="bg-gradient-to-br from-[#120B1C] to-[#2E1647] text-white p-10 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-bold font-serif-remoda text-purple-300">¿Quieres colaborar con nuestro equipo?</h3>
            <p className="text-purple-100/80 text-sm max-w-xl">Buscamos siempre artesanos, diseñadores y aliados apasionados por la economía circular.</p>
          </div>
          <button
            onClick={onOpenCustomModal}
            className="px-8 py-4 bg-gradient-to-r from-[#C85A2A] to-amber-600 hover:scale-105 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xl shrink-0 cursor-pointer"
          >
            Contactar al Equipo
          </button>
        </div>

      </section>

    </div>
  );
};

export default EquipoView;
