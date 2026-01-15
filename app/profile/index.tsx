import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/features/theme-toggle';

import {
  ArrowLeft,
  Save,
  Copy,
  Share2,
  Trophy,
  Flame,
  Dumbbell,
  ShieldCheck,
  Coffee,
  Camera,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
export default function ProfileScreen() {
  const { user, updateUser, history, restDays } = useStore();

  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);

  const totalWorkouts = history.length;
  const totalRestDays = restDays.length;

  const handleSave = () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    updateUser({ name });
    setIsEditing(false);
  };

  const handleExportData = async () => {
    const data = JSON.stringify({ user, history, restDays }, null, 2);
    await Clipboard.setStringAsync(data);
    Alert.alert('Copiado!', 'Seus dados foram copiados para a área de transferência.');
  };
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para trocar sua foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      updateUser({ avatarUri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted/50">
            <ArrowLeft size={20} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground">Perfil & Ajustes</Text>
          <View className="w-10" />
        </View>

        <View className="mt-6 items-center px-6">
          <View className="relative">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickImage}
              className="relative h-28 w-28 rounded-full border-4 border-primary bg-background p-1">
              <Avatar className="h-full w-full" alt={''}>
                <AvatarImage source={{ uri: user.avatarUri || 'https://github.com/shadcn.png' }} />
                <AvatarFallback>
                  <Text>US</Text>
                </AvatarFallback>
              </Avatar>

              <View className="absolute inset-0 items-center justify-center rounded-full bg-black/30 opacity-0 active:opacity-100">
                <Camera color="white" size={24} />
              </View>
            </TouchableOpacity>

            <View className="absolute bottom-0 right-0 z-10 h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary">
              <Text className="text-xs font-bold text-white">{user.level}</Text>
            </View>

            <TouchableOpacity
              onPress={handlePickImage}
              className="absolute bottom-0 left-0 z-10 h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted">
              <Camera size={14} className="text-foreground" />
            </TouchableOpacity>
          </View>

          {!isEditing ? (
            <View className="mt-4 items-center">
              <Text className="text-2xl font-bold text-foreground">{user.name}</Text>
              <Text className="text-sm text-muted-foreground">Membro desde 2024</Text>
              <Button variant="ghost" className="mt-2 h-8 px-4" onPress={() => setIsEditing(true)}>
                <Text className="text-xs font-bold text-primary">Editar Perfil</Text>
              </Button>
            </View>
          ) : (
            <View className="mt-4 w-full gap-3">
              <Input value={name} onChangeText={setName} placeholder="Seu nome" autoFocus />
              <View className="flex-row gap-2">
                <Button variant="outline" className="flex-1" onPress={() => setIsEditing(false)}>
                  <Text>Cancelar</Text>
                </Button>
                <Button className="flex-1" onPress={handleSave}>
                  <Save size={16} color="white" className="mr-2" />
                  <Text>Salvar</Text>
                </Button>
              </View>
            </View>
          )}
        </View>

        <View className="mt-8 flex-row flex-wrap gap-3 px-6">
          <View className="w-[48%] grow items-center gap-2 rounded-xl border border-border bg-card p-4">
            <Flame size={20} className="text-orange-500" />
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">{user.streak}</Text>
              <Text className="text-xs text-muted-foreground">Ofensiva</Text>
            </View>
          </View>

          <View className="w-[48%] grow items-center gap-2 rounded-xl border border-border bg-card p-4">
            <Trophy size={20} className="text-yellow-500" />
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">{user.totalXp}</Text>
              <Text className="text-xs text-muted-foreground">Total XP</Text>
            </View>
          </View>

          <View className="w-[48%] grow items-center gap-2 rounded-xl border border-border bg-card p-4">
            <Dumbbell size={20} className="text-primary" />
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">{totalWorkouts}</Text>
              <Text className="text-xs text-muted-foreground">Treinos</Text>
            </View>
          </View>

          <View className="w-[48%] grow items-center gap-2 rounded-xl border border-border bg-card p-4">
            <Coffee size={20} className="text-blue-500" />
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">{totalRestDays}</Text>
              <Text className="text-xs text-muted-foreground">Descansos</Text>
            </View>
          </View>
        </View>

        <View className="mt-8 gap-6 px-6">
          <Text className="text-sm font-bold uppercase text-muted-foreground">Preferências</Text>

          <View className="flex-row items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
            <View>
              <Text className="font-bold text-foreground">Aparência</Text>
              <Text className="text-xs text-muted-foreground">Alternar modo escuro/claro</Text>
            </View>
            <ThemeToggle />
          </View>

          <Text className="mt-2 text-sm font-bold uppercase text-muted-foreground">
            Dados & Backup
          </Text>

          <TouchableOpacity
            onPress={handleExportData}
            className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 active:bg-muted">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <Copy size={20} className="text-green-500" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-foreground">Copiar Dados (JSON)</Text>
              <Text className="text-xs text-muted-foreground">Salve seu backup manualmente</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 active:bg-muted"
            onPress={() =>
              Alert.alert('Em Breve', 'A exportação de arquivo estará disponível na v1.1')
            }>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Share2 size={20} className="text-blue-500" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-foreground">Exportar Arquivo</Text>
              <Text className="text-xs text-muted-foreground">
                Gerar arquivo .json para download
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-12 items-center gap-2">
          <ShieldCheck size={24} className="text-muted-foreground/30" />
          <Text className="text-xs font-medium text-muted-foreground">Iron Streak v1.0.0</Text>
          <Text className="text-[10px] text-muted-foreground/60">
            Built with Expo & React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
