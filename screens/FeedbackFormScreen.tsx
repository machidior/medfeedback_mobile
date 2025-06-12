import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type FeedbackFormScreenProps = StackScreenProps<RootStackParamList, 'FeedbackForm'>;

const FeedbackFormScreen = ({ navigation, route }: FeedbackFormScreenProps) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const translations = {
    en: {
      title: 'MedFeedback',
      feedbackTitle: 'Your Feedback',
      feedbackSubtitle: 'Please rate your experience with us',
      submit: 'Submit Feedback',
      back: 'Back'
    },
    sw: {
      title: 'MedFeedback',
      feedbackTitle: 'Maoni Yako',
      feedbackSubtitle: 'Tafadhali tathmini uzoefu wako na sisi',
      submit: 'Wasilisha Maoni',
      back: 'Rudi Nyuma'
    }
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.headerTitle}>MedFeedback</Text>
        <Text style={styles.icon}>🌐</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t.feedbackTitle}</Text>
          <Text style={styles.subtitle}>{t.feedbackSubtitle}</Text>
          
          {/* Feedback form content will go here */}
          
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{t.submit}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF', // Blue icon color
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackFormScreen; 