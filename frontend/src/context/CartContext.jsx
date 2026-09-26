import React, { createContext, useContext, useState, useEffect } from 'react';
import { isClothing } from '../utils/productHelpers';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('remoda_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null); // { code: 'REMODA10', percent: 10 }
  const [redeemedPoints, setRedeemedPoints] = useState(0); // 10 pts = 1 Bs
  const [deliveryType, setDeliveryType] = useState('Envío a domicilio'); // 'Envío a domicilio' | 'Retiro en tienda'
  const [selectedBranch, setSelectedBranch] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [deliverySlot, setDeliverySlot] = useState('14:00 - 18:00');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('remoda_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    setItems(prev => {
      const isCloth = isClothing(product);
      const sizeToUse = isCloth ? (selectedSize || product.size || 'M') : 'Talla única';
      const colorToUse = selectedColor || product.color || 'Original';

      const existingIndex = prev.findIndex(
        item => item.id === product.id && 
                item.selectedSize === sizeToUse && 
                (item.selectedColor || item.color) === colorToUse
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, {
          ...product,
          quantity,
          selectedSize: sizeToUse,
          selectedColor: colorToUse,
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId, selectedSize, selectedColor) => {
    setItems(prev => prev.filter(item => {
      if (item.id !== productId) return true;
      if (selectedSize && item.selectedSize !== selectedSize) return true;
      if (selectedColor && (item.selectedColor || item.color) !== selectedColor) return true;
      return false;
    }));
  };

  const updateQuantity = (productId, selectedSize, quantity, selectedColor) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize, selectedColor);
      return;
    }
    setItems(prev => prev.map(item => {
      const matchSize = !selectedSize || item.selectedSize === selectedSize;
      const matchColor = !selectedColor || (item.selectedColor || item.color) === selectedColor;
      if (item.id === productId && matchSize && matchColor) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const updateSize = (productId, oldSize, newSize, color) => {
    setItems(prev => prev.map(item => {
      const matchColor = !color || (item.selectedColor || item.color) === color;
      if (item.id === productId && item.selectedSize === oldSize && matchColor) {
        return { ...item, selectedSize: newSize };
      }
      return item;
    }));
  };

  const updateColor = (productId, size, oldColor, newColor) => {
    setItems(prev => prev.map(item => {
      const matchSize = !size || item.selectedSize === size;
      const curColor = item.selectedColor || item.color || 'Original';
      if (item.id === productId && matchSize && curColor === oldColor) {
        return { ...item, selectedColor: newColor };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setRedeemedPoints(0);
  };

  // Calculations (RF-021, RF-022)
  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const shippingCost = (deliveryType === 'Envío a domicilio' && items.length > 0) ? 15.00 : 0.00;
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discount_percent) {
      discountAmount = Math.round((subtotal * coupon.discount_percent) / 100);
    } else if (coupon.discount_fixed) {
      discountAmount = Math.min(coupon.discount_fixed, subtotal);
    }
  }

  const pointsDiscount = Math.round((redeemedPoints * 0.10) * 100) / 100;
  const total = Math.max(0, subtotal + shippingCost - discountAmount - pointsDiscount);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'REMODA10') {
      setCoupon({ code: 'REMODA10', discount_percent: 10 });
      return { success: true, message: '¡Cupón REMODA10 aplicado! 10% de descuento.' };
    }
    if (cleanCode === 'BIENVENIDA20') {
      setCoupon({ code: 'BIENVENIDA20', discount_fixed: 20 });
      return { success: true, message: '¡Cupón BIENVENIDA20 aplicado! Bs. 20 de descuento.' };
    }
    return { success: false, message: 'Cupón inválido o expirado' };
  };

  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateSize,
        updateColor,
        clearCart,
        subtotal,
        shippingCost,
        discountAmount,
        pointsDiscount,
        total,
        totalItemsCount,
        coupon,
        applyCoupon,
        removeCoupon,
        redeemedPoints,
        setRedeemedPoints,
        deliveryType,
        setDeliveryType,
        selectedBranch,
        setSelectedBranch,
        selectedAddress,
        setSelectedAddress,
        deliverySlot,
        setDeliverySlot,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
