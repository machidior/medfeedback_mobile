import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types'; 
import { StackNavigationProp } from '@react-navigation/stack';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

type Props = {
  navigation: HistoryScreenNavigationProp;
};

const HistoryScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Submitted' | 'Draft'>('All');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedbackHistory = async () => {
      try {
        const storedFeedback = await AsyncStorage.getItem('feedbackHistory');
        if (storedFeedback) {
          const parsedFeedback = JSON.parse(storedFeedback);
          // Sort feedback by date in descending order (most recent first)
          const sortedFeedback = parsedFeedback.sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setFeedbackHistory(sortedFeedback);
        }
      } catch (e) {
        console.error('Failed to load feedback history:', e);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
        loadFeedbackHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      all: 'All',
      submitted: 'Submitted',
      draft: 'Draft',
      departmentsLabel: 'Departments',
      statusLabel: 'Status',
      questionsAndAnswers: 'Questions & Answers',
      comment: 'Comment',
      feedbackCategory: 'Feedback Category',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
    },
    sw: {
      headerTitle: 'MedFeedback',
      all: 'Zote',
      submitted: 'Zilizowasilishwa',
      draft: 'Rasimu',
      departmentsLabel: 'Idara',
      statusLabel: 'Hali',
      questionsAndAnswers: 'Maswali na Majibu',
      comment: 'Maoni',
      feedbackCategory: 'Aina ya Maoni',
      positive: 'Chanya',
      negative: 'Hasi',
      neutral: 'Wastani',
    },
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'sw' : 'en'));
  };

  const toggleCardExpansion = (cardId: string) => {
    if (expandedCardId === cardId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(cardId);
    }
  };

  const filteredFeedback = feedbackHistory.filter((item) => {
    if (activeTab === 'All') {
      return true;
    }
    return item.status === activeTab; // Assuming status in saved data matches tab names
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
        
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'All' && styles.activeTabButton]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>{t.all}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Submitted' && styles.activeTabButton]}
          onPress={() => setActiveTab('Submitted')}
        >
          <Text style={[styles.tabText, activeTab === 'Submitted' && styles.activeTabText]}>{t.submitted}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Draft' && styles.activeTabButton]}
          onPress={() => setActiveTab('Draft')}
        >
          <Text style={[styles.tabText, activeTab === 'Draft' && styles.activeTabText]}>{t.draft}</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Cards */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredFeedback.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => toggleCardExpansion(item.id)}>
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Date</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Submitted' ? styles.submittedBadge : styles.draftBadge]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            
            <View style={styles.cardBody}>
              <View style={styles.departmentSection}>
                <Text style={styles.sectionLabel}>Departments</Text>
                <Text style={styles.departmentText}>
                  {Array.isArray(item.departments) ? item.departments.join(', ') : item.departments}
                </Text>
              </View>
              
              {/* Preview summary */}
              <View style={styles.previewSummary}>
                {item.questions && item.questions.length > 0 && (
                  <View style={styles.previewItem}>
                    <Text style={styles.previewText}>
                      {item.questions.length} question{item.questions.length !== 1 ? 's' : ''} answered
                    </Text>
                  </View>
                )}
                {item.comment && (
                  <View style={styles.previewItem}>
                    <Text style={styles.previewText} numberOfLines={1}>
                      {item.comment}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {expandedCardId === item.id && (
              <View style={styles.cardDetails}>
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsTitle}>Questions & Answers</Text>
                </View>
                
                {item.questions && item.questions.length > 0 ? (
                  <View style={styles.questionsContainer}>
                    {item.questions.map((question: any, index: number) => {
                      const answer = item.answers?.[question.id];
                      return (
                        <View key={question.id} style={styles.questionCard}>
                          <View style={styles.questionHeader}>
                            <Text style={styles.questionNumber}>Q{index + 1}</Text>
                            <Text style={styles.questionText}>{question.questionText}</Text>
                          </View>
                          <View style={styles.answerContainer}>
                            <Text style={styles.answerLabel}>Answer:</Text>
                            <Text style={styles.answerText}>
                              {answer ? answer : 'Not Answered'}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No questions available</Text>
                  </View>
                )}
                
                {item.comment && (
                  <View style={styles.commentSection}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentTitle}>Your Comment</Text>
                      {item.commentType && (
                        <View style={styles.commentTypeBadge}>
                          <Text style={styles.commentTypeText}>{item.commentType}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.commentContainer}>
                      <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                  </View>
                )}
                
                {/* Categorization Details */}
                {item.feedbackCategory && (
                  <View style={styles.categorizationSection}>
                    <View style={styles.categorizationHeader}>
                      <Text style={styles.categorizationTitle}>Analysis Details</Text>
                    </View>
                    <View style={styles.categorizationContainer}>
                      <Text style={styles.categorizationText}>
                        {item.feedbackCategory.reasoning.join('\n• ')}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
            
            <View style={styles.cardFooter}>
              <Text style={styles.expandText}>
                {expandedCardId === item.id ? 'Tap to collapse' : 'Tap to view details'}
              </Text>
              <Text style={styles.dropdownArrow}>{expandedCardId === item.id ? '⌃' : '⌄'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: '#FFFFFF',
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
  headerIconRight: {
    marginLeft: 'auto',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', // White background for tabs
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  submittedBadge: {
    backgroundColor: '#d4edda',
  },
  draftBadge: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#155724',
  },
  cardBody: {
    padding: 20,
    paddingTop: 15,
  },
  departmentSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  departmentText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  previewSummary: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 15,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardDetails: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  detailsHeader: {
    padding: 20,
    paddingBottom: 15,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  questionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007BFF',
    marginRight: 8,
    minWidth: 25,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  answerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  commentSection: {
    padding: 20,
    paddingTop: 0,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  commentTypeBadge: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  commentTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  commentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  categorizationSection: {
    padding: 20,
    paddingTop: 0,
  },
  categorizationHeader: {
    marginBottom: 12,
  },
  categorizationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  categorizationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categorizationText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  expandText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default HistoryScreen; 