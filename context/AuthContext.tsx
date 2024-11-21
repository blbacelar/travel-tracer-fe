import React, { createContext, useContext, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // You can add more authentication logic here
  useEffect(() => {
    if (isSignedIn && user) {
      console.log('User is signed in:', user.id);
    }
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 