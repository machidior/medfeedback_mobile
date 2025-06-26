import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Create Animatable components with specific types for refs
const AnimatableView = Animatable.createAnimatableComponent(View);
const AnimatableText = Animatable.createAnimatableComponent(Text);

const objectives = {
  en: [
    {
      id: '1',
      icon: 'heart-outline',
      title: 'Improve Healthcare Quality',
      text: 'Your feedback is a vital tool that helps us elevate the quality of our healthcare services. By sharing your experiences, you provide us with a clear, real-world view of what we are doing well and which areas require immediate attention and improvement.',
    },
    {
      id: '2',
      icon: 'chatbubble-ellipses-outline',
      title: 'Share Your Full Experience',
      text: 'Every detail of your visit matters—from the warmth of your greeting to the clarity of communication and the efficiency of care. Your story gives us a complete picture of the patient journey and helps us refine every step.',
    },
    {
      id: '3',
      icon: 'git-network-outline',
      title: 'Drive Meaningful Change',
      text: 'Constructive feedback is the catalyst for meaningful change. Your insights directly influence staff training programs, help us streamline our internal processes, and lead to tangible enhancements in our hospital facilities.',
    },
    {
      id: '4',
      icon: 'trending-up-outline',
      title: 'Enhance Future Patient Care',
      text: 'When you take a moment to share your experience, you are paving the way for a better healthcare journey for future patients. Your voice contributes to a cycle of continuous improvement that benefits the entire community.',
    },
    {
      id: '5',
      icon: 'analytics-outline',
      title: 'Data-Driven Performance Analysis',
      text: 'All feedback is collected, systematically organized, and carefully analyzed. This data-driven approach allows us to track our performance, measure the impact of our changes, and ensure we are consistently providing the best possible care.',
    },
  ],
  sw: [
    {
      id: '1',
      icon: 'heart-outline',
      title: 'Kuboresha Ubora wa Huduma za Afya',
      text: 'Maoni yako ni chombo muhimu kinachotusaidia kuinua ubora wa huduma zetu za afya. Kwa kushiriki uzoefu wako, unatupa picha halisi ya kile tunachofanya vizuri na maeneo gani yanahitaji maboresho ya haraka.',
    },
    {
      id: '2',
      icon: 'chatbubble-ellipses-outline',
      title: 'Shiriki Uzoefu Wako Kamili',
      text: 'Kila sehemu ya ziara yako ni muhimu—kutoka kwa joto la mapokezi hadi uwazi wa mawasiliano na ufanisi wa huduma. Hadithi yako hutupa picha kamili ya safari ya mgonjwa na hutusaidia kuboresha kila hatua.',
    },
    {
      id: '3_sw',
      icon: 'git-network-outline',
      title: 'Kuleta Mabadiliko ya Maana',
      text: 'Maoni yenye kujenga ndiyo chachu ya mabadiliko ya maana. Ufahamu wako huathiri moja kwa moja programu za mafunzo kwa wafanyakazi, hutusaidia kuboresha michakato yetu ya ndani, na hupelekea maboresho yanayoonekana katika vituo vyetu vya hospitali.',
    },
    {
      id: '4',
      icon: 'trending-up-outline',
      title: 'Kuboresha Huduma kwa Wagonjwa Wajao',
      text: 'Unapochukua muda kushiriki uzoefu wako, unaandaa njia bora zaidi ya huduma za afya kwa wagonjwa wajao. Sauti yako inachangia katika mzunguko wa maboresho endelevu unaonufaisha jamii nzima.',
    },
    {
      id: '5',
      icon: 'analytics-outline',
      title: 'Uchambuzi wa Utendaji kwa Kutumia Data',
      text: 'Maoni yote hukusanywa, hupangwa kwa utaratibu, na kuchambuliwa kwa makini. Mfumo huu unaotegemea data hutuwezesha kufuatilia utendaji wetu, kupima athari za mabadiliko yetu, na kuhakikisha tunatoa huduma bora zaidi kila wakati.',
    },
  ],
};

const ObjectiveScreen = () => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const t = objectives[language];
  const isFocused = useIsFocused();
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isFocused) {
      // Increment the key to re-mount the view and replay animations
      setAnimationKey((prevKey) => prevKey + 1);
    }
  }, [isFocused]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={index * 200}
      style={styles.card}
    >
      <Ionicons name={item.icon} size={40} color="#82D0D0" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.text}</Text>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/medfeedback_logo.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>
      {isFocused && (
        <Animatable.View key={animationKey} style={{width: '100%'}}>
          <Animatable.Text
            animation="fadeInDown"
            duration={1000}
            style={styles.mainTitle}
          >
            Why Your Feedback Matters
          </Animatable.Text>
          <FlatList
            data={t}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#F4F7F9',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    // marginBottom: 30,
  },
  headerLogo: {
    width: 150,
    height: 32,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8F0F2',
  },
  icon: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#555',
    textAlign: 'center',
  },
});

export default ObjectiveScreen; 