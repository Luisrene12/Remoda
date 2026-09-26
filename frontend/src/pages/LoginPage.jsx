import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ setCurrentTab }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await login(loginEmail, loginPassword);
      setLoading(false);
      if (result && result.success) {
        setSuccess('Credenciales confirmadas. Bienvenido/a.');
        const userRole = result.user?.role || 'customer';
        setTimeout(() => {
          if (userRole === 'admin') {
            setCurrentTab('admin');
          } else if (userRole === 'producer') {
            setCurrentTab('productor');
          } else {
            setCurrentTab('inicio');
          }
        }, 700);
      } else {
        setError(result?.message || 'Correo o contraseña incorrectos. Por favor verifica tus datos.');
      }
    } catch (err) {
      setLoading(false);
      setError('No se pudo establecer conexión con el servidor.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#091B15] flex flex-col justify-between selection:bg-[#BDEBC5] selection:text-[#10251D] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(167,225,178,0.2),transparent_30%),radial-gradient(circle_at_88%_82%,rgba(198,104,57,0.25),transparent_34%),linear-gradient(135deg,#071710,#102D22_52%,#2A211C)] pointer-events-none" />

      {/* Top Floating Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-5 sm:pt-7 pb-2 flex items-center justify-between z-10">
        <button
          onClick={() => setCurrentTab('inicio')}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/90 backdrop-blur-md border border-white hover:border-[#BDEBC5] text-xs font-extrabold text-[#173F20] hover:text-[#1E5128] transition-all shadow-lg hover:shadow-xl cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a la tienda</span>
        </button>

        <div 
          onClick={() => setCurrentTab('inicio')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1E5128] text-[#F8F3E9] flex items-center justify-center shadow-md group-hover:rotate-[-6deg] transition-transform">
            <span className="font-serif-remoda text-xl font-bold">R</span>
          </div>
          <span className="text-xl font-bold font-serif-remoda tracking-tight text-[#F8F3E9] drop-shadow-sm">
            Re<span className="text-[#B85A32]">Moda</span>
          </span>
        </div>
      </header>

      {/* Main Luxury Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 z-10">
        <div className="max-w-5xl w-full bg-[#F8F7F1]/88 backdrop-blur-2xl rounded-[30px] border border-white/40 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.65)] overflow-hidden relative grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr]">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#BDEBC5] to-transparent" />
          <div className="hidden md:flex relative min-h-[600px] items-center justify-center bg-[#E8E4D8]/80 p-5 border-r border-[#1E5128]/10">
            <img
              src="/logo-remoda.jpg"
              alt="ReModa - Ropa con una nueva historia"
              className="w-full h-full object-contain rounded-2xl shadow-[0_20px_45px_-24px_rgba(0,0,0,0.65)]"
            />
            <div className="absolute inset-x-7 bottom-7 rounded-xl bg-white/85 backdrop-blur-md px-4 py-3 text-center shadow-lg">
              <p className="font-serif-remoda text-sm font-bold text-[#173F20]">Ropa con una nueva historia</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1E5128]">Reutiliza · Cuida · El planeta</p>
            </div>
          </div>
          <div className="p-7 sm:p-10 flex flex-col justify-center">
            
            {/* Brand Logo & Header Content */}
            <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-[#1E5128]/15">
              <div className="w-12 h-12 rounded-2xl bg-[#1E5128] text-[#F8F3E9] shadow-[0_0_22px_rgba(64,180,92,0.35)] shrink-0 flex items-center justify-center relative overflow-hidden">
                <span className="font-serif-remoda text-3xl font-bold leading-none">R</span>
                <span className="absolute bottom-1.5 right-2 text-[9px] text-[#D7E4D1]">*</span>
              </div>
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1E5128]">
                  <LockKeyhole className="w-3.5 h-3.5 text-[#1E5128]" />
                  <span>Portal Oficial ReModa</span>
                </div>
                <h1 className="text-[2rem] sm:text-4xl font-bold font-serif-remoda text-[#10251D] tracking-tight leading-none mt-1">
                  Iniciar Sesión
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-medium mb-7 text-left leading-relaxed max-w-md">
              Ingresa tu correo y contraseña para acceder a tu perfil y panel de control.
            </p>

            {/* Error & Success Feedback Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl text-xs sm:text-sm text-red-700 font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-[#1E5128] shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* PURE LOGIN FORM: ONLY EMAIL & PASSWORD */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#1E5128] transition-colors pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="nombre@remoda.bo"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-[#D8CFC1] rounded-xl text-sm font-medium outline-none focus:border-[#1E5128] focus:ring-4 focus:ring-[#1E5128]/10 transition-all text-stone-900 shadow-sm hover:border-stone-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#1E5128] transition-colors pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/80 border border-[#D8CFC1] rounded-xl text-sm font-medium outline-none focus:border-[#1E5128] focus:ring-4 focus:ring-[#1E5128]/10 transition-all text-stone-900 shadow-sm hover:border-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer p-1"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Session & Forgot Password Line */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-stone-600 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#1E5128] cursor-pointer"
                  />
                  <span className="group-hover:text-stone-900 transition-colors">Recordar mis datos</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-bold text-[#C85A2A] hover:text-[#9A3C13] transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* High-Impact Luxury Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-4 px-6 rounded-xl bg-[#1E5128] hover:bg-[#173F20] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-[0_12px_30px_-5px_rgba(30,81,40,0.3)] hover:shadow-[0_16px_36px_-6px_rgba(30,81,40,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer group"
              >
                {loading ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando acceso...</span>
                  </div>
                ) : (
                  <>
                    <span>Entrar a ReModa</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </button>

            </form>

            {/* Bottom Security Assurance */}
            <div className="mt-8 pt-6 border-t border-[#EAE3D4] flex items-center justify-center gap-2 text-[11px] text-stone-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Autenticación protegida para clientes, artesanos y administradores.</span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-[11px] text-white/65 font-medium z-10">
        ReModa Bolivia · Moda Circular & Upcycling Consciente © 2026
      </footer>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E8E1D5] shadow-2xl space-y-4">
            <h3 className="text-xl font-bold font-serif-remoda text-[#1C1C1C]">
              Recuperar Contraseña
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace seguro para restablecer tu contraseña.
            </p>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E5128]" />
                  <span>Enlace de recuperación enviado con éxito.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSuccess(false);
                    setForgotEmail('');
                  }}
                  className="w-full py-2.5 bg-[#1E5128] text-white rounded-xl text-xs font-bold"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#DDD5C7] rounded-xl outline-none focus:border-[#1E5128] text-xs font-medium"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="px-4 py-2 border border-[#DDD5C7] rounded-xl font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-[#1E5128] text-white rounded-xl font-bold shadow-sm"
                  >
                    {loading ? 'Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
