import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import { theme } from '../theme';

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
    <View style={styles.container}>
        
      <View style={styles.formContainer}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.logoImage} resizeMode="contain" />
      </View>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subtitleText}>Please enter your phone number to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
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
    </View>
      

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    // marginTop: 40,
    marginBottom: 20,
  },
  logoImage: {
    width: 260,
    height: 60,
    marginBottom: 10,
  },
  formContainer: {
    // flex: 1,
    marginTop: 100,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    paddingVertical: 32,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LoginScreen; 