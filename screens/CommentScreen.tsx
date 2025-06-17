import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define the navigation prop type for CommentScreen
type CommentScreenProps = StackScreenProps<RootStackParamList, 'Comment'>;

const CommentScreen = ({ navigation, route }: CommentScreenProps) => {
  const { answers, questions, selectedDepartments, selectedDate, gender } = route.params || {};
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState<'suggestion' | 'compliment' | 'negative' | null>(null);
  const [showReview, setShowReview] = useState(false);

  // Debug logging
  console.log('CommentScreen received data:', {
    answers,
    questions: questions?.length,
    selectedDepartments,
    selectedDate,
    gender
  });

  const translations = {
    en: {
      title: 'MedFeedback',
      commentTitle: 'Share Your Experience',
      commentSubtitle: 'Help us improve our services by sharing your feedback',
      commentPlaceholder: 'Comment here...',
      commentTypeLabel: 'What type of feedback is this?',
      suggestion: 'Suggestion',
      compliment: 'Compliment',
      negative: 'Complaint',
      submit: 'Review & Submit',
      reviewTitle: 'Review Your Feedback',
      reviewSubtitle: 'Please review all details before submitting',
      personalInfo: 'Personal Information',
      departments: 'Departments Visited',
      questions: 'Your Responses',
      commentSection: 'Your Comment',
      submitFinal: 'Submit Feedback',
      backToEdit: 'Back to Edit',
      dateOfAttendance: 'Date of Attendance',
      gender: 'Gender',
      noData: 'No data available',
    },
    sw: {
      title: 'MedFeedback',
      commentTitle: 'Shiriki Uzoefu Wako',
      commentSubtitle: 'Tusaidie kuboresha huduma zetu kwa kushiriki maoni yako',
      commentPlaceholder: 'Tuambie kuhusu uzoefu wako hospitalini...',
      commentTypeLabel: 'Maoni yako ni ya aina gani?',
      suggestion: 'Pendekezo',
      compliment: 'Pongezi',
      negative: 'Wasiwasi',
      submit: 'Kagua na Wasilisha',
      reviewTitle: 'Kagua Maoni Yako',
      reviewSubtitle: 'Tafadhali kagua maelezo yote kabla ya kuwasilisha',
      personalInfo: 'Maelezo Binafsi',
      departments: 'Idara Zilizotembelewa',
      questions: 'Majibu Yako',
      commentSection: 'Maoni Yako',
      submitFinal: 'Wasilisha Maoni',
      backToEdit: 'Rudi Kurekebisha',
      dateOfAttendance: 'Tarehe ya Kujifungua',
      gender: 'Jinsia',
      noData: 'Hakuna data inayopatikana',
    }
  };

  const t = translations[language];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    if (!commentType) {
      Alert.alert(
        'Comment Type Required',
        'Please select a comment type before proceeding.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!comment.trim()) {
      Alert.alert(
        'Comment Required',
        'Please provide a comment before proceeding.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowReview(true);
  };

  const handleFinalSubmit = async () => {
    try {
      // Transform the data to match the required API structure
      const patientData = {
        gender: gender?.toUpperCase() || 'PREFER_NOT_TO_SAY',
        dateOfAttendance: selectedDate ? formatDate(selectedDate) : new Date().toLocaleDateString(),
        feedbacks: questions?.map(question => {
          const answer = answers?.[question.id];
          let category = 'COMPLAINT'; // Default category
          
          // Set category based on question type
          if (question.questionType === 'RATING') {
            category = 'COMPLIMENT';
          }
          
          return {
            question: question.questionText,
            questionAnswer: answer || 'Not answered',
            departmentId: question.departmentId,
            category: category
          };
        }) || [],
        response: {
          message: comment,
          category: commentType?.toUpperCase() || 'SUGGESTION'
        }
      };

      console.log('Submitting patient data:', patientData);

      // Submit to the new backend API
      try {
        const response = await axios.post("http://192.168.196.134:8089/api/patients/submit", patientData);
        console.log('Patient data submitted successfully:', response.data);
      } catch (apiError) {
        console.error('Failed to submit to backend:', apiError);
        // Continue with local storage as fallback
      }

      // Store locally as backup (keeping the old format for compatibility)
      const feedbackData = {
        id: Date.now().toString(),
        date: selectedDate ? formatDate(selectedDate) : new Date().toLocaleDateString(),
        gender: gender || 'Not specified',
        departments: selectedDepartments,
        answers: answers,
        commentType: commentType,
        comment: comment,
        status: 'Submitted',
      };

      const existingFeedback = await AsyncStorage.getItem('feedbackHistory');
      const feedbackHistory = existingFeedback ? JSON.parse(existingFeedback) : [];
      feedbackHistory.push(feedbackData);
      await AsyncStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory));
      
      console.log('Feedback saved locally successfully!');
      navigation.navigate('ThankYou');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  const renderReviewForm = () => {
    return (
      <ScrollView style={styles.reviewContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>{t.reviewTitle}</Text>
          <Text style={styles.reviewSubtitle}>{t.reviewSubtitle}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>{t.personalInfo}</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>{t.dateOfAttendance}:</Text>
              <Text style={styles.reviewValue}>{selectedDate ? formatDate(selectedDate) : new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>{t.gender}:</Text>
              <Text style={styles.reviewValue}>{gender || 'Not specified'}</Text>
            </View>
          </View>
        </View>

        {/* Departments */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>{t.departments}</Text>
          <View style={styles.reviewCard}>
            {selectedDepartments?.map((dept, index) => (
              <View key={index} style={styles.departmentItem}>
                <Text style={styles.departmentName}>• {dept}</Text>
              </View>
            )) || <Text style={styles.noDataText}>{t.noData}</Text>}
          </View>
        </View>

        {/* Questions and Answers */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>{t.questions}</Text>
          <View style={styles.reviewCard}>
            {questions && questions.length > 0 ? (
              questions.map((question) => {
                const answer = answers?.[question.id];
                let displayAnswer = 'Not answered';
                
                if (answer !== undefined && answer !== null && answer !== '') {
                  if (question.questionType === 'RATING') {
                    displayAnswer = `${answer}/5`;
                  } else if (question.questionType === 'RADIO') {
                    displayAnswer = answer;
                  } else if (question.questionType === 'TEXT') {
                    displayAnswer = answer;
                  }
                }
                
                return (
                  <View key={question.id} style={styles.questionReviewItem}>
                    <Text style={styles.questionReviewText}>{question.questionText}</Text>
                    <Text style={styles.answerReviewText}>{displayAnswer}</Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noDataText}>{t.noData}</Text>
            )}
          </View>
        </View>

        {/* Comment */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>{t.commentSection}</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Type:</Text>
              <Text style={styles.reviewValue}>{commentType}</Text>
            </View>
            <View style={styles.commentReviewContainer}>
              <Text style={styles.commentReviewText}>{comment}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.reviewActions}>
          <TouchableOpacity 
            style={styles.backToEditButton} 
            onPress={() => setShowReview(false)}
          >
            <Text style={styles.backToEditButtonText}>{t.backToEdit}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitFinalButton} 
            onPress={handleFinalSubmit}
          >
            <Text style={styles.submitFinalButtonText}>{t.submitFinal}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (showReview) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
        </View>
        {renderReviewForm()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentTitle}>{t.commentTitle}</Text>
          <Text style={styles.commentSubtitle}>{t.commentSubtitle}</Text>
        </View>
        
        {/* Comment Type Selection */}
        <View style={styles.commentTypeSection}>
          <Text style={styles.commentTypeLabel}>{t.commentTypeLabel}</Text>
          <View style={styles.commentTypeOptions}>
            <TouchableOpacity
              style={[styles.commentTypeButton, commentType === 'suggestion' && styles.commentTypeButtonSelected]}
              onPress={() => setCommentType('suggestion')}
            >
              <Text style={styles.commentTypeIcon}>💡</Text>
              <Text style={[styles.commentTypeButtonText, commentType === 'suggestion' && styles.commentTypeButtonTextSelected]}>
                {t.suggestion}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.commentTypeButton, commentType === 'compliment' && styles.commentTypeButtonSelected]}
              onPress={() => setCommentType('compliment')}
            >
              <Text style={styles.commentTypeIcon}>⭐</Text>
              <Text style={[styles.commentTypeButtonText, commentType === 'compliment' && styles.commentTypeButtonTextSelected]}>
                {t.compliment}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.commentTypeButton, commentType === 'negative' && styles.commentTypeButtonSelected]}
              onPress={() => setCommentType('negative')}
            >
              <Text style={styles.commentTypeIcon}>⚠️</Text>
              <Text style={[styles.commentTypeButtonText, commentType === 'negative' && styles.commentTypeButtonTextSelected]}>
                {t.negative}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comment Input */}
        <View style={styles.commentInputSection}>
          <TextInput
            style={styles.commentInput}
            multiline
            placeholder={t.commentPlaceholder}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t.submit}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  commentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004080',
    textAlign: 'center',
    marginBottom: 8,
  },
  commentSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  commentTypeSection: {
    marginBottom: 25,
  },
  commentTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
  },
  commentTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    // marginBottom: 5,
  },
  commentTypeButton: {
    flex: 1,
    // paddingVertical: 18,
    // paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 50,
  },
  commentTypeButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056B3',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  commentTypeButtonText: {
    color: '#6C757D',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  commentTypeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  commentTypeIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  commentInputSection: {
    marginBottom: 30,
  },
  commentInput: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Review Form Styles
  reviewContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reviewHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004080',
    textAlign: 'center',
    marginBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  reviewValue: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  departmentItem: {
    marginBottom: 8,
  },
  departmentName: {
    fontSize: 16,
    color: '#333',
  },
  questionReviewItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  questionReviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  answerReviewText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '500',
  },
  commentReviewContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  commentReviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  noDataText: {
    fontSize: 16,
    color: '#6C757D',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    gap: 15,
  },
  backToEditButton: {
    flex: 1,
    backgroundColor: '#6C757D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backToEditButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitFinalButton: {
    flex: 1,
    backgroundColor: '#28A745',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitFinalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CommentScreen; 