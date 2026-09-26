import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowRight, 
  Recycle, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Star, 
  Quote, 
  Mail, 
  MapPin, 
  ExternalLink,
  Eye,
  X,
  ShoppingBag,
  Heart,
  Tag,
  Leaf,
  Clock,
  Play,
  Pause,
  Award,
  Flame,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { DepthCarousel } from '../components/DepthCarousel';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

// ─── HERO SLIDES DEFINITION (Motion Slideshow) ─────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Ropa que cuenta',
    highlightTitle: 'una historia real.',
    subtitle: 'Cada prenda de ReModa renace del suprareciclaje. Confeccionamos piezas únicas con identidad, oficio artesanal y propósito sostenible.',
    imageLeft: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    imageRight: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80',
    tag: 'NUEVA COLECCIÓN CIRCULAR 2026',
    primaryCta: 'Explorar Catálogo',
    secondaryCta: 'Donar Ropa',
    badgeText: '100% Upcycled en Bolivia'
  },
  {
    id: 2,
    title: 'Edición Limitada',
    highlightTitle: 'Patchwork & Denim Art.',
    subtitle: 'Piezas exclusivas creadas a mano a partir de chaquetas vintage y denim recuperado. Calidad premium sin generar residuos textiles.',
    imageLeft: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
    imageRight: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
    tag: 'TENDENCIA SUSTENTABLE',
    primaryCta: 'Ver Chaquetas & Jeans',
    secondaryCta: 'Ver Lookbook 3D',
    badgeText: 'Piezas Irrepetibles'
  },
  {
    id: 3,
    title: 'Segunda Vida,',
    highlightTitle: 'Impacto Transparente.',
    subtitle: 'Transforma tu vestidor. Recogemos tu ropa usada en Santa Cruz, acumulas puntos para compras y mantenemos el planeta libre de desechos.',
    imageLeft: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    imageRight: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
    tag: 'RECOLECCIÓN GRATUITA EN DOMICILIO',
    primaryCta: 'Solicitar Recolección',
    secondaryCta: 'Conocer Proceso',
    badgeText: '+1.250kg Recolectados'
  }
];

