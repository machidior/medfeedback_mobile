import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B0E0E6', // Light blue background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentBox: {
    backgroundColor: '#FFFFFF', // White background for the box
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#90EE90', // Light green background for icon
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
  },
  subtitleText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  returnHomeButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThankYouScreen; 