import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type AnimatedSplashScreenProps = StackScreenProps<RootStackParamList, 'AnimatedSplash'>;

const AnimatedSplashScreen = ({ navigation }: AnimatedSplashScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // A single animation cycle of the logo fading in, staying visible, and fading out
    const animationCycle = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700, // Fade in duration
        useNativeDriver: true,
      }),
      Animated.delay(400), // How long the logo stays visible
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700, // Fade out duration
        useNativeDriver: true,
      }),
      Animated.delay(100), // How long the logo stays invisible before the next loop
    ]);

    // Loop the animation to make it appear and disappear multiple times
    const loopedAnimation = Animated.loop(animationCycle, { iterations: 2 }); // Runs the cycle 2 times

    loopedAnimation.start(() => {
      // After the animation loops are finished, navigate to the Login screen
      navigation.replace('Login');
    });

    // Cleanup the animation when the component unmounts
    return () => {
      loopedAnimation.stop();
    };
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../assets/medfeedback_logo.png')}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});

export default AnimatedSplashScreen; 