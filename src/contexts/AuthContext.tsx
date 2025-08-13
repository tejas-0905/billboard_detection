import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'authority' | 'admin';
  points: number;
  reportsSubmitted: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Demo user for prototype
    return {
      id: '1',
      name: 'Demo User',
      email: 'demo@billboard.app',
      role: 'citizen',
      points: 150,
      reportsSubmitted: 12
    };
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login
    if (email === 'admin@billboard.app') {
      setUser({
        id: '2',
        name: 'Admin User',
        email: 'admin@billboard.app',
        role: 'admin',
        points: 0,
        reportsSubmitted: 0
      });
    } else {
      setUser({
        id: '1',
        name: 'Demo User',
        email: email,
        role: 'citizen',
        points: 150,
        reportsSubmitted: 12
      });
    }
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate registration
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'citizen',
      points: 0,
      reportsSubmitted: 0
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};