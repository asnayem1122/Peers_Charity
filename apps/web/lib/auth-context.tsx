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
  studentId?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  levelTerm?: string;
  studentId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => ({ success: false }),
  register: () => ({ success: false }),
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

const STORAGE_KEY_REGISTERED_USERS = 'peers-charity-registered-accounts';

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

  const getCustomRegisteredAccounts = (): { email: string; password: string; user: User }[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const register = (data: RegisterData) => {
    try {
      const email = data.email.trim().toLowerCase();
      const existingRegistered = getCustomRegisteredAccounts();

      if (
        DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === email) ||
        existingRegistered.some((a) => a.email.toLowerCase() === email)
      ) {
        return { success: false, error: 'An account with this email address already exists. Please log in.' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name.trim(),
        email: data.email.trim(),
        role: 'STUDENT',
        avatarUrl: '',
        avatarName: '',
        levelTerm: data.levelTerm || 'Level 3 / Term 1',
        studentId: data.studentId?.trim(),
      };

      const newAccount = {
        email: email,
        password: data.password || 'password123',
        user: newUser,
      };

      const updatedList = [...existingRegistered, newAccount];
      localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(updatedList));

      setUser(newUser);
      localStorage.setItem('peers-charity-user', JSON.stringify(newUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to complete registration' };
    }
  };

  const login = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const customAccounts = getCustomRegisteredAccounts();
    const allAccounts = [...DEMO_ACCOUNTS, ...customAccounts];

    const account = allAccounts.find(
      (a) => a.email.toLowerCase() === trimmedEmail && a.password === password
    );

    if (!account) {
      return { success: false, error: 'Invalid email or password. Please check your credentials.' };
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
    // Security Guard: Forbid client tampering with role, id, or email
    const { role, id, email, ...safeUpdates } = updates;
    const updated = { ...user, ...safeUpdates };
    setUser(updated);
    localStorage.setItem('peers-charity-user', JSON.stringify(updated));
    localStorage.setItem(`peers-charity-profile-${user.id}`, JSON.stringify(safeUpdates));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
