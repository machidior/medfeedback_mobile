import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Submitted' | 'Draft'>('All');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadFeedbackHistory = async () => {
      try {
        const storedFeedback = await AsyncStorage.getItem('feedbackHistory');
        if (storedFeedback) {
          const parsedFeedback = JSON.parse(storedFeedback);
          // Sort feedback by date in descending order (most recent first)
          const sortedFeedback = parsedFeedback.sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setFeedbackHistory(sortedFeedback);
        }
      } catch (e) {
        console.error('Failed to load feedback history:', e);
      }
    };
    loadFeedbackHistory();
  }, []);

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      all: 'All',
      submitted: 'Submitted',
      draft: 'Draft',
      departmentsLabel: 'Department(s):',
      statusLabel: 'Status:',
    },
    sw: {
      headerTitle: 'MedFeedback',
      all: 'Zote',
      submitted: 'Zilizowasilishwa',
      draft: 'Rasimu',
      departmentsLabel: 'Idara:',
      statusLabel: 'Hali:',
    },
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'sw' : 'en'));
  };

  const filteredFeedback = feedbackHistory.filter((item) => {
    if (activeTab === 'All') {
      return true;
    }
    return item.status === activeTab; // Assuming status in saved data matches tab names
  });

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

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'All' && styles.activeTabButton]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>{t.all}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Submitted' && styles.activeTabButton]}
          onPress={() => setActiveTab('Submitted')}
        >
          <Text style={[styles.tabText, activeTab === 'Submitted' && styles.activeTabText]}>{t.submitted}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Draft' && styles.activeTabButton]}
          onPress={() => setActiveTab('Draft')}
        >
          <Text style={[styles.tabText, activeTab === 'Draft' && styles.activeTabText]}>{t.draft}</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Cards */}
      <ScrollView style={styles.scrollView}>
        {filteredFeedback.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardLabel}>{t.departmentsLabel}<Text style={styles.cardValue}>{Array.isArray(item.departments) ? item.departments.join(', ') : item.departments}</Text></Text>
              <Text style={styles.cardLabel}>{t.statusLabel}<Text style={styles.cardValue}>{item.status}</Text></Text>
            </View>
            <Text style={styles.dropdownArrow}>⌄</Text>
          </View>
        ))}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', // White background for tabs
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 14,
    color: '#888',
  },
  cardBody: {
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardValue: {
    fontWeight: 'normal',
    color: '#555',
  },
  dropdownArrow: {
    fontSize: 24,
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
});

export default HistoryScreen; 