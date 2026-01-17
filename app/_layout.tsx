import '../global.css';
import { ThemeProvider, Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import * as SystemUI from 'expo-system-ui';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bgDark = NAV_THEME.dark.colors.background;
  const bgLight = NAV_THEME.light.colors.background;

  const progress = useDerivedValue(() => {
    return withTiming(isDark ? 1 : 0, { duration: 500 });
  }, [isDark]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [bgLight, bgDark]);
    return { backgroundColor };
  });

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

      <Animated.View style={[{ flex: 1 }, animatedBackgroundStyle]}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'default',
            contentStyle: { backgroundColor: 'transparent' },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="workout/new"
            options={{
              presentation: 'modal',
              headerShown: false,
              gestureEnabled: true,
              contentStyle: { backgroundColor: isDark ? bgDark : bgLight },
            }}
          />

          <Stack.Screen name="workout/routines" options={{ headerShown: false }} />
          <Stack.Screen name="workout/editor" options={{ headerShown: false }} />
          <Stack.Screen name="analytics/exercise-details" options={{ headerShown: false }} />
          <Stack.Screen name="profile/index" options={{ headerShown: false }} />
        </Stack>
      </Animated.View>
    </ThemeProvider>
  );
}
