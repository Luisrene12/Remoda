import React, { useState } from 'react';
import { 
  MapPin, Clock, Phone, Navigation, Sparkles, CheckCircle2, 
  ExternalLink, MessageCircle, Copy, Check, Compass, Car, 
  CreditCard, Scissors, ShieldCheck, ArrowRight, Store, Calendar
} from 'lucide-react';

export const StoreLocationSection = () => {
  const [copied, setCopied] = useState(false);

  const flagship = {
    name: 'Flagship Boutique & Atelier ReModa',
    brandTag: 'Boutique Principal · Santa Cruz, Bolivia',
    address: 'Av. San Martín esquina Calle 4 Este #250',
    zone: 'Barrio Equipetrol',
    city: 'Santa Cruz de la Sierra, Bolivia',
    phone: '+591 3 3456789',
    whatsapp: '59171234567',
    scheduleWeek: 'Lunes a Sábado: 09:30 - 20:00 (Continuo)',
    scheduleWeekend: 'Domingos y Feriados: 11:00 - 18:00',
    status: 'Abierto hoy',
    statusDetail: 'Atención presencial continua',
    mapQuery: 'Av.+San+Martin,+Santa+Cruz+de+la+Sierra,+Bolivia',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Av.+San+Martin+Santa+Cruz+Bolivia&t=&z=16&ie=UTF8&iwloc=&output=embed',
    coverImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=80',
    features: [
      {
        title: 'Fitting Room Ecológico & Asesoría',
        desc: 'Espacio de probador amplio con asesoría personalizada en prendas únicas.'
      },
      {
        title: 'Punto Drop-Off de Donación (+50 Puntos)',
        desc: 'Trae tu ropa en desuso y acumula puntos ReModa instantáneos en tu cuenta.'
      },
      {
        title: 'Colecciones Cápsula & Piezas Exclusivas',
        desc: 'Descubre lanzamientos limitados que no se encuentran disponibles online.'
      },
      {
        title: 'Atelier de Confección & Ajustes a Medida',
        desc: 'Modistas expertos para ajustes de talla y personalizaciones al momento.'
      }
    ]
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${flagship.name}, ${flagship.address}, ${flagship.zone}, ${flagship.city}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* 1. Big Luxury Header Banner */}
      <div className="relative rounded-[36px] md:rounded-[48px] overflow-hidden bg-[#161614] border border-[#2D2D29] p-8 sm:p-14 lg:p-16 shadow-2xl text-white">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1E5128]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C85A2A]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Text (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-[#E3A07A] bg-[#C85A2A]/20 border border-[#C85A2A]/40 uppercase shadow-inner">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>NUESTRA TIENDA FÍSICA</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-remoda text-white leading-[1.1] tracking-tight">
              Visítanos en nuestra <br />
              <span className="text-[#E3A07A] italic">Flagship Boutique</span>
            </h2>

            <p className="text-base sm:text-lg text-[#D4CDC3] leading-relaxed max-w-2xl font-normal">
              Vive la experiencia completa de la moda circular en Santa Cruz. Toca las texturas, pruébate piezas exclusivas de suprareciclaje o entrega tus prendas en nuestro punto de recolección oficial.
            </p>

            {/* Quick Live Status Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-sm font-semibold text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{flagship.status} · {flagship.statusDetail}</span>
              </div>
              <div className="text-xs text-white/70 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#C85A2A]" />
                <span>{flagship.zone}, {flagship.city}</span>
              </div>
            </div>

          </div>

          {/* Right Boutique Hero Image Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group bg-black/40">
              <img
                src={flagship.coverImage}
                alt="ReModa Flagship Store"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E3A07A]">
                  Equipetrol · Santa Cruz
                </span>
                <p className="text-lg font-bold text-white mt-1">
                  Espacio sostenible de alta confección
                </p>
              </div>
            </div>

            {/* Floating Mini Badge */}
            <div className="absolute -bottom-4 -left-4 bg-[#1E5128] text-white px-5 py-2.5 rounded-2xl shadow-xl border border-emerald-400/30 flex items-center gap-2 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Punto de Donación Activo</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Main Large Details & Interactive Map Section */}
      <div className="bg-white rounded-[36px] md:rounded-[48px] border border-[#E3DC CE] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Address, Schedule, Amenities & Actions (6 Cols) */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-gradient-to-b from-white via-white to-[#FAF7F2]">
          
          <div className="space-y-6">
            
            {/* Title & Full Address */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A2A]">
                {flagship.brandTag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-remoda text-[#1C1C1C]">
                {flagship.name}
              </h3>
              <p className="text-sm sm:text-base text-[#5A544B] flex items-start gap-2 pt-1 font-medium">
                <MapPin className="w-5 h-5 text-[#C85A2A] shrink-0 mt-0.5" />
                <span>{flagship.address} · {flagship.zone}, {flagship.city}</span>
              </p>
            </div>

            {/* Grid for Schedule & Direct Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Horarios */}
              <div className="p-5 rounded-3xl bg-[#FBF8F3] border border-[#EAE3D5] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E5128] uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#1E5128]" />
                  <span>Horarios de Atención</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-[#1C1C1C]">{flagship.scheduleWeek}</p>
                  <p className="text-xs text-[#7A746B]">{flagship.scheduleWeekend}</p>
                </div>
              </div>

              {/* Teléfono & WhatsApp */}
              <div className="p-5 rounded-3xl bg-[#FBF8F3] border border-[#EAE3D5] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E5128] uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-[#1E5128]" />
                  <span>Atención Telefónica</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-[#1C1C1C]">{flagship.phone}</p>
                  <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                    WhatsApp: +{flagship.whatsapp}
                  </p>
                </div>
              </div>

            </div>

            {/* Features & Amenities */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A746B]">
                Servicios disponibles en la tienda:
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {flagship.features.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#EAE3D5] flex items-start gap-3.5 shadow-xs hover:border-[#1E5128] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#EBF5EE] text-[#1E5128] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C1C1C]">{feat.title}</p>
                      <p className="text-xs text-[#7A746B] mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Grand Action Buttons */}
          <div className="pt-6 border-t border-[#EAE3D5] flex flex-wrap gap-3.5 items-center">
            
            {/* Primary Google Maps Navigation */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${flagship.mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl bg-[#1E5128] hover:bg-[#163E1F] text-white text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-[#1E5128]/30 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Cómo llegar (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* WhatsApp Chat Button */}
            <a
              href={`https://wa.me/${flagship.whatsapp}?text=Hola%20ReModa,%20quisiera%20consultar%20sobre%20la%20Boutique%20Equipetrol`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold transition-all duration-300 shadow-md hover:shadow-[#25D366]/30 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>

            {/* Copy Address */}
            <button
              onClick={handleCopyAddress}
              className="px-5 py-4 rounded-2xl border border-[#DDD5C7] hover:border-[#1E5128] bg-white text-[#4E483E] hover:text-[#1E5128] text-xs sm:text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              title="Copiar dirección completa"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Dirección Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C8476]" />
                  <span>Copiar Dirección</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Side: Huge HD Google Map & GPS Navigator (6 Cols) */}
        <div className="lg:col-span-6 bg-[#161614] relative flex flex-col justify-between overflow-hidden min-h-[480px] lg:min-h-full">
          
          {/* Real Embedded Google Maps Full Viewport */}
          <div className="w-full h-full min-h-[420px] lg:min-h-[560px] relative">
            <iframe
              title={`Mapa ${flagship.name}`}
              src={flagship.mapEmbedUrl}
              className="w-full h-full min-h-[420px] lg:min-h-[560px] border-0 filter contrast-105"
              loading="lazy"
              allowFullScreen=""
            />

            {/* Floating Top Indicator */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-white border border-white/20 flex items-center gap-2 shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Flagship ReModa · Equipetrol</span>
            </div>

            {/* Floating Bottom Action Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#141412]/95 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1E5128] text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{flagship.address}</p>
                  <p className="text-xs text-white/70">{flagship.zone}, {flagship.city}</p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${flagship.mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-[#1C1C1C] hover:bg-[#F4EFE6] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
              >
                <span>Abrir GPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Bottom Luxury Guarantee Bar */}
          <div className="p-4 bg-[#1A1A18] border-t border-white/10 flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Boutique Oficial ReModa Bolivia</span>
            </span>
            <span className="text-white/60">Estacionamiento propio · Wifi libre</span>
          </div>

        </div>

      </div>

      {/* 3. Luxury Trust Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
        
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D5] shadow-xs flex items-center gap-4 hover:border-[#1E5128] transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5EE] text-[#1E5128] flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#1C1C1C]">Estacionamiento</h5>
            <p className="text-xs text-[#7A746B] mt-0.5">Gratuito para clientes</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D5] shadow-xs flex items-center gap-4 hover:border-[#1E5128] transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#FBF0EA] text-[#C85A2A] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#1C1C1C]">Puntos al Instante</h5>
            <p className="text-xs text-[#7A746B] mt-0.5">+50 pts por cada donación</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D5] shadow-xs flex items-center gap-4 hover:border-[#1E5128] transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5EE] text-[#1E5128] flex items-center justify-center shrink-0">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#1C1C1C]">Ajustes a Medida</h5>
            <p className="text-xs text-[#7A746B] mt-0.5">Modistas en boutique</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE3D5] shadow-xs flex items-center gap-4 hover:border-[#1E5128] transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#FBF0EA] text-[#C85A2A] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#1C1C1C]">Medios de Pago</h5>
            <p className="text-xs text-[#7A746B] mt-0.5">QR, Efectivo y Tarjetas</p>
          </div>
        </div>

      </div>

    </section>
  );
};
