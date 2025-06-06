import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

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
    console.log('Selected Departments:', selectedDepartments);
    
    // Add validation to ensure at least one department is selected
    if (selectedDepartments.length === 0) {
      alert('Please select at least one department.');
      return;
    }
    
    // Navigate to the FeedbackQuestion screen, passing the selected departments
    navigation.navigate('FeedbackQuestion', { selectedDepartments });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <TouchableOpacity onPress={toggleLanguage}>
          <GlobeIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}> {/* Container for title, subtitle and list */}
        <Text style={styles.sectionTitle}>{t.selectDepartment}</Text>
        <Text style={styles.sectionSubtitle}>{t.selectDepartmentSub}</Text>

        <ScrollView style={styles.scrollView}> 
          {departments.map((department, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.departmentItem} 
              onPress={() => toggleDepartmentSelect(department)}
            >
              <Text style={styles.departmentText}>{department}</Text>
              <View style={[styles.checkbox, selectedDepartments.includes(department) && styles.checkboxSelected]} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>{t.continue}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5FE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF', // Blue icon color
  },
  contentContainer:{
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 5,
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
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
  },
  departmentText: {
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#555',
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  continueButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DepartmentScreen; 