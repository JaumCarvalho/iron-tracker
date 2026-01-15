import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../store/useStore';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Trash2,
  CheckCircle2,
  X,
  ChevronDown,
  Timer,
  MapPin,
  Dumbbell,
  Footprints,
} from 'lucide-react-native';
import { ExerciseSelector } from '@/components/features/exercise-selector';

type LocalSet = {
  weight: string;
  reps: string;
  distance: string;
  duration: string;
};

type LocalExercise = {
  id: string;
  name: string;
  group: string;
  sets: LocalSet[];
};

export default function NewWorkout() {
  const { addWorkout } = useStore();

  const [exercises, setExercises] = useState<LocalExercise[]>([
    { id: '1', name: '', group: '', sets: [{ weight: '', reps: '', distance: '', duration: '' }] },
  ]);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  const handleAddExercise = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExercises((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: '',
        group: '',
        sets: [{ weight: '', reps: '', distance: '', duration: '' }],
      },
    ]);
  };

  const handleRemoveExercise = (id: string) => {
    if (exercises.length === 1) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const openSelector = (id: string) => {
    setActiveExerciseId(id);
    setIsSelectorOpen(true);
  };

  const handleSelectExerciseData = (name: string, group: string) => {
    if (activeExerciseId) {
      setExercises((prev) =>
        prev.map((ex) => (ex.id === activeExerciseId ? { ...ex, name, group } : ex))
      );
    }
    setActiveExerciseId(null);
    setIsSelectorOpen(false);
  };

  const handleAddSet = (exerciseId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return { ...ex, sets: [...ex.sets, { ...lastSet }] };
        }
        return ex;
      })
    );
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId && ex.sets.length > 1) {
          return { ...ex, sets: ex.sets.filter((_, index) => index !== setIndex) };
        }
        return ex;
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setIndex: number,
    field: keyof LocalSet,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = [...ex.sets];
          newSets[setIndex] = { ...newSets[setIndex], [field]: value };
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const handleFinish = () => {
    const namedExercises = exercises.filter((ex) => ex.name.trim().length > 0);

    if (namedExercises.length === 0) {
      Alert.alert('Treino Vazio', 'Adicione pelo menos um exercício e selecione o nome.');
      return;
    }

    for (const ex of namedExercises) {
      const isCardio = ex.group === 'Cardio';

      const hasValidData = ex.sets.some((s) => {
        if (isCardio) {
          return parseFloat(s.duration) > 0 || parseFloat(s.distance) > 0;
        } else {
          return parseFloat(s.weight) > 0 || parseFloat(s.reps) > 0;
        }
      });

      if (!hasValidData) {
        Alert.alert(
          'Dados Incompletos',
          `O exercício "${ex.name}" não tem dados preenchidos.\n\nPor favor, insira Carga/Reps ou Tempo/Distância.`
        );
        return;
      }
    }

    let totalXP = 50;

    const formattedExercises = namedExercises.map((ex) => {
      const isCardio = ex.group === 'Cardio';

      const validSets = ex.sets.map((s) => {
        if (isCardio) {
          const dist = parseFloat(s.distance) || 0;
          const dur = parseFloat(s.duration) || 0;
          totalXP += dist * 5 + dur * 2;
          return {
            weight: 0,
            reps: 0,
            completed: true,
            distance: dist,
            duration: dur,
          };
        } else {
          const w = parseFloat(s.weight) || 0;
          const r = parseFloat(s.reps) || 0;
          totalXP += 10;
          return {
            weight: w,
            reps: r,
            completed: true,
            distance: 0,
            duration: 0,
          };
        }
      });

      return {
        exerciseId: Math.random().toString(),
        name: ex.name,
        group: ex.group || 'Outros',
        sets: validSets,
      };
    });

    addWorkout({
      id: Math.random().toString(),
      date: new Date().toISOString(),
      durationSeconds: 0,
      exercises: formattedExercises,
      xpEarned: Math.floor(totalXP),
    });

    Alert.alert('Treino Finalizado!', `Você ganhou ${Math.floor(totalXP)} XP!`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background">
      <ExerciseSelector
        visible={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleSelectExerciseData}
      />

      <View className="z-10 flex-row items-center justify-between border-b border-border bg-background px-6 pb-4 pt-14">
        <View>
          <Text className="text-2xl font-bold text-foreground">Novo Treino</Text>
          <Text className="text-xs text-muted-foreground">Registre sua evolução de hoje</Text>
        </View>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.back()}
          className="rounded-full bg-muted/30">
          <X size={20} className="text-muted-foreground" />
        </Button>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {exercises.map((exercise, index) => {
            const isCardio = exercise.group === 'Cardio';

            return (
              <View
                key={exercise.id}
                className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
                <View className="flex-row items-start justify-between border-b border-border/30 bg-muted/20 p-4">
                  <TouchableOpacity
                    onPress={() => openSelector(exercise.id)}
                    className="mr-4 flex-1 flex-row items-center gap-3">
                    <View
                      className={`h-10 w-10 items-center justify-center rounded-xl ${exercise.name ? 'bg-primary/10' : 'bg-muted'}`}>
                      {isCardio ? (
                        <Footprints
                          size={20}
                          className={exercise.name ? 'text-primary' : 'text-muted-foreground'}
                        />
                      ) : (
                        <Dumbbell
                          size={20}
                          className={exercise.name ? 'text-primary' : 'text-muted-foreground'}
                        />
                      )}
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text
                          className={`text-lg font-bold ${exercise.name ? 'text-foreground' : 'text-muted-foreground'}`}
                          numberOfLines={1}>
                          {exercise.name || 'Selecionar Exercício'}
                        </Text>
                        <ChevronDown size={16} className="text-muted-foreground" />
                      </View>
                      {exercise.group ? (
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {exercise.group}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveExercise(exercise.id)}
                    className="-mr-2 p-2">
                    <Trash2 size={18} className="text-destructive/70" />
                  </TouchableOpacity>
                </View>

                <View className="gap-2 p-4">
                  {isCardio ? (
                    <View className="flex-row gap-4">
                      <View className="flex-1 gap-1.5">
                        <Text className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                          Tempo (min)
                        </Text>
                        <View className="h-14 flex-row items-center rounded-xl border border-transparent bg-muted/40 px-3 focus:border-primary">
                          <Timer size={18} className="mr-2 text-muted-foreground" />
                          <Input
                            keyboardType="numeric"
                            placeholder="0"
                            className="h-14 flex-1 border-0 p-0 text-xl font-bold text-foreground"
                            value={exercise.sets[0].duration}
                            onChangeText={(t) => updateSet(exercise.id, 0, 'duration', t)}
                          />
                        </View>
                      </View>

                      <View className="flex-1 gap-1.5">
                        <Text className="ml-1 text-[10px] font-bold uppercase text-muted-foreground">
                          Distância (km)
                        </Text>
                        <View className="h-14 flex-row items-center rounded-xl border border-transparent bg-muted/40 px-3 focus:border-primary">
                          <MapPin size={18} className="mr-2 text-muted-foreground" />
                          <Input
                            keyboardType="numeric"
                            placeholder="0.0"
                            className="h-14 flex-1 border-0 p-0 text-xl font-bold text-foreground"
                            value={exercise.sets[0].distance}
                            onChangeText={(t) => updateSet(exercise.id, 0, 'distance', t)}
                          />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View className="mb-1 flex-row px-1">
                        <Text className="w-8 text-center text-[10px] font-bold text-muted-foreground">
                          #
                        </Text>
                        <Text className="flex-1 text-center text-[10px] font-bold text-muted-foreground">
                          CARGA (KG)
                        </Text>
                        <Text className="flex-1 text-center text-[10px] font-bold text-muted-foreground">
                          REPETIÇÕES
                        </Text>
                        <View className="w-8" />
                      </View>

                      {exercise.sets.map((set, setIndex) => (
                        <View key={setIndex} className="mb-2 flex-row items-center gap-3">
                          <View className="h-12 w-8 items-center justify-center">
                            <Text className="text-sm font-bold text-muted-foreground">
                              {setIndex + 1}
                            </Text>
                          </View>

                          <Input
                            keyboardType="numeric"
                            placeholder="-"
                            className="h-12 flex-1 rounded-xl border-0 bg-muted/40 text-center text-lg font-bold"
                            value={set.weight}
                            onChangeText={(t) => updateSet(exercise.id, setIndex, 'weight', t)}
                          />

                          <Input
                            keyboardType="numeric"
                            placeholder="-"
                            className="h-12 flex-1 rounded-xl border-0 bg-muted/40 text-center text-lg font-bold"
                            value={set.reps}
                            onChangeText={(t) => updateSet(exercise.id, setIndex, 'reps', t)}
                          />

                          <TouchableOpacity
                            onPress={() => handleRemoveSet(exercise.id, setIndex)}
                            className="h-12 w-8 items-center justify-center">
                            <Trash2 size={16} className="text-muted-foreground/30" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      <TouchableOpacity
                        onPress={() => handleAddSet(exercise.id)}
                        className="mt-2 flex-row items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 py-3 active:bg-muted/30">
                        <Plus size={16} className="mr-2 text-primary" />
                        <Text className="text-sm font-bold text-primary">Adicionar Série</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            onPress={handleAddExercise}
            className="mt-4 flex-row items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 py-5 active:bg-muted/10">
            <Plus size={24} className="mr-2 text-muted-foreground" />
            <Text className="text-base font-medium text-muted-foreground">Novo Exercício</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-background p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button size="lg" className="h-14 w-full rounded-xl bg-primary" onPress={handleFinish}>
          <CheckCircle2 size={20} className="mr-2 text-primary-foreground" />
          <Text className="text-lg font-bold text-primary-foreground">Finalizar Treino</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
