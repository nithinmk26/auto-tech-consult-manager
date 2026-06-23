import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { useJobStore } from '../../store/useJobStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const DealershipDashboard = () => {
  const { colors, typography } = useTheme();
  const { user, logout } = useAuth();
  const jobs = useJobStore(state => state.jobs);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.header}>
        <Text style={{ color: colors.text, fontSize: typography.sizes.xl, fontWeight: 'bold' }}>
          {user?.name}
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: colors.alert }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: colors.accent, marginBottom: 16 }}>Recent Jobs Feed</Text>

      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.jobCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          >
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.id}</Text>
            <Text style={{ color: colors.text }}>{item.make} {item.model} ({item.year})</Text>
            <Text style={{ color: colors.action, marginTop: 8 }}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.action }]}
        onPress={() => navigation.navigate('CreateJob')}
      >
        <Text style={{ color: colors.primary, fontSize: typography.sizes.xxl }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' },
  jobCard: { borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 16 },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  }
});
