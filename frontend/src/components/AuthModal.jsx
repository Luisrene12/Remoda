import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Calendar, Eye, EyeOff, MapPin, ArrowRight, Sparkles, Recycle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialView = 'login', onSuccessLogin }) => {
  const { login, register, switchRole } = useAuth();
  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBirth, setRegBirth] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Santa Cruz');
  const [regZone, setRegZone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // Sync initialView
  React.useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleRoleQuickLogin = async (role, email, pass) => {
    setError('');
    setLoading(true);
    setLoginEmail(email);
    setLoginPassword(pass);
    const result = await login(email, pass);
    setLoading(false);
    if (result.success) {
      const userRole = result.user?.role || role;
      if (onSuccessLogin) {
        onSuccessLogin(userRole === 'admin' ? 'admin' : userRole === 'producer' ? 'productor' : 'inicio');
      }
      onClose();
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      const userRole = result.user?.role || 'customer';
      if (onSuccessLogin) {
        onSuccessLogin(userRole === 'admin' ? 'admin' : userRole === 'producer' ? 'productor' : 'inicio');
      }
      onClose();
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (regPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    const result = await register({
      name: regName,
      last_name: regLastName,
      email: regEmail,
      phone: regPhone,
      birth_date: regBirth,
      address: regAddress,
      city: regCity,
      zone: regZone,
      password: regPassword,
    });
    setLoading(false);
    if (result.success) {
      setSuccess('¡Cuenta creada exitosamente! Bienvenido/a a ReModa. 🎉');
      if (onSuccessLogin) {
        onSuccessLogin('inicio');
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.message || 'Error al crear la cuenta');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(`Hemos enviado un enlace de recuperación a ${forgotEmail}. Revisa tu correo.`);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#FBF8F3] rounded-3xl max-w-md w-full shadow-2xl border border-[#E8E1D5] overflow-hidden max-h-[95vh] overflow-y-auto">
        
        {/* Header Banner */}
        <div className="relative bg-[#1C1C1A] pt-8 pb-10 px-8 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#C85A2A]/20" />
          <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-[#1E5128]/30" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E5128] flex items-center justify-center text-white font-black text-xs shadow-sm">
                RM
              </div>
              <span className="text-lg font-bold font-serif-remoda text-white tracking-tight">
                Re<span className="text-[#C85A2A]">Moda</span>
              </span>
            </div>
            
            {view === 'login' && (
              <>
                <h2 className="text-2xl font-bold text-white font-serif-remoda">Ingresar a ReModa</h2>
                <p className="text-sm text-white/60 mt-1">Inicia sesión con tu correo o selecciona un usuario</p>
              </>
            )}
            {view === 'register' && (
              <>
                <h2 className="text-2xl font-bold text-white font-serif-remoda">Crea tu cuenta</h2>
                <p className="text-sm text-white/60 mt-1">Únete a la comunidad de moda circular</p>
              </>
            )}
            {view === 'forgot' && (
              <>
                <h2 className="text-2xl font-bold text-white font-serif-remoda">Recuperar contraseña</h2>
                <p className="text-sm text-white/60 mt-1">Te enviaremos un enlace a tu correo</p>
              </>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        {view !== 'forgot' && (
          <div className="flex border-b border-[#E8E1D5] bg-white">
            <button
              onClick={() => { setView('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors relative cursor-pointer ${
                view === 'login' 
                  ? 'text-[#1E5128] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E5128]' 
                  : 'text-[#7A746B] hover:text-[#1C1C1C]'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setView('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors relative cursor-pointer ${
                view === 'register' 
                  ? 'text-[#1E5128] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E5128]' 
                  : 'text-[#7A746B] hover:text-[#1C1C1C]'
              }`}
            >
              Crear cuenta
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
              ✅ {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {view === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9489]" />
                    <input
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD5C7] rounded-xl text-sm outline-none focus:border-[#1E5128] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9489]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Tu contraseña"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white border border-[#DDD5C7] rounded-xl text-sm outline-none focus:border-[#1E5128] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9489] hover:text-[#1C1C1C] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-[#5A554E] cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#1E5128] rounded" />
                    <span>Recordarme</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                    className="text-xs font-semibold text-[#C85A2A] hover:text-[#B34D21] cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#1E5128] hover:bg-[#163E1F] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* REGISTER FORM */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Nombre *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                    <input
                      type="text"
                      required
                      placeholder="María"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="López"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1C1C1C]">Correo electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                    <input
                      type="tel"
                      required
                      placeholder="+591 7XXXXXXX"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Fecha de nac.</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                    <input
                      type="date"
                      value={regBirth}
                      onChange={(e) => setRegBirth(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1C1C1C]">Dirección principal</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                  <input
                    type="text"
                    placeholder="Av. San Martín, Calle 7 Oeste #45"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Ciudad</label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                  >
                    <option>Santa Cruz</option>
                    <option>La Paz</option>
                    <option>Cochabamba</option>
                    <option>Sucre</option>
                    <option>Oruro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Zona / Barrio</label>
                  <input
                    type="text"
                    placeholder="Equipetrol Norte"
                    value={regZone}
                    onChange={(e) => setRegZone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Contraseña *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="Mín. 8 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1C1C1C]">Confirmar contraseña *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repite tu contraseña"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD5C7] rounded-xl text-xs outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#5A554E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="accent-[#1E5128] rounded"
                />
                <span>Mostrar contraseñas</span>
              </label>

              <div className="p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl flex items-start gap-2">
                <Recycle className="w-4 h-4 text-[#1E5128] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800">
                  Al crear tu cuenta recibes <strong>50 puntos de bienvenida</strong> canjeables por descuentos en tu próxima compra.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1E5128] hover:bg-[#163E1F] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Crear mi cuenta</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-[#7A746B]">
                Ingresa el correo registrado y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1C1C]">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9489]" />
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD5C7] rounded-xl text-sm outline-none focus:border-[#1E5128]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full py-3.5 rounded-xl bg-[#C85A2A] hover:bg-[#B34D21] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Enviar enlace de recuperación</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                className="w-full text-sm font-medium text-[#7A746B] hover:text-[#1C1C1C] transition-colors"
              >
                ← Volver al inicio de sesión
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
