import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Define the navigation prop type for CommentScreen
type CommentScreenProps = StackScreenProps<RootStackParamList, 'Comment'>;

// Placeholder icons (you might replace these with icons from a library)
const MenuIcon = () => <Text style={styles.icon}>☰</Text>;
const GlobeIcon = () => <Text style={styles.icon}>🌐</Text>;

const CommentScreen = ({ navigation, route }: CommentScreenProps) => {
  // You might receive selected departments and answers via route.params
  // const { answers, selectedDepartments } = route.params;

  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState<'suggestion' | 'compliment' | 'negative' | null>(null);

  const translations = {
    en: {
      title: 'MedFeedback',
      commentTitle: 'Leave a Comment',
      commentPlaceholder: 'Type your comment here...',
      commentTypeLabel: 'What type of comment is this?',
      suggestion: 'Suggestion',
      compliment: 'Compliment',
      negative: 'Negative',
      submit: 'Submit Feedback',
    },
    sw: {
      title: 'MedFeedback',
      commentTitle: 'Acha Maoni',
      commentPlaceholder: 'Andika maoni yako hapa...',
      commentTypeLabel: 'Maoni yako ni ya aina gani?',
      suggestion: 'Pendekezo',
      compliment: 'Pongezi',
      negative: 'Hasi',
      submit: 'Wasilisha Maoni',
    }
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleSubmit = () => {
    console.log('Comment:', comment);
    console.log('Comment Type:', commentType);
    // TODO: Implement logic to submit feedback (answers + comment + type)
    
    // Navigate to the thank you screen after submission
    navigation.navigate('ThankYou');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <TouchableOpacity onPress={toggleLanguage}>
          <GlobeIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}> {/* Container for comment section */}
        <Text style={styles.commentTitle}>{t.commentTitle}</Text>
        
        <TextInput
          style={styles.commentInput}
          multiline
          placeholder={t.commentPlaceholder}
          value={comment}
          onChangeText={setComment}
        />

        <Text style={styles.commentTypeLabel}>{t.commentTypeLabel}</Text>
        <View style={styles.commentTypeOptions}>
          <TouchableOpacity
            style={[styles.commentTypeButton, commentType === 'suggestion' && styles.commentTypeButtonSelected]}
            onPress={() => setCommentType('suggestion')}
          >
            <Text style={[styles.commentTypeButtonText, commentType === 'suggestion' && styles.commentTypeButtonTextSelected]}>{t.suggestion}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commentTypeButton, commentType === 'compliment' && styles.commentTypeButtonSelected]}
            onPress={() => setCommentType('compliment')}
          >
            <Text style={[styles.commentTypeButtonText, commentType === 'compliment' && styles.commentTypeButtonTextSelected]}>{t.compliment}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commentTypeButton, commentType === 'negative' && styles.commentTypeButtonSelected]}
            onPress={() => setCommentType('negative')}
          >
            <Text style={[styles.commentTypeButtonText, commentType === 'negative' && styles.commentTypeButtonTextSelected]}>{t.negative}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t.submit}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5FE', // Light blue background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    fontSize: 24,
    color: '#007BFF', // Blue icon color
  },
  contentContainer:{
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#004080',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top', // Aligns text to the top on Android
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    fontSize: 16,
  },
  commentTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  commentTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  commentTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#FFFFFF',
  },
  commentTypeButtonSelected: {
    backgroundColor: '#007BFF',
  },
  commentTypeButtonText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentTypeButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#6495ED',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CommentScreen; 