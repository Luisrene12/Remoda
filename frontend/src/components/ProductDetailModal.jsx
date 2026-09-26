import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RefreshCw, Sparkles, Heart, ShoppingBag, Send, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { isClothing, CLOTHING_SIZES, getAvailableColors, getColorHex, isLightColor } from '../utils/productHelpers';

export const ProductDetailModal = ({ product, onClose, isFavorite, onToggleFavorite }) => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();

  const isCloth = isClothing(product);
  const [selectedSize, setSelectedSize] = useState(isCloth ? (product?.size || 'M') : 'Talla única');
  const [selectedColor, setSelectedColor] = useState(product?.color || 'Original');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reviews state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  if (!product) return null;

  const images = product.images?.length > 0 
    ? product.images.map(img => img.image_url)
    : [product.primary_image?.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'Talla única'];

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Por favor inicia sesión para dejar una reseña");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await api.addReview(product.id, {
        user_id: currentUser.id,
        rating,
        comment,
      });
      if (res.review) {
        setReviewsList([res.review, ...reviewsList]);
        setComment('');
        setReviewMsg('¡Gracias por tu reseña!');
      }
    } catch (err) {
      setReviewsList([
        { id: Date.now(), rating, comment, user: { name: currentUser.name }, created_at: new Date().toISOString() },
        ...reviewsList
      ]);
      setComment('');
      setReviewMsg('¡Gracias por tu reseña!');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#FBF8F3] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E1D5] shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#EBE3D5] shadow-xs">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#1E5128] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Traceability Box (RF-015, RF-085) */}
            <div className="p-4 rounded-2xl bg-[#F3EDE3] border border-[#E4DAC9] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E5128] uppercase tracking-wider">
                <RefreshCw className="w-4 h-4" />
                <span>Origen y Trazabilidad Textil</span>
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                {product.origin_story || "Prenda rescatada y re-confeccionada artesanalmente bajo estándares de economía circular."}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#6E6659]">
                <div><span className="font-semibold text-[#1C1C1C]">Material:</span> {product.material || 'Denim'}</div>
                <div><span className="font-semibold text-[#1C1C1C]">Proceso:</span> {product.transformation_type || 'Upcycling'}</div>
                <div><span className="font-semibold text-[#1C1C1C]">Color:</span> {product.color || 'Original'}</div>
                <div><span className="font-semibold text-[#1C1C1C]">Estado:</span> {product.stock > 0 ? 'En Stock' : 'Agotado'}</div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category and Badges */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C85A2A] bg-[#C85A2A]/10 px-2.5 py-1 rounded-full">
                  {product.category?.name || 'Categoría'}
                </span>
                {product.badge && (
                  <span className="text-xs font-semibold text-white bg-[#1E5128] px-2.5 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-[#1C1C1C] font-serif-remoda">
                {product.name}
              </h1>

              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#1C1C1C]">
                    Bs. {parseFloat(product.price).toFixed(0)}
                  </span>
                  {product.original_price && (
                    <span className="text-base text-gray-400 line-through">
                      Bs. {parseFloat(product.original_price).toFixed(0)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sm bg-white px-3 py-1 rounded-full border border-[#E8E1D5] shadow-xs">
                  <Star className="w-4 h-4 fill-[#C85A2A] text-[#C85A2A]" />
                  <span className="font-bold">{product.rating || '4.8'}</span>
                  <span className="text-gray-500">({reviewsList.length || product.reviews_count || 0})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4E4A43] leading-relaxed">
                {product.description}
              </p>

              {/* Sizes & Colors Selection */}
              {isCloth ? (
                <div className="space-y-4 pt-1">
                  {/* SIZES FOR CLOTHING */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
                        Seleccionar Talla:
                      </span>
                      <span className="text-xs font-bold text-[#1E5128]">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CLOTHING_SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedSize === s
                              ? 'bg-[#1E5128] text-white shadow-md scale-105'
                              : 'bg-white border border-[#DDD5C7] text-[#4A4A4A] hover:border-[#1E5128]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COLORS FOR CLOTHING (Paleta de colores en cuadritos) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
                        Paleta de Color:
                      </span>
                      <span className="text-xs font-bold text-[#C85A2A] flex items-center gap-1.5">
                        <span 
                          className="w-3 h-3 rounded-xs border border-black/25 shrink-0 shadow-2xs" 
                          style={{ backgroundColor: getColorHex(selectedColor) }}
                        />
                        <span>{selectedColor}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                      {getAvailableColors(product).map((c) => {
                        const isCurrent = selectedColor === c;
                        const hex = getColorHex(c);
                        const isLight = isLightColor(hex);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`group relative w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border shadow-sm ${
                              isCurrent
                                ? 'ring-2 ring-offset-2 ring-[#1E5128] scale-110 shadow-md border-black/30'
                                : 'border-black/20 hover:scale-105 opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: hex }}
                            title={`Color: ${c}`}
                          >
                            {isCurrent && (
                              <Check className={`w-4 h-4 ${isLight ? 'text-stone-900' : 'text-white'} drop-shadow`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* ACCESORIOS / BOLSOS -> No sizes */
                <div className="p-3 bg-[#F5F2EB] rounded-2xl border border-[#E5DDD0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A746B] uppercase tracking-wider">
                    Categoría Accesorio / Bolso:
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-[#1C1C1C] border border-[#DDD5C7] shadow-xs">
                    Talla única
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">Cantidad:</span>
                <div className="flex items-center bg-white border border-[#DDD5C7] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-base font-semibold hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-center w-10">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 5, quantity + 1))}
                    className="px-3 py-1 text-base font-semibold hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7A746B]">({product.stock} disponibles)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#E8E1D5]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    addItem(product, quantity, isCloth ? selectedSize : 'Talla única', isCloth ? selectedColor : product.color);
                    onClose();
                  }}
                  className="flex-1 py-3 px-6 rounded-2xl bg-[#1E5128] hover:bg-[#163E1F] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al carrito — Bs. {(parseFloat(product.price) * quantity).toFixed(0)}</span>
                </button>

                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className={`p-3 rounded-2xl border transition-colors ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-[#DDD5C7] text-gray-600 hover:text-red-500'
                  }`}
                  title="Guardar en favoritos"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#7A746B] pt-2">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#1E5128]" /> Envíos a todo el país</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#1E5128]" /> Calidad ReModa Garantizada</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section (RF-129, RF-130) */}
        <div className="border-t border-[#E8E1D5] p-6 sm:p-10 bg-white/50 rounded-b-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
              Opiniones de la comunidad ({reviewsList.length})
            </h3>
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="p-4 bg-white rounded-2xl border border-[#E8E1D5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1C1C1C]">Tu calificación:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-[#C85A2A] text-[#C85A2A]' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué te pareció este producto y su origen reciclado? Comparte tu experiencia..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-[#DDD5C7] focus:outline-none focus:border-[#1E5128] bg-[#FDFCFB]"
            />

            {reviewMsg && <p className="text-xs text-[#1E5128] font-semibold">{reviewMsg}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReview || !comment.trim()}
                className="px-4 py-2 bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar opinión</span>
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {reviewsList.map((rev, idx) => (
              <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#EFE9DF] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1C1C1C]">{rev.user?.name || 'Cliente Verificado'}</span>
                  <div className="flex items-center gap-0.5 text-[#C85A2A]">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[#5A554E] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
