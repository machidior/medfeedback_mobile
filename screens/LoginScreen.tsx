import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.titleText}>MedFeedback</Text>
        <Text style={styles.label}>Enter Mobile Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 0746008941"
          keyboardType="phone-pad"
        />
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('OTP')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.noteText}>Note: This application doesn't use any of your credential during{`\n`}the feedback submission.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B0E0E6', // A slightly different light blue for distinction
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginBox: {
    backgroundColor: '#FFFFFF', // White background for the container
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400, // Limit max width on larger screens
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF', // Blue color for the title
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start', // Align label to the left within the container
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#6495ED', // A shade of blue for the button
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

export default LoginScreen; 