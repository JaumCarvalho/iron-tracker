import { Tabs, router } from 'expo-router';
import { LayoutDashboard, History, Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import { useStore } from '@/store/useStore';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const user = useStore((state) => state.user);
  const userAccent = user.accentColor || '#a1a1aa';

  const activeColor = !isDark && userAccent === '#a1a1aa' ? '#09090b' : userAccent;

  const inactiveColor = isDark ? '#a1a1aa' : '#71717a';

  const themeKey = isDark ? 'dark' : 'light';
  const colors = NAV_THEME[themeKey].colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,

        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <LayoutDashboard size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          tabBarIcon: () => (
            <View
              className="-mt-10 h-14 w-14 items-center justify-center rounded-full border-4 border-background shadow-sm"
              style={{ backgroundColor: activeColor }}>
              <Plus size={30} color={colors.background} />
            </View>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/workout/routines');
          },
        })}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => <History size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
