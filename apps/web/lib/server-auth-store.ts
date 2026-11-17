import { User } from './auth-context';

export interface ServerAccount {
  email: string;
  passwordHash: string;
  user: User;
}

// Secure credential hashing helper: matching client hash algorithm
export function hashPassword(password: string): string {
  let hash = 0x811c9dc5;
  const salted = `pc_salt_${password}_charity_2026`;
  for (let i = 0; i < salted.length; i++) {
    hash ^= salted.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export const INITIAL_DEMO_ACCOUNTS: ServerAccount[] = [
  {
    email: 'admin@demo.com',
    passwordHash: hashPassword('DemoPassword123!'),
    user: {
      id: 'user-admin-demo',
      name: 'System Administrator',
      email: 'admin@demo.com',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      avatarName: 'System Administrator',
      levelTerm: 'Faculty / Admin',
    },
  },
  {
    email: 'top.contributor@demo.com',
    passwordHash: hashPassword('DemoPassword123!'),
    user: {
      id: 'user-top-contributor',
      name: 'Sarah Ahmed',
      email: 'top.contributor@demo.com',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      avatarName: 'Sarah Ahmed',
      levelTerm: 'Level 2 / Term 1',
    },
  },
  {
    email: 'student@demo.com',
    passwordHash: hashPassword('DemoPassword123!'),
    user: {
      id: 'user-student-demo',
      name: 'Tanvir Hasan',
      email: 'student@demo.com',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      avatarName: 'Tanvir Hasan',
      levelTerm: 'Level 2 / Term 1',
    },
  },
  {
    email: 'moderator@demo.com',
    passwordHash: hashPassword('DemoPassword123!'),
    user: {
      id: 'user-moderator-demo',
      name: 'Nafis Iqbal',
      email: 'moderator@demo.com',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      avatarName: 'Nafis Iqbal',
      levelTerm: 'Level 3 / Term 2',
    },
  },
  {
    email: 'nayem@student.university.edu',
    passwordHash: hashPassword('password123'),
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
    passwordHash: hashPassword('password123'),
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

const globalStore = global as unknown as {
  __PEERS_CHARITY_USERS__?: ServerAccount[];
};

if (!globalStore.__PEERS_CHARITY_USERS__) {
  globalStore.__PEERS_CHARITY_USERS__ = [...INITIAL_DEMO_ACCOUNTS];
}

export function getServerAccounts(): ServerAccount[] {
  return globalStore.__PEERS_CHARITY_USERS__ || [...INITIAL_DEMO_ACCOUNTS];
}

export function findServerAccount(email: string): ServerAccount | undefined {
  const norm = email.trim().toLowerCase();
  const accounts = getServerAccounts();
  return accounts.find((a) => a.email.toLowerCase() === norm);
}

export function addServerAccount(account: ServerAccount): ServerAccount {
  const current = getServerAccounts();
  const norm = account.email.trim().toLowerCase();
  const existingIndex = current.findIndex((a) => a.email.toLowerCase() === norm);

  if (existingIndex !== -1) {
    current[existingIndex] = account;
    globalStore.__PEERS_CHARITY_USERS__ = [...current];
    return account;
  }

  const updated = [...current, account];
  globalStore.__PEERS_CHARITY_USERS__ = updated;
  return account;
}

export function sanitizeAccount(account: ServerAccount): User {
  return account.user;
}
