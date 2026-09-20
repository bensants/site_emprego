import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('obidos_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('obidos_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Validação e carregamento do perfil atual no backend
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('obidos_token');
      if (savedToken) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          localStorage.setItem('obidos_user', JSON.stringify(userData));
        } catch (error) {
          console.warn('Falha ao autenticar token existente:', error?.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, senha) => {
    const response = await authApi.login({ email, senha });
    const { token: receivedToken, user: receivedUser } = response;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('obidos_token', receivedToken);
    localStorage.setItem('obidos_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { token: receivedToken, user: receivedUser } = response;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('obidos_token', receivedToken);
    localStorage.setItem('obidos_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('obidos_token');
    localStorage.removeItem('obidos_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('obidos_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
