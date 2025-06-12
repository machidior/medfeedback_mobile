import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// Define the navigation prop type for DepartmentScreen
type DepartmentScreenProps = StackScreenProps<RootStackParamList, 'Department'>;

// Placeholder icons (you might replace these with icons from a library)
const MenuIcon = () => <Text style={styles.icon}>☰</Text>;
const GlobeIcon = () => <Text style={styles.icon}>🌐</Text>;

// Dummy data for departments based on the image
const departments = [
  'Emergency',
  'Outpatient Clinic',
  'Impatient Clinic',
  'Radiology',
  'Laboratory',
  'Pharmacy',
  'Billing',
  'Mortuary',
  'Maternity',
  'Immunization',
];

const DepartmentScreen = ({ navigation, route }: DepartmentScreenProps) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const translations = {
    en: {
      title: 'MedFeedback',
      selectDepartment: 'Select Department',
      selectDepartmentSub: 'Please select the department you\'d like to provide feedback for:',
      continue: 'Continue',
      // Add translations for department names if needed
    },
    sw: {
      title: 'MedFeedback',
      selectDepartment: 'Chagua Idara',
      selectDepartmentSub: 'Tafadhali chagua idara unayotaka kutoa maoni:',
      continue: 'Endelea',
      // Add translations for department names if needed
    }
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const toggleDepartmentSelect = (department: string) => {
    setSelectedDepartments(prevSelected => 
      prevSelected.includes(department)
        ? prevSelected.filter(d => d !== department)
        : [...prevSelected, department]
    );
  };

  const handleContinue = () => {
    if (selectedDepartments.length === 0) {
      Alert.alert(
        'No Department Selected',
        'Please select at least one department to continue.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('FeedbackQuestion', { selectedDepartments: selectedDepartments });
  };

  return (
    <LinearGradient
      colors={['#E6F7FF', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <Text style={styles.icon}>🌐</Text>
      </View>

      <View style={styles.contentContainer}> {/* Container for title, subtitle and list */}
        <Text style={styles.sectionTitle}>{t.selectDepartment}</Text>
        <Text style={styles.sectionSubtitle}>{t.selectDepartmentSub}</Text>

        <ScrollView style={styles.scrollView}> 
          {departments.map((department, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.departmentItem,
                selectedDepartments.includes(department) && styles.departmentItemSelected
              ]} 
              onPress={() => toggleDepartmentSelect(department)}
            >
              <Text style={[
                styles.departmentText,
                selectedDepartments.includes(department) && styles.departmentTextSelected
              ]}>{department}</Text>
              <View style={[styles.checkbox, selectedDepartments.includes(department) && styles.checkboxSelected]} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            selectedDepartments.length === 0 && styles.continueButtonDisabled
          ]} 
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>{t.continue}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  icon: {
    fontSize: 24,
    color: '#007BFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  contentContainer:{
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  departmentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  departmentItemSelected: {
    backgroundColor: '#E6F7FF',
    borderColor: '#007BFF',
  },
  departmentTextSelected: {
    color: '#007BFF',
  },
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DepartmentScreen; 