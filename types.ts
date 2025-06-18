import { NavigatorScreenParams } from '@react-navigation/native';

// Define the type for your root stack navigator params
export type RootStackParamList = {
  Welcome: undefined; // Assuming Welcome screen doesn't take params
  Login: undefined; // Assuming Login screen doesn't take params
  OTP: { phoneNumber: string; otp: string };     // Assuming OTP screen doesn't take params
  // Home is now part of the Bottom Tabs, access via AppTabs
  // Home: undefined;    // Add Home screen back
  FeedbackForm: undefined;
  AppTabs: NavigatorScreenParams<BottomTabParamList>; // Add the screen for the Bottom Tab Navigator
  Department: { selectedDate: Date; gender: string }; // Add date and gender params
  FeedbackQuestion: { selectedDepartments: string[]; selectedDate: Date; gender: string }; // Add date and gender params
  Comment: { 
    answers: { [key: string]: any }; 
    questions: any[]; // Add questions parameter
    selectedDepartments: string[]; 
    departmentPriorities: string[]; // Update to string[] for priority values
    selectedDate: Date; 
    gender: string 
  }; // Add date and gender params
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