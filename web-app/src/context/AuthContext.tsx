import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'dealer' | 'consultant' | null;

interface User {
  email: string;
  name: string;
  role: UserRole;
  org: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'dealer1@gmail.com' && password === 'Dealer@1') {
      setUser({
        email: cleanEmail,
        name: 'Sundaram Motors',
        role: 'dealer',
        org: 'Sundaram Motors Dealership',
      });
      return true;
    } else if (cleanEmail === 'consultant1@gmail.com' && password === 'Consultant@1') {
      setUser({
        email: cleanEmail,
        name: 'Karthikeyan',
        role: 'consultant',
        org: 'Professional Auto Consultants Inc.',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
