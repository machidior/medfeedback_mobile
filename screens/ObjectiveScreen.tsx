import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';

const ObjectiveScreen = () => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const translations = {
    en: {
      headerTitle: 'MedFeedback',
      title: 'Why your feedback?',
      paragraph1: 'Your feedback is a vital part of improving the quality of healthcare services. By sharing your thoughts and experiences, you help us understand what we\'re doing well and where we need to improve.',
      paragraph2: 'Whether it\'s about the way you were treated, the cleanliness of the hospital, the clarity of communication, or the time it took to receive care.',
      paragraph3: 'Our goal is to make sure every patient feels heard, respected, and cared for. Your feedback helps us identify areas where staff training, service processes, or facilities can be enhanced. It\'s not just about pointing out problems, it\'s about helping us grow and serve you better.',
      paragraph4: 'When you take a few minutes to share your experience, you\'re not only helping yourself but also helping future patients have a smoother, more comfortable journey through our hospital.',
      paragraph5: 'Your feedback is collected, organized and then analyzed to check the performance of our care to you. After analyzed, report generated according'
    },
    sw: {
      headerTitle: 'MedFeedback',
      title: 'Kwa nini maoni yako?',
      paragraph1: 'Maoni yako ni muhimu sana katika kuboresha ubora wa huduma za afya. Kwa kushiriki mawazo na uzoefu wako, unatusaidia kuelewa tunachofanya vizuri na tunahitaji kuboresha wapi.',
      paragraph2: 'Iwe inahusu jinsi ulivyotendewa, usafi wa hospitali, uwazi wa mawasiliano, au muda uliotumika kupokea huduma.',
      paragraph3: 'Lengo letu ni kuhakikisha kila mgonjwa anahisi kusikilizwa, kuheshimiwa, na kutunzwa. Maoni yako yanatusaidia kutambua maeneo ambapo mafunzo ya wafanyakazi, michakato ya huduma, au vituo vinaweza kuboreshwa. Si tu kuhusu kuonyesha matatizo, ni kuhusu kutusaidia kukua na kukuhudumia vizuri zaidi.',
      paragraph4: 'Unapochukua dakika chache kushiriki uzoefu wako, hujisaidii wewe tu bali pia unawasaidia wagonjwa wajao kuwa na safari rahisi na starehe zaidi kupitia hospitali yetu.',
      paragraph5: 'Maoni yako hukusanywa, hupangwa na kisha kuchambuliwa ili kuangalia utendaji wa huduma zetu kwako. Baada ya kuchambuliwa, ripoti hutolewa kulingana na'
    }
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

      {/* Main Content Area */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.paragraph}>
            {t.paragraph1}
          </Text>
          <Text style={styles.paragraph}>
            {t.paragraph2}
          </Text>
          <Text style={styles.paragraph}>
            {t.paragraph3}
          </Text>
          <Text style={styles.paragraph}>
            {t.paragraph4}
          </Text>
          <Text style={styles.paragraph}>
            {t.paragraph5}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
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
  scrollContainer: {
    flex: 1,
    borderRadius: 15, // Softer corners
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly less transparent white background for text box
    padding: 20,
    marginHorizontal: 20, // Add horizontal margin to align with header content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  contentContainer: {
    paddingBottom: 20, // Add some padding at the bottom for scrolling
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#004080', // Darker blue for the title
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#333',
  },
});

export default ObjectiveScreen; 