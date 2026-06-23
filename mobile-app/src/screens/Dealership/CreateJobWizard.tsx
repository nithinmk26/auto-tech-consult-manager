import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../theme/ThemeProvider';
import { useJobStore } from '../../store/useJobStore';
import { useNavigation } from '@react-navigation/native';
import vehicleDataRaw from '../../../vehicles.json';

// Cast vehicle database structure
const vehicleDb = vehicleDataRaw as Record<string, Record<string, number[]>>;

export const CreateJobWizard = () => {
  const { colors, typography } = useTheme();
  const { addJob } = useJobStore();
  const navigation = useNavigation();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [issue, setIssue] = useState('');

  // Custom user inputs when "Other" is chosen
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customYear, setCustomYear] = useState('');

  // Dropdown lists
  const makesList = Object.keys(vehicleDb).sort();
  const modelsList = make && make !== 'Other' && vehicleDb[make] ? Object.keys(vehicleDb[make]).sort() : [];
  const yearsList = make && make !== 'Other' && model && model !== 'Other' && vehicleDb[make]?.[model] ? vehicleDb[make][model] : [];

  // Reset dependents
  useEffect(() => {
    if (make !== 'Other') {
      setCustomMake('');
    }
    setModel('');
    setYear('');
  }, [make]);

  useEffect(() => {
    if (model !== 'Other') {
      setCustomModel('');
    }
    setYear('');
  }, [model]);

  useEffect(() => {
    if (year !== 'Other') {
      setCustomYear('');
    }
  }, [year]);

  const handleSubmit = () => {
    const finalMake = make === 'Other' ? customMake : make;
    const finalModel = model === 'Other' ? customModel : model;
    const finalYear = year === 'Other' ? customYear : year;

    if (!finalMake || !finalModel || !finalYear || !issue) return;
    addJob({ make: finalMake, model: finalModel, year: finalYear, issue });
    navigation.goBack();
  };

  const finalMake = make === 'Other' ? customMake : make;
  const finalModel = model === 'Other' ? customModel : model;
  const finalYear = year === 'Other' ? customYear : year;
  const isValid = finalMake.trim() && finalModel.trim() && finalYear.trim() && issue.trim();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.primary }} contentContainerStyle={styles.container}>
      <Text style={{ color: colors.text, fontSize: typography.sizes.xl, marginBottom: 24, fontWeight: 'bold' }}>
        Create New Job
      </Text>
      
      {/* Make Select */}
      <Text style={[styles.label, { color: colors.text }]}>Vehicle Make</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
        <Picker
          selectedValue={make}
          onValueChange={(val) => setMake(val)}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          <option value="">Select Make</option>
          {makesList.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
          <option value="Other">Other (Custom input)</option>
        </Picker>
      </View>

      {make === 'Other' && (
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.accent, marginBottom: 16 }]}
          placeholder="Enter Custom Make (e.g. Porsche)"
          placeholderTextColor={colors.accent}
          value={customMake}
          onChangeText={setCustomMake}
        />
      )}

      {/* Model Select */}
      <Text style={[styles.label, { color: colors.text }]}>Vehicle Model</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.accent, opacity: make ? 1 : 0.5 }]}>
        <Picker
          selectedValue={model}
          onValueChange={(val) => setModel(val)}
          enabled={!!make}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          <option value="">Select Model</option>
          {make !== 'Other' && modelsList.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
          <option value="Other">Other (Custom input)</option>
        </Picker>
      </View>

      {model === 'Other' && (
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.accent, marginBottom: 16 }]}
          placeholder="Enter Custom Model (e.g. Taycan)"
          placeholderTextColor={colors.accent}
          value={customModel}
          onChangeText={setCustomModel}
        />
      )}

      {/* Year Select */}
      <Text style={[styles.label, { color: colors.text }]}>Production Year</Text>
      <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.accent, opacity: model ? 1 : 0.5 }]}>
        <Picker
          selectedValue={year}
          onValueChange={(val) => setYear(val)}
          enabled={!!model}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          <option value="">Select Year</option>
          {make !== 'Other' && model !== 'Other' && yearsList.map((y) => (
            <option key={y.toString()} value={y.toString()}>{y.toString()}</option>
          ))}
          <option value="Other">Other (Custom input)</option>
        </Picker>
      </View>

      {year === 'Other' && (
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.accent, marginBottom: 16 }]}
          placeholder="Enter Custom Year (e.g. 2026)"
          placeholderTextColor={colors.accent}
          value={customYear}
          onChangeText={setCustomYear}
          keyboardType="numeric"
        />
      )}

      {/* Issue Details */}
      <Text style={[styles.label, { color: colors.text }]}>Diagnostic Issue</Text>
      <TextInput
        style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.accent }]}
        placeholder="Detailed Diagnostic Issue..."
        placeholderTextColor={colors.accent}
        value={issue}
        onChangeText={setIssue}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.action, marginTop: 24, opacity: isValid ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={{ color: colors.primary, fontSize: typography.sizes.md, fontWeight: 'bold' }}>
          Submit Job to Queue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    height: 56,
    justifyContent: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 4,
    height: 120,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    height: 56,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
