import React, { useState, useEffect } from 'react';
import { Package, Recycle, Sparkles, Scissors, MapPin, User, CheckCircle2, Clock, Truck, Store, RefreshCw, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const CustomerProfilePage = ({ onOpenCollectionModal, onOpenCustomModal }) => {
  const { currentUser, addAddress } = useAuth();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState('pedidos'); // 'pedidos', 'recolecciones', 'puntos', 'personalizaciones', 'direcciones'
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // New address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Casa');
  const [newAddressText, setNewAddressText] = useState('');
  const [newCity, setNewCity] = useState('Santa Cruz');
  const [newZone, setNewZone] = useState('Equipetrol');
  const [newRef, setNewRef] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        const [ordersRes, colRes, custRes] = await Promise.all([
          api.getUserOrders(currentUser.id),
          api.getUserCollections(currentUser.id),
          api.getCustomRequests({ user_id: currentUser.id }),
        ]);

        if (ordersRes.orders) setOrders(ordersRes.orders);
        if (colRes.collections) setCollections(colRes.collections);
        if (custRes.custom_requests) setCustomRequests(custRes.custom_requests);
      } catch (err) {
        console.log("Error loading customer profile data:", err);
      }
    };

    loadData();
  }, [currentUser]);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const addr = {
      title: newTitle,
      address: newAddressText,
      city: newCity,
      zone: newZone,
      reference: newRef,
      is_default: false,
    };

    try {
      await api.addAddress(currentUser.id, addr);
    } catch (err) {
      // Local fallback
    }
    addAddress(addr);
    setShowAddressModal(false);
    setNewAddressText('');
    setNewRef('');
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Entregado':
      case 'Retirado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'En camino':
      case 'Listo para retirar':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En preparación':
      case 'Confirmado':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1E5128] text-white flex items-center justify-center font-bold text-2xl font-serif-remoda shadow-md">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif-remoda text-[#1C1C1C]">
                {currentUser?.name} {currentUser?.last_name || ''}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#1E5128]">
                Cliente Circular
              </span>
            </div>
            <p className="text-xs text-[#7A746B]">{currentUser?.email} · {currentUser?.phone || '+591 77889900'}</p>
          </div>
        </div>

        {/* Points Capsule */}
        <div className="p-4 bg-[#F7F4EE] border border-[#E3DC CE] rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#C85A2A]/10 text-[#C85A2A] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#7A746B] uppercase tracking-wider block">Puntos ReModa</span>
            <span className="text-xl font-black text-[#1E5128]">{currentUser?.points_balance || 0} pts</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E1D5]">
        {[
          { id: 'pedidos', label: 'Mis Pedidos', icon: Package, count: orders.length },
          { id: 'recolecciones', label: 'Mis Donaciones', icon: Recycle, count: collections.length },
          { id: 'puntos', label: 'Puntos y Recompensas', icon: Sparkles },
          { id: 'personalizaciones', label: 'Personalizaciones', icon: Scissors, count: customRequests.length },
          { id: 'direcciones', label: 'Direcciones', icon: MapPin },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1E5128] text-white shadow-sm'
                : 'bg-white text-[#4A4A4A] border border-[#DDD5C7] hover:border-[#1E5128]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 1. ORDERS TAB (RF-051, RF-052, RF-053) */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E1D5] space-y-3">
              <Package className="w-12 h-12 text-[#CBBFA8] mx-auto" />
              <p className="text-base font-semibold text-[#1C1C1C]">Aún no tienes pedidos registrados</p>
              <p className="text-xs text-[#7A746B]">Tus compras de moda upcycled aparecerán aquí con seguimiento en tiempo real.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#7A746B]">Pedido</span>
                      <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C]">
                        #{order.order_number}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Tracking Timeline Bar (RF-033) */}
                  <div className="py-2">
                    <div className="flex justify-between text-[10px] text-[#7A746B] mb-1 font-semibold">
                      <span>Confirmado</span>
                      <span>En taller</span>
                      <span>{order.delivery_type === 'Retiro en tienda' ? 'Listo para retirar' : 'En camino'}</span>
                      <span>Entregado</span>
                    </div>
                    <div className="w-full h-2 bg-[#EFE9DF] rounded-full overflow-hidden flex">
                      <div className={`h-full bg-[#1E5128] transition-all duration-500 ${
                        order.status === 'Pendiente' ? 'w-1/6' :
                        order.status === 'Confirmado' ? 'w-2/6' :
                        order.status === 'En preparación' ? 'w-3/6' :
                        order.status === 'Listo' || order.status === 'En camino' || order.status === 'Listo para retirar' ? 'w-5/6' :
                        'w-full'
                      }`} />
                    </div>
                  </div>

                  {/* Delivery & Items info */}
                  <div className="p-3 bg-[#F7F4EE] rounded-2xl text-xs space-y-1.5 text-[#5A544C]">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#1C1C1C]">Modalidad:</span>
                      <span>{order.delivery_type}</span>
                    </div>
                    {order.pickup_code && (
                      <div className="flex justify-between text-[#1E5128] font-bold">
                        <span>Código de Retiro:</span>
                        <span>{order.pickup_code}</span>
                      </div>
                    )}
                    {order.delivery_driver && (
                      <div className="flex justify-between">
                        <span>Repartidor asignado:</span>
                        <span>{order.delivery_driver}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Total Pagado:</span>
                      <span className="font-bold text-[#1C1C1C]">Bs. {parseFloat(order.total).toFixed(0)} ({order.payment_method})</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-[#1C1C1C] font-medium">{item.quantity}x {item.product_name}</span>
                        <span className="text-[#7A746B]">Bs. {parseFloat(item.subtotal).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons (RF-053 Repeat Order, Digital Receipt) */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        order.items?.forEach(it => {
                          if (it.product) addItem(it.product, it.quantity, it.product_size);
                        });
                        alert("¡Prendas agregadas nuevamente a tu carrito!");
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#F7F4EE] hover:bg-[#EAE3D5] text-[#1C1C1C] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#1E5128]" />
                      <span>Repetir pedido</span>
                    </button>

                    <button
                      onClick={() => alert(`Comprobante Digital\nPedido: #${order.order_number}\nMonto: Bs. ${order.total}\nMétodo: ${order.payment_method}\nEstado: ${order.payment_status}`)}
                      className="px-4 py-2 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#4A4A4A] hover:bg-gray-50"
                    >
                      Comprobante
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. RECOLLECTIONS / DONATIONS TAB (RF-059, RF-060) */}
      {activeTab === 'recolecciones' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Mis Recolecciones de Ropa</h2>
              <p className="text-xs text-[#7A746B]">Historial de prendas donadas y transformadas para economía circular.</p>
            </div>
            <button
              onClick={onOpenCollectionModal}
              className="px-4 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva donación</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((col) => (
              <div key={col.id} className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-[#1E5128]" />
                    <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C]">
                      #{col.code}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getOrderStatusColor(col.status)}`}>
                    {col.status}
                  </span>
                </div>

                <div className="p-3.5 bg-[#F7F4EE] rounded-2xl text-xs space-y-1.5 text-[#5A544C]">
                  <div><span className="font-semibold text-[#1C1C1C]">Prendas:</span> {col.garment_types} (~{col.approx_quantity} piezas)</div>
                  <div><span className="font-semibold text-[#1C1C1C]">Peso estimado/real:</span> {col.actual_weight || col.estimated_weight} kg</div>
                  <div><span className="font-semibold text-[#1C1C1C]">Fecha programada:</span> {col.pickup_date} ({col.pickup_slot})</div>
                  {col.classification_type && (
                    <div className="text-[#1E5128] font-bold">
                      Clasificación: {col.classification_type} ({col.quality_grade})
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-[#7A746B]">Puntos obtenidos:</span>
                  <span className="font-bold text-[#1E5128] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A2A]" />
                    +{col.points_awarded || Math.round(col.estimated_weight * 50)} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. POINTS & REWARDS TAB (RF-061 to RF-065) */}
      {activeTab === 'puntos' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1E5128] to-[#12361A] text-white rounded-3xl p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E3DAC9]">Programa de Recompensas</span>
              <h2 className="text-3xl font-bold font-serif-remoda">Tus Puntos ReModa</h2>
              <p className="text-xs text-white/80 max-w-lg leading-relaxed">
                Ganas 50 puntos por cada kilo de ropa entregada para reciclaje y 10% en puntos por cada compra realizada. Puedes canjearlos por descuentos directos en el carrito.
              </p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <span className="text-xs font-semibold text-white/80 uppercase">Saldo Disponible</span>
              <div className="text-4xl font-black text-white py-1">{currentUser?.points_balance || 350}</div>
              <span className="text-xs text-emerald-200">Equivalente a Bs. {((currentUser?.points_balance || 350) * 0.10).toFixed(0)} de descuento</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] space-y-4">
            <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C]">Movimientos Recientes</h3>
            <div className="space-y-2">
              {[
                { title: 'Ropa entregada y clasificada #REC-00045 (3.8 kg)', points: '+190', date: 'Hace 5 días', type: 'donacion' },
                { title: 'Compra realizada #RM-000152', points: '+30', date: 'Ayer', type: 'compra' },
                { title: 'Descuento canjeado en compra #RM-000152', points: '-100', date: 'Ayer', type: 'canje' },
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[#EDE5D8] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#1C1C1C] block">{m.title}</span>
                    <span className="text-[11px] text-[#7A746B]">{m.date}</span>
                  </div>
                  <span className={`font-bold text-sm ${m.points.startsWith('+') ? 'text-[#1E5128]' : 'text-red-600'}`}>
                    {m.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CUSTOM REQUESTS / ATELIER TAB (RF-066 to RF-070) */}
      {activeTab === 'personalizaciones' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Atelier de Personalización</h2>
              <p className="text-xs text-[#7A746B]">Prendas tuyas en proceso de rediseño y confección artesanal.</p>
            </div>
            <button
              onClick={onOpenCustomModal}
              className="px-4 py-2.5 bg-[#C85A2A] hover:bg-[#B34D21] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Scissors className="w-4 h-4" />
              <span>Personalizar otra prenda</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C]">
                  #CUST-0092
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  En Evaluación
                </span>
              </div>
              <div className="p-3.5 bg-[#F7F4EE] rounded-2xl text-xs space-y-1.5 text-[#5A544C]">
                <div><span className="font-semibold text-[#1C1C1C]">Prenda original:</span> Jean vintage Lee en desuso</div>
                <div><span className="font-semibold text-[#1C1C1C]">Transformación elegida:</span> Mochila Urbana</div>
                <div><span className="font-semibold text-[#1C1C1C]">Cotización estimada:</span> Bs. 120 (Mano de obra y forro impermeable)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADDRESSES TAB (RF-005, RF-028) */}
      {activeTab === 'direcciones' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Libreta de Direcciones</h2>
              <p className="text-xs text-[#7A746B]">Administra tus ubicaciones para entregas y recolecciones rápidas.</p>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar dirección</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentUser?.addresses || []).map((addr, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-[#E8E1D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#C85A2A]">{addr.title}</span>
                  {addr.is_default && (
                    <span className="text-[10px] bg-emerald-100 text-[#1E5128] font-bold px-2 py-0.5 rounded-full">
                      Predeterminada
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-[#1C1C1C]">{addr.address}</p>
                <p className="text-[11px] text-[#7A746B]">{addr.city} · {addr.zone} · {addr.reference}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-md w-full p-6 border border-[#E8E1D5] space-y-4">
            <h3 className="text-lg font-bold font-serif-remoda text-[#1C1C1C]">Nueva Dirección</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Título (Ej: Casa, Oficina, Atelier)"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
              />
              <input
                type="text"
                placeholder="Dirección completa"
                required
                value={newAddressText}
                onChange={(e) => setNewAddressText(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
                <input
                  type="text"
                  placeholder="Zona"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Referencia"
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E5128] text-white rounded-xl font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
