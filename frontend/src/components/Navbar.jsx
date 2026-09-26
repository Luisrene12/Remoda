import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ChevronDown, Heart, Target, Users, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  onSelectQuienesSomosSection,
  onOpenCollectionModal, 
  onOpenCustomModal 
}) => {
  const { currentUser, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuienesSomosDropdown, setShowQuienesSomosDropdown] = useState(false);

  const handleOpenLogin = () => {
    setCurrentTab('login');
    setMobileMenuOpen(false);
  };

  const handleOpenRegister = () => {
    setCurrentTab('login');
    setMobileMenuOpen(false);
  };

  const handleNavigateTab = (tabName) => {
    setCurrentTab(tabName);
    setShowQuienesSomosDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[74px]">
            
            {/* Logo Brand */}
            <div 
              className="flex items-center gap-2 cursor-pointer select-none group" 
              onClick={() => setCurrentTab('inicio')}
            >
              <img
                src="/logo-remoda.jpg"
                alt="ReModa"
                className="w-12 h-11 object-cover object-top rounded-lg mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-300"
              />
              <span className="text-2xl font-bold font-serif-remoda tracking-tight text-[#173F20]">
                Re<span className="text-[#C85A2A]">Moda</span>
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-2xl bg-[#F4EFE6]/75 border border-[#E8E1D5] text-sm font-medium text-[#4A4A4A] shadow-sm">
              
              {/* Inicio */}
              <button
                onClick={() => setCurrentTab('inicio')}
                className={`transition-colors relative px-3 py-2 rounded-xl hover:text-[#1E5128] hover:bg-white/80 ${
                  currentTab === 'inicio'
                    ? 'text-[#1E5128] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E5128]'
                    : ''
                }`}
              >
                Inicio
              </button>

              {/* Catálogo */}
              <button
                onClick={() => setCurrentTab('catalogo')}
                className={`transition-colors relative px-3 py-2 rounded-xl hover:text-[#1E5128] hover:bg-white/80 ${
                  currentTab === 'catalogo'
                    ? 'text-[#1E5128] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E5128]'
                    : ''
                }`}
              >
                Catálogo
              </button>

              {/* Dropdown: Quiénes somos */}
              <div className="relative">
                <button
                  onClick={() => setShowQuienesSomosDropdown(prev => !prev)}
                  className={`flex items-center gap-1 transition-colors relative px-3 py-2 rounded-xl hover:text-[#1E5128] hover:bg-white/80 cursor-pointer ${
                    ['quienes-somos', 'mision-vision', 'nuestro-equipo', 'ubicacion'].includes(currentTab)
                      ? 'text-[#1E5128] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E5128]'
                      : ''
                  }`}
                >
                  <span>Quiénes somos</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showQuienesSomosDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Submenu Dropdown with ultra-professional styling & smooth transitions */}
                {showQuienesSomosDropdown && (
                  <>
                    {/* Transparent overlay for click-outside close */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowQuienesSomosDropdown(false)} 
                    />

                    <div className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E8E1D5] shadow-[0_20px_60px_-15px_rgba(30,81,40,0.2)] z-50 p-2.5 animate-in fade-in-0 slide-in-from-top-2 duration-300 space-y-1.5 ring-1 ring-black/5">
                      
                      {/* Sub-item 1: Quiénes Somos */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateTab('quienes-somos');
                        }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 text-left group cursor-pointer ${
                          currentTab === 'quienes-somos'
                            ? 'bg-gradient-to-r from-[#1E5128]/10 to-emerald-50 text-[#1E5128] font-bold shadow-sm'
                            : 'text-stone-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-stone-50 hover:text-[#1E5128]'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-[#1E5128] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Heart className="w-4 h-4 fill-white/20" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-stone-900 group-hover:text-[#1E5128] flex items-center justify-between text-sm">
                            <span>Quiénes Somos</span>
                            <span className="text-[10px] text-emerald-600 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                          </div>
                          <div className="text-[11px] text-stone-400 font-normal mt-0.5">Nuestra historia & valores</div>
                        </div>
                      </button>

                      {/* Sub-item 2: Misión y Visión */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateTab('mision-vision');
                        }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 text-left group cursor-pointer ${
                          currentTab === 'mision-vision'
                            ? 'bg-gradient-to-r from-[#C85A2A]/10 to-amber-50 text-[#C85A2A] font-bold shadow-sm'
                            : 'text-stone-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-stone-50 hover:text-[#C85A2A]'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C85A2A] to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-stone-900 group-hover:text-[#C85A2A] flex items-center justify-between text-sm">
                            <span>Misión y Visión</span>
                            <span className="text-[10px] text-[#C85A2A] font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                          </div>
                          <div className="text-[11px] text-stone-400 font-normal mt-0.5">Impacto & metas futuras</div>
                        </div>
                      </button>

                      {/* Sub-item 3: Nuestro Equipo */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateTab('nuestro-equipo');
                        }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 text-left group cursor-pointer border-t border-stone-100 pt-3 ${
                          currentTab === 'nuestro-equipo'
                            ? 'bg-gradient-to-r from-purple-500/10 to-purple-50 text-purple-800 font-bold shadow-sm'
                            : 'text-stone-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-stone-50 hover:text-purple-800'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-stone-900 group-hover:text-purple-800 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5">
                              Nuestro Equipo
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-extrabold rounded-full">5</span>
                            </span>
                            <span className="text-[10px] text-purple-700 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">Ver →</span>
                          </div>
                          <div className="text-[11px] text-stone-400 font-normal mt-0.5">Conoce a los 5 creadores</div>
                        </div>
                      </button>

                    </div>
                  </>
                )}

              </div>

              {/* Ubicación */}
              <button
                onClick={() => setCurrentTab('ubicacion')}
                className={`transition-colors relative px-3 py-2 rounded-xl hover:text-[#1E5128] hover:bg-white/80 ${
                  currentTab === 'ubicacion'
                    ? 'text-[#1E5128] font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#1E5128]'
                    : ''
                }`}
              >
                Ubicación
              </button>



              {/* Donar ropa */}
              <button
                onClick={onOpenCollectionModal}
                className="transition-colors px-3 py-2 rounded-xl hover:text-[#1E5128] hover:bg-white/80"
              >
                Donar ropa
              </button>

              {/* Personalizar */}
              <button
                onClick={onOpenCustomModal}
                className="transition-colors px-3 py-2 rounded-xl hover:text-[#1E5128] hover:bg-white/80"
              >
                Personalizar
              </button>
            </nav>

            {/* Right Area */}
            <div className="flex items-center gap-2">
              
              {/* Shopping Bag */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl text-[#1C1C1C] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                title="Carrito de compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C85A2A] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User / Auth Area */}
              {currentUser && (
                <div className="flex items-center gap-2 p-1 rounded-xl border border-[#DDD5C7] bg-white shadow-sm">
                    <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                      currentUser.role === 'producer' 
                        ? 'bg-[#C85A2A]' 
                        : 'bg-[#1E5128]'
                    }`}>
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-[#1C1C1C] leading-none">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] font-semibold text-[#7A746B] capitalize leading-tight">
                        {currentUser.role === 'producer' ? '🧵 Productor' : '🛍️ Cliente'}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="p-1.5 rounded-lg text-[#7A746B] hover:bg-[#EFE9DF] hover:text-[#1E5128] transition-colors cursor-pointer"
                      title="Cerrar sesión"
                      aria-label="Cerrar sesión"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
              )}

              <button
                onClick={handleOpenLogin}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E5128] hover:bg-[#163E1F] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                title="Ingresar / Iniciar sesión"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>


              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#1C1C1C] cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FBF8F3] border-b border-[#E8E1D5] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
            <button
              onClick={() => { setCurrentTab('inicio'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-base font-medium text-[#4A4A4A] hover:text-[#1E5128]"
            >
              Inicio
            </button>

            <button
              onClick={() => { setCurrentTab('catalogo'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-base font-medium text-[#4A4A4A] hover:text-[#1E5128]"
            >
              Catálogo
            </button>

            <button
              onClick={() => { setCurrentTab('ubicacion'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-base font-medium text-[#4A4A4A] hover:text-[#1E5128]"
            >
              Ubicación
            </button>

            {/* Mobile Quiénes somos accordion */}
            <div className="space-y-1.5 border-l-2 border-[#1E5128] pl-3 py-1">
              <p className="text-xs font-bold text-[#1E5128] uppercase tracking-wider">Quiénes Somos:</p>
              <button
                onClick={() => handleNavigateTab('quienes-somos')}
                className="block w-full text-left py-1 text-sm font-medium text-stone-700 hover:text-[#1E5128]"
              >
                · Quiénes Somos
              </button>
              <button
                onClick={() => handleNavigateTab('mision-vision')}
                className="block w-full text-left py-1 text-sm font-medium text-stone-700 hover:text-[#1E5128]"
              >
                · Misión y Visión
              </button>
              <button
                onClick={() => handleNavigateTab('nuestro-equipo')}
                className="block w-full text-left py-1 text-sm font-medium text-stone-700 hover:text-[#1E5128]"
              >
                · Nuestro Equipo (5)
              </button>
            </div>

            <button
              onClick={() => { onOpenCollectionModal(); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-base font-medium text-[#4A4A4A] hover:text-[#1E5128]"
            >
              Donar ropa
            </button>

            <button
              onClick={() => { onOpenCustomModal(); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-base font-medium text-[#4A4A4A] hover:text-[#1E5128]"
            >
              Personalizar
            </button>

            {/* Mobile Auth */}
            {!currentUser && (
              <div className="pt-2">
                <button
                  onClick={() => { handleOpenLogin(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E5128] text-white rounded-xl text-sm font-bold shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar / Iniciar sesión</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

    </>
  );
};
