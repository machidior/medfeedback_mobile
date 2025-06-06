import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OTP: undefined;
  Home: undefined;
};

const WelcomeScreen = ({ navigation }: StackScreenProps<RootStackParamList, 'Welcome'>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>medfeedback</Text>
      <ScrollView horizontal={true} pagingEnabled={true}>
        <View style={styles.page}>
          <Text style={styles.pageText}>Welcome to our app!</Text>
          <Text style={styles.pageText}>This is the first section of the objective.</Text>
        </View>
        <View style={styles.page}>
          <Text style={styles.pageText}>Here is the second part.</Text>
          <Text style={styles.pageText}>Explaining more about what the app does.</Text>
        </View>
        <View style={styles.page}>
          <Text style={styles.pageText}>And the final section.</Text>
          <Text style={styles.pageText}>Outlining the key features and benefits.</Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6', // Light blue background
    alignItems: 'center',
    justifyContent: 'center',
    // Removed paddingTop
  },
  page: {
    backgroundColor: '#FFFFFF', // White background for the container
    marginHorizontal: 20, // Add horizontal margin between pages
    borderRadius: 10, // Optional: add rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 32, // Increased font size
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50, // Added top margin to position it below the top of the screen
  },
  pageText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#007BFF', // Example button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default WelcomeScreen; 