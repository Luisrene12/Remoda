import React, { useEffect, useState } from 'react';
import { ArrowRight, Recycle, Sparkles, Check, ChevronRight, ChevronDown, ShieldCheck, Truck, CreditCard, Star, Quote, Mail, MapPin, ExternalLink } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { DepthCarousel } from '../components/DepthCarousel';
import { api } from '../services/api';

export const HomePage = ({ 
  onSelectProduct, 
  onOpenCollectionModal, 
  onOpenCustomModal,
  setCurrentTab,
  onSelectCategory,
  favorites = [],
  onToggleFavorite
}) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    recollected_kg: '1.250kg',
    reused_kg: '850kg',
    created_products: '250+',
    donated_garments: '100',
  });
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  const mockProducts = [
    {
      id: 1, name: 'Mochila Denim Revival', price: '185', original_price: '240', stock: 5,
      size: 'Talla única', color: 'Azul Índigo', material: 'Denim', transformation_type: 'Transformado',
      origin_story: 'Fabricada a partir de 2 jeans reutilizados', badge: 'Más vendido',
      rating: 4.9, reviews_count: 24, is_featured: true, is_new: false, is_active: true,
      category: { name: 'Mochilas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 2, name: 'Camisa Boho Upcycled', price: '120', original_price: null, stock: 8,
      size: 'M', color: 'Blanco Vintage', material: 'Algodón', transformation_type: 'Innovado',
      origin_story: 'Renovada con bordados artesanales únicos', badge: 'Nuevo',
      rating: 4.7, reviews_count: 11, is_featured: true, is_new: true, is_active: true,
      category: { name: 'Camisetas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 3, name: 'Bolso Patchwork Artisan', price: '210', original_price: '280', stock: 3,
      size: 'Talla única', color: 'Multicolor', material: 'Mezcla', transformation_type: 'Transformado',
      origin_story: 'Elaborado con retazos de diferentes épocas', badge: 'Edición limitada',
      rating: 5.0, reviews_count: 8, is_featured: true, is_new: false, is_active: true,
      category: { name: 'Bolsos' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 4, name: 'Jean Cargo Remix', price: '155', original_price: '200', stock: 6,
      size: 'L', color: 'Negro Desteñido', material: 'Denim', transformation_type: 'Reutilizado',
      origin_story: 'Jean clásico rediseñado con bolsillos cargo adicionales', badge: null,
      rating: 4.8, reviews_count: 15, is_featured: true, is_new: true, is_active: true,
      category: { name: 'Jeans' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 5, name: 'Chaqueta Patchwork Eco', price: '280', original_price: '350', stock: 2,
      size: 'S', color: 'Marrón Tierra', material: 'Mezcla', transformation_type: 'Transformado',
      origin_story: 'Combinada de 5 chaquetas distintas rescatadas', badge: '¡Últimas!',
      rating: 4.9, reviews_count: 6, is_featured: true, is_new: false, is_active: true,
      category: { name: 'Chaquetas' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' }
    },
    {
      id: 6, name: 'Tote Bag Orgánico', price: '85', original_price: null, stock: 12,
      size: 'Talla única', color: 'Natural', material: 'Algodón', transformation_type: 'Innovado',
      origin_story: 'Confeccionado con telas recuperadas de talleres', badge: 'Nuevo',
      rating: 4.6, reviews_count: 19, is_featured: false, is_new: true, is_active: true,
      category: { name: 'Accesorios' },
      primary_image: { image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' }
    },
  ];

  useEffect(() => {
    const loadHome = async () => {
      try {
        const data = await api.getHomeData();
        if (data.featured && data.featured.length > 0) setFeaturedProducts(data.featured);
        else setFeaturedProducts(mockProducts.filter(p => p.is_featured));
        if (data.new_products && data.new_products.length > 0) setNewProducts(data.new_products);
        else setNewProducts(mockProducts.filter(p => p.is_new));
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.stats) setStats(data.stats);
      } catch (err) {
        setFeaturedProducts(mockProducts.filter(p => p.is_featured));
        setNewProducts(mockProducts.filter(p => p.is_new));
        console.log("Using default home data");
      }
    };
    loadHome();
  }, []);

  const defaultCategories = [
    { id: 1, name: 'Mochilas', slug: 'mochilas', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Camisetas', slug: 'camisetas', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Jeans', slug: 'jeans', image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Bolsos', slug: 'bolsos', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Chaquetas', slug: 'chaquetas', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Accesorios', slug: 'accesorios', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
  ];

  const displayedCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION matching Screenshot 1 (Full screen first fold) */}
      <section className="relative overflow-hidden rounded-b-3xl md:rounded-b-[40px] shadow-2xl bg-[#141412] min-h-[calc(100vh-5rem)] flex flex-col justify-between">
        
        {/* Background Workshop Image with light overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Atelier ReModa"
            className="w-full h-full object-cover object-center opacity-80 filter brightness-95 contrast-105 scale-105 transition-transform duration-[10000ms] hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141412]/90 via-[#141412]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141412]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 my-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-remoda tracking-tight text-white leading-[1.12]">
                Ropa que cuenta <br />
                <span className="text-[#C85A2A]">una historia.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#D4CDC3] max-w-xl leading-relaxed">
                Cada prenda de ReModa viene de un segundo chance. Compramos, transformamos y vendemos ropa reutilizada con identidad y propósito.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => setCurrentTab('catalogo')}
                  className="px-8 py-3.5 rounded-xl bg-[#C85A2A] hover:bg-[#B54B1E] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-orange-950/40 active:scale-98 cursor-pointer"
                >
                  Ver catálogo
                </button>
                <button
                  onClick={onOpenCollectionModal}
                  className="px-8 py-3.5 rounded-xl border border-white/30 hover:border-white text-white font-semibold text-sm transition-all hover:bg-white/10 active:scale-98 flex items-center gap-2 cursor-pointer"
                >
                  <span>Donar ropa</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Images Layout matching Screenshot 1 */}
            <div className="lg:col-span-5 flex gap-4 justify-center items-center">
              <div className="w-1/2 aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black/40">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                  alt="Artesano de confección ReModa"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="w-1/2 aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black/40 translate-y-4">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"
                  alt="Prendas en perchas de madera ReModa"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 2. IMPACT STATS BAR matching Screenshot 1 */}
        <div className="relative z-10 bg-[#1E5128] border-t border-[#296837] py-6 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold font-serif-remoda text-white">
                {stats.recollected_kg || '1.250kg'}
              </div>
              <div className="text-xs text-white/80 font-medium">
                de ropa recolectada
              </div>
            </div>

            <div className="space-y-0.5 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-bold font-serif-remoda text-white">
                {stats.reused_kg || '850kg'}
              </div>
              <div className="text-xs text-white/80 font-medium">
                reutilizados activamente
              </div>
            </div>

            <div className="space-y-0.5 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-bold font-serif-remoda text-white">
                {stats.created_products || '250+'}
              </div>
              <div className="text-xs text-white/80 font-medium">
                productos creados
              </div>
            </div>

            <div className="space-y-0.5 border-l border-white/15">
              <div className="text-2xl sm:text-3xl font-bold font-serif-remoda text-white">
                {stats.donated_garments || '100'}
              </div>
              <div className="text-xs text-white/80 font-medium">
                prendas donadas
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 3. SHOPPING PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-[#E8E1D5] bg-[#E8E1D5] shadow-xl">
          {[
            { icon: ShieldCheck, title: 'Compra segura', text: 'Tus datos y pagos protegidos' },
            { icon: Truck, title: 'Envíos confiables', text: 'Recibe tu pedido donde estés' },
            { icon: CreditCard, title: 'Pago flexible', text: 'QR, transferencia y efectivo' },
            { icon: Recycle, title: 'Impacto real', text: 'Cada compra transforma una historia' },
          ].map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="group bg-white px-5 py-6 flex items-center gap-3 hover:bg-[#FBF8F3] transition-colors animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="w-11 h-11 rounded-2xl bg-[#E3EFDF] text-[#1E5128] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1C1C]">{title}</h3>
                <p className="text-[11px] text-[#7A746B] mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS matching Screenshot 2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A] block mb-1">
              SELECCIÓN
            </span>
            <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C]">
              Productos destacados
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('catalogo')}
            className="text-sm font-semibold text-[#1E5128] hover:text-[#163E1F] flex items-center gap-1 group"
          >
            <span>Ver todos</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 5. FIRST PURCHASE OFFER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#1E5128] px-6 py-10 sm:px-10 lg:px-14 lg:py-12 text-white shadow-xl group">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_85%_20%,#F4B183_0,transparent_30%),radial-gradient(circle_at_10%_100%,#0E3016_0,transparent_38%)]" />
          <div className="absolute right-8 top-6 text-white/10 text-[9rem] font-serif-remoda leading-none select-none group-hover:rotate-6 transition-transform duration-700">%</div>
          <div className="relative max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-amber-200">
              <Sparkles className="w-4 h-4" /> Bienvenida circular
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda leading-tight">Tu primera historia comienza con un regalo.</h2>
            <p className="text-sm text-white/75 max-w-lg">Obtén 10% de descuento en tu primera compra y descubre piezas únicas que ya tienen una nueva vida.</p>
            <button onClick={() => setCurrentTab('catalogo')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C85A2A] hover:bg-[#B54B1E] text-white text-sm font-bold transition-all hover:gap-3 shadow-lg cursor-pointer">
              Comprar ahora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* 3D DEPTH CAROUSEL - Lookbook & Stories */}
      <DepthCarousel onExplore={() => setCurrentTab('catalogo')} />


      {/* 6. CATEGORIES GRID - Big centered cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A] block mb-2">
            EXPLORAR
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C]">
            Categorías
          </h2>
          <p className="text-sm text-[#7A746B] mt-2">Encuentra tu estilo sustentable</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
          {displayedCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug || cat.name.toLowerCase())}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer bg-[#222] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-65 group-hover:opacity-55"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              
              {/* Category label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center justify-end">
                <span className="text-lg sm:text-xl font-bold text-white tracking-wide text-center drop-shadow-lg group-hover:text-[#F3EDE3] transition-colors mb-1">
                  {cat.name}
                </span>
                {cat.products_count !== undefined && (
                  <span className="text-xs text-white/70 font-medium">
                    {cat.products_count} prendas
                  </span>
                )}
                <div className="mt-3 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Explorar →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 7. DONATION CTA BANNER matching Screenshot 4 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E8E1D5] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left image */}
          <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden bg-[#F2EDE4] shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
              alt="Tu ropa tiene una segunda vida"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#1E5128] bg-emerald-100/70">
              <Recycle className="w-3.5 h-3.5" />
              <span>Recolección gratuita</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C] leading-tight">
              Tu ropa tiene <br />
              una segunda vida.
            </h2>

            <p className="text-sm sm:text-base text-[#5A554E] leading-relaxed">
              Solicita que pasemos a recoger tu ropa usada. La transformamos en productos nuevos y tú acumulas puntos para descuentos en tu próxima compra.
            </p>

            {/* Pills matching Screenshot 4 */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {['✓ Gratis', '✓ Acumulas puntos', '✓ Impacto ambiental', '✓ Sin límite de prendas'].map((pill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#4E483E] bg-[#F7F4EE] border border-[#E3DC CE]"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenCollectionModal}
                className="px-8 py-3.5 rounded-xl bg-[#1E5128] hover:bg-[#163E1F] text-white font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Solicitar recolección
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A]">ASÍ FUNCIONA</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda text-[#1C1C1C] leading-tight">Comprar también puede cambiar algo.</h2>
            <p className="text-sm text-[#7A746B] leading-relaxed max-w-md">Cada pedido conecta diseño, oficio y conciencia. Elige una pieza con historia y sigue su recorrido.</p>
            <button onClick={() => setCurrentTab('catalogo')} className="inline-flex items-center gap-2 text-sm font-bold text-[#1E5128] hover:gap-3 transition-all cursor-pointer">Explorar la colección <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['01', 'Elige', 'Encuentra una pieza única que conecte contigo.'],
              ['02', 'Recibe', 'Selecciona tu forma de entrega y disfruta tu compra.'],
              ['03', 'Transforma', 'Tu compra mantiene materiales y oficios en movimiento.'],
            ].map(([number, title, text], index) => (
              <div key={number} className="relative bg-white rounded-3xl border border-[#E8E1D5] p-5 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 120}ms` }}>
                <span className="text-4xl font-serif-remoda text-[#C85A2A]/25">{number}</span>
                <h3 className="text-lg font-bold font-serif-remoda text-[#1C1C1C] mt-3">{title}</h3>
                <p className="text-xs text-[#7A746B] leading-relaxed mt-2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER VOICES */}
      <section className="bg-[#F4EFE6] border-y border-[#E8E1D5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A]">HISTORIAS REALES</span>
              <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C] mt-1">Lo que dicen quienes ya eligieron ReModa</h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1E5128]"><Star className="w-4 h-4 fill-current" /> 4.9/5 de nuestros clientes</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              ['María Fernanda', 'La mochila se siente única y está muy bien terminada. Me encanta saber de dónde viene.', 'Mochila Denim Revival'],
              ['Carlos Rojas', 'El proceso de compra fue sencillo y la entrega llegó antes de lo esperado.', 'Jean Cargo Remix'],
              ['Andrea Salvatierra', 'No parece ropa reciclada: parece una pieza de diseño con una historia increíble.', 'Bolso Patchwork Artisan'],
            ].map(([name, quote, product], index) => (
              <article key={name} className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-sm hover:shadow-lg transition-shadow duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Quote className="w-7 h-7 text-[#C85A2A]/40 mb-4" />
                <p className="text-sm text-[#4A4A4A] leading-relaxed min-h-20">“{quote}”</p>
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#F0EBE0]">
                  <div><div className="text-xs font-bold text-[#1C1C1C]">{name}</div><div className="text-[10px] text-[#7A746B] mt-1">Compra verificada · {product}</div></div>
                  <div className="flex gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* 10. RECENT PRODUCTS SECTION */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A] block mb-1">
                RECIENTES
              </span>
              <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C]">
                Nuevos productos
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('catalogo')}
              className="text-sm font-semibold text-[#1E5128] hover:text-[#163E1F] flex items-center gap-1 group"
            >
              <span>Ver todos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}


      {/* 11. LARGE STORE LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#161614] border border-[#2D2D29] shadow-2xl">
          <div className="relative z-10 p-7 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
            <div className="space-y-3 text-white">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#E3A07A]">
                <MapPin className="w-4 h-4" /> Visítanos en Santa Cruz
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-remoda">Flagship Boutique & Atelier ReModa</h2>
              <p className="text-sm text-white/70 max-w-xl">Av. San Martín esquina Calle 4 Este #250 · Barrio Equipetrol, Santa Cruz de la Sierra, Bolivia</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+San+Martin+esquina+Calle+4+Este+250+Santa+Cruz+Bolivia"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C85A2A] hover:bg-[#B54B1E] text-white text-sm font-bold transition-all hover:gap-3 shadow-lg"
            >
              Cómo llegar <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="relative h-[420px] sm:h-[540px] lg:h-[620px] border-t border-white/10">
            <iframe
              title="Ubicación de ReModa Boutique Equipetrol"
              src="https://www.google.com/maps?q=Av.+San+Martin+esquina+Calle+4+Este+250,+Barrio+Equipetrol,+Santa+Cruz+de+la+Sierra,+Bolivia&z=17&output=embed"
              className="w-full h-full border-0 grayscale-[15%] contrast-105"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-5 left-5 px-4 py-2 rounded-xl bg-[#141412]/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Boutique ReModa · Equipetrol
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ & NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A]">PREGUNTAS FRECUENTES</span>
          <h2 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C]">Compra con tranquilidad</h2>
          <p className="text-sm text-[#7A746B]">Todo lo importante antes de elegir tu próxima pieza.</p>
          <div className="space-y-2 pt-3">
            {[
              ['¿Cómo puedo pagar mi pedido?', 'Aceptamos QR, transferencia bancaria y pago en efectivo coordinado para entregas o recojos.'],
              ['¿Cuánto tarda el envío?', 'Coordinamos cada entrega según tu zona. Te confirmamos el tiempo estimado antes de despachar.'],
              ['¿Puedo solicitar la recolección de ropa?', 'Sí. Solicita una recolección gratuita y acumula puntos para futuras compras.'],
              ['¿Las prendas son únicas?', 'Sí. Cada pieza se transforma en pequeñas cantidades para conservar su carácter irrepetible.'],
            ].map(([question, answer], index) => (
              <div key={question} className="border-b border-[#E8E1D5] last:border-b-0">
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-bold text-[#1C1C1C] cursor-pointer">
                  {question}<ChevronDown className={`w-4 h-4 shrink-0 text-[#C85A2A] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${openFaq === index ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className="overflow-hidden text-xs text-[#7A746B] leading-relaxed">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-[#1C1C1C] p-7 sm:p-10 text-white min-h-[360px] flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-white/10 animate-float-slow" />
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-[#C85A2A]/40" />
          <div className="relative space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#C85A2A] flex items-center justify-center"><Mail className="w-5 h-5" /></div>
            <h2 className="text-3xl font-bold font-serif-remoda">Novedades que sí valen la pena.</h2>
            <p className="text-sm text-white/65 max-w-sm">Recibe nuevas colecciones, piezas limitadas y descuentos especiales directamente en tu correo.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="relative mt-8">
            {newsletterSent ? (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-300/30 px-4 py-3 text-sm text-emerald-100">¡Listo! Te avisaremos cuando haya novedades.</div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="tu correo electrónico" className="min-w-0 flex-1 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#C85A2A] transition-colors" />
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C85A2A] hover:bg-[#B54B1E] px-5 py-3 text-sm font-bold transition-colors cursor-pointer">Suscribirme <ArrowRight className="w-4 h-4" /></button>
              </div>
            )}
          </form>
        </div>
      </section>

    </div>
  );
};
