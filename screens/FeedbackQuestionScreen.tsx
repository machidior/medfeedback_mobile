import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define the navigation prop type for FeedbackQuestionScreen
type FeedbackQuestionScreenProps = StackScreenProps<RootStackParamList, 'FeedbackQuestion'>;

// Arrow icons for navigation
const ArrowLeft = () => <Text style={styles.arrowIcon}>←</Text>;
const ArrowRight = () => <Text style={styles.arrowIcon}>→</Text>;

// Define the structure for a question
interface Question {
  id: number;
  questionText: string;
  questionType: 'RADIO' | 'RATING' | 'TEXT';
  options?: string[]; // For radio button type
  required: boolean;
  departmentId: number;
}

// Define the structure for a department
interface Department {
  id: number;
  name: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const FeedbackQuestionScreen = ({ navigation, route }: FeedbackQuestionScreenProps) => {
  const { selectedDepartments, selectedDate, gender } = route.params; // Get selected departments from navigation params
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [currentDepartmentIndex, setCurrentDepartmentIndex] = useState(0); // State for current department index
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentMap, setDepartmentMap] = useState<{ [key: string]: number }>({});
  const [departmentPriorityMap, setDepartmentPriorityMap] = useState<{ [key: string]: string }>({});
  const departmentPriorityMapRef = useRef<{ [key: string]: string }>({});

  const currentDepartment = selectedDepartments[currentDepartmentIndex];
  const departmentQuestions = allQuestions.filter(q => q.departmentId === departmentMap[currentDepartment]);

  // Fetch departments first to get their IDs
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://192.168.100.88:8089/api/departments/all');
      const departments: Department[] = response.data;
      
      console.log('Raw department data from API:', departments);
      
      // Create a map of department names to IDs
      const deptMap: { [key: string]: number } = {};
      // Create a map of department names to priorities
      const deptPriorityMap: { [key: string]: string } = {};
      
      departments.forEach(dept => {
        deptMap[dept.name] = dept.id;
        // Handle cases where priority might be missing or undefined
        const priority = dept.priority || 'MEDIUM'; // Default to MEDIUM if priority is missing
        deptPriorityMap[dept.name] = priority;
        console.log(`Department: ${dept.name}, ID: ${dept.id}, Priority: ${priority}`);
      });
      
      console.log('Department priority mapping:', deptPriorityMap);
      
      setDepartmentMap(deptMap);
      setDepartmentPriorityMap(deptPriorityMap);
      departmentPriorityMapRef.current = deptPriorityMap;
      
