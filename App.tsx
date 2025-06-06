import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from './types';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import HomeScreen from './screens/HomeScreen';
import ObjectiveScreen from './screens/ObjectiveScreen';
import HistoryScreen from './screens/HistoryScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import DepartmentScreen from './screens/DepartmentScreen';
import FeedbackQuestionScreen from './screens/FeedbackQuestionScreen';
import CommentScreen from './screens/CommentScreen';
import ThankYouScreen from './screens/ThankYouScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen as React.ComponentType<BottomTabScreenProps<BottomTabParamList, 'HomeTab'>>}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Objective" 
        component={ObjectiveScreen}
        options={{
          title: 'Objective',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: 'History',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }}/>
        <Stack.Screen 
          name="AppTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Department" component={DepartmentScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="FeedbackQuestion" component={FeedbackQuestionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Comment" component={CommentScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ThankYou" component={ThankYouScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
