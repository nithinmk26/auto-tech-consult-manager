import React, { createContext, useContext, ReactNode } from 'react';
import { colors, Colors } from './colors';
import { typography, Typography } from './typography';

export interface Theme {
  colors: Colors;
  typography: Typography;
}

export const theme: Theme = {
  colors,
  typography,
};

const ThemeContext = createContext<Theme>(theme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
