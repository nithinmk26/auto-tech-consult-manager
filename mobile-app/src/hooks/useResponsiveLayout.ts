import { useWindowDimensions } from 'react-native';

export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  return { isTablet, width };
};
