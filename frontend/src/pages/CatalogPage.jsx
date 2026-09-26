import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  RotateCcw, 
  LayoutGrid, 
  Grid3X3, 
  Leaf, 
  Check,
  ChevronDown,
  Filter,
  Tag
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { api } from '../services/api';

const getCategoryIcon = (slugOrName) => {
  const key = String(slugOrName).toLowerCase();
  if (key.includes('mochila')) return '🎒';
  if (key.includes('camiseta') || key.includes('polera')) return '👕';
  if (key.includes('jean') || key.includes('pantalon')) return '👖';
  if (key.includes('bolso')) return '👜';
  if (key.includes('chaqueta') || key.includes('chamarra') || key.includes('abrigo')) return '🧥';
  if (key.includes('vestido')) return '👗';
  if (key.includes('accesorio')) return '✨';
  if (key.includes('cartera')) return '👛';
  return '🏷️';
};

export const CatalogPage = ({ 
  onSelectProduct, 
  initialCategory = 'todas',
  favorites = [],
  onToggleFavorite
}) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'todas');
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedMaterial, setSelectedMaterial] = useState('Todos');
  const [selectedSort, setSelectedSort] = useState('recientes');
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState(3);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [categoriesList, setCategoriesList] = useState([
    { id: 'todas', label: 'Todas', icon: '🌟', count: null },
    { id: 'mochilas', label: 'Mochilas', icon: '🎒', count: 2 },
    { id: 'camisetas', label: 'Camisetas', icon: '👕', count: 2 },
    { id: 'jeans', label: 'Jeans', icon: '👖', count: 2 },
    { id: 'bolsos', label: 'Bolsos', icon: '👜', count: 2 },
    { id: 'chaquetas', label: 'Chaquetas', icon: '🧥', count: 2 },
    { id: 'vestidos', label: 'Vestidos', icon: '👗', count: 2 },
    { id: 'accesorios', label: 'Accesorios', icon: '✨', count: 2 },
    { id: 'carteras', label: 'Carteras', icon: '👛', count: 2 },
  ]);

  const materialsList = [
    { label: 'Todos', color: '#6B7280', bg: '#F3F4F6' },
    { label: 'Denim', color: '#1D4ED8', bg: '#DBEAFE' },
    { label: 'Algodón', color: '#92400E', bg: '#FEF3C7' },
    { label: 'Lana', color: '#7C3AED', bg: '#EDE9FE' },
    { label: 'Mezcla', color: '#065F46', bg: '#D1FAE5' },
  ];

  const pricePresets = [
    { label: 'Hasta 100', value: 100 },
    { label: 'Hasta 200', value: 200 },
    { label: 'Hasta 300', value: 300 },
    { label: 'Todo', value: 500 },
  ];

  const sortOptions = [
    { id: 'recientes', label: 'Más recientes' },
    { id: 'precio_menor', label: 'Precio: menor a mayor' },
    { id: 'precio_mayor', label: 'Precio: mayor a menor' },
    { id: 'mas_vendidos', label: 'Mejor calificados' },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.categories && res.categories.length > 0) {
          const totalCount = res.categories.reduce((sum, c) => sum + (c.products_count || 0), 0);
          const list = [
            { id: 'todas', label: 'Todas', icon: '🌟', count: totalCount },
            ...res.categories.map(c => ({
              id: c.slug || c.name.toLowerCase(),
              label: c.name,
              icon: getCategoryIcon(c.slug || c.name),
              count: c.products_count !== undefined ? c.products_count : null
            }))
          ];
          setCategoriesList(list);
        }
      } catch (err) {
        console.log("Using fallback categories list");
      }
    };
    loadCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'todas') params.category = selectedCategory;
      if (selectedMaterial && selectedMaterial !== 'Todos') params.material = selectedMaterial;
      if (maxPrice && maxPrice < 500) params.max_price = maxPrice;
      if (selectedSort) params.sort = selectedSort;
      const data = await api.getProducts(params);
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error("Error fetching catalog products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [selectedCategory, selectedMaterial, maxPrice, selectedSort]);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchProducts(); };

  const handleResetFilters = () => {
    setSelectedCategory('todas');
    setSelectedMaterial('Todos');
    setMaxPrice(500);
    setSearch('');
    setSelectedSort('recientes');
  };

  const hasActiveFilters = selectedCategory !== 'todas' || selectedMaterial !== 'Todos' || maxPrice < 500 || search.trim() !== '';

  const activeCategory = categoriesList.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-transparent">

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#1a1a18] h-56 sm:h-72">
        <img
          src="/hero-bg.jpg"
          alt="Catálogo ReModa"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a18]/95 via-[#1a1a18]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a18] via-transparent to-transparent opacity-60" />

        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full w-fit mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-bold text-amber-200 tracking-widest uppercase">Colección Circular</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-serif-remoda">
            Catálogo <span className="text-[#C85A2A]">Consciente</span>
          </h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg">
            Prendas rediseñadas con historia, calidad artesanal y mínimo impacto ambiental.
          </p>

          {/* Eco pills */}
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-emerald-800/60 backdrop-blur border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-300">🌱 100% Reutilizado</span>
            <span className="px-3 py-1 bg-amber-800/60 backdrop-blur border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">✨ Pieza Única</span>
            <span className="hidden sm:block px-3 py-1 bg-blue-900/50 backdrop-blur border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">💧 Bajo Consumo</span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── SEARCH + SORT BAR ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-[#1E5128] transition-colors z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, material o historia..."
              className="w-full pl-11 pr-10 py-3.5 bg-white rounded-2xl border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#1E5128] focus:ring-4 focus:ring-[#1E5128]/10 transition-all shadow-sm"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); fetchProducts(); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

            <div className="flex flex-wrap items-center gap-2">
            {/* Grid toggle */}
            <div className="hidden lg:flex items-center bg-white rounded-xl border border-stone-200 p-1 shadow-sm gap-0.5">
              <button onClick={() => setGridCols(3)}
                className={`p-2 rounded-lg transition-all ${gridCols === 3 ? 'bg-[#1E5128] text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                title="3 columnas"><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setGridCols(4)}
                className={`p-2 rounded-lg transition-all ${gridCols === 4 ? 'bg-[#1E5128] text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                title="4 columnas"><LayoutGrid className="w-4 h-4" /></button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-3.5 bg-white rounded-2xl border border-stone-200 text-sm font-semibold text-stone-800 focus:outline-none focus:border-[#1E5128] shadow-sm cursor-pointer appearance-none sm:min-w-[180px]">
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>

            {/* Mobile filter btn */}
            <button onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3.5 bg-[#1E5128] text-white rounded-2xl text-sm font-bold shadow-sm">
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && <span className="w-2 h-2 bg-[#C85A2A] rounded-full" />}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">Filtros:</span>
            {selectedCategory !== 'todas' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1E5128]/10 text-[#1E5128] text-xs font-bold rounded-full border border-[#1E5128]/20">
                {activeCategory?.icon} {activeCategory?.label || selectedCategory}
                <button onClick={() => setSelectedCategory('todas')} className="hover:bg-[#1E5128]/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedMaterial !== 'Todos' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-200">
                🧵 {selectedMaterial}
                <button onClick={() => setSelectedMaterial('Todos')} className="hover:bg-amber-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {maxPrice < 500 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full border border-emerald-200">
                💰 Hasta Bs. {maxPrice}
                <button onClick={() => setMaxPrice(500)} className="hover:bg-emerald-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-full border border-blue-200">
                🔍 "{search}"
                <button onClick={() => setSearch('')} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#C85A2A] hover:text-[#a0441e] px-3 py-1 rounded-full hover:bg-orange-50 transition-colors">
              <RotateCcw className="w-3 h-3" />
              Limpiar todo
            </button>
          </div>
        )}

        {/* ── LAYOUT: SIDEBAR + GRID ── */}
        <div className="flex gap-6 items-start">

          {/* Sidebar */}
          <aside className={`w-72 shrink-0 space-y-5 sticky top-24 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>

            {/* Categories */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#1E5128]" />
                  <span className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Categorías</span>
                </div>
                <span className="text-xs font-bold text-[#1E5128] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {categoriesList.length}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
                  return (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#1E5128] text-white shadow-md shadow-[#1E5128]/20'
                          : 'text-stone-700 hover:bg-stone-50 hover:text-[#1E5128]'
                      }`}>
                      <span className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                      {cat.count !== null && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                        }`}>{cat.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Slider */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Precio</span>
                <span className="text-sm font-extrabold text-[#1E5128] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Bs. {maxPrice}
                </span>
              </div>

              {/* Custom slider */}
              <div className="relative">
                <input type="range" min="50" max="500" step="10" value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1E5128]"
                />
                <div className="flex justify-between text-[11px] text-stone-400 font-semibold mt-1">
                  <span>Bs. 50</span><span>Bs. 250</span><span>Bs. 500</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {pricePresets.map((preset) => (
                  <button key={preset.label} onClick={() => setMaxPrice(preset.value)}
                    className={`text-xs py-2 px-2.5 rounded-xl font-bold transition-all ${
                      maxPrice === preset.value
                        ? 'bg-[#1E5128] text-white shadow-sm'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:border-[#1E5128] hover:text-[#1E5128]'
                    }`}>{preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#1E5128]" />
                <span className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Material</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {materialsList.map((mat) => {
                  const isActive = selectedMaterial === mat.label;
                  return (
                    <button key={mat.label} onClick={() => setSelectedMaterial(mat.label)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-[#1E5128] text-white border-[#1E5128] shadow-sm'
                          : 'border-stone-200 text-stone-700 hover:border-[#1E5128] hover:text-[#1E5128] bg-white'
                      }`}>
                      {isActive && <Check className="w-3 h-3" />}
                      {mat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Eco Stats card */}
            <div className="bg-gradient-to-br from-[#1E5128] to-[#163E1F] rounded-3xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Impacto Positivo</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                  <span className="text-xs text-emerald-200">💧 Agua ahorrada</span>
                  <span className="text-sm font-extrabold">2,400 L</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                  <span className="text-xs text-emerald-200">🌿 CO₂ evitado</span>
                  <span className="text-sm font-extrabold">18 kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-xs text-emerald-200">♻️ Prendas salvadas</span>
                  <span className="text-sm font-extrabold">250+</span>
                </div>
              </div>
            </div>

          </aside>

          {/* Main Product Area */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* Results bar */}
            <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="text-sm font-bold text-stone-700">
                  {loading ? 'Buscando prendas...' : `${products.length} ${products.length === 1 ? 'producto' : 'productos'} encontrados`}
                </span>
              </div>
              {selectedCategory !== 'todas' && (
                <span className="text-xs font-semibold text-stone-500">
                  {activeCategory?.icon} <span className="text-[#1E5128] font-bold">{activeCategory?.label}</span>
                </span>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'} gap-5`}>
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm animate-pulse">
                    <div className="aspect-4/3 bg-gradient-to-r from-stone-100 via-stone-200 to-stone-100 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-stone-200 rounded-full w-2/3" />
                      <div className="h-4 bg-stone-200 rounded-full w-full" />
                      <div className="h-3 bg-stone-200 rounded-full w-1/2" />
                      <div className="h-10 bg-stone-200 rounded-2xl w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 px-6 text-center space-y-4 bg-white rounded-3xl border border-stone-200 shadow-sm">
                <div className="w-20 h-20 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-4xl">🧶</div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-stone-800 font-serif-remoda">Sin resultados</h3>
                  <p className="text-sm text-stone-500 max-w-md mx-auto">
                    Prueba cambiando la categoría, ampliando el rango de precio o buscando otro término.
                  </p>
                </div>
                <button onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E5128] text-white rounded-2xl text-sm font-bold hover:bg-[#163E1F] transition-all shadow-md shadow-[#1E5128]/20 active:scale-95 cursor-pointer">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'} gap-5`}>
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    onSelectProduct={onSelectProduct}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
