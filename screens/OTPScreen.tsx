import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';

const OTPScreen = ({ navigation, route }: StackScreenProps<RootStackParamList, 'OTP'>) => {
  const { phoneNumber, otp } = route.params || {};
  const [enteredOtp, setEnteredOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

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

  const handleChange = (text: string) => {
    if (/^\d{0,4}$/.test(text)) {
      setEnteredOtp(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/medfeedback_logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>
        <View style={styles.inputContainer}>
          {phoneNumber ? (
            <Text style={styles.subtitleText}>Enter verification code sent to <Text style={{color: '#82D0D0', fontWeight: 'bold'}}>{phoneNumber}</Text></Text>
          ) : (
            <Text style={styles.subtitleText}>Enter the OTP</Text>
          )}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current && inputRef.current.focus()}
            style={styles.otpBoxesContainer}
          >
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.otpBox, enteredOtp.length === i && styles.otpBoxActive]}>
                <Text style={styles.otpBoxText}>{enteredOtp[i] || ''}</Text>
              </View>
            ))}
            <TextInput
              ref={inputRef}
              style={styles.otpHiddenInput}
              value={enteredOtp}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
              caretHidden
            />
          </TouchableOpacity>
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
    marginBottom: 20
    ,
  },
  logoImage: {
    width: 260,
    height: 60,
    marginBottom: 10,
  },
  formContainer: {
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
    width: '90%',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  otpBoxActive: {
    borderColor: '#82D0D0',
    backgroundColor: '#E6F7FF',
  },
  otpBoxText: {
    fontSize: 28,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  otpHiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  verifyButton: {
    backgroundColor: '#82D0D0',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#AD2F2F',
    fontSize: 14,
  
  },
});

export default OTPScreen; 