import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  colors: {
    background: string;
    cardBackground: string;
    text: string;
    subtitle: string;
    separator: string;
    sectionHeader: string;
    chevron: string;
    tabBar: string;
    tabBarInactive: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDarkState] = useState(systemColorScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkState(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const setIsDark = async (value: boolean) => {
    setIsDarkState(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const colors = {
    background: isDark ? '#000000' : '#F2F2F7',
    cardBackground: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    subtitle: isDark ? '#8E8E93' : '#8E8E93',
    separator: isDark ? '#38383A' : '#C6C6C8',
    sectionHeader: isDark ? '#8E8E93' : '#8E8E93',
    chevron: isDark ? '#3C3C43' : '#C7C7CC',
    tabBar: isDark ? '#1C1C1E' : '#F9F9F9',
    tabBarInactive: isDark ? '#8E8E93' : '#999999',
  };

  // Don't render children until we've loaded the saved preference
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};