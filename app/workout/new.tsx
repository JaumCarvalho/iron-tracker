import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, StopCircle, AlertTriangle, Plus } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ExerciseSelector } from '@/components/features/exercise-selector';
import { WorkoutTimer } from '@/components/workout/workout-timer';
import { ExerciseCard } from '@/components/workout/active-workout-components';
import { useActiveWorkout } from '@/components/workout/useActiveWorkout';

export default function NewWorkoutScreen() {
  const router = useRouter();
  const { templateId } = useLocalSearchParams();

  const { exercises, startTime, globalStatus, isSelectorOpen, setIsSelectorOpen, actions } =
    useActiveWorkout(templateId);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ExerciseSelector
        visible={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={actions.handleAddExercise}
      />

      <View className="z-10 flex-row items-center justify-between border-b border-border bg-background px-6 pb-4 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted/50">
          <ArrowLeft size={20} className="text-foreground" />
        </TouchableOpacity>

        <WorkoutTimer startTime={startTime} status={globalStatus} />

        <Button
          size="sm"
          onPress={actions.handleMainAction}
          className={startTime ? 'bg-destructive' : 'bg-primary'}>
          {startTime ? (
            <View className="flex-row items-center gap-2">
              <StopCircle size={16} color="white" />
              <Text className="font-bold text-white">Finalizar</Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <Play size={16} color="white" fill="white" />
              <Text className="font-bold text-white">Iniciar</Text>
            </View>
          )}
        </Button>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled">
          {!startTime && exercises.length > 0 && (
            <View className="mb-4 flex-row items-center justify-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <AlertTriangle size={20} className="text-primary" />
              <Text className="text-sm font-bold text-primary">Aperte "Iniciar" para começar.</Text>
            </View>
          )}

          {exercises.map((ex, exIndex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              exIndex={exIndex}
              onRemoveExercise={actions.removeExerciseFromList}
              onSetInteraction={actions.handleSetInteraction}
              onUpdateSet={actions.updateSetInput}
              onAddSet={actions.addSet}
              onRemoveSet={actions.removeSet}
            />
          ))}

          <Button
            variant="outline"
            className="mb-8 mt-4 h-12 border-dashed"
            onPress={() => setIsSelectorOpen(true)}>
            <Plus size={16} className="mr-2 text-foreground" />
            <Text>Adicionar Exercício</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
