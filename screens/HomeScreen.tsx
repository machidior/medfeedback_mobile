import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Alert, TouchableWithoutFeedback, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from '../types';
import { Calendar } from 'react-native-calendars';
import Constants from 'expo-constants';

// Define the navigation prop type for HomeScreen when nested in Bottom Tabs
type HomeScreenNavigationProp = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'HomeTab'>, 
  StackScreenProps<RootStackParamList> 
>;

// Placeholder icons (you might replace these with icons from a library)
const MenuIcon = () => <Text style={styles.icon}>☰</Text>;
const GlobeIcon = () => <Text style={styles.icon}>🌐</Text>;

// Use CompositeScreenProps for the component prop type
const HomeScreen = ({ navigation, route }: HomeScreenNavigationProp) => {
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
      welcomeSub: 'Your opinion matters and helps us serve you better. This would only take a few minutes.',
      formAs: 'Who do you fill this form as?',
      selectType: 'Select type',
     
      dateAttended: 'Date of Attendance',
      gender: 'Gender',
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
      
      dateAttended: 'Tarehe ya Mahudhurio',
      gender: 'Jinsia',
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
    if (!gender || !selectedDate) {
      Alert.alert(
        'Incomplete Form',
        'Please fill in all fields before continuing.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('Department', { selectedDate: selectedDate, gender: gender });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
        <TouchableOpacity onPress={toggleLanguage} style={styles.headerIconRight}>
          <Text style={styles.icon}>🌐</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formBox}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>{t.welcome}</Text>
          <Text style={styles.welcomeText}>{t.welcomeSub}</Text>
        </View>
        {/* Date Selection */}
        <Text style={styles.inputLabel}>{t.dateAttended}</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={selectedDate ? styles.dateText : styles.placeholderText}>
            {selectedDate ? formatDate(selectedDate) : "Date"}
          </Text>
        </TouchableOpacity>
        {/* Gender Selection */}
        <Text style={styles.inputLabel}>{t.gender}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight + 20,
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
    fontSize: 18,
    color: '#000000',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007BFF',
  },
  welcomeText: {
    fontSize: 13,
    textAlign: 'left',
    color: '#333',
  },
  formBox: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    width: '92%',
    maxWidth: 500, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: '#222',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#F9F9F9',
  },
  dateText: { 
    fontSize: 15,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#777',
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
    width: '80%',
    maxWidth: 400,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#E0F7FA',
    marginHorizontal: 6,
  },
  radioButtonSelected: {
    backgroundColor: '#007BFF22',
    borderColor: '#007BFF',
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
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formNote: {
    fontSize: 10,
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