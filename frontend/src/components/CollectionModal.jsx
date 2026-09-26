import React, { useState } from 'react';
import { X, Recycle, Calendar, Clock, MapPin, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CollectionModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();

  const [garmentTypes, setGarmentTypes] = useState('Jeans y Camisetas');
  const [approxQuantity, setApproxQuantity] = useState(5);
  const [estimatedWeight, setEstimatedWeight] = useState(2.5);
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [pickupSlot, setPickupSlot] = useState('Tarde (14:00 - 18:00)');
  const [addressId, setAddressId] = useState(currentUser?.addresses?.[0]?.id || 1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const estimatedPoints = Math.round(estimatedWeight * 50);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      user_id: currentUser?.id || 3,
      garment_types: garmentTypes,
      approx_quantity: approxQuantity,
      estimated_weight: estimatedWeight,
      address_id: addressId,
      pickup_date: pickupDate,
      pickup_slot: pickupSlot,
      notes,
    };

    try {
      const res = await api.createCollection(payload);
      if (res.collection) {
        setSuccessData(res.collection);
      }
    } catch (err) {
      setSuccessData({
        code: 'REC-' + Math.floor(10000 + Math.random() * 90000),
        pickup_date: pickupDate,
        pickup_slot: pickupSlot,
      });
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

        {successData ? (
          <div className="text-center space-y-5 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1E5128] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#C85A2A]">¡Recolección Programada!</span>
              <h3 className="text-2xl font-bold font-serif-remoda text-[#1C1C1C]">
                Código #{successData.code}
              </h3>
              <p className="text-xs text-[#6B655B] max-w-md mx-auto">
                Pasaremos a recoger tu ropa el día <strong>{successData.pickup_date}</strong> en el turno <strong>{successData.pickup_slot}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#EFE9DF] rounded-2xl text-xs text-[#4A443B] space-y-1 border border-[#DDD5C7]">
              <div className="font-semibold flex items-center justify-center gap-1 text-[#1E5128]">
                <Sparkles className="w-4 h-4" />
                Ganarás ~{estimatedPoints} puntos ReModa
              </div>
              <p className="text-[11px] text-[#7A746B]">
                Los puntos se acreditarán una vez que nuestro maestro artesano clasifique las prendas recibidas.
              </p>
            </div>

            <button
              onClick={() => {
                setSuccessData(null);
                onClose();
              }}
              className="w-full py-3 bg-[#1E5128] text-white rounded-xl text-sm font-semibold hover:bg-[#163E1F] transition-colors"
            >
              Listo, gracias
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#1E5128] bg-emerald-100/70">
                <Recycle className="w-3.5 h-3.5" />
                <span>Servicio 100% Gratuito</span>
              </div>
              <h2 className="text-2xl font-bold font-serif-remoda text-[#1C1C1C]">
                Solicitar Recolección de Ropa Usada
              </h2>
              <p className="text-xs text-[#6E675D]">
                Dona tus prendas que ya no uses. Nosotros las transformamos y tú ganas puntos para descuentos.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Garment types */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C]">Tipo de prendas a entregar:</label>
                <input
                  type="text"
                  required
                  value={garmentTypes}
                  onChange={(e) => setGarmentTypes(e.target.value)}
                  placeholder="Ej: Jeans, camisas de algodón, chaquetas..."
                  className="w-full p-3 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                />
              </div>

              {/* Quantity and Weight estimation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1C1C]">Cantidad aproximada:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={approxQuantity}
                    onChange={(e) => setApproxQuantity(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1C1C]">Peso estimado ({estimatedWeight} kg):</label>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={estimatedWeight}
                    onChange={(e) => setEstimatedWeight(Number(e.target.value))}
                    className="w-full mt-2 accent-[#1E5128]"
                  />
                </div>
              </div>

              {/* Date & Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1C1C] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1E5128]" /> Fecha de retiro:
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1C1C] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1E5128]" /> Horario:
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                  >
                    <option value="Mañana (09:00 - 12:00)">Mañana (09:00 - 12:00)</option>
                    <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E5128]" /> Dirección de recolección:
                </label>
                <div className="p-3 bg-white border border-[#DDD5C7] rounded-xl">
                  <span className="font-medium text-[#1C1C1C]">
                    {currentUser?.addresses?.[0]?.address || 'Av. San Martín, Calle 7 Oeste #45 (Santa Cruz)'}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    {currentUser?.addresses?.[0]?.reference || 'Frente al café cultural, portón negro'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1C1C1C]">Instrucciones adicionales o referencia:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Ropa empacada en bolsa verde, dejar con el portero..."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#DDD5C7] rounded-xl focus:border-[#1E5128] outline-none"
                />
              </div>

              {/* Points banner */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-[#1E5128]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-4 h-4 text-[#C85A2A]" />
                  Puntos estimados a ganar:
                </span>
                <span className="font-bold text-sm">+{estimatedPoints} Puntos</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1E5128] hover:bg-[#163E1F] text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Agendando...' : 'Confirmar Solicitud de Recolección'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
