import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/store/useStore';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react-native';

import { ExerciseSelector } from '@/components/features/exercise-selector';
import { TemplateExercise } from '@/types/template-exercise';

export default function TemplateEditorScreen() {
  const params = useLocalSearchParams();
  const templateId = params.id as string | undefined;

  const { templates, saveTemplate } = useStore();

  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (templateId) {
      const existing = templates.find((t) => t.id === templateId);
      if (existing) {
        setName(existing.name);
        setExercises(existing.exercises);
      }
    }
  }, [templateId, templates]);

  const handleAddExercise = () => {
    setEditingIndex(exercises.length);
    setIsSelectorOpen(true);
  };

  const handleEditExerciseName = (index: number) => {
    setEditingIndex(index);
    setIsSelectorOpen(true);
  };

  const handleExerciseSelected = (selectedName: string, selectedGroup: string) => {
    if (editingIndex === null) return;

    const newEx: TemplateExercise = {
      exerciseId: Math.random().toString(),
      name: selectedName,
      group: selectedGroup,
      sets: 3,
      reps: '10',
    };

    const newList = [...exercises];

    if (editingIndex === exercises.length) {
      newList.push(newEx);
    } else {
      newList[editingIndex] = {
        ...newList[editingIndex],
        name: selectedName,
        group: selectedGroup,
      };
    }

    setExercises(newList);
    setIsSelectorOpen(false);
  };

  const removeExercise = (index: number) => {
    const newList = [...exercises];
    newList.splice(index, 1);
    setExercises(newList);
  };

  const updateExercise = (index: number, field: keyof TemplateExercise, value: any) => {
    const newList = [...exercises];
    newList[index] = { ...newList[index], [field]: value };
    setExercises(newList);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Dê um nome para a rotina.');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício.');
      return;
    }

    saveTemplate({
      id: templateId || Math.random().toString(),
      name,
      exercises,
      lastUsed: undefined,
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ExerciseSelector
        visible={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleExerciseSelected}
      />

      <View className="flex-row items-center justify-between border-b border-border px-6 pb-2 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted/50">
          <ArrowLeft size={20} className="text-foreground" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">
          {templateId ? 'Editar Rotina' : 'Nova Rotina'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Save size={20} className="text-primary" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingRight: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingTop: 24,
          }}
          keyboardShouldPersistTaps="handled">
          <View className="mb-6">
            <Text className="mb-1 text-[10px] text-muted-foreground">Nome da rotina</Text>
            <Input
              placeholder="Ex: Treino A - Peito e Tríceps"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-sm font-bold uppercase text-muted-foreground">
              Exercícios ({exercises.length})
            </Text>

            <Button variant="ghost" className="h-8" onPress={handleAddExercise}>
              <Plus size={14} className="mr-1 text-primary" />
              <Text className="text-xs text-primary">Adicionar</Text>
            </Button>
          </View>

          <View className="gap-3">
            {exercises.map((ex, index) => (
              <View key={index} className="rounded-xl border border-border bg-card p-3">
                <View className="mb-2 flex-row items-center gap-2">
                  <GripVertical size={20} className="text-muted-foreground" />

                  <TouchableOpacity
                    className="h-10 flex-1 justify-center rounded-xl border border-input bg-muted/30 px-3"
                    onPress={() => handleEditExerciseName(index)}>
                    <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                      {ex.name}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => removeExercise(index)} className="p-2">
                    <Trash2 size={18} className="text-destructive" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-3 pl-7">
                  <View className="flex-1">
                    <Text className="mb-1 text-[10px] text-muted-foreground">Séries</Text>
                    <Input
                      className="h-9 text-center"
                      keyboardType="numeric"
                      value={String(ex.sets)}
                      onChangeText={(t) => updateExercise(index, 'sets', Number(t))}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-[10px] text-muted-foreground">Repetições</Text>
                    <Input
                      className="h-9 text-center"
                      value={ex.reps}
                      onChangeText={(t) => updateExercise(index, 'reps', t)}
                    />
                  </View>
                  <View className="flex-1 items-end justify-center pt-3">
                    <View className="rounded bg-muted px-2 py-1">
                      <Text className="text-[10px] font-bold uppercase text-muted-foreground">
                        {ex.group}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button className="mt-8" onPress={handleSave}>
            <Text>Salvar Rotina</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
