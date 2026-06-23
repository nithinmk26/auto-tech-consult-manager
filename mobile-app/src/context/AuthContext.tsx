import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = 'DEALERSHIP' | 'CONSULTANT' | null;

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = async (email: string, pass: string) => {
    if (email === 'dealer1@gmail.com' && pass === 'Dealer@1') {
      setUser({ name: 'Sundaram Motors', email, role: 'DEALERSHIP' });
      return true;
    } else if (email === 'consultant1@gmail.com' && pass === 'Consultant@1') {
      setUser({ name: 'Karthikeyan', email, role: 'CONSULTANT' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
