'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  avatarUrl: string;
  avatarName: string;
  levelTerm: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => ({ success: false }),
  logout: () => {},
  updateProfile: () => {},
});

// Demo accounts
const DEMO_ACCOUNTS: { email: string; password: string; user: User }[] = [
  {
    email: 'nayem@student.university.edu',
    password: 'password123',
    user: {
      id: 'user-nayem',
      name: 'Nayem',
      email: 'nayem@student.university.edu',
      role: 'STUDENT',
      avatarUrl: '',
      avatarName: '',
      levelTerm: 'Level 3 / Term 2',
    },
  },
  {
    email: 'admin@university.edu',
    password: 'password123',
    user: {
      id: 'user-admin',
      name: 'Admin',
      email: 'admin@university.edu',
      role: 'ADMIN',
      avatarUrl: '',
      avatarName: '',
      levelTerm: 'Faculty / Admin',
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('peers-charity-user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!account) {
      return { success: false, error: 'Invalid email or password. Try: nayem@student.university.edu / password123' };
    }

    // Check if there's a stored profile for this user (avatar, name, etc.)
    const storedProfile = localStorage.getItem(`peers-charity-profile-${account.user.id}`);
    const mergedUser = storedProfile
      ? { ...account.user, ...JSON.parse(storedProfile) }
      : account.user;

    setUser(mergedUser);
    localStorage.setItem('peers-charity-user', JSON.stringify(mergedUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('peers-charity-user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('peers-charity-user', JSON.stringify(updated));
    localStorage.setItem(`peers-charity-profile-${user.id}`, JSON.stringify(updates));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
