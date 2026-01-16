import { Tabs, router } from 'expo-router';
import { LayoutDashboard, History, Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const themeKey = isDark ? 'dark' : 'light';
  const colors = NAV_THEME[themeKey].colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#a1a1aa' : '#71717a',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />

      {/* BOTÃO CENTRAL DE AÇÃO */}
      <Tabs.Screen
        name="workout"
        options={{
          title: '', // Sem título para destacar o ícone
          tabBarIcon: () => (
            <View className="-mt-10 h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-primary shadow-sm">
              <Plus size={30} color={colors.background} />
            </View>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            // 1. Impede a navegação padrão da Tab (que abriria uma tela vazia)
            e.preventDefault();

            // 2. Redireciona para o seu novo Gerenciador de Rotinas
            router.push('/workout/routines');
          },
        })}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
