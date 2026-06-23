import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { useJobStore, Job } from '../../store/useJobStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const ConsultantQueue = () => {
  const { colors, typography } = useTheme();
  const { user, logout } = useAuth();
  const { jobs, updateJobStatus } = useJobStore();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Consultant sees jobs that are 'Created' or assigned to them
  const queue = jobs.filter(j => j.status === 'Created' || j.consultantId === user?.name);

  const handleClaim = (job: Job) => {
    updateJobStatus(job.id, 'In Progress', user?.name);
    Alert.alert('Job Claimed', `You have claimed ${job.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.header}>
        <Text style={{ color: colors.text, fontSize: typography.sizes.xl, fontWeight: 'bold' }}>
          Tech Advisor: {user?.name}
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: colors.alert }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: colors.accent, marginBottom: 16 }}>Triage Dashboard</Text>

      <FlatList
        data={queue}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.jobCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          >
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.id}</Text>
            <Text style={{ color: colors.text }}>{item.make} {item.model} ({item.year})</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: colors.action }}>{item.status}</Text>
              {item.status === 'Created' && (
                <TouchableOpacity 
                  style={[styles.claimButton, { backgroundColor: colors.action }]}
                  onPress={() => handleClaim(item)}
                >
                  <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Claim</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' },
  jobCard: { borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 16 },
  claimButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 }
});
