import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'authority' | 'admin';
  points: number;
  reportsSubmitted: number;
}

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  addReport: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function getStoredUsers(): User[] {
  const users = localStorage.getItem('billboard-users');
  return users ? JSON.parse(users) : [];
}

function setStoredUsers(users: User[]) {
  localStorage.setItem('billboard-users', JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
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
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    if (users.some(u => u.email === email)) {
      // Already registered
      return false;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: 'citizen',
      points: 0,
      reportsSubmitted: 0
    };
    users.push(newUser);
    setStoredUsers(users);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addReport = (points: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        points: prev.points + points,
        reportsSubmitted: prev.reportsSubmitted + 1
      };
      localStorage.setItem('billboard-user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, addReport }}>
      {children}
    </AuthContext.Provider>
  );
};