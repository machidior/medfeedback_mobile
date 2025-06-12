import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// Define the navigation prop type for ThankYouScreen
type ThankYouScreenProps = StackScreenProps<RootStackParamList, 'ThankYou'>;

// Placeholder checkmark icon (you might replace this with an icon from a library)
const CheckmarkIcon = () => <Text style={styles.checkmark}>✓</Text>;

const ThankYouScreen = ({ navigation }: ThankYouScreenProps) => {

  const handleReturnHome = () => {
    // Navigate back to the Home screen (specifically the HomeTab in AppTabs)
    // This requires navigating to the AppTabs navigator and then specifying the HomeTab screen
    navigation.navigate('AppTabs', { screen: 'HomeTab' });
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
        <Text style={styles.icon}>🌐</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentBox}>
          <View style={styles.iconContainer}>
            <CheckmarkIcon />
          </View>
          <Text style={styles.thankYouText}>Thank You for you Feedback!</Text>
          <Text style={styles.subtitleText}>Your input helps us improve</Text>
          <TouchableOpacity style={styles.returnHomeButton} onPress={handleReturnHome}>
            <Text style={styles.buttonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  returnHomeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
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
});

export default ThankYouScreen; 