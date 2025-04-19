import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  Email: string;
  Id: string;
  Profile: string;
  Username: string;
  exp: number;
  iat: number;
  nbf: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  decodedToken: TokenPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(() => {
    const storedToken = localStorage.getItem('auth_token');
    return storedToken ? jwtDecode<TokenPayload>(storedToken) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      verifyTokenPersisted(40);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  const verifyTokenPersisted = (count: number) => {
    if (count === 0) {
      return;
    }

    if (localStorage.getItem('auth_token') === null) {
      setTimeout(() => {
        verifyTokenPersisted(count - 1);
      }, 50);
      return;
    }

    setIsAuthenticated(true);
  };

  const login = (newToken: string) => {
    setToken(newToken);
    setDecodedToken(jwtDecode(newToken));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setDecodedToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, decodedToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};