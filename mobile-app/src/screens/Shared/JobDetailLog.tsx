import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useJobStore, Job } from '../../store/useJobStore';
import { useRoute } from '@react-navigation/native';

export const JobDetailLog = () => {
  const { colors, typography } = useTheme();
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };
  const job = useJobStore(state => state.jobs.find(j => j.id === jobId));

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Text style={{ color: colors.text }}>Job not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.primary }} contentContainerStyle={styles.container}>
      <Text style={{ color: colors.text, fontSize: typography.sizes.xl, marginBottom: 8 }}>
        {job.make} {job.model} ({job.year})
      </Text>
      <View style={[styles.badge, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.action, fontWeight: 'bold' }}>{job.status}</Text>
      </View>

      <Text style={{ color: colors.accent, marginTop: 24, marginBottom: 8 }}>Issue Description:</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
        <Text style={{ color: colors.text }}>{job.issue}</Text>
      </View>

      <Text style={{ color: colors.accent, marginTop: 24, marginBottom: 8 }}>Audit History:</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
        <Text style={{ color: colors.text, fontSize: typography.sizes.sm }}>
          - Created on: {new Date(job.createdAt).toLocaleString()}
        </Text>
        {job.consultantId && (
          <Text style={{ color: colors.text, fontSize: typography.sizes.sm, marginTop: 8 }}>
            - Claimed by: {job.consultantId}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
  }
});
