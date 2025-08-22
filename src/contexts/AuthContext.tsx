import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc
} from "firebase/firestore";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "citizen" | "authority" | "admin";
  points: number;
  reportsSubmitted: number;
}

interface AuthContextType {
  user: Omit<User, "password"> | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  addReport: (points: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 🔹 Fetch all users from Firestore
async function getStoredUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data() as User);
}

// 🔹 Save or update user in Firestore
async function setStoredUser(user: User): Promise<void> {
  await setDoc(doc(db, "users", user.id), user, { merge: true });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(() => {
    const stored = localStorage.getItem("billboard-user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("billboard-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("billboard-user");
    }
  }, [user]);

  // 🔹 Login: check Firestore for matching email+password
  const login = async (email: string, password: string): Promise<boolean> => {
    const users = await getStoredUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  // 🔹 Register: add new user to Firestore
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const users = await getStoredUsers();
    if (users.some((u) => u.email === email)) {
      return false; // Already exists
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: "citizen",
      points: 0,
      reportsSubmitted: 0,
    };

    await setStoredUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
  };

  // 🔹 Add report = increase points & reportsSubmitted in Firestore
  const addReport = async (points: number) => {
    if (!user) return;

    const updated = {
      ...user,
      points: user.points + points,
      reportsSubmitted: user.reportsSubmitted + 1,
    };

    await setStoredUser({ ...updated, password: "hidden" } as User); // keep structure

    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, addReport }}>
      {children}
    </AuthContext.Provider>
  );
};
