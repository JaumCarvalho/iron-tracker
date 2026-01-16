import React from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Play, MoreVertical, Trash2, Edit3, Dumbbell } from 'lucide-react-native';
import dayjs from 'dayjs';

export default function RoutinesScreen() {
  const { templates, deleteTemplate } = useStore();

  const handleStartEmpty = () => {
    router.push({ pathname: '/workout/new', params: { templateId: null } });
  };

  const handleStartRoutine = (templateId: string) => {
    router.push({ pathname: '/workout/new', params: { templateId } });
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Excluir Rotina', `Tem certeza que deseja apagar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteTemplate(id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-border px-6 pb-4 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted/50">
          <ArrowLeft size={20} className="text-foreground" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Rotinas de Treino</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <TouchableOpacity
          onPress={handleStartEmpty}
          className="mb-8 flex-row items-center gap-4 rounded-xl border-2 border-dashed border-muted bg-muted/10 p-4 active:bg-muted/20">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Plus size={24} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">Treino Livre</Text>
            <Text className="text-sm text-muted-foreground">Começar sem template predefinido</Text>
          </View>
        </TouchableOpacity>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm font-bold uppercase text-muted-foreground">Minhas Fichas</Text>
          <TouchableOpacity
            onPress={() => router.push('/workout/editor')}
            className="flex-row items-center gap-1">
            <Plus size={14} className="text-primary" />
            <Text className="text-xs font-bold text-primary">Nova Ficha</Text>
          </TouchableOpacity>
        </View>

        {templates.length === 0 ? (
          <View className="items-center justify-center py-10 opacity-50">
            <Dumbbell size={48} className="mb-4 text-muted-foreground" />
            <Text className="text-center text-muted-foreground">Nenhuma rotina criada.</Text>
          </View>
        ) : (
          <View className="gap-4">
            {templates.map((t) => (
              <View key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <View className="mb-2 flex-row items-start justify-between">
                  <View>
                    <Text className="text-xl font-bold text-foreground">{t.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {t.exercises.length} exercícios •{' '}
                      {t.lastUsed
                        ? `Última vez: ${dayjs(t.lastUsed).format('DD/MM')}`
                        : 'Nunca usado'}
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() =>
                        router.push({ pathname: '/workout/editor', params: { id: t.id } })
                      }
                      className="rounded-lg bg-muted p-2">
                      <Edit3 size={16} className="text-foreground" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(t.id, t.name)}
                      className="rounded-lg bg-red-500/10 p-2">
                      <Trash2 size={16} className="text-red-500" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="my-3 gap-1">
                  {t.exercises.slice(0, 3).map((ex, idx) => (
                    <Text key={idx} className="text-xs text-muted-foreground">
                      • {ex.name} ({ex.sets} x {ex.reps})
                    </Text>
                  ))}
                  {t.exercises.length > 3 && (
                    <Text className="text-xs italic text-muted-foreground">
                      + {t.exercises.length - 3} outros...
                    </Text>
                  )}
                </View>

                <Button
                  className="mt-2 w-full flex-row gap-2"
                  onPress={() => handleStartRoutine(t.id)}>
                  <Play size={16} color="white" fill="white" />
                  <Text>Começar Treino</Text>
                </Button>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
