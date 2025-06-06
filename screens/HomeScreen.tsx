import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types';
import { Calendar } from 'react-native-calendars';

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

  // TODO: Add continue button logic if needed later

  const handleContinue = () => {
    // TODO: Implement validation and navigation
    console.log('Continue button pressed');
    // Example validation:
    // if (!selectedType || !date || gender === null) {
    //   alert('Please fill out all fields');
    //   return;
    // }
    
    // Use navigation.getParent() to navigate to a screen in the parent stack navigator
    navigation.getParent()?.navigate('Department');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <>
          <TouchableOpacity>
            <MenuIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title}</Text>
          <TouchableOpacity onPress={toggleLanguage}>
            <GlobeIcon />
          </TouchableOpacity>
        </>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <>
          <Text style={styles.welcomeTitle}>{t.welcome}</Text>
          <Text style={styles.welcomeText}>{t.welcomeSub}</Text>
        </>
      </View>

      {/* Form Container */}
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

        {/* Date Picker Button */}
        <Text style={styles.formLabel}>{t.dateAttended}</Text>
        <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
          <Text style={date ? styles.dateText : styles.placeholderText}>
            {date ? date.toLocaleDateString() : '[d/M/y]'}
          </Text>
          <Text style={styles.dateIcon}>▼</Text>
        </TouchableOpacity>

        {/* Custom Calendar Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1} 
            onPressOut={() => setShowDatePicker(false)}
          >
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={date ? { [date.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' } } : undefined}
                maxDate={new Date().toISOString().split('T')[0]}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Gender Selection */}
        <Text style={styles.formLabel}>{t.gender}</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={styles.radioButton}
            onPress={() => toggleGender('Female')}
          >
            <View style={[styles.radioOuter, gender === 'Female' && styles.radioOuterSelected]}>
              {gender === 'Female' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{t.female}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.radioButton}
            onPress={() => toggleGender('Male')}
          >
            <View style={[styles.radioOuter, gender === 'Male' && styles.radioOuterSelected]}>
              {gender === 'Male' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{t.male}</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
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
    alignItems: 'center',
    paddingTop: 80,
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#004080',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 22,
  },
  formBox: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400, 
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  formLabel: { 
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
    color: '#333',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginBottom: 15,
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
    color: '#333',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginTop: -15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownOptionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginBottom: 15,
  },
  dateText: { 
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  dateIcon: { 
    fontSize: 16,
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#007BFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 