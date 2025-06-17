import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

const notificationData = [
  {
    id: '1',
    department: {
      en: 'Pharmacy',
      sw: 'Famasia',
    },
    message: {
      en: 'New Malaria dosage arrived!',
      sw: 'Dawa mpya ya Malaria imefika!',
    },
    date: 'Today',
    read: false,
  },
  {
    id: '2',
    department: {
      en: 'Billing',
      sw: 'Malipo',
    },
    message: {
      en: 'Now you can pay your bills through mobile money!',
      sw: 'Sasa unaweza kulipa bili zako kupitia fedha za rununu!',
    },
    date: 'Today',
    read: false,
  },
  {
    id: '3',
    department: {
      en: 'Pharmacy',
      sw: 'Famasia',
    },
    message: {
      en: 'New UTI dosage arrived!',
      sw: 'Dawa mpya ya UTI imefika!',
    },
    date: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    department: {
      en: 'Pharmacy',
      sw: 'Famasia',
    },
    message: {
      en: 'New Malaria dosage arrived!',
      sw: 'Dawa mpya ya Malaria imefika!',
    },
    date: '17 April',
    read: true,
  },
  {
    id: '5',
    department: {
      en: 'Pharmacy',
      sw: 'Famasia',
    },
    message: {
      en: 'New Malaria dosage arrived!',
      sw: 'Dawa mpya ya Malaria imefika!',
    },
    date: '28 March',
    read: true,
  },
];

const NotificationsScreen = () => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
    },
    sw: {
      headerTitle: 'MedFeedback',
    },
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'sw' : 'en'));
  };

  return (
   <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {notificationData.map((notification) => (
          <View key={notification.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.departmentText}>{notification.department[language]}</Text>
              <View style={styles.dateAndDot}>
                {!notification.read && <View style={styles.unreadDot} />}
                <Text style={styles.dateText}>{notification.date}</Text>
              </View>
            </View>
            <Text style={styles.messageText}>{notification.message[language]}</Text>
          </View>
        ))}
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
    color: '#007BFF',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004080', // Darker blue for department
  },
  dateAndDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6347', // Tomato color for unread dot
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default NotificationsScreen; 