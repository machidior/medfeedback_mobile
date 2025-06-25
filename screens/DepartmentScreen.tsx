import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import axios from 'axios';

// Define the navigation prop type for DepartmentScreen
type DepartmentScreenProps = StackScreenProps<RootStackParamList, 'Department'>;

// Placeholder icons (you might replace these with icons from a library)
const MenuIcon = () => <Text style={styles.icon}>☰</Text>;
const GlobeIcon = () => <Text style={styles.icon}>🌐</Text>;

// Define the Department interface
interface Department {
  id: number;
  name: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const DepartmentScreen = ({ navigation, route }: DepartmentScreenProps) => {
  const { selectedDate, gender } = route.params;
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    en: {
      title: 'MedFeedback',
      selectDepartment: 'Department',
      selectDepartmentSub: 'Please select the department you\'d like to provide feedback for:',
      continue: 'Continue',
      loading: 'Loading departments...',
      error: 'Failed to load departments',
      retry: 'Retry',
      // Add translations for department names if needed
    },
    sw: {
      title: 'MedFeedback',
      selectDepartment: 'Idara',
      selectDepartmentSub: 'Tafadhali chagua idara unayotaka kutoa maoni:',
      continue: 'Endelea',
      loading: 'Inapakia idara...',
      error: 'Imeshindwa kupakia idara',
      retry: 'Jaribu tena',
      // Add translations for department names if needed
    }
  };

  const t = translations[language];

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://192.168.100.88:8089/api/departments/all');
      console.log('Departments fetched with priorities:', response.data);
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const toggleDepartmentSelect = (departmentName: string) => {
    setSelectedDepartments(prevSelected => 
      prevSelected.includes(departmentName)
        ? prevSelected.filter(d => d !== departmentName)
        : [...prevSelected, departmentName]
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
    navigation.navigate('FeedbackQuestion', { 
      selectedDepartments: selectedDepartments,
      selectedDate: selectedDate,
      gender: gender
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDepartments}>
            <Text style={styles.retryButtonText}>{t.retry}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.sectionTitle}>{t.selectDepartment}</Text>
        <Text style={styles.sectionSubtitle}>{t.selectDepartmentSub}</Text>

        <ScrollView style={styles.scrollView}> 
          {departments.map((department, index) => (
            <TouchableOpacity 
              key={department.id} 
              style={[
                styles.departmentItem,
                selectedDepartments.includes(department.name) && styles.departmentItemSelected
              ]} 
              onPress={() => toggleDepartmentSelect(department.name)}
            >
              <View style={[styles.checkbox, selectedDepartments.includes(department.name) && styles.checkboxSelected]} />
              <Text style={[
                styles.departmentText,
                selectedDepartments.includes(department.name) && styles.departmentTextSelected
              ]}>{department.name}</Text>
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
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  headerIconRight: {
    marginLeft: 'auto',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF',
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
    textAlign: 'left',
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
    // justifyContent: 'space-between',
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
    paddingLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#007BFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DepartmentScreen; 