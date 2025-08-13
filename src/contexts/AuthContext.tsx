import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Try to load user from localStorage
    const stored = localStorage.getItem('billboard-user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('billboard-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('billboard-user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login
    if (email === 'admin@billboard.app') {
      const adminUser: User = {
        id: '2',
        name: 'Admin User',
        email: 'admin@billboard.app',
        role: 'admin',
        points: 0,
        reportsSubmitted: 0
      };
      setUser(adminUser);
      return true;
    } else if (email && password) {
      const demoUser: User = {
        id: '1',
        name: 'Demo User',
        email,
        role: 'citizen',
        points: 150,
        reportsSubmitted: 12
      };
      setUser(demoUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate registration
    if (name && email && password) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'citizen',
        points: 0,
        reportsSubmitted: 0
      };
      setUser(newUser);
      return true;
    }
    return false;
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