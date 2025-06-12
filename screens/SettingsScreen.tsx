import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [userName, setUserName] = useState('Robert Msogoya');
  const [userEmail, setUserEmail] = useState('robertmsogoya2@gmail.com');
  const [userPhone, setUserPhone] = useState('+255746008941');

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      profileTitle: 'User Profile',
      nameLabel: 'Name:',
      emailLabel: 'Email:',
      phoneLabel: 'Phone Number:',
      saveChanges: 'Save Changes',
      accountSettings: 'Account Settings',
      changePassword: 'Change Password',
      privacyPolicy: 'Privacy Policy',
      notificationPreferences: 'Notification Preferences',
      enableNotifications: 'Enable Notifications',
      soundAlerts: 'Sound Alerts',
      appInformation: 'App Information',
      version: 'Version:',
      aboutApp: 'About MedFeedback',
      logout: 'Logout',
    },
    sw: {
      headerTitle: 'MedFeedback',
      profileTitle: 'Wasifu wa Mtumiaji',
      nameLabel: 'Jina:',
      emailLabel: 'Barua pepe:',
      phoneLabel: 'Namba ya Simu:',
      saveChanges: 'Hifadhi Mabadiliko',
      accountSettings: 'Mipangilio ya Akaunti',
      changePassword: 'Badilisha Nenosiri',
      privacyPolicy: 'Sera ya Faragha',
      notificationPreferences: 'Mapendekezo ya Arifa',
      enableNotifications: 'Washa Arifa',
      soundAlerts: 'Arifa za Sauti',
      appInformation: 'Taarifa za Programu',
      version: 'Toleo:',
      aboutApp: 'Kuhusu MedFeedback',
      logout: 'Toka',
    },
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'sw' : 'en'));
  };

  const handleSaveChanges = () => {
    // Implement save logic here
    console.log('Saving changes:', { userName, userEmail, userPhone });
    alert('Profile changes saved!');
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear user session
    navigation.navigate('Login'); // Navigate to Login screen
  };

  const handleOptionPress = (option: string) => {
    console.log(`${option} pressed`);
    // Implement navigation or actions based on option
    if (option === 'changePassword') {
      // navigation.navigate('ChangePasswordScreen'); // Example navigation
      alert('Change Password option pressed');
    } else if (option === 'privacyPolicy') {
      // navigation.navigate('PrivacyPolicyScreen'); // Example navigation
      alert('Privacy Policy option pressed');
    } else if (option === 'aboutApp') {
      // navigation.navigate('AboutAppScreen'); // Example navigation
      alert('About MedFeedback option pressed');
    }
  };

  return (
    <LinearGradient
      colors={['#E6F7FF', '#FFFFFF']} // Light blue to white gradient
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={styles.icon}>🌐</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {/* User Profile Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.profileTitle}</Text>

          <Text style={styles.label}>{t.nameLabel}</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder={t.nameLabel}
          />

          <Text style={styles.label}>{t.emailLabel}</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder={t.emailLabel}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>{t.phoneLabel}</Text>
          <TextInput
            style={styles.input}
            value={userPhone}
            onChangeText={setUserPhone}
            placeholder={t.phoneLabel}
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>{t.saveChanges}</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.accountSettings}</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('changePassword')}>
            <Text style={styles.optionText}>{t.changePassword}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('privacyPolicy')}>
            <Text style={styles.optionText}>{t.privacyPolicy}</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.notificationPreferences}</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('enableNotifications')}>
            <Text style={styles.optionText}>{t.enableNotifications}</Text>
            {/* Add a toggle switch here */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('soundAlerts')}>
            <Text style={styles.optionText}>{t.soundAlerts}</Text>
            {/* Add a toggle switch here */}
          </TouchableOpacity>
        </View>

        {/* App Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.appInformation}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.version}</Text>
            <Text style={styles.infoText}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('aboutApp')}>
            <Text style={styles.optionText}>{t.aboutApp}</Text>
          </TouchableOpacity>
    </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20, // Adjust for status bar and some padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#004080',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#FF6347', // Tomato color for logout
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 