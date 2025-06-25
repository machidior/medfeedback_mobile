import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// This should match the User interface in your web app for consistency
export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  departmentId: number | null;
  departmentName: string | null;
}

interface LoginResponse {
  message: string;
  email: string;
  otpSent: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  pendingOtpEmail: string | null;
  pendingPhoneNumber: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<LoginResponse | null>;
  loginWithOtp: (email: string, otpCode: string) => Promise<boolean>;
  loginWithPhoneNumber: (phoneNumber: string) => Promise<{ otp: string } | null>;
  verifyPhoneNumberOtp: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearPendingOtp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(null);
  const [pendingOtp, setPendingOtp] = useState<string | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user data from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<LoginResponse | null> => {
    try {
      const response = await axios.post('http://10.0.2.2:8089/api/users/login', {
        usernameOrEmail,
        password,
      });

      if (response.data && response.data.otpSent) {
        setPendingOtpEmail(response.data.email);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const loginWithOtp = async (email: string, otpCode: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://10.0.2.2:8089/api/otp/verify', {
        email,
        otpCode,
      });

      if (response.data) {
        const userData: User = response.data;
        setUser(userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setPendingOtpEmail(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const loginWithPhoneNumber = async (phoneNumber: string): Promise<{ otp: string } | null> => {
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Mock OTP for ${phoneNumber}: ${mockOtp}`);
    
    setPendingPhoneNumber(phoneNumber);
    setPendingOtp(mockOtp);
    
    return { otp: mockOtp };
  };

  const verifyPhoneNumberOtp = async (phoneNumber: string, otp: string): Promise<boolean> => {
    if (pendingPhoneNumber === phoneNumber && pendingOtp === otp) {
      const mockUser: User = {
        id: new Date().getTime(),
        username: `User_${phoneNumber.slice(-4)}`,
        phoneNumber: phoneNumber,
        role: 'PATIENT',
      };
      
      setUser(mockUser);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      setPendingPhoneNumber(null);
      setPendingOtp(null);
      
      return true;
    }
    
    return false;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setPendingOtpEmail(null);
      setPendingPhoneNumber(null);
      setPendingOtp(null);
    } catch (error) {
      console.error('Failed to clear user data from storage', error);
    }
  };

  const clearPendingOtp = () => {
    setPendingOtpEmail(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    pendingOtpEmail,
    pendingPhoneNumber,
    login,
    loginWithOtp,
    loginWithPhoneNumber,
    verifyPhoneNumberOtp,
    logout,
    isAuthenticated: !!user,
    clearPendingOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 