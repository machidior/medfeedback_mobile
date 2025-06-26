import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type HistoryDetailsScreenProps = StackScreenProps<RootStackParamList, 'HistoryDetails'>;

const HistoryDetailsScreen = ({ navigation, route }: HistoryDetailsScreenProps) => {
  const { feedbackItem } = route.params;

  const deleteHistoryItem = async () => {
    Alert.alert(
      'Delete History',
      'Are you sure you want to delete this feedback history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get current history
              const storedFeedback = await AsyncStorage.getItem('feedbackHistory');
              if (storedFeedback) {
                const parsedFeedback = JSON.parse(storedFeedback);
                // Remove the current item
                const updatedHistory = parsedFeedback.filter((item: any) => item.id !== feedbackItem.id);
                // Save updated history
                await AsyncStorage.setItem('feedbackHistory', JSON.stringify(updatedHistory));
                // Navigate back to history screen
                navigation.goBack();
              }
            } catch (e) {
              console.error('Failed to delete history item:', e);
              Alert.alert('Error', 'Failed to delete history item');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return '#28A745';
      case 'Draft':
        return '#FFC107';
      default:
        return '#6C757D';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return '✓';
      case 'Draft':
        return '📝';
      default:
        return '•';
    }
  };

  const renderQuestionAnswer = (question: any, answer: any) => {
    return (
      <View key={question.id} style={styles.questionAnswerContainer}>
        <Text style={styles.questionText}>
          {question.questionText}
          {question.required && <Text style={styles.requiredIndicator}> *</Text>}
        </Text>
        <View style={styles.answerContainer}>
          {question.questionType === 'RATING' ? (
            <View style={styles.ratingAnswer}>
              <Text style={styles.ratingValue}>{answer}</Text>
              <Text style={styles.ratingLabel}>/ 5</Text>
            </View>
          ) : (
            <Text style={styles.answerText}>{answer || 'No answer provided'}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              {/* <View style={styles.statusContainer}>
                <Text style={[styles.statusIcon, { color: getStatusColor(feedbackItem.status) }]}>
                  {getStatusIcon(feedbackItem.status)}
                </Text>
                <Text style={[styles.statusText, { color: getStatusColor(feedbackItem.status) }]}>
                  {feedbackItem.status}
                </Text>
              </View> */}
              <Text style={styles.submissionDate}>
                Submitted on {formatDate(feedbackItem.date)}
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Departments:</Text>
                <Text style={styles.infoValue}>
                  {Array.isArray(feedbackItem.departments) 
                    ? feedbackItem.departments.join(', ') 
                    : feedbackItem.departments}
                </Text>
              </View>
              
              {feedbackItem.gender && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Gender:</Text>
                  <Text style={styles.infoValue}>{feedbackItem.gender}</Text>
                </View>
              )}
              
              {feedbackItem.priorities && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Priorities:</Text>
                  <Text style={styles.infoValue}>
                    {Array.isArray(feedbackItem.priorities) 
                      ? feedbackItem.priorities.join(', ') 
                      : feedbackItem.priorities}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Questions and Answers */}
          {feedbackItem.answers && feedbackItem.questions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Questions & Answers</Text>
              
              <View style={styles.questionsCard}>
                {feedbackItem.questions.map((question: any) => {
                  const answer = feedbackItem.answers[question.id];
                  return renderQuestionAnswer(question, answer);
                })}
              </View>
            </View>
          )}

          {/* Comments */}
          {feedbackItem.comment && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Comments</Text>
              
              <View style={styles.commentCard}>
                <Text style={styles.commentText}>{feedbackItem.comment}</Text>
              </View>
            </View>
          )}

          {/* Remove Button - After Content */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={deleteHistoryItem}
            >
              <Ionicons name="trash-outline" size={20} color="#495057" />
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submissionDate: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
    paddingLeft: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 15,
    color: '#6C757D',
    flex: 1,
  },
  questionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionAnswerContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
    lineHeight: 22,
  },
  requiredIndicator: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  answerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  answerText: {
    fontSize: 15,
    color: '#6C757D',
    lineHeight: 20,
  },
  ratingAnswer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#82D0D0',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#6C757D',
    marginLeft: 4,
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentText: {
    fontSize: 15,
    color: '#6C757D',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  removeButtonText: {
    marginLeft: 8,
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default HistoryDetailsScreen; 