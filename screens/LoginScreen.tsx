import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const LoginScreen = ({ navigation }: StackScreenProps<RootStackParamList, 'Login'>) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    const phoneRegex = /^0\d{9}$/;

    if (phoneNumber.trim() === '') {
      Alert.alert('Input Required', 'Please enter your phone number.');
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number in the format 0xxxxxxxxx.');
      return;
    }

    // Simulate OTP generation (in a real app, this would be sent from a backend)
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
    console.log(`Generated OTP for ${phoneNumber}: ${otp}`); // For testing purposes

    // If validation passes, navigate to the OTP screen, passing the phone number and OTP
    navigation.navigate('OTP', { phoneNumber: phoneNumber, otp: otp });
  };

  return (
    <LinearGradient
      colors={['#E6F7FF', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MF</Text>
        <Text style={styles.titleText}>MedFeedback</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subtitleText}>Please enter your phone number to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={15}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007BFF',
    backgroundColor: '#E6F7FF',
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 100,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#004080',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 10,
    fontFamily: 'System',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    fontFamily: 'System',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'System',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    fontFamily: 'System',
  },
});

export default LoginScreen; 