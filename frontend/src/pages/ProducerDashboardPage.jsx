import React, { useState, useEffect } from 'react';
import { Scissors, PackageCheck, Recycle, CheckCircle2, AlertTriangle, Plus, Scale, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProducerDashboardPage = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('clasificacion'); // 'clasificacion', 'produccion', 'trazabilidad'
  const [collections, setCollections] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Classification form modal
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [actualWeight, setActualWeight] = useState(3.5);
  const [actualQuantity, setActualQuantity] = useState(5);
  const [classificationType, setClassificationType] = useState('Transformable');
  const [materialType, setMaterialType] = useState('Denim');
  const [qualityGrade, setQualityGrade] = useState('Excelente');

  // New Production Order modal
  const [showNewPoModal, setShowNewPoModal] = useState(false);
  const [poProductName, setPoProductName] = useState('Mochila Denim Revival');
  const [poCategoryId, setPoCategoryId] = useState(1);
  const [poPrimaryMaterial, setPoPrimaryMaterial] = useState('Denim');
  const [poTargetQty, setPoTargetQty] = useState(5);
  const [poMaterialNotes, setPoMaterialNotes] = useState('Jeans reciclados seleccionados');
  const [selectedColIds, setSelectedColIds] = useState([]);

  // Complete & QC Modal
  const [qcOrder, setQcOrder] = useState(null);
  const [qcStatus, setQcStatus] = useState('Aprobado');
  const [qcNotes, setQcNotes] = useState('Costuras reforzadas, cierres metálicos y acabado aprobado.');
  const [producedQty, setProducedQty] = useState(5);
  const [catalogPrice, setCatalogPrice] = useState(185);
  const [originStory, setOriginStory] = useState('Fabricada a partir de 2 jeans reutilizados');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80');

  const loadData = async () => {
    try {
      const [colRes, poRes, homeRes] = await Promise.all([
        api.getCollections(),
        api.getProductionOrders(),
        api.getHomeData(),
      ]);
      if (colRes.collections) setCollections(colRes.collections);
      if (poRes.production_orders) setProductionOrders(poRes.production_orders);
      if (homeRes.categories) setCategories(homeRes.categories);
    } catch (err) {
      console.log("Error loading producer workbench data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClassifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollection) return;

    try {
      await api.classifyCollection(selectedCollection.id, {
        actual_weight: actualWeight,
        actual_quantity: actualQuantity,
        classification_type: classificationType,
        material_type: materialType,
        quality_grade: qualityGrade,
      });
      alert("¡Lote clasificado con éxito e ingresado al inventario de materiales! Puntos asignados al cliente.");
      setSelectedCollection(null);
      loadData();
    } catch (err) {
      alert("Error al clasificar lote");
    }
  };

  const handleCreatePo = async (e) => {
    e.preventDefault();
    try {
      await api.createProductionOrder({
        producer_id: currentUser?.id || 2,
        product_name: poProductName,
        category_id: poCategoryId,
        primary_material: poPrimaryMaterial,
        target_quantity: poTargetQty,
        material_notes: poMaterialNotes,
        collection_ids: selectedColIds,
      });
      alert("¡Orden de producción creada con éxito!");
      setShowNewPoModal(false);
      loadData();
    } catch (err) {
      alert("Error al crear orden de producción");
    }
  };

  const handleCompletePo = async (e) => {
    e.preventDefault();
    if (!qcOrder) return;

    try {
      await api.completeProductionOrder(qcOrder.id, {
        qc_status: qcStatus,
        qc_notes: qcNotes,
        produced_quantity: producedQty,
        price: catalogPrice,
        origin_story: originStory,
        image_url: imageUrl,
      });
      alert("¡Control de calidad completado! El nuevo producto ha sido ingresado al catálogo de la tienda.");
      setQcOrder(null);
      loadData();
    } catch (err) {
      alert("Error al completar control de calidad");
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#F4F0E8] flex flex-col lg:flex-row text-[#1C1C1C] animate-fade-in">
      <aside className="w-full lg:w-72 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-gradient-to-b from-[#141C15] via-[#1B271D] to-[#0E150F] text-white p-5 flex flex-col justify-between shrink-0 border-r border-[#28382B] shadow-2xl relative z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-5 border-b border-[#293A2D]">
            <div className="rounded-2xl bg-white/95 px-2 py-1 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400/20">
              <img src="/logo-remoda.jpg" alt="ReModa" className="w-12 h-12 object-cover object-top rounded-lg mix-blend-multiply" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold font-serif-remoda text-white leading-none mb-1">Re<span className="text-[#C85A2A]">Moda</span></div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#C85A2A]/20 text-[#E3A07A] border border-[#C85A2A]/30 uppercase">Productor</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 px-3 mb-2">Menú de Producción</p>
            {[
              { id: 'clasificacion', label: 'Recepción y Clasificación', icon: Recycle, count: collections.filter(c => c.status !== 'Clasificada').length },
              { id: 'produccion', label: 'Órdenes y Calidad', icon: PackageCheck, count: productionOrders.length },
              { id: 'trazabilidad', label: 'Trazabilidad Circular', icon: RefreshCw },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all duration-300 cursor-pointer group ${isActive ? 'bg-gradient-to-r from-[#C85A2A] to-amber-600 text-white font-bold shadow-lg shadow-orange-950/40 ring-1 ring-orange-300/40 translate-x-1' : 'text-stone-300 hover:bg-white/10 hover:text-white hover:translate-x-1'}`}>
                  <span className="flex items-center gap-3"><span className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}><Icon className="w-4 h-4" /></span>{tab.label}</span>
                  {tab.count !== undefined && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-[#C85A2A]' : 'bg-white/10 text-stone-300'}`}>{tab.count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-[#293A2D] flex items-center gap-2.5 text-xs text-stone-400">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C85A2A] to-amber-600 text-white flex items-center justify-center font-bold shadow-md">{currentUser?.name?.charAt(0) || 'P'}</div>
          <div><div className="font-bold text-white text-xs">{currentUser?.name} {currentUser?.last_name}</div><div className="text-[10px] text-stone-400">Productor ReModa</div></div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 lg:min-h-0 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#1C1C1A] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#333]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#C85A2A] text-white flex items-center justify-center font-bold text-2xl shadow-md">
            <Scissors className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C85A2A]">Módulo del Productor / Atelier</span>
            <h1 className="text-2xl font-bold font-serif-remoda">
              Taller de Transformación & Producción
            </h1>
            <p className="text-xs text-[#A6A6A6]">
              Operador: {currentUser?.name} {currentUser?.last_name} · Confección Circular
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewPoModal(true)}
          className="px-5 py-3 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Orden de Producción</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2 lg:hidden">
        {[
          { id: 'clasificacion', label: '1. Recepción y Clasificación de Ropa', icon: Recycle, count: collections.filter(c => c.status !== 'Clasificada').length },
          { id: 'produccion', label: '2. Órdenes de Producción & Calidad', icon: PackageCheck, count: productionOrders.length },
          { id: 'trazabilidad', label: '3. Cadena de Trazabilidad', icon: RefreshCw },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1E5128] text-white shadow-sm'
                : 'bg-white text-[#4A4A4A] border border-[#DDD5C7] hover:border-[#1E5128]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: RECEPTION & CLASSIFICATION (RF-071 to RF-075) */}
      {activeTab === 'clasificacion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div key={col.id} className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C85A2A]">Lote #{col.code}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    col.status === 'Clasificada' ? 'bg-emerald-100 text-[#1E5128]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {col.status}
                  </span>
                </div>

                <div className="p-3 bg-[#F7F4EE] rounded-2xl text-xs space-y-1 text-[#5A544C]">
                  <div><span className="font-semibold text-[#1C1C1C]">Donante:</span> {col.user?.name} {col.user?.last_name}</div>
                  <div><span className="font-semibold text-[#1C1C1C]">Prendas declaradas:</span> {col.garment_types}</div>
                  <div><span className="font-semibold text-[#1C1C1C]">Peso estimado:</span> {col.estimated_weight} kg (~{col.approx_quantity} piezas)</div>
                  {col.notes && <div className="text-gray-500 italic">"{col.notes}"</div>}
                </div>

                {col.status === 'Clasificada' ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#1E5128] space-y-1">
                    <div><strong>Clasificación:</strong> {col.classification_type} ({col.material_type})</div>
                    <div><strong>Calidad:</strong> {col.quality_grade} · <strong>Peso Real:</strong> {col.actual_weight} kg</div>
                    <div><strong>Puntos otorgados:</strong> +{col.points_awarded} pts</div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCollection(col);
                      setActualWeight(parseFloat(col.estimated_weight) || 3.0);
                      setActualQuantity(col.approx_quantity || 5);
                    }}
                    className="w-full py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Pesar y Clasificar Lote</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTION ORDERS & QC (RF-076 to RF-082) */}
      {activeTab === 'produccion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productionOrders.map((po) => (
              <div key={po.id} className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#7A746B]">Orden de Producción</span>
                    <h3 className="text-lg font-bold font-serif-remoda text-[#1C1C1C]">
                      #{po.code} · {po.product_name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EFE9DF] text-[#1E5128]">
                    {po.status}
                  </span>
                </div>

                <div className="p-3.5 bg-[#F7F4EE] rounded-2xl text-xs space-y-1.5 text-[#5A544C]">
                  <div><span className="font-semibold text-[#1C1C1C]">Material Principal:</span> {po.primary_material}</div>
                  <div><span className="font-semibold text-[#1C1C1C]">Meta de Producción:</span> {po.target_quantity} unidades</div>
                  <div><span className="font-semibold text-[#1C1C1C]">Unidades Producidas:</span> {po.produced_quantity} unidades</div>
                  {po.materials?.length > 0 && (
                    <div className="pt-1 text-[#1E5128]">
                      <strong>Lotes Vinculados:</strong> {po.materials.map(m => m.material_description).join(', ')}
                    </div>
                  )}
                </div>

                {po.status === 'Terminado' ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#1E5128]">
                    ✓ Control de Calidad: <strong>{po.qc_status}</strong>. Ingresado al inventario general.
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={async () => {
                        await api.updateProductionProgress(po.id, {
                          status: 'Control de calidad',
                          produced_quantity: po.target_quantity,
                          scrap_weight: 0.3,
                        });
                        loadData();
                      }}
                      className="flex-1 py-2 bg-[#F7F4EE] hover:bg-[#EDE5D8] rounded-xl text-xs font-semibold text-[#1C1C1C]"
                    >
                      Avanzar a Control Calidad
                    </button>

                    <button
                      onClick={() => {
                        setQcOrder(po);
                        setProducedQty(po.target_quantity);
                      }}
                      className="px-4 py-2 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl text-xs font-semibold"
                    >
                      Aprobar e Ingresar a Stock
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRACEABILITY CHAIN (RF-083 to RF-085) */}
      {activeTab === 'trazabilidad' && (
        <div className="bg-white rounded-3xl p-8 border border-[#E8E1D5] space-y-6">
          <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Mapa de Trazabilidad Circular</h2>
          <p className="text-xs text-[#7A746B]">Registro inmutable desde la recolección hasta la venta al cliente final.</p>

          <div className="space-y-4">
            {[
              {
                product: 'Mochila Denim Revival (#RM-100)',
                source: '2 Jeans donados lote REC-00045 (Cliente: Lucía Vargas)',
                order: 'OP-000125 (Productor: Carlos Mendoza)',
                qc: 'Aprobado (0.4 kg de merma reciclada para accesorios)',
                status: 'Disponible en Tienda Online por Bs. 185',
              },
              {
                product: 'Chaqueta Patchwork Bohème',
                source: 'Retazos de 5 prendas lote REC-00038',
                order: 'OP-000119 (Productor: Carlos Mendoza)',
                qc: 'Aprobado (Edición limitada 4 unidades)',
                status: 'En catálogo por Bs. 320',
              }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F7F4EE] border border-[#E3DC CE] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1E5128] font-serif-remoda">{item.product}</h4>
                  <span className="bg-white px-2.5 py-0.5 rounded-full border text-[11px] font-semibold text-[#1C1C1C]">{item.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[#5A544C]">
                  <div><strong>Origen:</strong> {item.source}</div>
                  <div><strong>Producción:</strong> {item.order}</div>
                  <div><strong>Control Calidad:</strong> {item.qc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
      </main>

      {/* Classification Modal (RF-071 to RF-075) */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8E1D5] space-y-5">
            <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
              Clasificar Lote #{selectedCollection.code}
            </h3>

            <form onSubmit={handleClassifySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Peso Real (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={actualWeight}
                    onChange={(e) => setActualWeight(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Cantidad de prendas:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={actualQuantity}
                    onChange={(e) => setActualQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Classification type (RF-073) */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Destino / Clasificación (RF-073):</label>
                <select
                  value={classificationType}
                  onChange={(e) => setClassificationType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                >
                  <option value="Transformable">Transformable (Upcycling en taller)</option>
                  <option value="Reutilizable">Reutilizable (Venta directa segunda mano)</option>
                  <option value="Reparación">Requiere Reparación</option>
                  <option value="Donación">Donación Comunitaria</option>
                  <option value="Reciclaje">Reciclaje de Fibras</option>
                  <option value="Desecho">Desecho / Merma</option>
                </select>
              </div>

              {/* Material (RF-074) */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Material Textil (RF-074):</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                >
                  <option value="Denim">Denim / Jeans</option>
                  <option value="Algodón">Algodón 100%</option>
                  <option value="Lana">Lana / Tejidos</option>
                  <option value="Mezcla">Mezcla Sintética / Poliéster</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              {/* Quality grade (RF-075) */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Calidad de la tela (RF-075):</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                >
                  <option value="Excelente">Excelente (Como nueva)</option>
                  <option value="Buena">Buena (Desgaste menor)</option>
                  <option value="Regular">Regular (Apta para retazos)</option>
                  <option value="Dañada">Dañada</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-[#1E5128] font-bold text-center">
                Puntos a acreditar automáticamente: +{Math.round(actualWeight * 50)} pts
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCollection(null)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E5128] text-white rounded-xl font-semibold"
                >
                  Confirmar Clasificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Production Order Modal (RF-076) */}
      {showNewPoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8E1D5] space-y-5">
            <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
              Crear Orden de Producción
            </h3>

            <form onSubmit={handleCreatePo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Nombre del Producto a Crear:</label>
                <input
                  type="text"
                  required
                  value={poProductName}
                  onChange={(e) => setPoProductName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Categoría:</label>
                  <select
                    value={poCategoryId}
                    onChange={(e) => setPoCategoryId(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Cantidad Meta:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poTargetQty}
                    onChange={(e) => setPoTargetQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Material Principal:</label>
                <input
                  type="text"
                  value={poPrimaryMaterial}
                  onChange={(e) => setPoPrimaryMaterial(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPoModal(false)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E5128] text-white rounded-xl font-semibold"
                >
                  Crear Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QC & Stock Entry Modal (RF-081, RF-082, RN-007) */}
      {qcOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8E1D5] space-y-5">
            <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
              Control de Calidad e Ingreso a Catálogo
            </h3>

            <form onSubmit={handleCompletePo} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Dictamen QC (RF-081):</label>
                  <select
                    value={qcStatus}
                    onChange={(e) => setQcStatus(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  >
                    <option value="Aprobado">Aprobado para Venta</option>
                    <option value="Observado">Observado con Corrección</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Precio de Venta (Bs.):</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={catalogPrice}
                    onChange={(e) => setCatalogPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Historia de Origen / Trazabilidad (RF-085):</label>
                <input
                  type="text"
                  required
                  value={originStory}
                  onChange={(e) => setOriginStory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">URL de Fotografía del Producto:</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQcOrder(null)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E5128] text-white rounded-xl font-semibold"
                >
                  Aprobar y Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
