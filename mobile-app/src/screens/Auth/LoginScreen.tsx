import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = () => {
  const { colors, typography } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const success = await login(email, password);
    if (!success) {
      Alert.alert('Login Failed', 'Invalid credentials. Use dealer1@gmail.com / Dealer@1 or consultant1@gmail.com / Consultant@1');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={{ color: colors.text, fontSize: typography.sizes.xxl, marginBottom: 40, fontWeight: 'bold' }}>
        Automobile Tech Consult
      </Text>
      
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Email address"
          placeholderTextColor={colors.accent}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.accent, marginTop: 16 }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Password"
          placeholderTextColor={colors.accent}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.action, marginTop: 32 }]}
        onPress={handleLogin}
      >
        <Text style={{ color: colors.primary, fontSize: typography.sizes.lg, fontWeight: 'bold' }}>
          Secure Login
        </Text>
      </TouchableOpacity>
      
      <View style={styles.hintContainer}>
        <Text style={{ color: colors.accent, fontSize: typography.sizes.sm }}>
          Dealer: dealer1@gmail.com / Dealer@1
        </Text>
        <Text style={{ color: colors.accent, fontSize: typography.sizes.sm, marginTop: 4 }}>
          Consultant: consultant1@gmail.com / Consultant@1
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    height: '100%',
  },
  button: {
    height: 56,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintContainer: {
    marginTop: 40,
    alignItems: 'center',
  }
});
