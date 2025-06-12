import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// Define the navigation prop type for HomeScreen when nested in Bottom Tabs
// This type is useful if HomeScreen could be navigated to directly via the Stack or within the Tabs,
// but when used directly as a component within Tab.Screen, it should expect Tab-specific props.
// Keeping this definition for reference, but using BottomTabScreenProps directly on the component.
// type HomeScreenNavigationProp = CompositeScreenProps<
//   BottomTabScreenProps<BottomTabParamList, 'HomeTab'>, 
//   StackScreenProps<RootStackParamList> 
// >;

// Placeholder icons (you might replace these with icons from a library)
const MenuIcon = () => <Text style={styles.icon}>☰</Text>;
const GlobeIcon = () => <Text style={styles.icon}>🌐</Text>;

// Use BottomTabScreenProps directly for the component prop type
const HomeScreen = ({ navigation, route }: BottomTabScreenProps<BottomTabParamList, 'HomeTab'>) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formAs, setFormAs] = useState<string | null>(null);

  const translations = {
    en: {
      title: 'MedFeedback',
      welcome: 'Welcome to our feedback portal!',
      welcomeSub: 'Your opinion matters and helps us serve you better.\nThis would only take a few minutes.',
      formAs: 'Who do you fill this form as?',
      selectType: 'Select type',
      patient: 'Patient',
      visitor: 'Visitor',
      dateAttended: 'Date you attended the Hospital:',
      gender: 'Gender:',
      female: 'Female',
      male: 'Male',
      continue: 'Continue',
      formNote: 'Note: This form is for feedback about your hospital experience. Your opinion is important to us.',
    },
    sw: {
      title: 'MedFeedback',
      welcome: 'Karibu kwenye ukurasa wetu wa maoni!',
      welcomeSub: 'Maoni yako ni muhimu na yatusaidia kukuhudumia vizuri.\nHii itachukua dakika chache tu.',
      formAs: 'Unajaza fomu hii kama nani?',
      selectType: 'Chagua aina',
      patient: 'Mgonjwa',
      visitor: 'Mgeni',
      dateAttended: 'Tarehe uliyohudhuria Hospitali:',
      gender: 'Jinsia:',
      female: 'Mwanamke',
      male: 'Mwanaume',
      continue: 'Endelea',
      formNote: 'Tukio: Hii fomu ni kwa maoni ya kijijini. Maoni yako ni muhimu kwa kami kukuhudumia vizuri.',
    }
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleOptionSelect = (option: string) => {
    setSelectedType(option);
    setShowOptions(false);
  };

  const handleDateSelect = (day: any) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const toggleGender = (selectedGender: string) => {
    setGender(gender === selectedGender ? null : selectedGender);
  };

  const handleContinue = () => {
    if (!selectedDate || !gender || !selectedType) {
      Alert.alert(
        'Incomplete Form',
        'Please fill in all fields before continuing.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('Department');
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LinearGradient
      colors={['#E6F7FF', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.headerTitle}>MedFeedback</Text>
        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={styles.icon}>🌐</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>{t.welcome}</Text>
        <Text style={styles.welcomeText}>{t.welcomeSub}</Text>
      </View>
      <View style={styles.formBox}>
        <Text style={styles.formLabel}>{t.formAs}</Text>
        {/* Custom Dropdown Button */}
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Text style={selectedType ? styles.dropdownButtonText : styles.dropdownPlaceholderText}>
            {selectedType ? (selectedType === 'patient' ? t.patient : t.visitor) : t.selectType}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        {/* Dropdown Options List */}
        {showOptions && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity 
              style={styles.dropdownOptionItem}
              onPress={() => handleOptionSelect('patient')}
            >
              <Text>{t.patient}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownOptionItem}
              onPress={() => handleOptionSelect('visitor')}
            >
              <Text>{t.visitor}</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Date Selection */}
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={selectedDate ? styles.dateText : styles.placeholderText}>
            {selectedDate ? formatDate(selectedDate) : t.dateAttended}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        {/* Gender Selection */}
        <Text style={styles.formLabel}>{t.gender}</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]}
            onPress={() => setGender('male')}
          >
            <View style={[styles.radioOuter, gender === 'male' && styles.radioOuterSelected]}>
              {gender === 'male' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{t.male}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]}
            onPress={() => setGender('female')}
          >
            <View style={[styles.radioOuter, gender === 'female' && styles.radioOuterSelected]}>
              {gender === 'female' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{t.female}</Text>
          </TouchableOpacity>
        </View>
        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>{t.continue}</Text>
        </TouchableOpacity>
        <Text style={styles.formNote}>
          {t.formNote}
        </Text>
      </View>
      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={(day) => {
                    setSelectedDate(new Date(day.timestamp));
                    setShowDatePicker(false);
                  }}
                  markedDates={selectedDate ? {
                    [selectedDate.toISOString().split('T')[0]]: { selected: true }
                  } : {}}
                  maxDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    todayTextColor: '#007BFF',
                    selectedDayBackgroundColor: '#007BFF',
                    selectedDayTextColor: '#FFFFFF',
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight + 20, // Adjust for status bar and some padding
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
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007BFF',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  formBox: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  formLabel: { 
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: '600',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholderText: {
    fontSize: 16,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#777',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginTop: -10, // Overlap with the button
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  dropdownOptionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  dateText: { 
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    maxWidth: 400,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F0F8FF', // Light blue background
    borderWidth: 1,
    borderColor: '#E0F7FA',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#007BFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen; 