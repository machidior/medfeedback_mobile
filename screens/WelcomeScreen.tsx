import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

const WelcomeScreen = ({ navigation }: StackScreenProps<RootStackParamList, 'Welcome'>) => {
  return (
    <LinearGradient
      colors={['#E6F7FF', '#FFFFFF']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MF</Text>
        <Text style={styles.titleText}>MedFeedback</Text>
      </View>
      
      <ScrollView 
        horizontal={true} 
        pagingEnabled={true}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.page}>
          <Text style={styles.pageTitle}>Welcome to MedFeedback!</Text>
          <Text style={styles.pageText}>Your voice matters in improving healthcare services.</Text>
        </View>
        <View style={styles.page}>
          <Text style={styles.pageTitle}>Share Your Experience</Text>
          <Text style={styles.pageText}>Help us enhance patient care by providing valuable feedback.</Text>
        </View>
        <View style={styles.page}>
          <View style={styles.lastPageContent}>
            <Text style={styles.pageTitle}>Make a Difference</Text>
            <Text style={styles.pageText}>Your feedback drives positive change in healthcare delivery.</Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  page: {
    width: 400,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  lastPageContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'System',
  },
  pageText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'System',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
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

export default WelcomeScreen; 