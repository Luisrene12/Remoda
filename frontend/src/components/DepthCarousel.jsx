import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const DepthCarousel = ({ onExplore }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: 'Denim Revival',
      subtitle: 'Jeans y chaquetas reinventadas con patrones geométricos únicos.',
      tag: 'Upcycling Creativo',
      badge: 'Colección 2026',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 2,
      title: 'Alta Costura Circular',
      subtitle: 'Vestidos y prendas de gala confeccionadas con retazos nobles.',
      tag: 'Elegancia Sostenible',
      badge: 'Edición Limitada',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      title: 'Accesorios & Bolsos',
      subtitle: 'Mochilas y carteras de cuero y lonas de alta resistencia.',
      tag: 'Artesanía Local',
      badge: '100% Hecho a Mano',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 4,
      title: 'Patchwork & Streetwear',
      subtitle: 'Estilo urbano con identidad propia a partir de fibras recicladas.',
      tag: 'Impacto Positivo',
      badge: 'Tendencia Eco',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const total = slides.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Continuous Automatic Transition every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3500);

    return () => clearInterval(timer);
  }, [total, activeIndex]);

  // Compute 3D depth styles based on relative offset
  const getCardStyle = (index) => {
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total; // e.g. -1, 0, 1, 2

    // diff = 0 is active (center)
    // diff = 1 is right (+1)
    // diff = -1 is left (-1)
    // diff = 2 is background center/back (+2)

    if (diff === 0) {
      return {
        transform: 'translateX(0%) scale(1) translateZ(0px)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(100%)',
        pointerEvents: 'auto',
      };
    } else if (diff === 1) {
      return {
        transform: 'translateX(55%) scale(0.85) translateZ(-60px) rotateY(-12deg)',
        zIndex: 20,
        opacity: 0.82,
        filter: 'brightness(75%) blur(0.3px)',
        pointerEvents: 'auto',
      };
    } else if (diff === -1) {
      return {
        transform: 'translateX(-55%) scale(0.85) translateZ(-60px) rotateY(12deg)',
        zIndex: 20,
        opacity: 0.82,
        filter: 'brightness(75%) blur(0.3px)',
        pointerEvents: 'auto',
      };
    } else {
      return {
        transform: 'translateX(0%) scale(0.7) translateZ(-120px) translateY(-10px)',
        zIndex: 10,
        opacity: 0.45,
        filter: 'brightness(55%) blur(1px)',
        pointerEvents: 'none',
      };
    }
  };

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#C85A2A] bg-orange-100/70 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOOKBOOK 3D</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C]">
            Historias de Transformación
          </h2>
          <p className="text-sm text-[#7A746B] mt-1">
            Explora las piezas y el arte del suprareciclaje de ReModa
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Anterior"
            className="w-11 h-11 rounded-full bg-white border border-[#DDD5C7] hover:border-[#1E5128] hover:bg-[#1E5128] hover:text-white text-[#1C1C1C] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Siguiente"
            className="w-11 h-11 rounded-full bg-white border border-[#DDD5C7] hover:border-[#1E5128] hover:bg-[#1E5128] hover:text-white text-[#1C1C1C] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Carousel Stage */}
      <div 
        className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center overflow-hidden py-4"
        style={{ perspective: '1200px' }}
      >
        {slides.map((slide, index) => {
          const style = getCardStyle(index);
          const isCurrent = index === activeIndex;

          return (
            <div
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              style={style}
              className="absolute w-[280px] sm:w-[360px] md:w-[460px] h-[340px] sm:h-[400px] md:h-[440px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer group select-none border border-white/20 bg-[#161614]"
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                  {slide.tag}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C85A2A] text-white shadow-md">
                  {slide.badge}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 flex flex-col justify-end">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-remoda text-white tracking-wide drop-shadow-md">
                  {slide.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/85 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                  {slide.subtitle}
                </p>

                {isCurrent && (
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between animate-fade-in">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Disponible en catálogo
                    </span>
                    {onExplore && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExplore();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#1C1C1C] text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ver prendas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots Indicator with Progress Animation */}
      <div className="flex items-center justify-center gap-2.5 pt-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Ir a slide ${idx + 1}`}
            className="relative h-2.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
            style={{ width: idx === activeIndex ? '2.5rem' : '0.625rem' }}
          >
            <div className={`w-full h-full ${idx === activeIndex ? 'bg-[#E5DDD0]' : 'bg-[#DDD5C7] hover:bg-[#8C8476]'}`}>
              {idx === activeIndex && (
                <div 
                  key={activeIndex} 
                  className="h-full bg-[#1E5128] rounded-full animate-[progress_3.5s_linear_forwards]"
                  style={{
                    animation: 'progressFill 3.5s linear forwards'
                  }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};
