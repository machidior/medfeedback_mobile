import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import Constants from 'expo-constants';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types';

type SettingsScreenProps = BottomTabScreenProps<BottomTabParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      settings: 'Settings',
      language: 'Language',
      theme: 'Dark Mode',
      notifications: 'Notifications',
      sound: 'Sound',
      vibration: 'Vibration',
      dataSaver: 'Data Saver',
      clearCache: 'Clear Cache',
      helpSupport: 'Help & Support',
      appInformation: 'App Information',
      version: 'Version:',
      aboutApp: 'About MedFeedback',
      logout: 'Logout',
    },
    sw: {
      headerTitle: 'MedFeedback',
      settings: 'Mipangilio',
      language: 'Lugha',
      theme: 'Muda wa Giza',
      notifications: 'Arifa',
      sound: 'Sauti',
      vibration: 'Mtikisiko',
      dataSaver: 'Hifadhi Data',
      clearCache: 'Futa Akiba',
      helpSupport: 'Msaada & Usaidizi',
      appInformation: 'Taarifa za Programu',
      version: 'Toleo:',
      aboutApp: 'Kuhusu MedFeedback',
      logout: 'Toka',
    },
  };

  const t = translations[language];

  const handleClearCache = () => {
    Alert.alert(
      t.clearCache,
      language === 'en' ? 'App cache cleared!' : 'Akiba ya programu imefutwa!'
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      t.helpSupport,
      language === 'en' ? 'Contact support at support@medfeedback.com' : 'Wasiliana na msaada kupitia support@medfeedback.com'
    );
  };

  const handleLogout = () => {
    navigation.getParent()?.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      {/* Title */}
      <Text style={styles.screenTitle}>{t.settings}</Text>

      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {/* Language Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.languageRow}>
            <Text style={styles.languageLabel}>{t.language}</Text>
            <View style={styles.languageSegmentedControl}>
              <TouchableOpacity
                style={[styles.languageSegment, language === 'en' && styles.languageSegmentActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.languageSegmentText, language === 'en' && styles.languageSegmentTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.languageSegment, language === 'sw' && styles.languageSegmentActive]}
                onPress={() => setLanguage('sw')}
              >
                <Text style={[styles.languageSegmentText, language === 'sw' && styles.languageSegmentTextActive]}>SW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.theme}</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.optionText}>{t.theme}</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? '#82D0D0' : '#ccc'}
              trackColor={{ false: '#eee', true: '#b2eaea' }}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.notifications}</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.optionText}>{t.notifications}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? '#82D0D0' : '#ccc'}
              trackColor={{ false: '#eee', true: '#b2eaea' }}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.optionText}>{t.sound}</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              thumbColor={soundEnabled ? '#82D0D0' : '#ccc'}
              trackColor={{ false: '#eee', true: '#b2eaea' }}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.optionText}>{t.vibration}</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              thumbColor={vibrationEnabled ? '#82D0D0' : '#ccc'}
              trackColor={{ false: '#eee', true: '#b2eaea' }}
            />
          </View>
        </View>

        {/* Data Usage Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.dataSaver}</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.optionText}>{t.dataSaver}</Text>
            <Switch
              value={dataSaver}
              onValueChange={setDataSaver}
              thumbColor={dataSaver ? '#82D0D0' : '#ccc'}
              trackColor={{ false: '#eee', true: '#b2eaea' }}
            />
          </View>
        </View>

        {/* Utility Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleClearCache}>
            <Text style={styles.optionText}>{t.clearCache}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleHelpSupport}>
            <Text style={styles.optionText}>{t.helpSupport}</Text>
          </TouchableOpacity>
        </View>

        {/* App Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t.appInformation}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.version}</Text>
            <Text style={styles.infoText}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert(t.aboutApp, 'MedFeedback v1.0.0') }>
            <Text style={styles.optionText}>{t.aboutApp}</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: '#F4F6F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#82D0D0',
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
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
    color: '#82D0D0',
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#333',
  },
  optionButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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
    fontSize: 15,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  languageLabel: {
    fontSize: 15,
    marginBottom: 5,
    color: '#333',
  },
  languageSegmentedControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  languageSegment: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  languageSegmentActive: {
    backgroundColor: '#82D0D0',
  },
  languageSegmentText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 15,
  },
  languageSegmentTextActive: {
    color: '#fff',
  },
});

export default SettingsScreen; 