export const HomePage = ({ 
  onSelectProduct, 
  onOpenCollectionModal, 
  onOpenCustomModal,
  setCurrentTab,
  onSelectCategory,
  favorites = [],
  onToggleFavorite
}) => {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    recollected_kg: '1.250kg',
    reused_kg: '850kg',
    created_products: '250+',
    donated_garments: '100',
  });
  
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideTimerRef = useRef(null);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Filter state for selection
  const [productFilter, setProductFilter] = useState('Todos');

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState(0);

  // Coupon Copy Toast
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  // Mock Products fallback
  const mockProducts = [
    {
      id: 1, name: 'Mochila Denim Revival', price: '185', original_price: '240', stock: 5,
      size: 'Talla única', color: 'Azul Índigo', material: 'Denim', transformation_type: 'Transformado',
      origin_story: 'Fabricada a partir de 2 jeans reutilizados', badge: 'Más vendido',
      rating: 4.9, reviews_count: 34, is_featured: true, is_new: false, is_active: true,
      category: { name: 'Mochilas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 2, name: 'Chaqueta Patchwork Bohème', price: '320', original_price: null, stock: 4,
      size: 'M', color: 'Terracota / Ocre', material: 'Mezcla', transformation_type: 'Innovado',
      origin_story: 'Ensamblada con retazos de 5 prendas distintas', badge: 'Edición limitada',
      rating: 4.9, reviews_count: 21, is_featured: true, is_new: false, is_active: true,
      category: { name: 'Chaquetas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 3, name: 'Bolso Cartera Terra', price: '145', original_price: null, stock: 6,
      size: 'Talla única', color: 'Naranja Canela', material: 'Algodón', transformation_type: 'Transformado',
      origin_story: 'Fabricado a partir de pantalones y camisas reutilizadas', badge: 'Nuevo',
      rating: 4.6, reviews_count: 48, is_featured: true, is_new: true, is_active: true,
      category: { name: 'Bolsos' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 4, name: 'Camiseta Re-Basic Ecru', price: '85', original_price: '110', stock: 15,
      size: 'L', color: 'Blanco Hueso', material: 'Algodón', transformation_type: 'Reutilizado',
      origin_story: 'Recuperada y esterilizada con tintes botánicos', badge: 'Nuevo',
      rating: 4.7, reviews_count: 15, is_featured: false, is_new: true, is_active: true,
      category: { name: 'Camisetas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 5, name: 'Jean Upcycled Cargo Flare', price: '210', original_price: null, stock: 5,
      size: 'S', color: 'Azul Medio / Verde Oliva', material: 'Denim', transformation_type: 'Innovado',
      origin_story: 'Confeccionado con 2 pantalones vaqueros vintage', badge: '¡Últimas!',
      rating: 4.85, reviews_count: 19, is_featured: false, is_new: true, is_active: true,
      category: { name: 'Jeans' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 6, name: 'Vestido Midi Denim Patch', price: '260', original_price: '310', stock: 3,
      size: 'M', color: 'Azul Índigo', material: 'Denim', transformation_type: 'Innovado',
      origin_story: 'Creado a partir de 3 faldas vaqueras donadas', badge: 'Edición limitada',
      rating: 4.95, reviews_count: 12, is_featured: false, is_new: true, is_active: true,
      category: { name: 'Vestidos' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 7, name: 'Chamarra Denim Trucker Re-Craft', price: '295', original_price: '350', stock: 5,
      size: 'L', color: 'Azul Deslavado', material: 'Denim', transformation_type: 'Innovado',
      origin_story: 'Rescatada de 2 chamarras vintage con acabados artesanales', badge: 'Tendencia',
      rating: 4.85, reviews_count: 14, is_featured: true, is_new: true, is_active: true,
      category: { name: 'Chaquetas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 8, name: 'Mochila Roll-Top Eco Canvas', price: '220', original_price: '270', stock: 6,
      size: 'Talla única', color: 'Verde Oliva / Mostaza', material: 'Algodón', transformation_type: 'Transformado',
      origin_story: 'Hecha a partir de carpas de lona militar y excedentes textiles', badge: 'Sostenible',
      rating: 4.90, reviews_count: 19, is_featured: true, is_new: true, is_active: true,
      category: { name: 'Mochilas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80' }
    }
  ];

  useEffect(() => {
    const loadHome = async () => {
      try {
        const data = await api.getHomeData();
        if (data.featured && data.featured.length > 0) setFeaturedProducts(data.featured);
        else setFeaturedProducts(mockProducts);
        if (data.new_products && data.new_products.length > 0) setNewProducts(data.new_products);
        else setNewProducts(mockProducts.slice(0, 6));
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.stats) setStats(data.stats);
      } catch (err) {
        setFeaturedProducts(mockProducts);
        setNewProducts(mockProducts.slice(0, 6));
      }
    };
    loadHome();
  }, []);

  // Automatic Hero Slide Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('REMODA10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  const defaultCategories = [
    { id: 1, name: 'Mochilas', slug: 'mochilas', products_count: 5, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Camisetas', slug: 'camisetas', products_count: 8, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Jeans', slug: 'jeans', products_count: 6, image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Bolsos', slug: 'bolsos', products_count: 4, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Chaquetas', slug: 'chaquetas', products_count: 7, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Accesorios', slug: 'accesorios', products_count: 9, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
    { id: 7, name: 'Vestidos', slug: 'vestidos', products_count: 3, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
    { id: 8, name: 'Carteras', slug: 'carteras', products_count: 5, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80' },
  ];

  const displayedCategories = categories.length > 0 ? categories : defaultCategories;

  // Filtered Selection Products
  const filteredProductsList = featuredProducts.filter((p) => {
    if (productFilter === 'Todos') return true;
    if (productFilter === '🔥 En oferta') return (p.original_price && Number(p.original_price) > Number(p.price)) || p.badge?.toLowerCase().includes('descuento') || p.badge?.toLowerCase().includes('off') || p.badge?.toLowerCase().includes('oferta');
    if (productFilter === 'Más vendidos') return p.badge?.toLowerCase().includes('más vendido') || p.rating >= 4.8;
    if (productFilter === 'Edición limitada') return p.badge?.toLowerCase().includes('limitada') || p.badge?.toLowerCase().includes('exclusivo');
    if (productFilter === 'Tendencia') return p.badge?.toLowerCase().includes('tendencia') || p.badge?.toLowerCase().includes('nuevo');
    return true;
  });

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-16 pb-20">

      {/* ─── 1. ULTRA-PREMIUM MOTION E-COMMERCE HERO SLIDER ───────────────────── */}
      <section 
        className="relative overflow-hidden rounded-b-3xl md:rounded-b-[48px] shadow-2xl bg-[#0D120E] min-h-[calc(100vh-4rem)] flex flex-col justify-between group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Dynamic Background Parallax Slide Images */}
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageLeft}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-90 contrast-105 scale-105 transition-transform duration-[12000ms] ease-out hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D120E]/95 via-[#0D120E]/75 to-[#0D120E]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D120E] via-transparent to-black/40" />
            </div>
          ))}
        </div>

        {/* Floating Slide Counter / Status Badge */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{activeSlideData.tag}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs text-stone-300">
            <span className="font-extrabold text-emerald-400">0{currentSlide + 1}</span>
            <span className="opacity-40">/</span>
            <span>0{HERO_SLIDES.length}</span>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-2 p-1 hover:text-white transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pausar diapositivas' : 'Iniciar reproducción'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Main Slide Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 my-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Dynamic Text Column with animations */}
            <div key={currentSlide} className="lg:col-span-7 space-y-6 animate-text-slide">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-remoda tracking-tight text-white leading-[1.12]">
                {activeSlideData.title} <br />
                <span className="text-gradient-gold drop-shadow-md">
                  {activeSlideData.highlightTitle}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-stone-200 max-w-xl leading-relaxed font-normal">
                {activeSlideData.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (currentSlide === 2) onOpenCollectionModal();
                    else setCurrentTab('catalogo');
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C85A2A] to-[#D97706] hover:from-[#B54B1E] hover:to-[#C85A2A] text-white font-bold text-sm tracking-wide transition-all shadow-xl hover:shadow-orange-950/60 active:scale-98 cursor-pointer flex items-center gap-2 group ring-2 ring-amber-400/20"
                >
                  <span>{activeSlideData.primaryCta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenCollectionModal}
                  className="px-8 py-4 rounded-2xl border border-white/25 hover:border-white text-white font-bold text-sm backdrop-blur-md transition-all hover:bg-white/10 active:scale-98 flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Recycle className="w-4 h-4 text-emerald-400" />
                  <span>{activeSlideData.secondaryCta}</span>
                </button>
              </div>

              {/* Trust Tag */}
              <div className="flex items-center gap-2 text-xs text-emerald-300/90 pt-1 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{activeSlideData.badgeText}</span>
              </div>
            </div>

            {/* Right Interactive Image Gallery Cards */}
            <div className="lg:col-span-5 flex gap-4 justify-center items-center relative">
              <div className="w-1/2 aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/40 group/card relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src={activeSlideData.imageLeft}
                  alt="Prenda ReModa"
                  className="w-full h-full object-cover object-center group-hover/card:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] text-white font-bold border border-white/15">
                  Handcrafted In Bolivia
                </span>
              </div>

              <div className="w-1/2 aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/40 group/card relative transform translate-y-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={activeSlideData.imageRight}
                  alt="Detalle ReModa"
                  className="w-full h-full object-cover object-center group-hover/card:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-[#1E5128]/90 backdrop-blur-md text-[11px] text-emerald-200 font-bold border border-emerald-400/30 flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" /> Zero Waste
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows & Slide Dots */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-[#C85A2A]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
                title={`Ir a la diapositiva ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-3 rounded-full bg-[#C85A2A] hover:bg-[#B54B1E] text-white shadow-lg shadow-orange-950/40 transition-all active:scale-90 cursor-pointer"
              title="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Impact Stats Bar Footer */}
        <div className="relative z-10 bg-gradient-to-r from-[#143B1D] via-[#1E5128] to-[#143B1D] border-t border-emerald-500/25 py-6 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black font-serif-remoda text-white">
                {stats.recollected_kg || '1.250kg'}
              </div>
              <div className="text-xs text-emerald-200/90 font-semibold">
                de ropa recolectada
              </div>
            </div>

            <div className="space-y-0.5 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-black font-serif-remoda text-white">
                {stats.reused_kg || '850kg'}
              </div>
              <div className="text-xs text-emerald-200/90 font-semibold">
                reutilizados activamente
              </div>
            </div>

            <div className="space-y-0.5 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-black font-serif-remoda text-white">
                {stats.created_products || '250+'}
              </div>
              <div className="text-xs text-emerald-200/90 font-semibold">
                productos creados
              </div>
            </div>

            <div className="space-y-0.5 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-black font-serif-remoda text-white">
                {stats.donated_garments || '100'}
              </div>
              <div className="text-xs text-emerald-200/90 font-semibold">
                prendas donadas
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─── 2. SHOPPING PROMISE BAR ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-[#E8E1D5] bg-[#E8E1D5] shadow-xl">
          {[
            { icon: ShieldCheck, title: 'Compra segura', text: 'Tus datos y pagos protegidos' },
            { icon: Truck, title: 'Envíos confiables', text: 'Recibe tu pedido donde estés' },
            { icon: CreditCard, title: 'Pago flexible', text: 'QR, transferencia y efectivo' },
            { icon: Recycle, title: 'Impacto real', text: 'Cada compra transforma una historia' },
          ].map(({ icon: Icon, title, text }, index) => (
            <div 
              key={title} 
              className="group bg-white px-5 py-6 flex items-center gap-3.5 hover:bg-[#FAF6F0] transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E3EFDF] to-emerald-100 text-[#1E5128] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-emerald-200/60">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1C1C] group-hover:text-[#1E5128] transition-colors">{title}</h3>
                <p className="text-[11px] text-[#7A746B] mt-0.5 font-medium">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. FEATURED SELECTION PRODUCTS ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E1D5] pb-5">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              SELECCIÓN DESTACADA
            </span>
            <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C] mt-2">
              Productos destacados
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['Todos', '🔥 En oferta', 'Más vendidos', 'Edición limitada', 'Tendencia'].map((tab) => (
              <button
                key={tab}
                onClick={() => setProductFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  productFilter === tab
                    ? 'bg-[#1E5128] text-white shadow-md shadow-emerald-950/20'
                    : 'bg-white hover:bg-stone-200/70 text-stone-700 border border-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}

            <button
              onClick={() => setCurrentTab('catalogo')}
              className="text-xs font-bold text-[#1E5128] hover:text-[#163E1F] flex items-center gap-1 group ml-2"
            >
              <span>Ver todos ({featuredProducts.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductsList.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onSelectProduct={(p) => setQuickViewProduct(p)}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* ─── 4. CIRCULAR WELCOME OFFER BANNER ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#143B1D] via-[#1E5128] to-[#0E2E16] px-6 py-10 sm:px-10 lg:px-14 lg:py-12 text-white shadow-2xl border border-emerald-500/20 group">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_85%_20%,#F4B183_0,transparent_40%),radial-gradient(circle_at_10%_100%,#0E3016_0,transparent_50%)]" />
          
          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-amber-300 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <Sparkles className="w-4 h-4 text-amber-300" /> Bienvenida circular
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-remoda leading-tight text-white">
              Tu primera historia <br />
              <span className="text-gradient-gold">comienza con un regalo.</span>
            </h2>
            
            <p className="text-sm text-stone-200 max-w-lg leading-relaxed">
              Obtén **10% de descuento** en tu primera compra usando el código <code className="bg-black/40 px-2 py-0.5 rounded font-mono text-amber-300 font-bold">REMODA10</code> y descubre piezas únicas con propósito.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => setCurrentTab('catalogo')} 
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#C85A2A] hover:bg-[#B54B1E] text-white text-sm font-bold transition-all hover:gap-3 shadow-lg cursor-pointer ring-2 ring-amber-300/20"
              >
                <span>Comprar ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyCoupon}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold backdrop-blur-md transition-all cursor-pointer"
              >
                {copiedCoupon ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-300" />}
                <span>{copiedCoupon ? '¡Código Copiado!' : 'Copiar cupón REMODA10'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. 3D DEPTH CAROUSEL - Lookbook & Stories ─────────────────────── */}
      <DepthCarousel onExplore={() => setCurrentTab('catalogo')} />

      {/* ─── 6. CATEGORIES GRID ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            EXPLORAR CATÁLOGO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C]">
            Categorías
          </h2>
          <p className="text-sm text-[#7A746B] max-w-md mx-auto">
            Encuentra tu estilo sustentable navegando por nuestras colecciones transformadas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayedCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug || cat.name.toLowerCase())}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer bg-stone-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-stone-200"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center justify-end text-center">
                <span className="text-lg sm:text-xl font-bold text-white tracking-wide drop-shadow-md group-hover:text-amber-200 transition-colors mb-1 font-serif-remoda">
                  {cat.name}
                </span>
                
                <span className="text-xs text-stone-300 font-semibold bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                  {cat.products_count !== undefined ? `${cat.products_count} prendas` : 'Explorar'}
                </span>

                <div className="mt-3 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 flex items-center gap-1">
                  <span>Explorar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. FREE CLOTHING RECYCLING / DONATION CTA ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E8E1D5] p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 aspect-4/3 rounded-3xl overflow-hidden bg-stone-100 shadow-md relative group">
            <img
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
              alt="Tu ropa tiene una segunda vida"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md text-xs font-bold text-stone-800 flex items-center gap-2">
              <Recycle className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Programa Oficial de Recolección en Bolivia</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E5128] bg-emerald-100/80 border border-emerald-200">
              <Recycle className="w-4 h-4" />
              <span>Recolección gratuita</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C] leading-tight">
              Tu ropa tiene <br />
              <span className="text-[#1E5128]">una segunda vida.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#5A554E] leading-relaxed font-normal">
              Solicita que pasemos a recoger tu ropa usada en Santa Cruz. La transformamos en productos nuevos en nuestro atelier y tú acumulas puntos para canjear por descuentos en tus compras.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {['✓ Gratis', '✓ Acumulas puntos', '✓ Impacto ambiental', '✓ Sin límite de prendas'].map((pill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#3E3830] bg-[#F7F4EE] border border-[#E3DCCE]"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenCollectionModal}
                className="px-8 py-4 rounded-2xl bg-[#1E5128] hover:bg-[#163E1F] text-white font-bold text-sm transition-all shadow-lg hover:shadow-emerald-950/30 active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Recycle className="w-4 h-4" />
                <span>Solicitar recolección</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 8. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ASÍ FUNCIONA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C] leading-tight">
              Comprar también <br />puede cambiar algo.
            </h2>
            <p className="text-sm text-[#7A746B] leading-relaxed max-w-md">
              Cada pedido conecta diseño, oficio artesanal y conciencia ambiental. Elige una pieza con historia y sigue su recorrido.
            </p>
            <button 
              onClick={() => setCurrentTab('catalogo')} 
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1E5128] hover:gap-3 transition-all cursor-pointer pt-2"
            >
              <span>Explorar la colección</span> 
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['01', 'Elige', 'Encuentra una pieza única que conecte contigo.'],
              ['02', 'Recibe', 'Selecciona tu forma de entrega y disfruta tu compra.'],
              ['03', 'Transforma', 'Tu compra mantiene materiales y oficios en movimiento.'],
            ].map(([number, title, text], index) => (
              <div 
                key={number} 
                className="relative bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 animate-fade-in-up" 
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="text-4xl font-serif-remoda font-black text-[#C85A2A]/30">{number}</span>
                <h3 className="text-lg font-bold font-serif-remoda text-[#1C1C1C] mt-3">{title}</h3>
                <p className="text-xs text-[#7A746B] leading-relaxed mt-2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. REAL CUSTOMER VOICES ────────────────────────────────────────── */}
      <section className="bg-[#F4EFE6] border-y border-[#E8E1D5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                HISTORIAS REALES
              </span>
              <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C] mt-2">
                Lo que dicen quienes ya eligieron ReModa
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1E5128] bg-emerald-100/70 px-4 py-2 rounded-2xl border border-emerald-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 
              <span>4.9/5 de nuestros clientes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ['María Fernanda', 'La mochila se siente única y está muy bien terminada. Me encanta saber de dónde viene.', 'Mochila Denim Revival'],
              ['Carlos Rojas', 'El proceso de compra fue sencillo y la entrega llegó antes de lo esperado.', 'Jean Upcycled Cargo'],
              ['Andrea Salvatierra', 'No parece ropa reciclada: parece una pieza de diseño con una historia increíble.', 'Bolso Patchwork Artisan'],
            ].map(([name, quote, product], index) => (
              <article 
                key={name} 
                className="bg-white rounded-3xl border border-[#E8E1D5] p-7 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#C85A2A]/40 mb-3" />
                  <p className="text-sm text-[#4A4A4A] leading-relaxed font-normal">“{quote}”</p>
                </div>

                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#F0EBE0]">
                  <div>
                    <div className="text-xs font-bold text-[#1C1C1C]">{name}</div>
                    <div className="text-[10px] text-[#7A746B] mt-0.5 font-medium">Compra verificada · {product}</div>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. NEW RECENT ARRIVALS ────────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between border-b border-[#E8E1D5] pb-5">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                RECIENTES
              </span>
              <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C] mt-2">
                Nuevos productos en catálogo
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('catalogo')}
              className="text-sm font-semibold text-[#1E5128] hover:text-[#163E1F] flex items-center gap-1 group"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                onSelectProduct={(p) => setQuickViewProduct(p)}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── 11. FLAGSHIP BOUTIQUE & LOCATION SANTA CRUZ ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#141412] border border-[#2D2D29] shadow-2xl">
          <div className="relative z-10 p-7 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
            <div className="space-y-3 text-white">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-[#E3A07A] bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <MapPin className="w-4 h-4 text-[#C85A2A]" /> Visítanos en Santa Cruz
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda">Flagship Boutique & Atelier ReModa</h2>
              <p className="text-sm text-white/70 max-w-xl">Av. San Martín esquina Calle 4 Este #250 · Barrio Equipetrol, Santa Cruz de la Sierra, Bolivia</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+San+Martin+esquina+Calle+4+Este+250+Santa+Cruz+Bolivia"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C85A2A] hover:bg-[#B54B1E] text-white text-sm font-bold transition-all hover:gap-3 shadow-lg cursor-pointer"
            >
              <span>Cómo llegar</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="relative h-[380px] sm:h-[480px] border-t border-white/10">
            <iframe
              title="Ubicación de ReModa Boutique Equipetrol"
              src="https://www.google.com/maps?q=Av.+San+Martin+esquina+Calle+4+Este+250,+Barrio+Equipetrol,+Santa+Cruz+de+la+Sierra,+Bolivia&z=17&output=embed"
              className="w-full h-full border-0 grayscale-[15%] contrast-105"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-5 left-5 px-4 py-2 rounded-2xl bg-[#141412]/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Boutique ReModa · Equipetrol</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12. FAQ & NEWSLETTER ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4 bg-white p-7 sm:p-9 rounded-[2rem] border border-[#E8E1D5] shadow-sm">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            PREGUNTAS FRECUENTES
          </span>
          <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C]">Compra con tranquilidad</h2>
          <p className="text-sm text-[#7A746B]">Todo lo importante antes de elegir tu próxima pieza.</p>
          
          <div className="space-y-3 pt-3">
            {[
              ['¿Cómo puedo pagar mi pedido?', 'Aceptamos QR, transferencia bancaria y pago en efectivo coordinado para entregas a domicilio o retiros en sucursal.'],
              ['¿Cuánto tarda el envío?', 'En Santa Cruz entregamos de 12 a 24 horas. Para otras ciudades enviamos por transporte express garantizado.'],
              ['¿Puedo solicitar la recolección de ropa?', 'Sí. Solicita una recolección gratuita desde nuestra web y acumula puntos de descuento.'],
              ['¿Las prendas son únicas?', 'Sí. Cada pieza se transforma en ediciones limitadas para conservar su carácter irrepetible y artesanal.'],
            ].map(([question, answer], index) => (
              <div key={question} className="border-b border-[#E8E1D5] last:border-b-0 pb-3">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)} 
                  className="w-full flex items-center justify-between gap-4 py-2.5 text-left text-sm font-bold text-[#1C1C1C] cursor-pointer hover:text-[#1E5128] transition-colors"
                >
                  <span>{question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-[#C85A2A] transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${openFaq === index ? 'grid-rows-[1fr] opacity-100 pt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className="overflow-hidden text-xs text-[#7A746B] leading-relaxed">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#141C15] p-8 sm:p-10 text-white min-h-[380px] flex flex-col justify-between shadow-2xl border border-emerald-900/40">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-emerald-500/20 animate-float-slow" />
          
          <div className="relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C85A2A] text-white flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold font-serif-remoda leading-tight">Novedades que sí valen la pena.</h2>
            <p className="text-sm text-stone-300 max-w-sm leading-relaxed">
              Recibe avisos de nuevas colecciones upcycled, piezas limitadas y ofertas exclusivas directamente en tu correo.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="relative mt-8">
            {newsletterSent ? (
              <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/30 px-5 py-4 text-sm text-emerald-100 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>¡Suscripción exitosa! Te notificaremos de las novedades.</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input 
                  type="email" 
                  required 
                  value={newsletterEmail} 
                  onChange={(e) => setNewsletterEmail(e.target.value)} 
                  placeholder="tu correo electrónico..." 
                  className="min-w-0 flex-1 rounded-2xl bg-white/10 border border-white/20 px-4 py-3.5 text-sm text-white placeholder:text-stone-400 outline-none focus:border-[#C85A2A] transition-colors" 
                />
                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C85A2A] hover:bg-[#B54B1E] px-6 py-3.5 text-sm font-bold text-white transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Suscribirme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ─── 13. QUICK VIEW MODAL OVERLAY ──────────────────────────────────── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 animate-pop-in overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={
                    quickViewProduct.primary_image?.image_url ||
                    quickViewProduct.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-extrabold text-[#1E5128]">
                    {quickViewProduct.category?.name || 'Upcycled'}
                  </span>
                  <h3 className="text-xl font-bold font-serif-remoda text-stone-900 mt-1">
                    {quickViewProduct.name}
                  </h3>
                </div>

                {quickViewProduct.origin_story && (
                  <p className="text-xs text-stone-600 italic bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                    🌱 {quickViewProduct.origin_story}
                  </p>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-stone-900">
                    Bs. {parseFloat(quickViewProduct.price).toFixed(0)}
                  </span>
                  {quickViewProduct.original_price && (
                    <span className="text-sm text-stone-400 line-through">
                      Bs. {parseFloat(quickViewProduct.original_price).toFixed(0)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div><strong>Talla:</strong> {quickViewProduct.size || 'Única'}</div>
                  <div><strong>Material:</strong> {quickViewProduct.material || 'Denim / Algodón'}</div>
                  <div><strong>Transformación:</strong> {quickViewProduct.transformation_type || 'Reutilizado'}</div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      addItem(quickViewProduct, 1);
                      setAddedAnimation(true);
                      setTimeout(() => setAddedAnimation(false), 1600);
                    }}
                    className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1E5128] hover:bg-[#163E1F] text-white shadow-lg'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Agregar al carrito</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      onSelectProduct(quickViewProduct);
                    }}
                    className="py-3.5 px-4 rounded-2xl text-sm font-bold border border-stone-300 hover:bg-stone-100 text-stone-800 transition-colors"
                  >
                    Ver detalle completo
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
