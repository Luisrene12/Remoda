import React, { useState } from 'react';
import { Heart, Sparkles, ShoppingBag, Check, Eye, Leaf, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = React.memo(({ product, onSelectProduct, isFavorite, onToggleFavorite, index = 0 }) => {
  const { addItem } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const primaryImage = product.primary_image?.image_url 
    || product.images?.[0]?.image_url 
    || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80';

  const categoryName = product.category?.name || 'Upcycled';
  const transformationTag = product.transformation_type || 'Transformado';

  const hasDiscount = product.original_price && Number(product.original_price) > Number(product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : null;

  const rating = product.rating || 4.8;
  const reviewsCount = product.reviews_count;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 400);
    onToggleFavorite(product.id);
  };

  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#1E5128]/30 transition-all duration-500 flex flex-col cursor-pointer transform hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
      onClick={() => onSelectProduct(product)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'; }}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#C85A2A] shadow-lg shadow-[#C85A2A]/30 backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white bg-emerald-600 shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 cursor-pointer shadow-md ${
            heartPop ? 'scale-125' : 'hover:scale-110'
          } ${
            isFavorite
              ? 'bg-white text-rose-500 shadow-rose-200'
              : 'bg-white/85 text-stone-400 hover:bg-white hover:text-rose-500'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Quick view pill on hover */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-stone-800 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#1E5128]" />
            Vista rápida
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Category + tag */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-[#1E5128] uppercase tracking-widest">
            {categoryName}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            <Leaf className="w-2.5 h-2.5 text-emerald-600" />
            {transformationTag}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[15px] font-bold text-stone-900 group-hover:text-[#1E5128] transition-colors leading-snug line-clamp-2 font-serif-remoda -mt-1">
          {product.name}
        </h3>

        {/* Origin story */}
        {product.origin_story && (
          <p className="text-[11px] text-stone-500 line-clamp-1 italic border-l-2 border-[#C85A2A]/40 pl-2 -mt-1">
            {product.origin_story}
          </p>
        )}

        {/* Price + Rating */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-stone-900">
              Bs. {parseFloat(product.price).toFixed(0)}
            </span>
            {product.original_price && (
              <span className="text-xs text-stone-400 line-through font-medium">
                Bs. {parseFloat(product.original_price).toFixed(0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-bold">{rating}</span>
            {reviewsCount && <span className="text-stone-400">({reviewsCount})</span>}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 mt-1 ${
            addedAnimation
              ? 'bg-emerald-600 text-white scale-[1.02] shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-500'
              : 'bg-[#1E5128] hover:bg-[#163E1F] text-white hover:shadow-md hover:shadow-[#1E5128]/25'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 animate-bounce" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});
