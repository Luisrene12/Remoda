import React, { useState } from 'react';
import { X, Scissors, Sparkles, CheckCircle2, Upload, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CustomRequestModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();

  const [sourceGarment, setSourceGarment] = useState('Mi Jean vintage Lee en desuso');
  const [targetTransformation, setTargetTransformation] = useState('Mochila');
  const [instructions, setInstructions] = useState('Quiero convertirlo en una mochila urbana con bolsillo frontal y forro impermeable.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState(null);

  if (!isOpen) return null;

  const transformationTypes = [
    { id: 'Mochila', label: 'Mochila', icon: '🎒' },
    { id: 'Bolso', label: 'Bolso / Tote', icon: '👜' },
    { id: 'Cartera', label: 'Cartera de mano', icon: '👝' },
    { id: 'Accesorio', label: 'Accesorio / Gorro', icon: '🧢' },
    { id: 'Prenda nueva', label: 'Prenda Nueva', icon: '✂️' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      user_id: currentUser?.id || 3,
      source_garment: sourceGarment,
      target_transformation: targetTransformation,
      instructions,
    };

    try {
      const res = await api.createCustomRequest(payload);
      if (res.custom_request) {
        setSuccessCode(res.custom_request.code);
      }
    } catch (err) {
      setSuccessCode('CUST-' + Math.floor(10000 + Math.random() * 90000));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#FBF8F3] rounded-3xl max-w-xl w-full border border-[#E8E1D5] shadow-2xl relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        {successCode ? (
          <div className="text-center space-y-5 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1E5128] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#C85A2A]">¡Solicitud Recibida!</span>
              <h3 className="text-2xl font-bold font-serif-remoda text-[#1C1C1C]">
                Código #{successCode}
              </h3>
              <p className="text-xs text-[#6B655B] max-w-md mx-auto">
                Uno de nuestros maestros de confección evaluará la viabilidad de la prenda y te enviará una cotización personalizada en tu panel de cuenta.
              </p>
            </div>

            <button
              onClick={() => {
                setSuccessCode(null);
                onClose();
              }}
              className="w-full py-3 bg-[#1E5128] text-white rounded-xl text-sm font-semibold hover:bg-[#163E1F] transition-colors"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#C85A2A] bg-orange-100/70">
                <Scissors className="w-3.5 h-3.5" />
                <span>Atelier de Upcycling a Medida</span>
              </div>
              <h2 className="text-2xl font-bold font-serif-remoda text-[#1C1C1C]">
                Personalizar mi propia prenda
              </h2>
              <p className="text-xs text-[#6E675D]">
                Trae o envía tu prenda favorita en desuso y la transformamos en el producto que elijas.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Target Transformation options */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C]">¿En qué quieres transformarla?:</label>
                <div className="grid grid-cols-3 gap-2">
                  {transformationTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTargetTransformation(t.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                        targetTransformation === t.id
                          ? 'bg-[#1E5128] text-white border-[#1E5128]'
                          : 'bg-white border-[#DDD5C7] text-[#4A4A4A]'
                      }`}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Source garment description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C]">Prenda original a transformar:</label>
                <input
                  type="text"
                  required
                  value={sourceGarment}
                  onChange={(e) => setSourceGarment(e.target.value)}
                  placeholder="Ej: Pantalón vaquero Levi's talla 32, Chamarra de cuero..."
                  className="w-full p-3 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C]">Instrucciones y especificaciones de diseño:</label>
                <textarea
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Describe detalles como bolsillos, colores, tipo de forro, cierres o bordados personalizados..."
                  rows={3}
                  className="w-full p-3 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                />
              </div>

              <div className="p-3 bg-[#EFE9DF] rounded-xl border border-[#DDD5C7] text-[11px] text-[#6E6659]">
                💡 <strong>¿Cómo funciona?</strong> Evaluamos la tela, te enviamos una cotización y tiempo de entrega. Cuando la apruebes, recogemos la prenda y comenzamos la confección.
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando solicitud...' : 'Solicitar Evaluación y Cotización'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
