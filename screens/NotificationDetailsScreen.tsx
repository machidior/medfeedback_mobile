import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

const NotificationDetailsScreen = ({ route, navigation }: any) => {
  const { notification } = route.params;
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const translations = {
    en: {
      feedbackResponse: 'Feedback Response',
      patientComment: 'Your Comment',
      response: 'Response',
      feedbackDetails: 'Feedback Details',
      departments: 'Departments',
      priorities: 'Priorities',
      rating: 'Rating',
      submittedDate: 'Submitted Date',
      clearNotification: 'Clear Notification',
      back: 'Back',
    },
    sw: {
      feedbackResponse: 'Jibu la Maoni',
      patientComment: 'Maoni Yako',
      response: 'Jibu',
      feedbackDetails: 'Maelezo ya Maoni',
      departments: 'Idara',
      priorities: 'Vipaumbele',
      rating: 'Ukadiriaji',
      submittedDate: 'Tarehe ya Kuwasilisha',
      clearNotification: 'Futa Arifa',
      back: 'Rudi',
    },
  };

  const t = translations[language];

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

  const getRatingText = (rating: number) => {
    const ratings = {
      1: { en: 'Very Poor', sw: 'Mbaya Sana' },
      2: { en: 'Poor', sw: 'Mbaya' },
      3: { en: 'Fair', sw: 'Wastani' },
      4: { en: 'Good', sw: 'Nzuri' },
      5: { en: 'Excellent', sw: 'Bora' }
    };
    return ratings[rating as keyof typeof ratings]?.[language] || 'N/A';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '#FF6B6B';
      case 'MEDIUM': return '#FFA726';
      case 'LOW': return '#66BB6A';
      default: return '#82D0D0';
    }
  };

  const clearNotification = () => {
    Alert.alert(
      'Clear Notification',
      'Are you sure you want to clear this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Navigate back to notifications screen
            navigation.goBack();
            // You could also pass a callback to update the parent screen's state
            // For now, we'll rely on the parent screen to handle state updates
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#82D0D0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.feedbackResponse}</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearNotification}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Department and Date */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.section}>
          <View style={styles.departmentHeader}>
            <View style={styles.departmentBadge}>
              <Text style={styles.departmentText}>{notification.department[language]}</Text>
            </View>
            <Text style={styles.dateText}>{notification.date}</Text>
          </View>
        </Animatable.View>

        {/* Patient Comment */}
        <Animatable.View animation="fadeInUp" duration={600} delay={200} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-outline" size={20} color="#82D0D0" />
            <Text style={styles.sectionTitle}>{t.patientComment}</Text>
          </View>
          <View style={styles.commentCard}>
            <Text style={styles.commentText}>{notification.patientComment}</Text>
          </View>
        </Animatable.View>

        {/* Response */}
        <Animatable.View animation="fadeInUp" duration={600} delay={400} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>{t.response}</Text>
          </View>
          <View style={styles.responseCard}>
            <Text style={styles.responseText}>{notification.response}</Text>
          </View>
        </Animatable.View>

        {/* Feedback Details */}
        <Animatable.View animation="fadeInUp" duration={600} delay={600} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#82D0D0" />
            <Text style={styles.sectionTitle}>{t.feedbackDetails}</Text>
          </View>
          
          <View style={styles.detailsCard}>
            {/* Departments */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t.departments}:</Text>
              <View style={styles.tagsContainer}>
                {notification.feedbackDetails.departments.map((dept: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{dept}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Priorities */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t.priorities}:</Text>
              <View style={styles.tagsContainer}>
                {notification.feedbackDetails.priorities.map((priority: string, index: number) => (
                  <View 
                    key={index} 
                    style={[styles.priorityTag, { backgroundColor: getPriorityColor(priority) }]}
                  >
                    <Text style={styles.priorityTagText}>{priority}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t.rating}:</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  {notification.feedbackDetails.rating}/5 - {getRatingText(notification.feedbackDetails.rating)}
                </Text>
              </View>
            </View>

            {/* Submitted Date */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t.submittedDate}:</Text>
              <Text style={styles.detailValue}>
                {formatDate(notification.feedbackDetails.submittedDate)}
              </Text>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Constants.statusBarHeight + 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  clearButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  departmentBadge: {
    backgroundColor: '#82D0D0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  departmentText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dateText: {
    color: '#888',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  responseCard: {
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tagText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  priorityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  priorityTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default NotificationDetailsScreen; 