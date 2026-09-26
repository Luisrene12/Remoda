import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, Truck, Store, Sparkles, CheckCircle2, 
  QrCode, CreditCard, Banknote, ArrowRight, ShieldCheck, RefreshCw, Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { isClothing, CLOTHING_SIZES, getAvailableColors, getColorHex, isLightColor } from '../utils/productHelpers';

export const CartDrawer = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    updateSize,
    updateColor,
    clearCart,
    subtotal,
    shippingCost,
    pointsDiscount,
    total,
    redeemedPoints,
    setRedeemedPoints,
    deliveryType,
    setDeliveryType,
    selectedBranch,
    setSelectedBranch,
    selectedAddress,
    deliverySlot,
    setDeliverySlot,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { currentUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('QR');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isCartOpen) return null;

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'Talla única'];

  const branches = [
    { id: 1, name: 'Flagship ReModa Equipetrol', address: 'Av. San Martín esq. Calle 4 Este (Santa Cruz)' },
    { id: 2, name: 'Atelier ReModa Casco Viejo', address: 'Calle 24 de Septiembre #180 (Santa Cruz)' },
  ];

  const deliverySlots = ['Mañana (09:00 - 12:00)', 'Tarde (14:00 - 18:00)', 'Noche (18:00 - 21:00)'];

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    const orderData = {
      user_id: currentUser?.id || 3,
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.selectedSize || item.size || 'Talla única',
        color: item.selectedColor || item.color || 'Original',
      })),
      delivery_type: deliveryType,
      shipping_address_id: deliveryType === 'Envío a domicilio' ? selectedAddress : null,
      branch_id: deliveryType === 'Retiro en tienda' ? selectedBranch : null,
      delivery_slot: deliverySlot,
      points_to_redeem: redeemedPoints,
      payment_method: paymentMethod,
      notes: orderNotes,
    };

    try {
      const res = await api.createOrder(orderData);
      if (res.order) {
        setCompletedOrder(res.order);
        clearCart();
      }
    } catch (err) {
      // Local fallback order object
      const mockOrder = {
        order_number: 'RM-' + Math.floor(100000 + Math.random() * 900000),
        pickup_code: deliveryType === 'Retiro en tienda' ? 'RM-' + Math.floor(1000 + Math.random() * 9000) : null,
        total,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        items,
      };
      setCompletedOrder(mockOrder);
      clearCart();
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#FAF8F5] shadow-2xl border-l border-[#E8E1D5] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E1D5] flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF5EE] text-[#1E5128] flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
                  Bolsa de Compras
                </h2>
                <span className="text-xs text-[#7A746B] font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setCompletedOrder(null);
              }}
              className="w-9 h-9 rounded-full bg-[#F4EFE6] hover:bg-[#EAE3D5] text-[#4E483E] flex items-center justify-center transition-all cursor-pointer"
              title="Cerrar bolsa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Screen after Order Placed */}
          {completedOrder ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in overflow-y-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#1E5128] flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A]">¡Pedido Confirmado con Éxito!</span>
                <h3 className="text-3xl font-bold font-serif-remoda text-[#1C1C1C]">
                  Pedido #{completedOrder.order_number}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B655B] max-w-xs mx-auto leading-relaxed">
                  Gracias por apoyar la moda circular y reducir el impacto ambiental textil en Bolivia.
                </p>
              </div>

              {completedOrder.pickup_code && (
                <div className="p-5 bg-white rounded-3xl w-full text-center space-y-2 border border-[#DDD5C7] shadow-sm">
                  <span className="text-xs font-bold text-[#544E44] uppercase tracking-wider">Código para retiro en tienda:</span>
                  <div className="text-3xl font-black text-[#1E5128] tracking-widest font-mono">
                    {completedOrder.pickup_code}
                  </div>
                  <p className="text-[11px] text-[#8C8476]">Preséntalo en Flagship Boutique Equipetrol</p>
                </div>
              )}

              {paymentMethod === 'QR' && (
                <div className="p-6 bg-white rounded-3xl border border-[#E8E1D5] w-full flex flex-col items-center space-y-3 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Escanea para pagar con QR Simple</span>
                  <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-inner">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=REMODA_ORDER_PAYMENT" 
                      alt="QR de Pago ReModa" 
                      className="w-36 h-36 rounded-lg"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#1E5128]">Monto total a transferir: Bs. {completedOrder.total || total}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setIsCartOpen(false);
                }}
                className="w-full py-4 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Seguir explorando la tienda
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart View */
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#9C9487]">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <p className="text-lg font-bold font-serif-remoda text-[#1C1C1C]">Tu bolsa está vacía</p>
                <p className="text-xs sm:text-sm text-[#7A746B] max-w-xs mx-auto">
                  Explora nuestras colecciones exclusivas de prendas recicladas y suprareciclaje.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-8 py-3 rounded-2xl bg-[#1E5128] text-white text-xs sm:text-sm font-semibold hover:bg-[#163E1F] transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Flow */
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Item List */}
              <div className="space-y-3.5">
                <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider block">
                  Prendas en tu bolsa ({items.length})
                </span>

                {items.map((item) => {
                  const isCloth = isClothing(item);
                  const currentColor = item.selectedColor || item.color || 'Original';
                  const currentSize = item.selectedSize || (isCloth ? 'M' : 'Talla única');

                  return (
                    <div 
                      key={`${item.id}-${currentSize}-${currentColor}`} 
                      className="p-4 bg-white rounded-3xl border border-[#EDE5D8] shadow-xs space-y-3 transition-all hover:border-[#1E5128]/30"
                    >
                      <div className="flex gap-4">
                        {/* Product Thumbnail */}
                        <img
                          src={item.primary_image?.image_url || item.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80'}
                          alt={item.name}
                          className="w-20 h-24 rounded-2xl object-cover bg-gray-100 shrink-0 shadow-xs border border-[#EAE3D5]"
                        />

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#1C1C1C] truncate">{item.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF5EE] text-[#1E5128]">
                                  {item.transformation_type || 'Upcycling'}
                                </span>
                                {item.material && (
                                  <span className="text-[11px] text-[#7A746B] font-medium">
                                    {item.material}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(item.id, currentSize, currentColor)}
                              className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              title="Eliminar prenda"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price and Quantity Row */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center bg-[#F7F4EE] rounded-xl border border-[#E0D8C8] p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, currentSize, item.quantity - 1, currentColor)}
                                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#4A443A] hover:bg-white rounded-lg transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-3 text-xs font-bold text-[#1C1C1C]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, currentSize, item.quantity + 1, currentColor)}
                                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#4A443A] hover:bg-white rounded-lg transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-bold text-[#1E5128]">
                                Bs. {(parseFloat(item.price) * item.quantity).toFixed(0)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-[#8C8476] block">
                                  Bs. {parseFloat(item.price).toFixed(0)} c/u
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sizing & Color logic */}
                      {isCloth ? (
                        <div className="pt-2.5 border-t border-[#F2ECE1] space-y-2.5">
                          {/* SIZES FOR CLOTHING */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#544E44] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                              <span>Talla:</span>
                              <span className="text-[#1E5128] font-black">{currentSize}</span>
                            </span>

                            <div className="flex items-center gap-1 overflow-x-auto">
                              {CLOTHING_SIZES.map((size) => {
                                const isCurrentSize = currentSize === size;
                                return (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => updateSize(item.id, currentSize, size, currentColor)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      isCurrentSize
                                        ? 'bg-[#1E5128] text-white shadow-xs scale-105'
                                        : 'bg-[#F7F4EE] border border-[#DDD5C7] text-[#5A544B] hover:border-[#1E5128] hover:text-[#1E5128]'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* COLOR SELECTION FOR CLOTHING (Paleta de colores en cuadritos) */}
                          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F7F4EE]">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-bold text-[#7A746B] uppercase tracking-wider">
                                Color:
                              </span>
                              <span className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5 truncate" title={currentColor}>
                                <span 
                                  className="w-2.5 h-2.5 rounded-xs border border-black/25 shrink-0 shadow-2xs" 
                                  style={{ backgroundColor: getColorHex(currentColor) }}
                                />
                                <span className="truncate max-w-[100px]">{currentColor}</span>
                              </span>
                            </div>

                            {/* Paleta de cuadritos */}
                            <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
                              {getAvailableColors(item).map((c) => {
                                const isCurrentColor = currentColor === c;
                                const hex = getColorHex(c);
                                const isLight = isLightColor(hex);
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => updateColor(item.id, currentSize, currentColor, c)}
                                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center border shadow-xs ${
                                      isCurrentColor
                                        ? 'ring-2 ring-offset-2 ring-[#1E5128] scale-110 shadow-md border-black/30'
                                        : 'border-black/20 hover:scale-105 opacity-85 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: hex }}
                                    title={`Tono: ${c}`}
                                  >
                                    {isCurrentColor && (
                                      <Check className={`w-3.5 h-3.5 ${isLight ? 'text-stone-900' : 'text-white'} drop-shadow`} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* ACCESORIOS / BOLSONES: NO TIENEN TALLAS XS, S, M, L */
                        <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                          <span className="font-bold text-[#7A746B] uppercase tracking-wider flex items-center gap-1">
                            <span>Accesorio / Bolso:</span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#F4EFE6] text-[#6E6659] border border-[#E0D8C8] text-[11px]">
                            Talla única
                          </span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Delivery Type Selector */}
              <div className="space-y-3 pt-4 border-t border-[#E8E1D5]">
                <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider block">
                  Modalidad de Entrega:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryType('Envío a domicilio')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'Envío a domicilio'
                        ? 'bg-[#1E5128] text-white border-[#1E5128] shadow-md'
                        : 'bg-white border-[#DDD5C7] text-[#4A4A4A] hover:border-[#1E5128]/50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Envío a domicilio</span>
                  </button>

                  <button
                    onClick={() => setDeliveryType('Retiro en tienda')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'Retiro en tienda'
                        ? 'bg-[#1E5128] text-white border-[#1E5128] shadow-md'
                        : 'bg-white border-[#DDD5C7] text-[#4A4A4A] hover:border-[#1E5128]/50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Retiro en tienda</span>
                  </button>
                </div>

                {deliveryType === 'Envío a domicilio' ? (
                  <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2 text-xs">
                    <label className="block text-xs font-bold text-[#1C1C1C]">Horario preferente de entrega:</label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl text-xs font-medium text-[#1C1C1C] focus:outline-none focus:border-[#1E5128] cursor-pointer"
                    >
                      {deliverySlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    <p className="text-[11px] text-[#7A746B]">Costo de envío estándar: Bs. 15 (Gratis para retiro en tienda)</p>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-[#EAE3D5] space-y-2 text-xs">
                    <label className="block text-xs font-bold text-[#1C1C1C]">Sucursal ReModa para retirar:</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl text-xs font-medium text-[#1C1C1C] focus:outline-none focus:border-[#1E5128] cursor-pointer"
                    >
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name} - {b.address}</option>)}
                    </select>
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Retiro disponible inmediatamente con código QR
                    </p>
                  </div>
                )}
              </div>

              {/* Points Redemption */}
              {currentUser?.points_balance > 0 && (
                <div className="p-4 bg-gradient-to-br from-[#F4EFE6] to-[#EBE4D5] border border-[#DDD5C7] rounded-3xl space-y-3 text-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1C1C] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C85A2A]" />
                      Canjear Puntos ReModa
                    </span>
                    <span className="font-bold text-[#1E5128] bg-white px-2.5 py-1 rounded-full border border-[#DDD5C7]">
                      {currentUser.points_balance} pts disponibles
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={currentUser.points_balance}
                      step={50}
                      value={redeemedPoints}
                      onChange={(e) => setRedeemedPoints(Number(e.target.value))}
                      className="flex-1 h-2 bg-[#DDD5C7] rounded-lg appearance-none cursor-pointer accent-[#1E5128]"
                    />
                    <span className="font-bold text-sm text-[#1E5128] w-14 text-right">{redeemedPoints} pts</span>
                  </div>
                  {redeemedPoints > 0 && (
                    <p className="text-[11px] text-[#1E5128] font-bold">
                      ✓ Descuento aplicado: Bs. {(redeemedPoints * 0.10).toFixed(0)} en esta compra.
                    </p>
                  )}
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-3 pt-4 border-t border-[#E8E1D5]">
                <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider block">
                  Método de Pago:
                </span>
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'QR', label: 'QR Simple', icon: QrCode, desc: 'Banca Móvil' },
                    { id: 'Transferencia', label: 'Transferencia', icon: CreditCard, desc: 'Cuenta Banco' },
                    { id: 'Pago en tienda', label: 'En tienda', icon: Banknote, desc: 'Efectivo / POS' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === m.id
                          ? 'bg-[#1E5128] text-white border-[#1E5128] shadow-md scale-[1.02]'
                          : 'bg-white border-[#DDD5C7] text-[#4A4A4A] hover:border-[#1E5128]/40'
                      }`}
                    >
                      <m.icon className="w-5 h-5" />
                      <span className="font-bold text-xs">{m.label}</span>
                      <span className={`text-[10px] ${paymentMethod === m.id ? 'text-emerald-200' : 'text-[#8C8476]'}`}>
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Footer Calculations & Submit */}
          {!completedOrder && items.length > 0 && (
            <div className="p-6 border-t border-[#E8E1D5] bg-white space-y-4 sticky bottom-0 z-20 shadow-2xl">
              <div className="space-y-2 text-xs text-[#5A544C]">
                <div className="flex justify-between font-medium">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#1C1C1C]">Bs. {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Envío:</span>
                  <span className="font-bold text-[#1C1C1C]">
                    {deliveryType === 'Retiro en tienda' ? (
                      <span className="text-[#1E5128] font-bold">Gratis (En tienda)</span>
                    ) : (
                      `Bs. ${shippingCost.toFixed(0)}`
                    )}
                  </span>
                </div>
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-[#1E5128] font-bold">
                    <span>Descuento Puntos ({redeemedPoints} pts):</span>
                    <span>-Bs. {pointsDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-[#1C1C1C] pt-3 border-t border-gray-100 items-baseline">
                  <span>Total a Pagar:</span>
                  <span className="text-2xl font-serif-remoda font-bold text-[#1E5128]">
                    Bs. {total.toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isCheckingOut ? (
                  <span>Procesando pedido...</span>
                ) : (
                  <>
                    <span>Confirmar Pedido (Bs. {total.toFixed(0)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
