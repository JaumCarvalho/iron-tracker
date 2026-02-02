import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Copy, Share2, ShieldCheck } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ThemeToggle } from '@/components/features/theme-toggle';

import {
  ProfileHeader,
  StatsGrid,
  ColorThemeSelector,
} from '@/components/profile/profile-components';
import { useProfile } from '@/components/profile/useProfile';

export default function ProfileScreen() {
  const { user, name, setName, isEditing, setIsEditing, stats, actions } = useProfile();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#fafafa' : '#09090b';

  const accentColor = user.accentColor || '#a1a1aa';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted/50">
            <ArrowLeft size={20} color={iconColor} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground">Perfil & Ajustes</Text>
          <View className="w-10" />
        </View>

        <ProfileHeader
          user={user}
          name={name}
          setName={setName}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={actions.handleSaveName}
          onPickImage={actions.handlePickImage}
          accentColor={accentColor}
        />

        <StatsGrid stats={stats} accentColor={accentColor} />

        <View className="mt-8 gap-6 px-6">
          <Text className="text-sm font-bold uppercase text-muted-foreground">Preferências</Text>

          <View className="flex-row items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
            <View>
              <Text className="font-bold text-foreground">Modo Escuro</Text>
              <Text className="text-xs text-muted-foreground">Alternar tema do sistema</Text>
            </View>
            <ThemeToggle />
          </View>

          <ColorThemeSelector
            currentColor={accentColor}
            onSelectColor={actions.handleSetAccentColor}
          />

          <Text className="mt-2 text-sm font-bold uppercase text-muted-foreground">
            Dados & Backup
          </Text>

          <TouchableOpacity
            onPress={actions.handleExportData}
            className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 active:bg-muted">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}20` }}>
              <Copy size={20} color={accentColor} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-foreground">Copiar Dados (JSON)</Text>
              <Text className="text-xs text-muted-foreground">Salve seu backup manualmente</Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 active:bg-muted"
            onPress={() =>
              Alert.alert('Em Breve', 'A exportação de arquivo estará disponível na v1.1')
            }>
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}20` }}>
              <Share2 size={20} color={accentColor} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-foreground">Exportar Arquivo</Text>
              <Text className="text-xs text-muted-foreground">
                Gerar arquivo .json para download
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
        <View className="mt-12 items-center gap-2">
          <ShieldCheck size={24} color={accentColor} style={{ opacity: 0.5 }} />
          <Text className="text-xs font-medium text-muted-foreground">Iron Streak v1.0.0</Text>
          <Text className="text-[10px] text-muted-foreground/60">
            Built with Expo & React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
