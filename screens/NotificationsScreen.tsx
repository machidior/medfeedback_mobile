import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const notificationData = [
  {
    id: '1',
    department: {
      en: 'Pharmacy',
      sw: 'Famasia',
    },
    message: {
      en: 'Your feedback has been reviewed and action has been taken.',
      sw: 'Maoni yako yameangaliwa na hatua imechukuliwa.',
    },
    date: '2 hours ago',
    read: false,
    type: 'feedback_response',
    patientComment: 'The waiting time at the pharmacy was too long. I waited for 2 hours to get my medication.',
    response: 'We have increased our pharmacy staff and implemented a new queuing system to reduce waiting times.',
    feedbackDetails: {
      departments: ['Pharmacy'],
      priorities: ['HIGH'],
      rating: 2,
      submittedDate: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: '2',
    department: {
      en: 'Billing',
      sw: 'Malipo',
    },
    message: {
      en: 'Your billing feedback has been addressed.',
      sw: 'Maoni yako ya malipo yameshughulikiwa.',
    },
    date: '1 day ago',
    read: false,
    type: 'feedback_response',
    patientComment: 'The billing process is confusing and takes too long.',
    response: 'We have simplified the billing process and added more payment options including mobile money.',
    feedbackDetails: {
      departments: ['Billing'],
      priorities: ['MEDIUM'],
      rating: 3,
      submittedDate: '2024-01-14T14:20:00Z'
    }
  },
  {
    id: '3',
    department: {
      en: 'Emergency',
      sw: 'Dharura',
    },
    message: {
      en: 'New emergency protocols have been implemented based on your feedback.',
      sw: 'Mipango mpya ya dharura imetekelezwa kulingana na maoni yako.',
    },
    date: '2 days ago',
    read: true,
    type: 'feedback_response',
    patientComment: 'Emergency response time needs improvement.',
    response: 'We have added more emergency staff and improved our response protocols.',
    feedbackDetails: {
      departments: ['Emergency'],
      priorities: ['HIGH'],
      rating: 1,
      submittedDate: '2024-01-13T09:15:00Z'
    }
  },
  {
    id: '4',
    department: {
      en: 'Laboratory',
      sw: 'Maabara',
    },
    message: {
      en: 'Your laboratory feedback has been reviewed.',
      sw: 'Maoni yako ya maabara yameangaliwa.',
    },
    date: '1 week ago',
    read: true,
    type: 'feedback_response',
    patientComment: 'Lab results take too long to be ready.',
    response: 'We have upgraded our laboratory equipment and increased staff to reduce result processing time.',
    feedbackDetails: {
      departments: ['Laboratory'],
      priorities: ['MEDIUM'],
      rating: 2,
      submittedDate: '2024-01-08T11:45:00Z'
    }
  },
];

const NotificationsScreen = ({ navigation }: any) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [notifications, setNotifications] = useState(notificationData);
  const isFocused = useIsFocused();

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      notifications: 'Notifications',
      clearAll: 'Clear All',
      noNotifications: 'No notifications',
      noNotificationsSub: 'You\'re all caught up!',
    },
    sw: {
      headerTitle: 'MedFeedback',
      notifications: 'Arifa',
      clearAll: 'Futa Zote',
      noNotifications: 'Hakuna arifa',
      noNotificationsSub: 'Uko sawa!',
    },
  };

  const t = translations[language];

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
          }
        }
      ]
    );
  };

  const handleNotificationPress = (notification: any) => {
    // Mark notification as read
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notification.id 
          ? { ...n, read: true }
          : n
      )
    );
    navigation.navigate('NotificationDetails', { notification });
  };

  const renderNotificationCard = (notification: any, index: number) => (
    <Animatable.View
      key={notification.id}
      animation="slideInLeft"
      duration={500}
      delay={index * 100}
    >
      <TouchableOpacity 
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadCard
        ]}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={notification.read ? '#82D0D0' : '#FF6B6B'} 
              />
            </View>
            <View style={styles.notificationText}>
              <Text style={styles.departmentText}>{notification.department[language]}</Text>
              <Text style={styles.messageText} numberOfLines={2}>{notification.message[language]}</Text>
            </View>
            <View style={styles.notificationMeta}>
              {!notification.read && <View style={styles.unreadDot} />}
              <Text style={styles.dateText}>{notification.date}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderEmptyState = () => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      style={styles.emptyStateContainer}
    >
      <Text style={styles.emptyStateIcon}>🔔</Text>
      <Text style={styles.emptyStateTitle}>{t.noNotifications}</Text>
      <Text style={styles.emptyStateSubtitle}>{t.noNotificationsSub}</Text>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      {/* Title and Clear All */}
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.notificationsTitle}>{t.notifications}</Text>
          {notifications.length > 0 && (
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={clearAllNotifications}
            >
              <Text style={styles.clearAllButtonText}>{t.clearAll}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.notificationsSubtitle}>
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => renderNotificationCard(notification, index))
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
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
    marginBottom: 20,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  icon: {
    fontSize: 24,
    color: '#82D0D0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  departmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  titleContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationsSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  clearAllButton: {
    padding: 10,
    backgroundColor: '#82D0D0',
    borderRadius: 5,
  },
  clearAllButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadCard: {
    backgroundColor: '#F8F9FF',
    borderLeftWidth: 3,
    borderLeftColor: '#82D0D0',
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationText: {
    flex: 1,
    marginRight: 12,
  },
  notificationMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 60,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateIcon: {
    fontSize: 48,
    color: '#888',
    marginBottom: 10,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  scrollView: {
    flex: 1,
  },
});

export default NotificationsScreen; 