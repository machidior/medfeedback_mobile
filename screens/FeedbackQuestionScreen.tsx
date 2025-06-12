import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the navigation prop type for FeedbackQuestionScreen
type FeedbackQuestionScreenProps = StackScreenProps<RootStackParamList, 'FeedbackQuestion'>;

// Placeholder icons (you might replace these with icons from a library)
const MenuIcon = () => <Text style={styles.icon}>☰</Text>;
const GlobeIcon = () => <Text style={styles.icon}>🌐</Text>;

// Define the structure for a question
interface Question {
  id: string;
  department: string;
  text: string;
  type: 'slider' | 'radio' | 'rating';
  options?: string[]; // For radio button type
}

// Dummy data for questions - Expanded to include all departments
const allQuestions: Question[] = [
  // Emergency Questions
  {
    id: 'emergency_q1',
    department: 'Emergency',
    text: 'How quickly were you attended to upon arrival?',
    type: 'slider',
  },
  {
    id: 'emergency_q2',
    department: 'Emergency',
    text: 'How would you rate the communication of the medical team during your emergency visit?',
    type: 'rating',
  },
  {
    id: 'emergency_q3',
    department: 'Emergency',
    text: 'Were your concerns addressed properly?',
    type: 'radio',
    options: ['Yes, Completely', 'Somewhat', 'No, Not at all'],
  },
  {
    id: 'emergency_q4',
    department: 'Emergency',
    text: 'Were the emergency team well prepared to handle your case?',
    type: 'radio',
    options: ['Yes, Completely', 'Somewhat', 'No, Not at all'],
  },

  // Outpatient Clinic Questions
  {
    id: 'outpatient_q1',
    department: 'Outpatient Clinic',
    text: 'How long did you wait for your appointment?',
    type: 'slider',
  },
  {
    id: 'outpatient_q2',
    department: 'Outpatient Clinic',
    text: 'How satisfied were you with the clinic staff?',
    type: 'radio',
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
  },
  {
    id: 'outpatient_q3',
    department: 'Outpatient Clinic',
    text: 'Was the clinic environment clean and comfortable?',
    type: 'radio',
    options: ['Yes', 'No'],
  },

  // Impatient Clinic Questions
  {
    id: 'impatient_q1',
    department: 'Impatient Clinic',
    text: 'How would you rate the attentiveness of the nurses?',
    type: 'rating',
  },
  {
    id: 'impatient_q2',
    department: 'Impatient Clinic',
    text: 'Were your meals satisfactory during your stay?',
    type: 'radio',
    options: ['Yes', 'No', 'N/A'],
  },
  {
    id: 'impatient_q3',
    department: 'Impatient Clinic',
    text: 'Was the room clean and comfortable?',
    type: 'radio',
    options: ['Yes', 'No'],
  },

  // Radiology Questions
  {
    id: 'radiology_q1',
    department: 'Radiology',
    text: 'How long did you wait for your imaging procedure?',
    type: 'slider',
  },
  {
    id: 'radiology_q2',
    department: 'Radiology',
    text: 'Was the technician professional and clear?',
    type: 'radio',
    options: ['Yes, Very', 'Somewhat', 'No'],
  },
  {
    id: 'radiology_q3',
    department: 'Radiology',
    text: 'Were you given clear instructions after the procedure?',
    type: 'radio',
    options: ['Yes', 'No'],
  },

  // Laboratory Questions
  {
    id: 'laboratory_q1',
    department: 'Laboratory',
    text: 'How quickly was your sample taken?',
    type: 'slider',
  },
  {
    id: 'laboratory_q2',
    department: 'Laboratory',
    text: 'Was the lab technician gentle and skilled?',
    type: 'radio',
    options: ['Yes, Very', 'Somewhat', 'No'],
  },
  {
    id: 'laboratory_q3',
    department: 'Laboratory',
    text: 'Was the lab area clean?',
    type: 'radio',
    options: ['Yes', 'No'],
  },

  // Pharmacy Questions
  {
    id: 'pharmacy_q1',
    department: 'Pharmacy',
    text: 'How long did you wait for your prescription?',
    type: 'slider',
  },
  {
    id: 'pharmacy_q2',
    department: 'Pharmacy',
    text: 'Was the pharmacist helpful and knowledgeable?',
    type: 'radio',
    options: ['Yes, Completely', 'Somewhat', 'No, Not at all'],
  },
  {
    id: 'pharmacy_q3',
    department: 'Pharmacy',
    text: 'Was the pharmacy clean and organized?',
    type: 'radio',
    options: ['Yes, Completely', 'Somewhat', 'No, Not at all'],
  },

  // Billing Questions
  {
    id: 'billing_q1',
    department: 'Billing',
    text: 'How clear was your billing statement?',
    type: 'slider',
  },
  {
    id: 'billing_q2',
    department: 'Billing',
    text: 'Was the billing staff helpful and courteous?',
    type: 'radio',
    options: ['Yes, Very', 'Somewhat', 'No'],
  },
  {
    id: 'billing_q3',
    department: 'Billing',
    text: 'Was the billing process efficient?',
    type: 'radio',
    options: ['Yes', 'No'],
  },

  // Mortuary Questions
  {
    id: 'mortuary_q1',
    department: 'Mortuary',
    text: 'How would you rate the sensitivity and respect shown by the staff?',
    type: 'rating',
  },
  {
    id: 'mortuary_q2',
    department: 'Mortuary',
    text: 'Were your needs and requests handled appropriately?',
    type: 'radio',
    options: ['Yes, Completely', 'Somewhat', 'No, Not at all'],
  },
  {
    id: 'mortuary_q3',
    department: 'Mortuary',
    text: 'Was the facility clean and well-maintained?',
    type: 'radio',
    options: ['Yes', 'No'],
  },

  // Maternity Questions
  {
    id: 'maternity_q1',
    department: 'Maternity',
    text: 'How would you rate the care provided during labor and delivery?',
    type: 'rating',
  },
  {
    id: 'maternity_q2',
    department: 'Maternity',
    text: 'Was the postnatal care informative and supportive?',
    type: 'radio',
    options: ['Yes, Very', 'Somewhat', 'No'],
  },
  {
    id: 'maternity_q3',
    department: 'Maternity',
    text: 'Were your questions and concerns addressed by the medical team?',
    type: 'radio',
    options: ['Yes, Completely', 'Somewhat', 'No, Not at all'],
  },

  // Immunization Questions
  {
    id: 'immunization_q1',
    department: 'Immunization',
    text: 'How quickly was the immunization administered?',
    type: 'slider',
  },
  {
    id: 'immunization_q2',
    department: 'Immunization',
    text: 'Was the nurse gentle during the injection?',
    type: 'radio',
    options: ['Yes, Very', 'Somewhat', 'No'],
  },
  {
    id: 'immunization_q3',
    department: 'Immunization',
    text: 'Were you provided with clear post-immunization instructions?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
];

const FeedbackQuestionScreen = ({ navigation, route }: FeedbackQuestionScreenProps) => {
  const { selectedDepartments } = route.params; // Get selected departments from navigation params
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [currentDepartmentIndex, setCurrentDepartmentIndex] = useState(0); // State for current department index
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

  const currentDepartment = selectedDepartments[currentDepartmentIndex];
  const departmentQuestions = allQuestions.filter(q => q.department === currentDepartment);

  useEffect(() => {
    // Reset current department index and answers when selected departments change
    setCurrentDepartmentIndex(0);
    setAnswers({});
  }, [selectedDepartments]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleContinue = async () => {
    // Check if all questions for the current department are answered
    const allCurrentQuestionsAnswered = departmentQuestions.every(
      (question) => answers[question.id] !== undefined
    );

    if (!allCurrentQuestionsAnswered) {
      Alert.alert(
        'Incomplete Feedback',
        'Please answer all questions for the current department before proceeding.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If there are more departments to answer for
    if (currentDepartmentIndex < selectedDepartments.length - 1) {
      setCurrentDepartmentIndex(currentDepartmentIndex + 1);
      setAnswers({}); // Clear answers for the new department
    } else {
      // All departments answered, save feedback and navigate to Comment screen
      const feedbackEntry = {
        id: Date.now().toString(), // Unique ID for the feedback entry
        departments: selectedDepartments, // Array of department names
        answers: answers,
        date: new Date().toLocaleDateString(), // Current date
        status: 'Submitted', // Or 'Draft' if you want to implement that functionality
      };

      try {
        const existingFeedback = await AsyncStorage.getItem('feedbackHistory');
        const feedbackHistory = existingFeedback ? JSON.parse(existingFeedback) : [];
        feedbackHistory.push(feedbackEntry);
        await AsyncStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory));
        console.log('Feedback saved successfully!');
      } catch (e) {
        console.error('Failed to save feedback:', e);
      }

      navigation.navigate('Comment', { answers: answers, selectedDepartments: selectedDepartments });
    }
  };

  const handlePreviousDepartment = () => {
    if (currentDepartmentIndex > 0) {
      setCurrentDepartmentIndex(prevIndex => prevIndex - 1);
    } else {
      // If on the first department, go back to the Department Selection screen
      navigation.goBack();
    }
  };

  // Render the appropriate input type based on the question type
  const renderInput = (question: Question) => {
    switch (question.type) {
      case 'slider':
        return (
          <View style={styles.inputContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={answers[question.id] || 0}
              onValueChange={(value: number) => handleAnswer(question.id, value)} // Pass question id and value
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#007BFF"
            />
            <Text style={styles.sliderValue}>{answers[question.id] || 0}</Text>
          </View>
        );
      case 'radio':
        return (
          <View style={styles.inputContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.radioOption}
                onPress={() => handleAnswer(question.id, option)} // Pass question id and option
              >
                <View style={styles.radioOuter}>
                  {answers[question.id] === option && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'rating':
        return (
          <View style={styles.inputContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={answers[question.id] || 0}
              onValueChange={(value) => handleAnswer(question.id, value)}
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#007BFF"
            />
            <Text style={styles.sliderValue}>
              {answers[question.id] || 0}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const translations = {
    en: {
      title: 'MedFeedback',
    },
    sw: {
      title: 'MedFeedback',
    },
  };

  return (
    <LinearGradient
      colors={['#E6F7FF', '#FFFFFF']} // Light blue to white gradient
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousDepartment}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations[language].title}</Text>
        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={styles.icon}>🌐</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View style={styles.contentContainer}> {/* Container for questions */}
          <Text style={styles.departmentTitle}>{currentDepartment}</Text>
          {departmentQuestions.length > 0 ? (
            departmentQuestions.map((question) => (
              <View key={question.id} style={styles.questionContainer}> {/* Wrap question and input */}
                <Text style={styles.questionText}>{question.text}</Text>
                {renderInput(question)} {/* Pass the individual question */} 
              </View>
            ))
          ) : (
            <Text>No questions available for this department.</Text>
          )}
        </View>

        {/* Navigation Button */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleContinue}
          >
            <Text style={styles.navButtonText}>
              {currentDepartmentIndex < selectedDepartments.length - 1 ? 'Next Department →' : 'Continue to Comment →'} {/* Dynamic button text */}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20, // Adjust for status bar and some padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 24,
    color: '#007BFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF',
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  contentContainer:{
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  departmentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: { // New style for each question block
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 15, // Adjust margin for new layout
    color: '#333',
  },
  inputContainer: {
    marginBottom: 0, // Adjust margin as container now wraps input
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 5, // Add some space above the value
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Adjust margin
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10, // Add some space above the button
  },
  navButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackQuestionScreen; 