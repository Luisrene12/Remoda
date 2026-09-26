import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  CartesianGrid,
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  Recycle, 
  Users, 
  Tag, 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Sparkles,
  BarChart3,
  Layers,
  Edit2,
  Trash2,
  Image as ImageIcon,
  FolderPlus,
  Percent,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  Search,
  KeyRound,
  Mail,
  Phone,
  ArrowUpRight,
  Leaf,
  Droplets,
  TreePine,
  Zap,
  ShoppingBag,
  Settings,
  Timer,
  Activity,
  ChevronRight,
  CalendarDays,
  LogOut,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatOrderDate = (order) => {
  const rawDate = order.created_at || order.order_date || order.date;
  if (!rawDate) return 'Sin fecha';

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) return 'Fecha no disponible';

  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate);
};

export const AdminDashboardPage = ({ setCurrentTab }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);
  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      return {
        systemName: 'ReModa',
        tagline: 'Moda circular con propósito',
        contactEmail: 'hola@remoda.bo',
        contactPhone: '+591 7 123 4567',
        address: 'Santa Cruz, Bolivia',
        logoUrl: '/logo-remoda.jpg',
        primaryColor: '#1E5128',
        maintenanceMode: false,
        emailNotifications: true,
        orderNotifications: true,
        ...JSON.parse(localStorage.getItem('remoda_system_settings') || '{}'),
      };
    } catch {
      return {
        systemName: 'ReModa',
        tagline: 'Moda circular con propósito',
        contactEmail: 'hola@remoda.bo',
        contactPhone: '+591 7 123 4567',
        address: 'Santa Cruz, Bolivia',
        logoUrl: '/logo-remoda.jpg',
        primaryColor: '#1E5128',
        maintenanceMode: false,
        emailNotifications: true,
        orderNotifications: true,
      };
    }
  });

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80');
  const [catBanner, setCatBanner] = useState('');
  const [catColor, setCatColor] = useState('#1E5128');
  const [catSeason, setCatSeason] = useState('Todo el año');
  const [catMaterial, setCatMaterial] = useState('');
  const [catOrder, setCatOrder] = useState(0);
  const [catIsActive, setCatIsActive] = useState(true);
  const [catMetaTitle, setCatMetaTitle] = useState('');
  const [catMetaDescription, setCatMetaDescription] = useState('');

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(1);
  const [prodPrice, setProdPrice] = useState(185);
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodStock, setProdStock] = useState(5);
  const [prodSize, setProdSize] = useState('Talla única');
  const [prodColor, setProdColor] = useState('Azul Denim');
  const [prodMaterial, setProdMaterial] = useState('Denim');
  const [prodTransformation, setProdTransformation] = useState('Transformado');
  const [prodStory, setProdStory] = useState('Fabricada a partir de 2 jeans reutilizados');
  const [prodBadge, setProdBadge] = useState('Más vendido');
  const [prodDesc, setProdDesc] = useState('Confeccionada con materiales seleccionados y reforzados.');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80');
  const [prodIsFeatured, setProdIsFeatured] = useState(true);
  const [prodIsNew, setProdIsNew] = useState(false);

  // Coupon Modal State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(100);

  // User Management Modal State
  const { addNewUser, logout } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('customer'); // 'customer' | 'producer' | 'admin'
  const [newUserStatus, setNewUserStatus] = useState('active');
  const [userFilterRole, setUserFilterRole] = useState('Todos');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userModalLoading, setUserModalLoading] = useState(false);
  const [userModalError, setUserModalError] = useState('');
  const [userModalSuccess, setUserModalSuccess] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  const handleOpenNewUser = () => {
    setNewUserName('');
    setNewUserLastName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserPassword('');
    setNewUserRole('customer');
    setNewUserStatus('active');
    setUserModalError('');
    setUserModalSuccess('');
    setShowUserModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserModalError('');
    setUserModalSuccess('');
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword) {
      setUserModalError('Por favor completa todos los campos obligatorios (*)');
      return;
    }
    if (newUserPassword.length < 6) {
      setUserModalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setUserModalLoading(true);
    try {
      const res = await addNewUser({
        name: newUserName.trim(),
        last_name: newUserLastName.trim(),
        email: newUserEmail.trim(),
        phone: newUserPhone.trim(),
        password: newUserPassword,
        role: newUserRole,
        status: newUserStatus,
      });

      if (res && res.success) {
        setUserModalSuccess(`¡Usuario "${newUserName}" creado exitosamente! Ahora puede iniciar sesión.`);
        setUsers(prev => [res.user, ...prev.filter(u => u.email?.toLowerCase() !== res.user?.email?.toLowerCase())]);
        setTimeout(() => {
          setShowUserModal(false);
        }, 1500);
      } else {
        setUserModalError(res?.message || 'Error al crear usuario');
      }
    } catch (err) {
      setUserModalError('Error al crear usuario');
    } finally {
      setUserModalLoading(false);
    }
  };

  const loadAll = async () => {
    try {
      const [statsRes, ordersRes, colRes, prodRes, catRes, couponRes, usersRes, repRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getCollections(),
        api.getProducts(),
        api.getCategories(),
        api.getCoupons(),
        api.getAdminUsers(),
        api.getAdminReports(),
      ]);

      if (statsRes.metrics) setStats(statsRes);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (colRes.collections) setCollections(colRes.collections);
      if (prodRes.products) setProducts(prodRes.products);
      if (catRes.categories) setCategories(catRes.categories);
      if (couponRes.coupons) setCoupons(couponRes.coupons);
      if (usersRes.users) setUsers(usersRes.users);
      if (repRes.environmental_impact) setReports(repRes);
    } catch (err) {
      console.log("Error loading admin data:", err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateSystemSetting = (field, value) => {
    setSystemSettings((current) => ({ ...current, [field]: value }));
  };

  const saveSystemSettings = () => {
    localStorage.setItem('remoda_system_settings', JSON.stringify(systemSettings));
    alert('Configuración guardada correctamente.');
  };

  // Category Handlers
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCatImage('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80');
    setCatBanner('');
    setCatColor('#1E5128');
    setCatSeason('Todo el año');
    setCatMaterial('');
    setCatOrder(0);
    setCatIsActive(true);
    setCatMetaTitle('');
    setCatMetaDescription('');
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCatImage(cat.image || '');
    setCatBanner(cat.banner_image || '');
    setCatColor(cat.color || '#1E5128');
    setCatSeason(cat.season || 'Todo el año');
    setCatMaterial(cat.material || '');
    setCatOrder(cat.display_order || 0);
    setCatIsActive(cat.is_active !== false);
    setCatMetaTitle(cat.meta_title || '');
    setCatMetaDescription(cat.meta_description || '');
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, {
          name: catName,
          description: catDesc,
          image: catImage,
          banner_image: catBanner,
          color: catColor,
          season: catSeason,
          material: catMaterial,
          display_order: catOrder,
          is_active: catIsActive,
          meta_title: catMetaTitle,
          meta_description: catMetaDescription,
        });
        alert("¡Categoría actualizada exitosamente!");
      } else {
        await api.createCategory({
          name: catName,
          description: catDesc,
          image: catImage,
          banner_image: catBanner,
          color: catColor,
          season: catSeason,
          material: catMaterial,
          display_order: catOrder,
          meta_title: catMetaTitle,
          meta_description: catMetaDescription,
        });
        alert("¡Categoría registrada exitosamente! Ya es visible en el catálogo de clientes.");
      }
      setShowCategoryModal(false);
      loadAll();
    } catch (err) {
      alert("Error guardando la categoría");
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await api.deleteCategory(catId);
      loadAll();
    } catch (err) {
      alert("Error eliminando categoría");
    }
  };

  // Product Handlers
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?.id || 1);
    setProdPrice(185);
    setProdOriginalPrice('');
    setProdStock(5);
    setProdSize('Talla única');
    setProdColor('Azul Denim');
    setProdMaterial('Denim');
    setProdTransformation('Transformado');
    setProdStory('Fabricada a partir de 2 jeans reutilizados');
    setProdBadge('Más vendido');
    setProdDesc('Prenda sustentable upcycled.');
    setProdImage('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80');
    setProdIsFeatured(true);
    setProdIsNew(false);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category_id);
    setProdPrice(parseFloat(prod.price) || 0);
    setProdOriginalPrice(prod.original_price ? parseFloat(prod.original_price) : '');
    setProdStock(prod.stock || 1);
    setProdSize(prod.size || 'Talla única');
    setProdColor(prod.color || 'Azul');
    setProdMaterial(prod.material || 'Denim');
    setProdTransformation(prod.transformation_type || 'Transformado');
    setProdStory(prod.origin_story || '');
    setProdBadge(prod.badge || '');
    setProdDesc(prod.description || '');
    setProdImage(prod.primary_image?.image_url || prod.images?.[0]?.image_url || '');
    setProdIsFeatured(Boolean(prod.is_featured));
    setProdIsNew(Boolean(prod.is_new));
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodName.trim() || !prodDesc.trim() || !prodCategory) {
      alert('Completa nombre, descripción y categoría antes de guardar.');
      return;
    }

    const payload = {
      name: prodName,
      category_id: prodCategory,
      price: prodPrice,
      original_price: prodOriginalPrice ? prodOriginalPrice : null,
      stock: prodStock,
      size: prodSize,
      color: prodColor,
      material: prodMaterial,
      transformation_type: prodTransformation,
      origin_story: prodStory,
      badge: prodBadge,
      description: prodDesc,
      image_url: prodImage,
      is_featured: prodIsFeatured,
      is_new: prodIsNew,
    };

    try {
      const result = editingProduct
        ? await api.updateProduct(editingProduct.id, payload)
        : await api.createProduct(payload);

      if (result?.errors || result?.message?.toLowerCase().includes('error')) {
        throw new Error(result.message || 'No se pudo guardar el producto');
      }

      if (editingProduct) {
        alert("¡Producto y precios actualizados exitosamente!");
      } else {
        alert("¡Producto registrado exitosamente! Ya está publicado en el catálogo y página principal de los clientes.");
      }
      setShowProductModal(false);
      loadAll();
    } catch (err) {
      alert("Error guardando el producto");
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.deleteProduct(prodId);
      loadAll();
    } catch (err) {
      alert("Error eliminando producto");
    }
  };

  const handleToggleProductActive = async (prod) => {
    try {
      await api.updateProduct(prod.id, { is_active: !prod.is_active });
      loadAll();
    } catch (err) {
      alert("Error al cambiar visibilidad");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const previousOrder = orders.find((order) => order.id === orderId);
    setOrders((currentOrders) => currentOrders.map((order) => (
      order.id === orderId ? { ...order, status: newStatus } : order
    )));

    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
    } catch (err) {
      if (previousOrder) {
        setOrders((currentOrders) => currentOrders.map((order) => (
          order.id === orderId ? previousOrder : order
        )));
      }
      alert("Error actualizando pedido");
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.createCoupon({
        code: newCouponCode.toUpperCase(),
        discount_percent: newCouponPercent,
        min_order: newCouponMin,
        max_uses: 200,
      });
      alert("¡Cupón de descuento creado!");
      setShowCouponModal(false);
      loadAll();
    } catch (err) {
      alert("Error al crear cupón");
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-[#F4F0E8] flex flex-col md:flex-row text-[#1C1C1C] animate-fade-in">
      
      {/* ─── LEFT SIDEBAR MENU (Full Style) ─────────────────────────────────── */}
      <aside className="w-full md:w-72 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-gradient-to-b from-[#141C15] via-[#1B271D] to-[#0E150F] text-white p-5 flex flex-col justify-between shrink-0 border-r border-[#28382B] shadow-2xl relative z-20">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#293A2D]">
            <div className="rounded-2xl bg-white/95 px-2 py-1 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400/20">
              <img src={systemSettings.logoUrl || '/logo-remoda.jpg'} alt={systemSettings.systemName} className="w-12 h-12 object-cover object-top rounded-lg mix-blend-multiply" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold font-serif-remoda text-white leading-none mb-1">
                {systemSettings.systemName}
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Admin
              </span>
              <div className="text-[11px] text-stone-400 font-medium flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Panel de Control Central
              </div>
            </div>
          </div>



          {/* Sidebar Menu Items */}
          <div className="space-y-1.5 pt-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 px-3 mb-2">
              Menú de Administración
            </p>

            {[
              { id: 'dashboard', label: 'Dashboard & Métricas', icon: BarChart3 },
              { id: 'categorias', label: 'Categorías', icon: FolderPlus, count: categories.length },
              { id: 'productos', label: 'Productos', icon: ShoppingBag, count: products.length },
              { id: 'pedidos', label: 'Pedidos E-Commerce', icon: Package, count: orders.length },
              { id: 'recolecciones', label: 'Recolecciones Ropa', icon: Recycle, count: collections.length },
              { id: 'cupones', label: 'Cupones & Promos', icon: Tag, count: coupons.length },
              { id: 'usuarios', label: 'Usuarios', icon: Users, count: users.length },
              { id: 'reportes', label: 'Impacto Ambiental', icon: FileText },
              { id: 'configuracion', label: 'Configuración del Sistema', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1E5128] to-emerald-700 text-white font-bold shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40 translate-x-1'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-stone-400 group-hover:text-white group-hover:bg-white/10'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{tab.label}</span>
                  </div>

                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                      isActive ? 'bg-white text-[#1E5128]' : 'bg-white/10 text-stone-300 group-hover:bg-white/20 group-hover:text-white'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Sidebar Footer User Info */}
        <div className="pt-6 mt-6 border-t border-[#293A2D] space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-stone-400">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-emerald-600 to-[#1E5128] text-white flex items-center justify-center font-bold text-xs shadow-md">
              A
            </div>
            <div>
              <div className="font-bold text-white text-xs">Administrador</div>
              <div className="text-[10px] text-stone-400">admin@remoda.bo</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              setCurrentTab('inicio');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-stone-300 hover:bg-red-500/15 hover:text-red-200 hover:border-red-400/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA (Right Side) ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 md:min-h-0 p-5 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header Banner Topbar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-[#E8E1D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C85A2A] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              SECCIÓN ACTIVA: {activeTab.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-remoda text-[#1C1C1C] mt-2">
              {activeTab === 'dashboard' && 'Dashboard General & Métricas'}
              {activeTab === 'categorias' && 'Gestión de Categorías'}
              {activeTab === 'productos' && 'Gestión de Productos'}
              {activeTab === 'pedidos' && 'Pedidos E-Commerce'}
              {activeTab === 'recolecciones' && 'Recolecciones de Ropa Usada'}
              {activeTab === 'cupones' && 'Cupones de Descuento & Promociones'}
              {activeTab === 'usuarios' && 'Usuarios'}
              {activeTab === 'reportes' && 'Reporte de Impacto Ambiental'}
              {activeTab === 'configuracion' && 'Configuración del Sistema'}
            </h1>
            <p className="text-xs text-[#7A746B] mt-1">
              Control centralizado en tiempo real con sincronización automática en la base de datos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAll}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-2xl transition-all border border-stone-300 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Actualizar datos"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C85A2A]" />
              <span>Sincronizar Datos</span>
            </button>
          </div>
        </div>

        {/* 1. DASHBOARD OVERVIEW WITH RECHARTS GRAPHS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'Ventas Totales',
                value: `Bs. ${stats?.metrics?.total_sales || '14.850'}`,
                change: '+18% este mes',
                changeColor: 'text-emerald-600',
                icon: DollarSign,
                gradient: 'from-emerald-500 to-[#1E5128]',
                iconBg: 'bg-emerald-500/10',
                border: 'border-emerald-200/60',
              },
              {
                label: 'Ropa Recolectada',
                value: `${stats?.metrics?.total_kg_collected || '1.250'} kg`,
                change: '850 kg reutilizados',
                changeColor: 'text-[#1E5128]',
                icon: Recycle,
                gradient: 'from-[#1E5128] to-emerald-700',
                iconBg: 'bg-[#1E5128]/10',
                border: 'border-[#1E5128]/20',
              },
              {
                label: 'Pedidos Activos',
                value: `${orders.length} pedidos`,
                change: 'Trazabilidad activa',
                changeColor: 'text-amber-700',
                icon: Package,
                gradient: 'from-[#C85A2A] to-amber-600',
                iconBg: 'bg-[#C85A2A]/10',
                border: 'border-amber-200/60',
              },
              {
                label: 'Catálogo Activo',
                value: `${products.length} productos`,
                change: `${categories.length} categorías`,
                changeColor: 'text-[#7A746B]',
                icon: Layers,
                gradient: 'from-violet-500 to-purple-700',
                iconBg: 'bg-violet-500/10',
                border: 'border-violet-200/60',
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="group relative bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-3xl`} />
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-extrabold text-[#7A746B] uppercase tracking-wider">{stat.label}</span>
                    <div className={`p-2 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-4 h-4 text-[#1C1C1C]" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#1C1C1C] tracking-tight">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <ArrowUpRight className={`w-3 h-3 ${stat.changeColor}`} />
                    <span className={`text-[11px] font-semibold ${stat.changeColor}`}>{stat.change}</span>
                  </div>
                  <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.07] rounded-full blur-2xl transition-opacity duration-500`} />
                </div>
              );
            })}
          </div>

          {/* 📊 RECHARTS CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Area Chart: Sales Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#C85A2A] uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Crecimiento E-Commerce
                  </span>
                  <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C] mt-1">
                    Ventas & Transacciones Mensuales (Bs.)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E5128]" />
                  <span className="text-xs text-[#7A746B] font-semibold">Ventas Reales</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { mes: 'Ene', ventas: 7200, recolectado: 280 },
                      { mes: 'Feb', ventas: 9400, recolectado: 410 },
                      { mes: 'Mar', ventas: 11800, recolectado: 530 },
                      { mes: 'Abr', ventas: 10500, recolectado: 490 },
                      { mes: 'May', ventas: 13900, recolectado: 710 },
                      { mes: 'Jun', ventas: parseFloat(stats?.metrics?.total_sales) || 14850, recolectado: stats?.metrics?.total_kg_collected || 850 },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E5128" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1E5128" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
                    <XAxis dataKey="mes" stroke="#9A9489" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9A9489" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#141C15', borderRadius: '16px', color: '#fff', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                      formatter={(val) => [`Bs. ${val}`, 'Ventas']}
                    />
                    <Area type="monotone" dataKey="ventas" stroke="#1E5128" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Categories Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#1E5128] uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Catálogo Textil
                </span>
                <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C] mt-1">
                  Distribución por Categorías
                </h3>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories.map((c, i) => ({
                        name: c.name,
                        value: c.products_count || products.filter(p => p.category_id === c.id).length || (i + 1) * 2,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {['#1E5128', '#C85A2A', '#D97706', '#059669', '#7C3AED', '#2563EB'].map((col, idx) => (
                        <Cell key={`cell-${idx}`} fill={col} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#141C15', borderRadius: '12px', color: '#fff', border: 'none' }}
                      formatter={(val) => [`${val} prendas`, 'Cantidad']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend Pills */}
              <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                {categories.slice(0, 4).map((c, i) => (
                  <span key={c.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F4EE] text-[#5A544C] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#1E5128', '#C85A2A', '#D97706', '#059669'][i % 4] }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Bar Chart: Recolecciones de Ropa Usada */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-[#1E5128] uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Economía Circular & Upcycling
                </span>
                <h3 className="text-base font-bold font-serif-remoda text-[#1C1C1C] mt-1">
                  Kilos de Ropa Usada Recolectada por Mes (kg)
                </h3>
              </div>
              <div className="text-xs font-bold text-[#1E5128] bg-[#E3EFDF] px-3 py-1.5 rounded-xl border border-[#BFD4BD]">
                🌱 Total Acumulado: {stats?.metrics?.total_kg_collected || '1.250'} kg
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { mes: 'Ene', kg: 210 },
                    { mes: 'Feb', kg: 340 },
                    { mes: 'Mar', kg: 480 },
                    { mes: 'Abr', kg: 410 },
                    { mes: 'May', kg: 620 },
                    { mes: 'Jun', kg: stats?.metrics?.total_kg_collected || 850 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
                  <XAxis dataKey="mes" stroke="#9A9489" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9A9489" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141C15', borderRadius: '12px', color: '#fff', border: 'none' }}
                    formatter={(val) => [`${val} kg`, 'Ropa Recolectada']}
                  />
                  <Bar dataKey="kg" fill="#C85A2A" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Overview Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-emerald-50">
                  <Activity className="w-4 h-4 text-[#1E5128]" />
                </div>
                <h3 className="text-sm font-bold text-[#1C1C1C]">Actividad Reciente de Pedidos</h3>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 4).map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF8F3] border border-[#F0EBE0] hover:border-[#DDD5C7] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C85A2A] to-amber-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                        #{ord.order_number?.toString().slice(-2)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1C1C1C]">{ord.recipient_name || ord.user?.name}</div>
                        <div className="text-[10px] text-[#7A746B]">{ord.delivery_type}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E5128]">Bs. {parseFloat(ord.total).toFixed(0)}</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center py-8 text-xs text-[#7A746B]">Sin pedidos recientes</div>
                )}
              </div>
            </div>

            {/* Categories Summary */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <FolderPlus className="w-4 h-4 text-[#C85A2A]" />
                </div>
                <h3 className="text-sm font-bold text-[#1C1C1C]">Resumen Rápido de Categorías</h3>
              </div>
              <div className="space-y-2.5">
                {categories.slice(0, 5).map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF8F3] border border-[#F0EBE0] hover:border-[#DDD5C7] transition-colors">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#DDD5C7]" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200" />
                      )}
                      <span className="text-xs font-bold text-[#1C1C1C]">{cat.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E3EFDF] text-[#1E5128]">{cat.products_count || 0} productos</span>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-8 text-xs text-[#7A746B]">Sin categorías</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CATEGORIES MANAGEMENT (SINGLE LINE ROW LAYOUT WITH FULL STYLE) */}
      {activeTab === 'categorias' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#FBF8F3] border border-[#E8E1D5] text-[10px] font-bold text-[#5A544C]">Todas: {categories.length}</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">Con productos: {categories.filter(cat => cat.products_count > 0).length}</span>
              </div>
              <button onClick={handleOpenNewCategory} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85A2A] hover:bg-[#B34E22] text-white text-xs font-bold transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /> Registrar Categoría
              </button>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[760px] text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[#7A746B] bg-[#F7F4EE]">
                    <th className="px-4 py-3 rounded-l-xl font-extrabold">Categoría</th>
                    <th className="px-4 py-3 font-extrabold">Descripción</th>
                    <th className="px-4 py-3 font-extrabold">Productos</th>
                    <th className="px-4 py-3 font-extrabold">Estado</th>
                    <th className="px-4 py-3 rounded-r-xl font-extrabold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#FBF8F3] transition-colors">
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          {cat.image ? <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-[#E8E1D5]" /> : <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center"><FolderPlus className="w-5 h-5 text-[#1E5128]" /></div>}
                          <div className="min-w-0"><div className="font-bold text-sm text-[#1C1C1C] truncate">{cat.name}</div><div className="text-[10px] text-[#7A746B] truncate">#{cat.slug || 'sin-slug'}</div></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0] text-xs text-[#5A544C] max-w-[280px]"><span className="line-clamp-2">{cat.description || 'Sin descripción ingresada.'}</span></td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]"><span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-[#1E5128]">{cat.products_count || 0} prendas</span></td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Publicada</span></td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]"><div className="flex justify-end gap-2"><button onClick={() => handleOpenEditCategory(cat)} className="p-2 rounded-lg border border-[#BFD4BD] bg-[#F4F9F3] text-[#1E5128] hover:bg-[#EAF4E8] cursor-pointer" title="Editar categoría"><Edit2 className="w-3.5 h-3.5" /></button><button onClick={() => handleDeleteCategory(cat.id)} className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer" title="Eliminar categoría"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && <div className="text-center py-12 text-sm text-[#7A746B]"><FolderPlus className="w-10 h-10 text-[#C85A2A] mx-auto mb-2 opacity-50" /><p className="font-bold">No hay categorías registradas aún</p><button onClick={handleOpenNewCategory} className="mt-4 px-4 py-2 bg-[#C85A2A] text-white rounded-xl text-xs font-bold cursor-pointer">Crear primera categoría</button></div>}
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT (SINGLE LINE ROW LAYOUT WITH FULL STYLE) */}
      {activeTab === 'productos' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#FBF8F3] border border-[#E8E1D5] text-[10px] font-bold text-[#5A544C]">Todos: {products.length}</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">En tienda: {products.filter(p => p.is_active).length}</span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700">Stock crítico: {products.filter(p => p.stock <= 2).length}</span>
                <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-[10px] font-bold text-red-700">Ocultos: {products.filter(p => !p.is_active).length}</span>
              </div>
              <button
                onClick={handleOpenNewProduct}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C85A2A] hover:bg-[#B34E22] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Registrar Nueva Prenda
              </button>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[850px] text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[#7A746B] bg-[#F7F4EE]">
                    <th className="px-4 py-3 rounded-l-xl font-extrabold">Producto</th>
                    <th className="px-4 py-3 font-extrabold">Categoría</th>
                    <th className="px-4 py-3 font-extrabold">Precio</th>
                    <th className="px-4 py-3 font-extrabold">Stock</th>
                    <th className="px-4 py-3 font-extrabold">Estado</th>
                    <th className="px-4 py-3 rounded-r-xl font-extrabold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#F0EBE0] hover:bg-[#FBF8F3] transition-colors">
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <div className="flex items-center gap-3 min-w-[250px]">
                          <img
                            src={p.primary_image?.image_url || p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E8E1D5]"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-[#1C1C1C] truncate">{p.name}</div>
                            <div className="text-[10px] text-[#7A746B] truncate">{p.transformation_type || 'Upcycled'} · {p.size || 'Talla única'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <span className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[10px] font-bold text-[#C85A2A]">{p.category?.name || 'Sin categoría'}</span>
                      </td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <div className="font-black text-[#1E5128]">Bs. {parseFloat(p.price).toFixed(0)}</div>
                        {p.original_price && <div className="text-[10px] text-stone-400 line-through">Bs. {parseFloat(p.original_price).toFixed(0)}</div>}
                      </td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.stock <= 2 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-[#1E5128] border border-emerald-200'}`}>{p.stock} unidades</span>
                      </td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <button
                          onClick={() => handleToggleProductActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer ${p.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}
                          title="Cambiar visibilidad"
                        >
                          {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.is_active ? 'Publicado' : 'Oculto'}
                        </button>
                      </td>
                      <td className="px-4 py-3 border-b border-[#F0EBE0]">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEditProduct(p)} className="p-2 rounded-lg border border-[#BFD4BD] bg-[#F4F9F3] text-[#1E5128] hover:bg-[#EAF4E8] cursor-pointer" title="Editar producto">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer" title="Eliminar producto">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-12 text-sm text-[#7A746B]">
                  <ShoppingBag className="w-10 h-10 text-[#C85A2A] mx-auto mb-2 opacity-50" />
                  <p className="font-bold">No hay prendas registradas aún</p>
                  <button onClick={handleOpenNewProduct} className="mt-4 px-4 py-2 bg-[#C85A2A] text-white rounded-xl text-xs font-bold cursor-pointer">Registrar primera prenda</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS MANAGEMENT (RF-097 to RF-100) */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6 animate-fade-in">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C85A2A] via-amber-400 to-[#C85A2A]" />
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#C85A2A]/10 to-amber-50">
                <Package className="w-5 h-5 text-[#C85A2A]" />
              </div>
              <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Control de Pedidos</h2>
              <span className="ml-2 px-2.5 py-0.5 bg-[#C85A2A]/10 text-[#C85A2A] text-[10px] font-bold rounded-full">{orders.length} total</span>
            </div>

            {/* Order Status Summary */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado'].map(s => {
                const count = orders.filter(o => o.status === s).length;
                return (
                  <div key={s} className="px-3 py-1.5 rounded-xl bg-[#FBF8F3] border border-[#F0EBE0] text-[10px] font-semibold text-[#5A544C]">
                    {s}: <span className="font-bold text-[#1C1C1C]">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E8E1D5]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F7F4EE] to-[#FBF8F3]">
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C] rounded-tl-2xl">Código</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Fecha</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Cliente</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Modalidad</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Total</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Pago</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Estado</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C] rounded-tr-2xl">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  {orders.map((ord, idx) => (
                    <tr key={ord.id} className="hover:bg-[#FBF8F3] transition-colors duration-200" style={{animationDelay: `${idx * 30}ms`}}>
                      <td className="p-4">
                        <span className="font-bold text-[#1C1C1C] bg-[#F7F4EE] px-2 py-1 rounded-lg">#{ord.order_number}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-[#5A544C]">
                          <CalendarDays className="w-3.5 h-3.5 text-[#C85A2A]" />
                          {formatOrderDate(ord)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C85A2A] to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {(ord.recipient_name || ord.user?.name || 'U').charAt(0)}
                          </div>
                          <span className="font-medium text-[#1C1C1C]">{ord.recipient_name || ord.user?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg bg-[#F7F4EE] text-[#5A544C] text-[11px] font-medium">{ord.delivery_type}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-[#1E5128] text-sm">Bs. {parseFloat(ord.total).toFixed(0)}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-[#1E5128] font-bold text-[10px] border border-emerald-200">
                          {ord.payment_method} ({ord.payment_status})
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="p-2 bg-white border border-[#DDD5C7] rounded-xl text-xs font-semibold focus:border-[#1E5128] focus:ring-1 focus:ring-[#1E5128]/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Pendiente">⏳ Pendiente</option>
                          <option value="Confirmado">✓ Confirmado</option>
                          <option value="En preparación">🔧 En preparación</option>
                          <option value="Listo">✅ Listo</option>
                          <option value="En camino">🚚 En camino</option>
                          <option value="Listo para retirar">📦 Listo para retirar</option>
                          <option value="Entregado">🎉 Entregado</option>
                          <option value="Retirado">✔ Retirado</option>
                          <option value="Cancelado">❌ Cancelado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => alert(`Detalle del Pedido #${ord.order_number}\nFecha: ${formatOrderDate(ord)}\nProductos: ${ord.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}\nTotal: Bs. ${ord.total}`)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-[#DDD5C7] hover:border-[#1E5128] text-[#1C1C1C] rounded-xl font-bold text-[11px] transition-all hover:shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && (
              <div className="text-center py-12 text-sm text-[#7A746B]">No hay pedidos registrados aún.</div>
            )}
          </div>
        </div>
      )}

      {/* 5. RECOLLECTIONS MANAGEMENT (RF-101 to RF-105) */}
      {activeTab === 'recolecciones' && (
        <div className="space-y-6 animate-fade-in">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E5128] via-emerald-400 to-[#1E5128]" />
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#1E5128]/10 to-emerald-50">
                <Recycle className="w-5 h-5 text-[#1E5128]" />
              </div>
              <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Solicitudes de Recolección</h2>
              <span className="ml-2 px-2.5 py-0.5 bg-emerald-50 text-[#1E5128] text-[10px] font-bold rounded-full border border-emerald-200">{collections.length} solicitudes</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E8E1D5]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F7F4EE] to-[#FBF8F3]">
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C] rounded-tl-2xl">Lote</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Cliente</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Prendas / Kilos</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Fecha y Turno</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C]">Estado</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#5A544C] rounded-tr-2xl">Asignado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  {collections.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-[#FBF8F3] transition-colors duration-200">
                      <td className="p-4">
                        <span className="font-bold text-[#C85A2A] bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">#{c.code}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-[#1E5128] flex items-center justify-center text-white text-[10px] font-bold">
                            {(c.user?.name || 'U').charAt(0)}
                          </div>
                          <span className="font-medium text-[#1C1C1C]">{c.user?.name} {c.user?.last_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-[#1C1C1C]">{c.garment_types}</div>
                          <div className="text-[10px] text-[#7A746B]">~{c.actual_weight || c.estimated_weight} kg</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-[#1C1C1C]">{c.pickup_date}</div>
                          <div className="text-[10px] text-[#7A746B] flex items-center gap-1"><Timer className="w-3 h-3" />{c.pickup_slot}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 text-[#1E5128] border border-emerald-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[#5A544C] font-medium">{c.assigned_producer?.name || 'Taller Central'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {collections.length === 0 && (
              <div className="text-center py-12 text-sm text-[#7A746B]">No hay solicitudes de recolección.</div>
            )}
          </div>
        </div>
      )}

      {/* 7. COUPONS (RF-132, RF-133) */}
      {activeTab === 'cupones' && (
        <div className="space-y-6 animate-fade-in">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-50">
                  <Tag className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">Cupones de Descuento</h2>
                  <p className="text-xs text-[#7A746B]">{coupons.length} cupones activos</p>
                </div>
              </div>
              <button
                onClick={() => setShowCouponModal(true)}
                className="group px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-500/20 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Crear Cupón</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coupons.map((c, idx) => (
              <div key={c.id} className="group relative bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-5">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-[3rem]" />
                
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="font-mono text-xl font-black text-[#1E5128] tracking-wider">{c.code}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Activo
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-violet-600" />
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#FBF8F3] to-white border border-[#F0EBE0]">
                    <span className="text-[10px] font-bold text-[#9A9489] uppercase">Descuento</span>
                    <div className="text-lg font-black text-[#C85A2A] mt-0.5">
                      {c.discount_percent ? `${c.discount_percent}%` : `Bs. ${c.discount_fixed}`}
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#7A746B] pt-2 border-t border-[#F0EBE0]">
                    <span>Mínimo: <strong className="text-[#1C1C1C]">Bs. {c.min_order}</strong></span>
                    <span>Usado: <strong className="text-[#1C1C1C]">{c.used_count || 0} veces</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. USERS */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-remoda text-[#1C1C1C]">
                  Directorio de Usuarios
                </h2>
                <span className="px-2.5 py-0.5 bg-[#EFE9DF] text-[#1E5128] text-xs font-bold rounded-full">
                  {users.length} total
                </span>
              </div>
              <p className="text-xs text-[#7A746B]">
                Gestiona y registra clientes, artesanos/talleres y administradores para que puedan ingresar al sistema.
              </p>
            </div>

            <button
              onClick={handleOpenNewUser}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-bold rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Agregar Nuevo Usuario</span>
            </button>
          </div>

          {/* Search and Role Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F0EBE0]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9489]" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128] transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'Todos', label: 'Todos', count: users.length },
                { id: 'customer', label: 'Clientes', count: users.filter(u => u.role === 'customer').length },
                { id: 'producer', label: 'Productores', count: users.filter(u => u.role === 'producer').length },
                { id: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setUserFilterRole(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    userFilterRole === f.id
                      ? 'bg-[#1E5128] text-white shadow-xs'
                      : 'bg-[#F0EBE0] text-[#5A544C] hover:bg-[#E4DDD0]'
                  }`}
                >
                  {f.label} <span className="opacity-75 text-[10px]">({f.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4EE] text-[#5A544C] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Usuario</th>
                  <th className="p-3.5">Correo Electrónico</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Rol / Permisos</th>
                  <th className="p-3.5">Puntos</th>
                  <th className="p-3.5 rounded-r-xl text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {users
                  .filter(u => {
                    const matchRole = userFilterRole === 'Todos' || u.role === userFilterRole;
                    const q = userSearchTerm.toLowerCase();
                    const matchSearch = !userSearchTerm || 
                      (u.name && u.name.toLowerCase().includes(q)) ||
                      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
                      (u.email && u.email.toLowerCase().includes(q)) ||
                      (u.phone && u.phone.toLowerCase().includes(q));
                    return matchRole && matchSearch;
                  })
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#FBF8F3] transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                            u.role === 'admin' 
                              ? 'bg-purple-700' 
                              : u.role === 'producer' 
                              ? 'bg-[#C85A2A]' 
                              : 'bg-[#1E5128]'
                          }`}>
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-[#1C1C1C] text-sm">{u.name} {u.last_name}</div>
                            <div className="text-[10px] text-[#7A746B]">ID #{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-gray-700">{u.email}</td>
                      <td className="p-3.5 text-gray-600">{u.phone || '—'}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : u.role === 'producer'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100 text-[#1E5128] border border-emerald-200'
                        }`}>
                          <span>{u.role === 'admin' ? '🛡️' : u.role === 'producer' ? '🧵' : '🛍️'}</span>
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[#1E5128]">{u.points_balance || 0} pts</td>
                      <td className="p-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          u.status === 'active' || u.status === 'Activo' || !u.status
                            ? 'bg-emerald-100 text-[#1E5128]'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {u.status === 'active' || !u.status ? 'Activo' : u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. ENVIRONMENTAL IMPACT */}
      {activeTab === 'reportes' && (
        <div className="space-y-6 animate-fade-in">
          {/* Impact Header */}
          <div className="relative bg-gradient-to-br from-[#1E5128] via-emerald-800 to-[#0E150F] rounded-3xl p-8 sm:p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C85A2A]/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  <Leaf className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">Reporte de Sostenibilidad</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-remoda">Impacto Ambiental Consolidado</h2>
              <p className="text-sm text-emerald-200/70 mt-2 max-w-lg">Métricas de sostenibilidad generadas por las operaciones de reciclaje textil y economía circular de ReModa.</p>
            </div>
          </div>

          {/* Impact KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                label: 'Agua Ahorrada',
                value: '3.375.000 L',
                desc: 'Por reciclaje y desvío de algodón/denim',
                icon: Droplets,
                gradient: 'from-sky-500 to-cyan-600',
                bgLight: 'from-sky-50 to-cyan-50',
                borderColor: 'border-sky-200',
                textColor: 'text-sky-700',
                valueColor: 'text-sky-900',
              },
              {
                label: 'CO₂ Evitado',
                value: '4.500 kg',
                desc: 'Equivalente a plantar 215 árboles',
                icon: TreePine,
                gradient: 'from-emerald-500 to-[#1E5128]',
                bgLight: 'from-emerald-50 to-green-50',
                borderColor: 'border-emerald-200',
                textColor: 'text-emerald-700',
                valueColor: 'text-[#1E5128]',
              },
              {
                label: 'Prendas Transformadas',
                value: '250+ Uds',
                desc: 'Piezas únicas comercializadas',
                icon: Zap,
                gradient: 'from-amber-500 to-[#C85A2A]',
                bgLight: 'from-amber-50 to-orange-50',
                borderColor: 'border-amber-200',
                textColor: 'text-amber-700',
                valueColor: 'text-[#C85A2A]',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className={`group relative bg-gradient-to-br ${card.bgLight} rounded-3xl p-6 sm:p-8 border ${card.borderColor} shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden text-center`}>
                  <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${card.textColor} mb-2`}>{card.label}</div>
                  <div className={`text-3xl sm:text-4xl font-black ${card.valueColor} tracking-tight`}>{card.value}</div>
                  <p className={`text-[11px] ${card.textColor} mt-2 opacity-75`}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'configuracion' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-50 text-[#1E5128]
              "><Settings className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold font-serif-remoda">Identidad del sistema</h2>
                <p className="text-xs text-[#7A746B] mt-1">Personaliza los datos principales que identifican tu tienda.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                ['systemName', 'Nombre del sistema', 'Ej. ReModa'],
                ['tagline', 'Lema o descripción corta', 'Ej. Moda circular con propósito'],
                ['contactEmail', 'Correo de contacto', 'hola@tusistema.com'],
                ['contactPhone', 'Teléfono de contacto', '+591 ...'],
                ['address', 'Dirección principal', 'Ciudad, país'],
                ['logoUrl', 'URL o ruta del logo', '/logo-remoda.jpg'],
              ].map(([field, label, placeholder]) => (
                <label key={field} className="space-y-1.5">
                  <span className="text-xs font-bold text-[#5A544C]">{label}</span>
                  <input
                    value={systemSettings[field]}
                    onChange={(event) => updateSystemSetting(field, event.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#E8E1D5] bg-[#FBF8F3] text-sm outline-none focus:border-[#1E5128] focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              ))}
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-[#5A544C]">Color principal</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={systemSettings.primaryColor}
                    onChange={(event) => updateSystemSetting('primaryColor', event.target.value)}
                    className="h-12 w-14 rounded-xl border border-[#E8E1D5] bg-white p-1 cursor-pointer"
                  />
                  <input
                    value={systemSettings.primaryColor}
                    onChange={(event) => updateSystemSetting('primaryColor', event.target.value)}
                    className="flex-1 px-3.5 py-3 rounded-xl border border-[#E8E1D5] bg-[#FBF8F3] text-sm uppercase outline-none focus:border-[#1E5128]"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E8E1D5] grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['maintenanceMode', 'Modo mantenimiento', 'Oculta temporalmente la tienda para visitantes.'],
                ['emailNotifications', 'Notificaciones por correo', 'Recibe avisos generales del sistema.'],
                ['orderNotifications', 'Avisos de pedidos', 'Recibe alertas cuando entra un pedido nuevo.'],
              ].map(([field, label, description]) => (
                <label key={field} className="flex items-start gap-3 p-4 rounded-2xl bg-[#FBF8F3] border border-[#EDE5D8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings[field]}
                    onChange={(event) => updateSystemSetting(field, event.target.checked)}
                    className="mt-0.5 accent-[#1E5128]"
                  />
                  <span>
                    <span className="block text-xs font-bold text-[#1C1C1C]">{label}</span>
                    <span className="block text-[11px] text-[#7A746B] mt-1">{description}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={saveSystemSettings}
                className="px-5 py-3 rounded-xl bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Guardar configuración
              </button>
            </div>
          </div>
        </div>
      )}


      </main>

      {/* ================= CATEGORY MODAL ================= */}

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8E1D5] space-y-5 shadow-2xl animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#E8E1D5] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#C85A2A]">Editor de catálogo</span>
                <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C] mt-1">
                  {editingCategory ? 'Editar Categoría' : 'Registrar Nueva Categoría'}
                </h3>
                <p className="text-xs text-[#7A746B] mt-1">Define cómo se verá y encontrará esta categoría en la tienda.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E1D5]">
                <span className={`w-2 h-2 rounded-full ${catIsActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                <span className="text-[10px] font-bold text-[#5A544C]">{catIsActive ? 'Activa' : 'Oculta'}</span>
              </div>
            </div>
            
            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 p-4 rounded-2xl bg-white border border-[#E8E1D5]">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Nombre de la Categoría *</label>
                  <input type="text" required placeholder="Ej: Mochilas, Vestidos..." value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full p-2.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Orden</label>
                  <input type="number" min="0" value={catOrder} onChange={(e) => setCatOrder(Number(e.target.value))} className="w-full sm:w-24 p-2.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Descripción:</label>
                <textarea
                  rows={2}
                  placeholder="Breve descripción para el catálogo..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#E8E1D5]">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Temporada</label>
                  <select value={catSeason} onChange={(e) => setCatSeason(e.target.value)} className="w-full p-2.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]">
                    {['Todo el año', 'Primavera', 'Verano', 'Otoño', 'Invierno', 'Edición limitada'].map((season) => <option key={season}>{season}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Material principal</label>
                  <select value={catMaterial} onChange={(e) => setCatMaterial(e.target.value)} className="w-full p-2.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]">
                    <option value="">Sin especificar</option>
                    {['Denim', 'Algodón', 'Lana', 'Mezcla', 'Poliéster', 'Cuero recuperado'].map((material) => <option key={material}>{material}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Color distintivo</label>
                  <div className="flex items-center gap-2 p-1.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl">
                    <input type="color" value={catColor} onChange={(e) => setCatColor(e.target.value)} className="w-8 h-7 rounded-lg border-0 p-0 cursor-pointer" />
                    <span className="text-[11px] font-mono text-[#5A544C]">{catColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 p-4 rounded-2xl bg-[#1E5128]/5 border border-[#BFD4BD]">
                <label className="font-semibold text-[#1C1C1C]">Banner de categoría</label>
                <input type="url" placeholder="https://images.unsplash.com/..." value={catBanner} onChange={(e) => setCatBanner(e.target.value)} className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]" />
                {catBanner && <img src={catBanner} alt="Vista previa del banner" className="mt-3 h-28 w-full rounded-xl object-cover border border-[#BFD4BD]" />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E8E1D5]">
                <div className="space-y-1"><label className="font-semibold text-[#1C1C1C]">Meta título SEO</label><input type="text" maxLength={255} placeholder="Mochilas upcycled ReModa" value={catMetaTitle} onChange={(e) => setCatMetaTitle(e.target.value)} className="w-full p-2.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]" /></div>
                <div className="space-y-1"><label className="font-semibold text-[#1C1C1C]">Descripción SEO</label><textarea rows={2} placeholder="Descripción para buscadores..." value={catMetaDescription} onChange={(e) => setCatMetaDescription(e.target.value)} className="w-full p-2.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]" /></div>
              </div>

              <label className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E8E1D5] cursor-pointer">
                <span><span className="block font-semibold text-[#1C1C1C]">Mostrar categoría en la tienda</span><span className="block text-[11px] text-[#7A746B] mt-0.5">Las categorías ocultas no aparecerán en el catálogo público.</span></span>
                <input type="checkbox" checked={catIsActive} onChange={(e) => setCatIsActive(e.target.checked)} className="w-5 h-5 accent-[#1E5128] cursor-pointer" />
              </label>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">URL de Fotografía Representativa:</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                />
              </div>

              {catImage && (
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                  <img src={catImage} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E5128] text-white rounded-xl font-semibold hover:bg-[#163E1F]"
                >
                  {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PRODUCT MODAL WITH FULL PRICE FORM ================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8E1D5] space-y-5 shadow-2xl my-8 animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#C85A2A]">Formulario de Catálogo</span>
              <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
                {editingProduct ? 'Editar Prenda & Precios' : 'Registrar Nueva Prenda Upcycled'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Nombre del Producto:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Mochila Denim Revival"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Categoría:</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* FORMULARIO DE PRECIOS Y DESCUENTOS */}
              <div className="p-4 bg-white rounded-2xl border border-[#E8E1D5] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E5128] uppercase">
                  <DollarSign className="w-4 h-4" />
                  <span>Formulario de Precios & Descuentos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1C1C1C]">Precio de Venta (Bs.):</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      required
                      placeholder="185"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FDFCFB] border border-[#DDD5C7] rounded-xl font-bold text-sm text-[#1E5128] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1C1C1C]">Precio Original / Tachado (Bs.):</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Opcional (Ej: 240)"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-2.5 bg-[#FDFCFB] border border-[#DDD5C7] rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1C1C1C]">Stock Disponible (Uds):</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="5"
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FDFCFB] border border-[#DDD5C7] rounded-xl outline-none font-bold text-[#1C1C1C]"
                    />
                  </div>
                </div>

                {prodOriginalPrice && prodOriginalPrice > prodPrice && (
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#1E5128] font-semibold flex items-center justify-between">
                    <span>Descuento activo en tienda:</span>
                    <span>-{Math.round(((prodOriginalPrice - prodPrice) / prodOriginalPrice) * 100)}% de ahorro para el cliente</span>
                  </div>
                )}
              </div>

              {/* Textile Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Talla:</label>
                  <select
                    value={prodSize}
                    onChange={(e) => setProdSize(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Talla única'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Material:</label>
                  <select
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  >
                    {['Denim', 'Algodón', 'Lana', 'Mezcla', 'Poliéster', 'Lino'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Color:</label>
                  <input
                    type="text"
                    value={prodColor}
                    onChange={(e) => setProdColor(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Proceso:</label>
                  <select
                    value={prodTransformation}
                    onChange={(e) => setProdTransformation(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  >
                    {['Transformado', 'Innovado', 'Reutilizado'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Origin Story & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Historia de Origen / Trazabilidad (RF-015):</label>
                  <input
                    type="text"
                    placeholder="Ej: Fabricada a partir de 2 jeans reutilizados"
                    value={prodStory}
                    onChange={(e) => setProdStory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Distintivo / Badge:</label>
                  <select
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                  >
                    <option value="">Sin distintivo</option>
                    <option value="Más vendido">Más vendido</option>
                    <option value="Edición limitada">Edición limitada</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="¡Últimas!">¡Últimas!</option>
                  </select>
                </div>
              </div>

              {/* Description & Image */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Descripción completa:</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">URL de Fotografía del Producto:</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
                />
              </div>

              {/* Checkboxes for featured */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1C1C1C]">
                  <input
                    type="checkbox"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                    className="accent-[#1E5128] w-4 h-4 rounded"
                  />
                  <span>Mostrar en Productos Destacados (Inicio)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1C1C1C]">
                  <input
                    type="checkbox"
                    checked={prodIsNew}
                    onChange={(e) => setProdIsNew(e.target.checked)}
                    className="accent-[#1E5128] w-4 h-4 rounded"
                  />
                  <span>Mostrar en Nuevos Productos</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E5128] text-white rounded-xl font-semibold hover:bg-[#163E1F] shadow-md"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Guardar y Publicar en Tienda'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= COUPON MODAL ================= */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-md w-full p-6 border border-[#E8E1D5] space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-serif-remoda text-[#1C1C1C]">Crear Cupón de Descuento</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Código (Ej: ECO20)"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none uppercase"
              />
              <input
                type="number"
                placeholder="Porcentaje de descuento (%)"
                required
                value={newCouponPercent}
                onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
              />
              <input
                type="number"
                placeholder="Compra mínima (Bs.)"
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 border border-[#DDD5C7] rounded-xl text-[#4A4A4A]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C85A2A] text-white rounded-xl font-semibold"
                >
                  Crear Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= USER MODAL ================= */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FBF8F3] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8E1D5] space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1E5128] text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif-remoda text-[#1C1C1C]">
                    Registrar Nuevo Usuario
                  </h3>
                  <p className="text-[11px] text-[#7A746B]">
                    El nuevo usuario podrá ingresar inmediatamente con su correo y contraseña
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#DDD5C7] flex items-center justify-center text-[#7A746B] hover:text-[#1C1C1C] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {userModalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                ⚠️ {userModalError}
              </div>
            )}
            {userModalSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                ✅ {userModalSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              
              {/* Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Nombre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Sofía"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Apellido</label>
                  <input
                    type="text"
                    placeholder="Ej: Morales"
                    value={newUserLastName}
                    onChange={(e) => setNewUserLastName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                    <input
                      type="email"
                      required
                      placeholder="usuario@remoda.bo"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#1C1C1C]">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                    <input
                      type="tel"
                      placeholder="+591 7XXXXXXX"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1C1C1C]">Contraseña de Acceso *</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full pl-8 pr-9 py-2.5 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9489] hover:text-[#1C1C1C] cursor-pointer"
                  >
                    {showNewUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C]">Rol y Permisos del Usuario *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'customer', label: '🛍️ Cliente', desc: 'Comprar y donar' },
                    { id: 'producer', label: '🧵 Productor', desc: 'Taller & prendas' },
                    { id: 'admin', label: '🛡️ Admin', desc: 'Control total' },
                  ].map(r => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setNewUserRole(r.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        newUserRole === r.id
                          ? 'bg-white border-[#1E5128] ring-2 ring-[#1E5128]/20 shadow-xs'
                          : 'bg-[#F0EBE0] border-transparent hover:bg-[#E6DFD2]'
                      }`}
                    >
                      <div className="font-bold text-stone-900 text-xs">{r.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-white border border-[#DDD5C7] rounded-2xl">
                <div>
                  <div className="font-bold text-[#1C1C1C]">Estado de la Cuenta</div>
                  <div className="text-[11px] text-[#7A746B]">Habilita o deshabilita el acceso al login</div>
                </div>
                <select
                  value={newUserStatus}
                  onChange={(e) => setNewUserStatus(e.target.value)}
                  className="px-3 py-1.5 bg-[#FBF8F3] border border-[#DDD5C7] rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="active">Activo (Habilitado)</option>
                  <option value="inactive">Inactivo (Suspendido)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2.5 border border-[#DDD5C7] rounded-xl text-[#4A4A4A] font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={userModalLoading}
                  className="px-6 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {userModalLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Registrar Usuario</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
