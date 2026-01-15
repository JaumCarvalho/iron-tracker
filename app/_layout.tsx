import '../global.css';
import { ThemeProvider, Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import * as SystemUI from 'expo-system-ui';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bgDark = NAV_THEME.dark.colors.background;
  const bgLight = NAV_THEME.light.colors.background;

  React.useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? bgDark : bgLight);
  }, [isDark, bgDark, bgLight]);

  const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light.colors,
  };

  const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark.colors,
  };

  return (
    <ThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: { backgroundColor: isDark ? bgDark : bgLight },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workout/new" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="analytics/exercise-details" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
