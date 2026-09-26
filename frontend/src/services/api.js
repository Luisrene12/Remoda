/**
 * ReModa API Service — with in-memory cache & request deduplication
 * Categories and products are cached for 60s to avoid redundant fetches
 */

const API_URL = (import.meta.env.VITE_API_URL ?? '') + '/api';

// ─── Simple in-memory cache ──────────────────────────────────────────────────
const _cache = new Map();

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { _cache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key, data, ttlMs = 60_000) {
  _cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearApiCache(key) {
  if (key) _cache.delete(key);
  else _cache.clear();
}

// ─── Request deduplication: avoid parallel identical requests ─────────────────
const _pending = new Map();

async function cachedFetch(url, ttlMs = 60_000) {
  const cached = cacheGet(url);
  if (cached) return cached;

  if (_pending.has(url)) return _pending.get(url);

  const promise = fetch(url, {
    headers: { Accept: 'application/json' },
  })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      cacheSet(url, data, ttlMs);
      _pending.delete(url);
      return data;
    })
    .catch((err) => {
      _pending.delete(url);
      throw err;
    });

  _pending.set(url, promise);
  return promise;
}

// ─── POST/PUT/DELETE helper with 7s timeout ──────────────────────────────────
async function apiRequest(url, method, body, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ─── API surface ──────────────────────────────────────────────────────────────
export const api = {
  // Auth
  login: (email, password) => apiRequest(`${API_URL}/auth/login`, 'POST', { email, password }),
  register: (data) => apiRequest(`${API_URL}/auth/register`, 'POST', data),
  updateProfile: (id, data) => apiRequest(`${API_URL}/auth/profile/${id}`, 'PUT', data),
  addAddress: (userId, data) => apiRequest(`${API_URL}/auth/addresses/${userId}`, 'POST', data),

  // Home & Products — CACHED
  getHomeData: () => cachedFetch(`${API_URL}/home`, 120_000),
  getCategories: () => cachedFetch(`${API_URL}/categories`, 300_000), // 5 min cache

  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_URL}/products${query ? `?${query}` : ''}`;
    // Only cache "all products" without filters for 60s; filtered queries 30s
    const hasFilters = Object.keys(params).some(k => k !== 'sort');
    return cachedFetch(url, hasFilters ? 30_000 : 60_000);
  },

  getProduct: (id) => cachedFetch(`${API_URL}/products/${id}`, 120_000),

  // Products CRUD — invalidate cache on write
  createProduct: (data) => apiRequest(`${API_URL}/products`, 'POST', data).then(r => { clearApiCache(); return r; }),
  updateProduct: (id, data) => apiRequest(`${API_URL}/products/${id}`, 'PUT', data).then(r => { clearApiCache(); return r; }),
  deleteProduct: (id) => apiRequest(`${API_URL}/products/${id}`, 'DELETE').then(r => { clearApiCache(); return r; }),
  addReview: (pid, d) => apiRequest(`${API_URL}/products/${pid}/reviews`, 'POST', d),

  // Categories CRUD
  createCategory: (data) => apiRequest(`${API_URL}/categories`, 'POST', data).then(r => { clearApiCache(`${API_URL}/categories`); return r; }),
  updateCategory: (id, data) => apiRequest(`${API_URL}/categories/${id}`, 'PUT', data).then(r => { clearApiCache(`${API_URL}/categories`); return r; }),
  deleteCategory: (id) => apiRequest(`${API_URL}/categories/${id}`, 'DELETE').then(r => { clearApiCache(`${API_URL}/categories`); return r; }),

  toggleFavorite: (userId, productId) => apiRequest(`${API_URL}/favorites/toggle`, 'POST', { user_id: userId, product_id: productId }),

  // Orders
  createOrder: (data) => apiRequest(`${API_URL}/orders`, 'POST', data),
  getUserOrders: (userId) => cachedFetch(`${API_URL}/users/${userId}/orders`, 30_000),
  getAdminOrders: (params = {}) => cachedFetch(`${API_URL}/admin/orders?${new URLSearchParams(params)}`, 15_000),
  updateOrderStatus: (orderId, data) => apiRequest(`${API_URL}/orders/${orderId}/status`, 'PUT', data),

  // Collections
  createCollection: (data) => apiRequest(`${API_URL}/collections`, 'POST', data),
  getUserCollections: (userId) => cachedFetch(`${API_URL}/users/${userId}/collections`, 30_000),
  getCollections: (params = {}) => cachedFetch(`${API_URL}/collections?${new URLSearchParams(params)}`, 30_000),
  assignCollection: (id, data) => apiRequest(`${API_URL}/collections/${id}/assign`, 'PUT', data),
  classifyCollection: (id, data) => apiRequest(`${API_URL}/collections/${id}/classify`, 'PUT', data),

  // Production
  getProductionOrders: (params = {}) => cachedFetch(`${API_URL}/production-orders?${new URLSearchParams(params)}`, 30_000),
  createProductionOrder: (data) => apiRequest(`${API_URL}/production-orders`, 'POST', data),
  updateProductionProgress: (id, data) => apiRequest(`${API_URL}/production-orders/${id}/progress`, 'PUT', data),
  completeProductionOrder: (id, data) => apiRequest(`${API_URL}/production-orders/${id}/complete`, 'PUT', data),

  // Custom Requests
  createCustomRequest: (data) => apiRequest(`${API_URL}/custom-requests`, 'POST', data),
  getCustomRequests: (params = {}) => cachedFetch(`${API_URL}/custom-requests?${new URLSearchParams(params)}`, 30_000),
  updateCustomRequestStatus: (id, data) => apiRequest(`${API_URL}/custom-requests/${id}/status`, 'PUT', data),

  // Admin
  getAdminStats: () => cachedFetch(`${API_URL}/admin/stats`, 60_000),
  getAdminReports: (p = {}) => cachedFetch(`${API_URL}/admin/reports?${new URLSearchParams(p)}`, 30_000),
  getAdminUsers: (p = {}) => cachedFetch(`${API_URL}/admin/users?${new URLSearchParams(p)}`, 30_000),
  createUser: (data) => apiRequest(`${API_URL}/admin/users`, 'POST', data).then(r => { clearApiCache(`${API_URL}/admin/users`); return r; }),
  updateUserStatus: (uid, status) => apiRequest(`${API_URL}/admin/users/${uid}/status`, 'PUT', { status }),
  getBranches: () => cachedFetch(`${API_URL}/admin/branches`, 300_000),
  getDeliveryZones: () => cachedFetch(`${API_URL}/admin/delivery-zones`, 300_000),
  getCoupons: () => cachedFetch(`${API_URL}/admin/coupons`, 60_000),
  createCoupon: (data) => apiRequest(`${API_URL}/admin/coupons`, 'POST', data),
};
