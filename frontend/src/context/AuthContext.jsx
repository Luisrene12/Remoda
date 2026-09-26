import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const MOCK_USERS = {
  customer: {
    id: 3,
    name: 'Lucía',
    last_name: 'Vargas',
    email: 'cliente@remoda.bo',
    phone: '+591 77889900',
    role: 'customer',
    points_balance: 350,
    status: 'active',
    addresses: [
      {
        id: 1,
        title: 'Casa',
        address: 'Av. San Martín, Calle 7 Oeste #45',
        city: 'Santa Cruz',
        zone: 'Equipetrol',
        reference: 'Frente al café cultural, portón negro',
        is_default: true,
      },
      {
        id: 2,
        title: 'Oficina',
        address: 'Av. Cristo Redentor 3er Anillo',
        city: 'Santa Cruz',
        zone: 'Zona Norte',
        reference: 'Torre Duo piso 8',
        is_default: false,
      }
    ]
  },
  producer: {
    id: 2,
    name: 'Carlos',
    last_name: 'Mendoza',
    email: 'productor@remoda.bo',
    phone: '+591 76543210',
    role: 'producer',
    points_balance: 0,
    status: 'active',
  },
  admin: {
    id: 1,
    name: 'Administrador',
    last_name: 'ReModa',
    email: 'admin@remoda.bo',
    phone: '+591 71234567',
    role: 'admin',
    points_balance: 0,
    status: 'active',
  }
};

export const AuthProvider = ({ children }) => {
  // Stored custom users created dynamically (registration or admin)
  const [customUsers, setCustomUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('remoda_custom_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('remoda_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState(() => currentUser?.role || 'customer');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('remoda_user', JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    } else {
      localStorage.removeItem('remoda_user');
      setActiveRole('customer');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('remoda_custom_users', JSON.stringify(customUsers));
  }, [customUsers]);

  const switchRole = (role) => {
    if (MOCK_USERS[role]) {
      setCurrentUser(MOCK_USERS[role]);
      setActiveRole(role);
      return MOCK_USERS[role];
    }
    setActiveRole(role);
  };

  const login = async (email, password) => {
    const trimmedEmail = email?.trim().toLowerCase();
    
    // 1. Try Laravel Backend API
    try {
      const data = await api.login(trimmedEmail, password);
      if (data && data.user) {
        setCurrentUser(data.user);
        setActiveRole(data.user.role);
        return { success: true, user: data.user };
      }
      if (data && data.message) {
        // If API explicitly rejected, check local fallback before failing
      }
    } catch (err) {
      console.log('Backend API login error, testing local credentials...', err);
    }

    // 2. Check Custom Created/Registered Users
    const customFound = customUsers.find(
      (u) => u.email?.toLowerCase() === trimmedEmail && (u.password === password || !u.password)
    );
    if (customFound) {
      const userToSet = { ...customFound };
      delete userToSet.password;
      setCurrentUser(userToSet);
      setActiveRole(userToSet.role || 'customer');
      return { success: true, user: userToSet };
    }

    // 3. Check Default 3 Seed/Mock Users
    const mockMatch = Object.entries(MOCK_USERS).find(([role, u]) => {
      if (u.email.toLowerCase() !== trimmedEmail) return false;
      const expectedPass = role === 'admin' ? 'admin123' : role === 'producer' ? 'productor123' : 'cliente123';
      return password === expectedPass || password === 'admin' || password === '123456';
    });

    if (mockMatch) {
      const [, mockUser] = mockMatch;
      setCurrentUser(mockUser);
      setActiveRole(mockUser.role);
      return { success: true, user: mockUser };
    }

    return { 
      success: false, 
      message: 'Credenciales inválidas. Verifica tu correo y contraseña.' 
    };
  };

  const register = async (userData) => {
    const trimmedEmail = userData.email?.trim().toLowerCase();
    
    // Create new user object
    const newUser = {
      id: Date.now(),
      name: userData.name,
      last_name: userData.last_name || '',
      email: trimmedEmail,
      phone: userData.phone || '',
      birth_date: userData.birth_date || '',
      role: 'customer',
      points_balance: 50,
      status: 'active',
      password: userData.password,
      addresses: userData.address ? [
        {
          id: Date.now(),
          title: 'Principal',
          address: userData.address,
          city: userData.city || 'Santa Cruz',
          zone: userData.zone || 'Centro',
          is_default: true,
        }
      ] : []
    };

    // Save in custom users list for local authentication
    setCustomUsers(prev => {
      const filtered = prev.filter(u => u.email?.toLowerCase() !== trimmedEmail);
      return [...filtered, newUser];
    });

    // Attempt to register in backend API as well
    try {
      const data = await api.register(userData);
      if (data && data.user) {
        const userToSet = { ...data.user };
        setCurrentUser(userToSet);
        setActiveRole('customer');
        return { success: true, user: userToSet };
      }
    } catch (err) {
      console.log('Backend API register fallback to local user:', err);
    }

    const cleanUser = { ...newUser };
    delete cleanUser.password;
    setCurrentUser(cleanUser);
    setActiveRole('customer');
    return { success: true, user: cleanUser };
  };

  const addNewUser = async (userData) => {
    const trimmedEmail = userData.email?.trim().toLowerCase();
    const newUser = {
      id: Date.now(),
      name: userData.name,
      last_name: userData.last_name || '',
      email: trimmedEmail,
      phone: userData.phone || '',
      role: userData.role || 'customer',
      points_balance: userData.role === 'customer' ? 50 : 0,
      status: userData.status || 'active',
      password: userData.password,
      addresses: []
    };

    // Add to local custom users for authentication
    setCustomUsers(prev => {
      const filtered = prev.filter(u => u.email?.toLowerCase() !== trimmedEmail);
      return [...filtered, newUser];
    });

    // Try backend API
    try {
      const data = await api.createUser(userData);
      if (data && data.user) {
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.log('Backend createUser fallback to local storage:', err);
    }

    const cleanUser = { ...newUser };
    delete cleanUser.password;
    return { success: true, user: cleanUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('remoda_user');
    setActiveRole('customer');
  };

  const addAddress = (newAddress) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: [...(currentUser.addresses || []), { ...newAddress, id: Date.now() }]
    };
    setCurrentUser(updated);
  };

  const updatePoints = (delta) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      points_balance: Math.max(0, (currentUser.points_balance || 0) + delta)
    };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        login,
        register,
        addNewUser,
        logout,
        addAddress,
        updatePoints,
        customUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
