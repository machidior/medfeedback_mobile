import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Import RootStackParamList from types.ts

// Remove the local RootStackParamList definition
// type RootStackParamList = {
//   Welcome: undefined;
//   Login: undefined;
//   OTP: undefined;    
//   Home: undefined;   
// };

// Use StackScreenProps to type the props, specifically for the 'OTP' screen
const OTPScreen = ({ navigation }: StackScreenProps<RootStackParamList, 'OTP'>) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]).current;

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input automatically
    if (text !== '' && index < otp.length - 1) {
      inputRefs[index + 1]?.focus();
    }
  };

  const handleContinue = () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    // TODO: Add OTP verification logic here
    // If verification is successful, navigate to the next screen
    // Navigate to the HomeTab within the AppTabs Bottom Tab Navigator
    navigation.navigate('AppTabs', { screen: 'HomeTab' }); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpBox}>
        <Text style={styles.titleText}>MedFeedback</Text>
        <Text style={styles.label}>Enter OTP:</Text>
        <View style={styles.otpContainer}>{
          otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { if (ref) inputRefs[index] = ref; }}
              style={styles.otpInput}
              keyboardType='number-pad'
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
            />
          ))
        }</View>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>{
          <Text style={styles.buttonText}>Continue</Text>
        }</TouchableOpacity>
      </View>
      <Text style={styles.noteText}>Note: This application doesn\'t use any of your credential during{`\\n`}the feedback submission.</Text>
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
  otpBox: {
    backgroundColor: '#FFFFFF', // White background for the container
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust width as needed
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    width: 40, // Adjust size of input box
    textAlign: 'center',
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default OTPScreen; 