import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, BottomTabParamList } from './types';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import HomeScreen from './screens/HomeScreen';
import ObjectiveScreen from './screens/ObjectiveScreen';
import HistoryScreen from './screens/HistoryScreen';
import HistoryDetailsScreen from './screens/HistoryDetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
import DepartmentScreen from './screens/DepartmentScreen';
import FeedbackFormScreen from './screens/FeedbackFormScreen';
import FeedbackQuestionScreen from './screens/FeedbackQuestionScreen';
import CommentScreen from './screens/CommentScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import AnimatedSplashScreen from './screens/AnimatedSplashScreen';
import { useEffect, useState, useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert'; // Default icon

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Objective') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#82D0D0',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 20,
          paddingTop: 3,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E9ECEF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen as React.ComponentType<BottomTabScreenProps<BottomTabParamList, 'HomeTab'>>}
      />
      <Tab.Screen 
        name="Objective" 
        component={ObjectiveScreen}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Here you can load fonts, make API calls, etc.
        // For now, we'll just simulate a short delay.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Render nothing while the app is preparing
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AnimatedSplash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AnimatedSplash" component={AnimatedSplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="AppTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Department" component={DepartmentScreen} />
          <Stack.Screen name="FeedbackQuestion" component={FeedbackQuestionScreen} />
          <Stack.Screen name="Comment" component={CommentScreen} />
          <Stack.Screen name="ThankYou" component={ThankYouScreen} />
          <Stack.Screen name="HistoryDetails" component={HistoryDetailsScreen} />
          <Stack.Screen name="NotificationDetails" component={NotificationDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

