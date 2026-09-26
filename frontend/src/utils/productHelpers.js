/**
 * Product category and variant helpers for ReModa
 */

export const isClothing = (product) => {
  if (!product) return false;
  const cat = String(product.category?.slug || product.category?.name || product.category || '').toLowerCase();
  const name = String(product.name || '').toLowerCase();

  // Bags, backpacks, wallets, accessories
  const nonClothingKeywords = [
    'bolso', 'mochila', 'cartera', 'bolson', 'accesorio', 'gargantilla', 
    'collar', 'cinturon', 'sombrero', 'hat', 'tote', 'crossbody', 'sobre', 'billetera'
  ];
  if (nonClothingKeywords.some(kw => cat.includes(kw) || name.includes(kw))) {
    return false;
  }

  // Explicit clothing items
  const clothingKeywords = [
    'camiseta', 'polera', 'jean', 'pantalon', 'chaqueta', 'chamarra', 
    'vestido', 'abrigo', 'camisa', 'falda', 'ropa', 'top', 'blusa', 'bomber', 'cargo', 'lino'
  ];
  if (clothingKeywords.some(kw => cat.includes(kw) || name.includes(kw))) {
    return true;
  }

  // Fallback: If product.size is 'Talla única' and has no clothing keyword, it's non-clothing
  return product.size !== 'Talla única';
};

export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const getAvailableColors = (product) => {
  if (!product) return ['Original'];
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
    return product.colors;
  }

  const baseColor = product.color || 'Original';
  const mat = String(product.material || '').toLowerCase();
  const name = String(product.name || '').toLowerCase();

  let variants = [baseColor];

  if (mat.includes('denim') || name.includes('jean') || name.includes('denim')) {
    variants = [baseColor, 'Azul Claro', 'Azul Índigo', 'Negro Carbón'];
  } else if (mat.includes('algod') || name.includes('camiseta') || name.includes('polera')) {
    variants = [baseColor, 'Blanco Hueso', 'Terracota', 'Verde Oliva', 'Negro'];
  } else if (name.includes('vestido') || mat.includes('lino') || name.includes('camisero')) {
    variants = [baseColor, 'Arena / Beige', 'Azul Índigo', 'Terracota', 'Rosa Palo'];
  } else if (name.includes('chaqueta') || name.includes('chamarra') || mat.includes('mezcla')) {
    variants = [baseColor, 'Terracota / Ocre', 'Verde Militar', 'Azul Índigo', 'Negro'];
  } else {
    variants = [baseColor, 'Tono Original', 'Azul Índigo', 'Verde Oliva', 'Terracota'];
  }

  // Remove duplicates while keeping order
  return [...new Set(variants.filter(Boolean))];
};

export const getColorHex = (colorName) => {
  const c = String(colorName).toLowerCase();
  if (c.includes('blanco') || c.includes('hueso') || c.includes('crudo') || c.includes('ecru')) return '#F5F2EB';
  if (c.includes('negro') || c.includes('carb')) return '#222222';
  if (c.includes('claro') || c.includes('deslavado')) return '#7FA1C3';
  if (c.includes('oscuro') || c.includes('índigo') || c.includes('indigo') || c.includes('denim') || c.includes('azul')) return '#2A4365';
  if (c.includes('terracota') || c.includes('canela') || c.includes('teja') || c.includes('naranja')) return '#C85A2A';
  if (c.includes('militar') || c.includes('oliva') || c.includes('verde')) return '#3B5336';
  if (c.includes('mostaza') || c.includes('ocre') || c.includes('amarillo')) return '#D97706';
  if (c.includes('arena') || c.includes('beige')) return '#E7DBCE';
  if (c.includes('rosa')) return '#E0A9A5';
  if (c.includes('gris') || c.includes('marengo')) return '#64748B';
  return '#1E5128';
};

export const isLightColor = (hex) => {
  if (!hex) return false;
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
};
