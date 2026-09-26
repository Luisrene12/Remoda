import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

import { QuienesSomosView } from './pages/QuienesSomosView';
import { MisionVisionView } from './pages/MisionVisionView';
import { EquipoView } from './pages/EquipoView';

// ─── Lazy-load heavy pages (code split = faster initial load) ─────────────────
const HomePage             = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage          = lazy(() => import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const CustomerProfilePage  = lazy(() => import('./pages/CustomerProfilePage').then(m => ({ default: m.CustomerProfilePage })));
const ProducerDashboardPage= lazy(() => import('./pages/ProducerDashboardPage').then(m => ({ default: m.ProducerDashboardPage })));
const AdminDashboardPage   = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const ProductDetailModal   = lazy(() => import('./components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const CollectionModal      = lazy(() => import('./components/CollectionModal').then(m => ({ default: m.CollectionModal })));
const CustomRequestModal   = lazy(() => import('./components/CustomRequestModal').then(m => ({ default: m.CustomRequestModal })));
const LocationPage         = lazy(() => import('./pages/LocationPage').then(m => ({ default: m.LocationPage })));
const LoginPage            = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));

// ─── Route Mapping Configuration ──────────────────────────────────────────────
const TAB_TO_PATH = {
  inicio: '/',
  catalogo: '/catalogo',
  login: '/login',
  admin: '/admin',
  productor: '/productor',
  'quienes-somos': '/quienes-somos',
  'mision-vision': '/mision-vision',
  'nuestro-equipo': '/nuestro-equipo',
  ubicacion: '/ubicacion',
  cuenta: '/cuenta',
};

const PATH_TO_TAB = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([tab, path]) => [path, tab])
);

// ─── Minimal page loader ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#1E5128]/20 border-t-[#1E5128] animate-spin" />
        <span className="text-sm font-semibold text-stone-500">Cargando...</span>
      </div>
    </div>
  );
}

function MainApp() {
  const { currentUser, activeRole, switchRole } = useAuth();

  // Initialize tab state from initial URL pathname
  const getInitialTab = () => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return PATH_TO_TAB[path] || 'inicio';
  };

  const [currentTab, setCurrentTabState] = useState(getInitialTab);

  // Auto-authenticate when entering protected routes directly (e.g. /admin)
  React.useEffect(() => {
    if (currentTab === 'admin' && currentUser?.role !== 'admin') {
      switchRole('admin');
    }
  }, [currentTab, currentUser, switchRole]);

  // Synchronize state changes with window.history URL address bar
  const setCurrentTab = useCallback((tab) => {
    setCurrentTabState(tab);
    const targetPath = TAB_TO_PATH[tab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  }, []);

  // Listen to browser Back / Forward buttons
  React.useEffect(() => {
    const handlePopState = (e) => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const tab = PATH_TO_TAB[path] || (e.state && e.state.tab) || 'inicio';
      setCurrentTabState(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('todas');
  const [quienesSomosSection, setQuienesSomosSection] = useState('historia');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [favorites, setFavorites] = useState([1, 3]);

  // ─── Stable callbacks (no re-render cascade) ────────────────────────────────
  const handleToggleFavorite = useCallback((productId) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const handleCategorySelect = useCallback((categorySlug) => {
    setSelectedCategoryFilter(categorySlug);
    setCurrentTab('catalogo');
  }, [setCurrentTab]);

  const openCollection  = useCallback(() => setIsCollectionOpen(true),  []);
  const closeCollection = useCallback(() => setIsCollectionOpen(false), []);
  const openCustom      = useCallback(() => setIsCustomOpen(true),      []);
  const closeCustom     = useCallback(() => setIsCustomOpen(false),     []);
  const closeProduct    = useCallback(() => setSelectedProduct(null),   []);

  // ─── Derived ────────────────────────────────────────────────────────────────
  const isProductFavorite = useMemo(
    () => selectedProduct ? favorites.includes(selectedProduct.id) : false,
    [selectedProduct, favorites]
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E8E0D4] text-[#1C1C1C]">

      {!['login', 'admin', 'productor'].includes(currentTab) && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onSelectQuienesSomosSection={setQuienesSomosSection}
          onOpenCollectionModal={openCollection}
          onOpenCustomModal={openCustom}
        />
      )}

      {/* Visual Route & Breadcrumb Indicator */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {currentTab === 'login' && (
            <LoginPage setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'inicio' && (
            <HomePage
              onSelectProduct={setSelectedProduct}
              onOpenCollectionModal={openCollection}
              onOpenCustomModal={openCustom}
              setCurrentTab={setCurrentTab}
              onSelectCategory={handleCategorySelect}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === 'catalogo' && (
            <CatalogPage
              onSelectProduct={setSelectedProduct}
              initialCategory={selectedCategoryFilter}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentTab === 'quienes-somos' && (
            <QuienesSomosView
              setCurrentTab={setCurrentTab}
              onOpenCollectionModal={openCollection}
              onOpenCustomModal={openCustom}
            />
          )}

          {currentTab === 'mision-vision' && (
            <MisionVisionView
              setCurrentTab={setCurrentTab}
              onOpenCollectionModal={openCollection}
              onOpenCustomModal={openCustom}
            />
          )}

          {currentTab === 'nuestro-equipo' && (
            <EquipoView
              setCurrentTab={setCurrentTab}
              onOpenCustomModal={openCustom}
            />
          )}

          {currentTab === 'cuenta' && (
            <CustomerProfilePage
              onOpenCollectionModal={openCollection}
              onOpenCustomModal={openCustom}
            />
          )}

          {currentTab === 'ubicacion' && (
            <LocationPage
              setCurrentTab={setCurrentTab}
              onOpenCollectionModal={openCollection}
            />
          )}

          {currentTab === 'productor' && <ProducerDashboardPage />}
          {currentTab === 'admin'    && <AdminDashboardPage setCurrentTab={setCurrentTab} />}
        </Suspense>
      </main>

      {/* Global Modals — loaded only when needed */}
      <Suspense fallback={null}>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={closeProduct}
            isFavorite={isProductFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {isCollectionOpen && (
          <CollectionModal isOpen={isCollectionOpen} onClose={closeCollection} />
        )}

        {isCustomOpen && (
          <CustomRequestModal isOpen={isCustomOpen} onClose={closeCustom} />
        )}
      </Suspense>

      <CartDrawer />

      {!['login', 'admin', 'productor'].includes(currentTab) && (
        <Footer
          setCurrentTab={setCurrentTab}
          onOpenCollectionModal={openCollection}
          onOpenCustomModal={openCustom}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
