import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const OTPScreen = ({ navigation, route }: StackScreenProps<RootStackParamList, 'OTP'>) => {
  const { phoneNumber, otp } = route.params || {};
  const [enteredOtp, setEnteredOtp] = useState('');

  useEffect(() => {
    if (!phoneNumber || !otp) {
      Alert.alert(
        'Error',
        'Missing phone number or OTP. Please try logging in again.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  }, [phoneNumber, otp, navigation]);

  const handleVerify = () => {
    if (enteredOtp === otp) {
      Alert.alert('Success', 'OTP Verified!');
      navigation.navigate('AppTabs', { screen: 'HomeTab' });
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
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
        <Text style={styles.welcomeText}>Verify Your Number</Text>
        {phoneNumber ? (
          <Text style={styles.subtitleText}>Enter the 4-digit code sent to {phoneNumber}</Text>
        ) : (
          <Text style={styles.subtitleText}>Enter the 4-digit code</Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={enteredOtp}
            onChangeText={setEnteredOtp}
            maxLength={4}
            secureTextEntry={false}
          />
        </View>

        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'System',
  },
  verifyButton: {
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
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#007BFF',
    fontSize: 16,
    fontFamily: 'System',
  },
});

export default OTPScreen; 