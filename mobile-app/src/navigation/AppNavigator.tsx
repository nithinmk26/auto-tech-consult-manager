import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';

import { LoginScreen } from '../screens/Auth/LoginScreen';
import { DealershipDashboard } from '../screens/Dealership/DealershipDashboard';
import { CreateJobWizard } from '../screens/Dealership/CreateJobWizard';
import { ConsultantQueue } from '../screens/Consultant/ConsultantQueue';
import { JobDetailLog } from '../screens/Shared/JobDetailLog';

const Stack = createNativeStackNavigator();

const DealershipStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DealershipDashboard} />
    <Stack.Screen name="CreateJob" component={CreateJobWizard} />
    <Stack.Screen name="JobDetail" component={JobDetailLog} />
  </Stack.Navigator>
);

const ConsultantStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Queue" component={ConsultantQueue} />
    <Stack.Screen name="JobDetail" component={JobDetailLog} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: colors.action,
        background: colors.primary,
        card: colors.surface,
        text: colors.text,
        border: colors.accent,
        notification: colors.alert,
      }
    }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === 'DEALERSHIP' ? (
          <Stack.Screen name="DealershipRoot" component={DealershipStack} />
        ) : (
          <Stack.Screen name="ConsultantRoot" component={ConsultantStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
