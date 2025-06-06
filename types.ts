import { NavigatorScreenParams } from '@react-navigation/native';

// Define the type for your root stack navigator params
export type RootStackParamList = {
  Welcome: undefined; // Assuming Welcome screen doesn't take params
  Login: undefined; // Assuming Login screen doesn't take params
  OTP: undefined;     // Assuming OTP screen doesn't take params
  // Home is now part of the Bottom Tabs, access via AppTabs
  // Home: undefined;    // Add Home screen back
  FeedbackForm: undefined;
  AppTabs: NavigatorScreenParams<BottomTabParamList>; // Add the screen for the Bottom Tab Navigator
  Department: undefined; // Add the Department screen
  FeedbackQuestion: { selectedDepartments: string[] }; // Add the FeedbackQuestion screen with params
  Comment: { answers: { [key: string]: any }, selectedDepartments: string[] }; // Add the Comment screen with params
  ThankYou: undefined; // Add the ThankYou screen
  // Removed Home and AppDrawer
  // Add other screens here as you create them
};

// Define the type for the Bottom Tab Navigator params (copying from App.tsx for clarity)
export type BottomTabParamList = {
  HomeTab: undefined;
  Objective: undefined;
  History: undefined;
  Notifications: undefined;
  Settings: undefined;
}; 