      return deptMap;
    } catch (err) {
      console.error('Error fetching departments:', err);
      throw err;
    }
  };

  // Fetch questions for a specific department
  const fetchQuestionsForDepartment = async (departmentId: number): Promise<Question[]> => {
    try {
      console.log(`Fetching questions for department ${departmentId}...`);
      
      // Try multiple endpoint formats
      const endpoints = [
        {
          url: 'http://192.168.100.88:8089/api/departments/department/questions',
          params: { id: departmentId }
        },
        {
          url: 'http://192.168.100.88:8089/api/departments/department/questions',
          params: { departmentId: departmentId }
        },
        {
          url: `http://192.168.100.88:8089/api/departments/${departmentId}/questions`,
          params: {}
        },
        {
          url: `http://192.168.100.88:8089/api/questions/department/${departmentId}`,
          params: {}
        }
      ];
      
      for (let i = 0; i < endpoints.length; i++) {
        try {
          console.log(`Trying endpoint ${i + 1}: ${endpoints[i].url}`);
          const response = await axios.get(endpoints[i].url, { params: endpoints[i].params });
          console.log(`Questions for department ${departmentId}:`, response.data);
          
          // Log the structure of each question to debug the ID issue
          if (response.data && Array.isArray(response.data)) {
            console.log(`Found ${response.data.length} questions for department ${departmentId}`);
            response.data.forEach((question, index) => {
              console.log(`Question ${index}:`, {
                id: question.id,
                questionText: question.questionText,
                questionType: question.questionType,
                departmentId: question.departmentId,
                hasId: question.id !== undefined && question.id !== null
              });
            });
          }
          
          return response.data;
        } catch (endpointErr: any) {
          console.log(`Endpoint ${i + 1} failed:`, endpointErr.response?.status);
          if (i === endpoints.length - 1) {
            // Last endpoint failed, throw the error
            throw endpointErr;
          }
        }
      }
      
      return [];
    } catch (err: any) {
      console.error(`Error fetching questions for department ${departmentId}:`, err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      return [];
    }
  };

  // Fetch all questions for selected departments
  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Selected departments:', selectedDepartments);
      
      // First get departments to map names to IDs
      const deptMap = await fetchDepartments();
      
      // Fetch questions for each selected department
      const allQuestionsData: Question[] = [];
      let tempIdCounter = 1000; // Start temporary IDs from 1000
      
      for (const deptName of selectedDepartments) {
        const deptId = deptMap[deptName];
        console.log(`Processing department: ${deptName}, ID: ${deptId}`);
        if (deptId) {
          const questions = await fetchQuestionsForDepartment(deptId);
          
          // Process questions and assign temporary IDs if needed
          const processedQuestions = questions.map(q => {
            if (q.id === undefined || q.id === null) {
              console.warn('Found question with undefined ID, assigning temporary ID:', q);
              return {
                ...q,
                id: tempIdCounter++
              };
            }
            return q;
          });
          
          allQuestionsData.push(...processedQuestions);
        } else {
          console.warn(`No department ID found for: ${deptName}`);
        }
      }
      
      console.log('All questions collected:', allQuestionsData);
      setAllQuestions(allQuestionsData);
      
      if (allQuestionsData.length === 0) {
        setError('No questions found for selected departments');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
  }, [selectedDepartments]);

  useEffect(() => {
    // Reset current department index when selected departments change
    setCurrentDepartmentIndex(0);
    // Don't reset answers - preserve them when navigating
  }, [selectedDepartments]);

  // Clean up invalid answers when questions change
  useEffect(() => {
    if (allQuestions.length > 0) {
      const cleanedAnswers: { [key: number]: any } = {};
      
      Object.keys(answers).forEach(key => {
        const questionId = parseInt(key);
        const question = allQuestions.find(q => q.id === questionId);
        const answer = answers[questionId];
        
        if (question) {
          // Ensure answer type matches question type
          if (question.questionType === 'RATING' && typeof answer !== 'number') {
            // Skip invalid rating answers
            return;
          } else if (question.questionType === 'TEXT' && typeof answer !== 'string') {
            // Skip invalid text answers
            return;
          } else if (question.questionType === 'RADIO' && typeof answer !== 'string') {
            // Skip invalid radio answers
            return;
          }
          
          cleanedAnswers[questionId] = answer;
        }
      });
      
      setAnswers(cleanedAnswers);
    }
  }, [allQuestions]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleAnswer = (questionId: number, answer: any) => {
    console.log('handleAnswer called:', { questionId, answer, type: typeof questionId });
    
    // Ensure the answer is of the correct type based on the question
    let processedAnswer = answer;
    
    // If it's a RATING question, ensure it's a number
    const question = allQuestions.find(q => q.id === questionId);
    if (question?.questionType === 'RATING') {
      processedAnswer = typeof answer === 'number' ? answer : 0;
    }
    
    console.log('Setting answer:', { questionId, processedAnswer });
    
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: processedAnswer,
    }));
  };

  const handleNextDepartment = () => {
    console.log('handleNextDepartment called');
    console.log('Current department:', currentDepartment);
    console.log('Current department index:', currentDepartmentIndex);
    console.log('Total departments:', selectedDepartments.length);
    
    // Check if all required questions for the CURRENT department are answered
    const currentDepartmentQuestions = allQuestions.filter(q => q.departmentId === departmentMap[currentDepartment]);
    const currentDepartmentRequiredQuestions = currentDepartmentQuestions.filter(q => q.required);
    
    console.log('Current department questions:', currentDepartmentQuestions.length);
    console.log('Current department required questions:', currentDepartmentRequiredQuestions.length);
    
    const currentDepartmentAnswered = currentDepartmentRequiredQuestions.every(
      (question) => {
        const answer = answers[question.id];
        const isAnswered = question.questionType === 'TEXT' 
          ? (answer && answer.trim() !== '')
          : (answer !== undefined && answer !== null && answer !== '');
        
        console.log(`Question ${question.id} answered:`, isAnswered, 'Answer:', answer);
        return isAnswered;
      }
    );

    console.log('Current department answered:', currentDepartmentAnswered);

    // If current department is completed, move to next department or navigate to Comment
    if (currentDepartmentAnswered) {
      if (currentDepartmentIndex < selectedDepartments.length - 1) {
        // Move to next department
        console.log('Moving to next department');
        setCurrentDepartmentIndex(currentDepartmentIndex + 1);
      } else {
        // All departments completed, navigate to Comment screen
        console.log('All departments completed, navigating to Comment screen');
        
        // Get department priorities from the department priority map
        const departmentPriorities = selectedDepartments.map(deptName => {
          const priority = departmentPriorityMapRef.current[deptName];
          console.log(`Looking up priority for ${deptName}:`, priority);
          
          // If priority is not found in the map, try to get it from the state
          if (!priority) {
            const statePriority = departmentPriorityMap[deptName];
            console.log(`Priority not found in ref, checking state for ${deptName}:`, statePriority);
            return statePriority || 'MEDIUM'; // Default to MEDIUM if priority not found
          }
          
          return priority;
        });
        
        console.log('Department priority map state:', departmentPriorityMapRef.current);
        console.log('Selected departments:', selectedDepartments);
        console.log('Calculated priorities:', departmentPriorities);
        console.log('Priorities array type:', typeof departmentPriorities);
        console.log('Priorities array length:', departmentPriorities.length);
        
        // Final fallback: if we still don't have priorities, create default ones
        const finalPriorities = departmentPriorities.length > 0 ? departmentPriorities : selectedDepartments.map(() => 'MEDIUM');
        console.log('Final priorities being passed:', finalPriorities);
        console.log('Final priorities type:', typeof finalPriorities);
        console.log('Final priorities length:', finalPriorities.length);
        
        const navigationParams = { 
          answers: answers, 
          questions: allQuestions,
          selectedDepartments: selectedDepartments,
          departmentPriorities: finalPriorities, // Use final priorities
          selectedDate: selectedDate,
          gender: gender
        };
        
        console.log('Navigation params being passed:', JSON.stringify(navigationParams, null, 2));
        
        navigation.navigate('Comment', navigationParams);
      }
    } else {
      // Show alert that current department questions need to be completed
      console.log('Current department not completed, showing alert');
      Alert.alert(
        'Required Questions',
        'Please answer all required questions for this department before proceeding.',
        [{ text: 'OK' }]
      );
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
    console.log('renderInput called for question:', { 
      id: question.id, 
      questionText: question.questionText, 
      questionType: question.questionType 
    });
    
    switch (question.questionType) {
      case 'RADIO':
        return (
          <View style={styles.inputContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={`${question.id || 'q'}-${option}-${index}`}
                style={[
                  styles.radioOption,
                  answers[question.id] === option && styles.radioOptionSelected
                ]}
                onPress={() => {
                  console.log('Radio option pressed:', { questionId: question.id, option });
                  handleAnswer(question.id, option);
                }}
              >
                <View style={styles.radioOuter}>
                  {answers[question.id] === option && <View style={styles.radioInner} />}
                </View>
                <Text style={[
                  styles.radioLabel,
                  answers[question.id] === option && styles.radioLabelSelected
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'RATING':
        return (
          <View style={styles.inputContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={typeof answers[question.id] === 'number' ? answers[question.id] : 0}
              onValueChange={(value) => handleAnswer(question.id, value)}
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#007BFF"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Poor</Text>
              <Text style={styles.sliderValue}>{typeof answers[question.id] === 'number' ? answers[question.id] : 0}</Text>
              <Text style={styles.sliderLabel}>Excellent</Text>
            </View>
          </View>
        );
      case 'TEXT':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={typeof answers[question.id] === 'string' ? answers[question.id] : ''}
              onChangeText={(text) => handleAnswer(question.id, text)}
              placeholder="Enter your answer here..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
        );
      default:
        return null;
    }
  };

  const translations = {
    en: {
      title: 'MedFeedback',
      loading: 'Loading questions...',
      error: 'Failed to load questions',
      retry: 'Retry',
      noQuestions: 'No questions available for this department.',
    },
    sw: {
      title: 'MedFeedback',
      loading: 'Inapakia maswali...',
      error: 'Imeshindwa kupakia maswali',
      retry: 'Jaribu tena',
      noQuestions: 'Hakuna maswali yanayopatikana kwa idara hii.',
    },
  };

  // Calculate progress
  const progress = ((currentDepartmentIndex + 1) / selectedDepartments.length) * 100;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>{translations[language].loading}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAllQuestions}>
            <Text style={styles.retryButtonText}>{translations[language].retry}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentDepartmentIndex + 1} of {selectedDepartments.length} Departments
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.departmentHeader}>
            <Text style={styles.departmentTitle}>{currentDepartment}</Text>
            <View style={styles.questionCount}>
              <Text style={styles.questionCountText}>
                {departmentQuestions.length} Questions
              </Text>
            </View>
          </View>
          
          {departmentQuestions.length > 0 ? (
            departmentQuestions.map((question, index) => (
              <View key={`${currentDepartment}-${question.id || index}-${index}`} style={styles.questionContainer}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>Q{index + 1}</Text>
                  <Text style={styles.questionText}>
                    {question.questionText}
                    {question.required && <Text style={styles.requiredIndicator}> *</Text>}
                  </Text>
                </View>
                {renderInput(question)}
              </View>
            ))
          ) : (
            <View style={styles.noQuestionsContainer}>
              <Text style={styles.noQuestionsText}>{translations[language].noQuestions}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Required Fields Note */}
      <View style={styles.requiredNoteContainer}>
        <Text style={styles.requiredNoteText}>* Required fields</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonLeft]}
          onPress={handlePreviousDepartment}
        >
          <Text style={styles.navButtonText}>back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonRight]}
          onPress={handleNextDepartment}
        >
          <Text style={styles.navButtonText}>next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007BFF',
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  departmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004080',
    flex: 1,
  },
  questionCount: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  questionCountText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginRight: 10,
    minWidth: 25,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  inputContainer: {
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 30,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  radioOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  radioLabelSelected: {
    color: '#007BFF',
    fontWeight: '600',
  },
  noQuestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noQuestionsText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    height: 50,
    minWidth: 60,
    justifyContent: 'center',
  },
  navButtonLeft: {
    backgroundColor: '#6C757D',
  },
  navButtonRight: {
    backgroundColor: '#007BFF',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    minHeight: 100,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  requiredIndicator: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  requiredNoteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  requiredNoteText: {
    color: '#6C757D',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default FeedbackQuestionScreen; 