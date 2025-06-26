import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';

const HistoryScreen = ({ navigation }: any) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setAnimationKey(prevKey => prevKey + 1);
      loadFeedbackHistory();
    }
  }, [isFocused]);

  const loadFeedbackHistory = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const clearAllHistory = async () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all feedback history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('feedbackHistory');
              setFeedbackHistory([]);
            } catch (e) {
              console.error('Failed to clear all history:', e);
              Alert.alert('Error', 'Failed to delete all history');
            }
          }
        }
      ]
    );
  };

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      historyTitle: 'History',
      noHistory: 'No feedback history found',
      noHistorySub: 'Your submitted feedback will appear here',
      viewDetails: 'View Details',
      date: 'Date',
      gender: 'Gender',
      priorities: 'Priorities',
      clearAll: 'Clear All',
    },
    sw: {
      headerTitle: 'MedFeedback',
      historyTitle: 'Historia',
      noHistory: 'Hakuna historia ya maoni',
      noHistorySub: 'Maoni yako yaliyowasilishwa yataonekana hapa',
      viewDetails: 'Ona Maelezo',
      date: 'Tarehe',
      gender: 'Jinsia',
      priorities: 'Vipaumbele',
      clearAll: 'Futa Zote',
    },
  };

  const t = translations[language];

  const handleCardPress = (item: any) => {
    // Navigate to history details screen
    navigation.navigate('HistoryDetails', { feedbackItem: item });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return '#82D0D0';
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

  const renderEmptyState = () => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      style={styles.emptyStateContainer}
    >
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>{t.noHistory}</Text>
      <Text style={styles.emptyStateSubtitle}>{t.noHistorySub}</Text>
    </Animatable.View>
  );

  const renderFeedbackCard = (item: any, index: number) => (
    <Animatable.View
      key={item.id || index}
      animation="slideInLeft"
      duration={500}
      delay={index * 100}
    >
      <TouchableOpacity 
        style={styles.card}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.8}
      >
        {/* Card Header with Status and Date */}
        <View style={styles.cardHeader}>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusIcon, { color: getStatusColor(item.status) }]}>
              {getStatusIcon(item.status)}
            </Text>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
        </View>
        
        {/* Main Content - Departments and Key Info */}
        <View style={styles.cardContent}>
          <Text style={styles.departmentValue}>
            {Array.isArray(item.departments) ? item.departments.join(', ') : item.departments}
          </Text>
          
          {item.priorities && (
            <View style={styles.keyInfoRow}>
              <View style={styles.keyInfoItem}>
                <Text style={styles.keyInfoLabel}>{t.priorities}</Text>
                <Text style={styles.keyInfoValue}>
                  {Array.isArray(item.priorities) ? item.priorities.join(', ') : item.priorities}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      {/* History Title and Clear All Button */}
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.historyTitle}>{t.historyTitle}</Text>
          {feedbackHistory.length > 0 && (
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={clearAllHistory}
            >
              <Text style={styles.clearAllButtonText}>{t.clearAll}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.historySubtitle}>
          {feedbackHistory.length} feedback submission{feedbackHistory.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Feedback Cards */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animatable.View key={animationKey} style={{flex: 1, width: '100%'}}>
          {feedbackHistory.length > 0 ? (
            feedbackHistory.map((item, index) => renderFeedbackCard(item, index))
          ) : (
            renderEmptyState()
          )}
        </Animatable.View>
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
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 4,
  },
  historySubtitle: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 10,
  },
  deleteButton: {
    width: 32,
    height: 32,
    // backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    elevation: 3,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cardDate: {
    fontSize: 11,
    color: '#6C757D',
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: 0,
  },
  departmentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#004080',
    lineHeight: 20,
    marginBottom: 8,
  },
  keyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  keyInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyInfoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#495057',
    marginRight: 4,
  },
  keyInfoValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#004080',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    // borderRadius: 8,
    // backgroundColor: '#82D0D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 16,
    // paddingHorizontal: 32,
    borderRadius: 12,
    // minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  clearAllButtonText: {
    fontSize: 12,
    fontWeight: '600',
    // color: '#FFFFFF',
    color: '#495057',
    // fontSize: 16,
    // fontWeight: '600',
    textTransform: 'capitalize',
    
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HistoryScreen; 