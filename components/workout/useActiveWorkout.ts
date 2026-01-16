import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { ActiveExercise, SetStatus } from '@/types/active-workout';

export function useActiveWorkout(templateId?: string | string[]) {
  const router = useRouter();
  const { templates, addWorkout } = useStore();

  const [exercises, setExercises] = useState<ActiveExercise[]>([]);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [globalStatus, setGlobalStatus] = useState<'idle' | 'training' | 'resting'>('idle');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    if (templateId) {
      const tId = Array.isArray(templateId) ? templateId[0] : templateId;
      const template = templates.find((t) => t.id === tId);
      if (template) {
        const initial = template.exercises.map((tEx) => ({
          id: Math.random().toString(),
          exerciseId: tEx.exerciseId,
          name: tEx.name,
          group: tEx.group,
          isExtra: false,
          sets: Array.from({ length: tEx.sets }).map(() => ({
            id: Math.random().toString(),
            weight: '',
            reps: tEx.reps.replace(/\D/g, '') || '',
            status: 'idle' as SetStatus,
            targetReps: tEx.reps,
            isExtra: false,
          })),
        }));
        setExercises(initial);
      }
    }
  }, [templateId, templates]);

  const changeSetStatus = useCallback((exIndex: number, setIndex: number, newStatus: SetStatus) => {
    setExercises((prev) => {
      const newExs = [...prev];
      const newSets = [...newExs[exIndex].sets];
      const set = { ...newSets[setIndex] };
      const now = new Date().toISOString();

      if (newStatus === 'working') {
        set.startedAt = now;
        setGlobalStatus('training');
      } else if (newStatus === 'completed') {
        if (!set.weight.trim()) {
          Alert.alert('Peso Obrigatório', 'Informe a carga para concluir.');
          return prev;
        }
        set.completedAt = now;
        if (set.startedAt) {
          set.durationSeconds = Math.floor(
            (new Date(now).getTime() - new Date(set.startedAt).getTime()) / 1000
          );
        }
        setGlobalStatus('resting');
      } else if (newStatus === 'idle') {
        set.startedAt = undefined;
        set.completedAt = undefined;
        set.durationSeconds = undefined;
      }
      set.status = newStatus;
      newSets[setIndex] = set;
      newExs[exIndex] = { ...newExs[exIndex], sets: newSets };
      return newExs;
    });
  }, []);

  const handleSetInteraction = useCallback(
    (exIndex: number, setIndex: number) => {
      if (!startTime) {
        Alert.alert('Calma!', 'Clique em "INICIAR" no topo da tela primeiro.');
        return;
      }
      setExercises((prev) => {
        const status = prev[exIndex].sets[setIndex].status;
        // depois refatorar para useEffects se necessário
        setTimeout(() => {
          if (status === 'idle') changeSetStatus(exIndex, setIndex, 'working');
          else if (status === 'working') changeSetStatus(exIndex, setIndex, 'completed');
          else if (status === 'completed') {
            Alert.alert('Desfazer?', 'Resetar série?', [
              { text: 'Não', style: 'cancel' },
              { text: 'Sim', onPress: () => changeSetStatus(exIndex, setIndex, 'idle') },
            ]);
          }
        }, 0);
        return prev;
      });
    },
    [startTime, changeSetStatus]
  );

  const updateSetInput = useCallback(
    (exIndex: number, setIndex: number, field: string, value: string) => {
      setExercises((prev) => {
        const newExs = [...prev];
        const newSets = [...newExs[exIndex].sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: value };
        newExs[exIndex] = { ...newExs[exIndex], sets: newSets };
        return newExs;
      });
    },
    []
  );

  const handleMainAction = () => {
    if (!startTime) {
      const now = new Date().toISOString();
      setStartTime(now);
      setGlobalStatus('training');
      if (exercises.length > 0 && exercises[0].sets.length > 0) {
        changeSetStatus(0, 0, 'working');
      }
    } else {
      handleFinish();
    }
  };

  const handleAddExercise = useCallback((name: string, group: string) => {
    setExercises((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name,
        group,
        isExtra: true,
        sets: Array.from({ length: 3 }).map(() => ({
          id: Math.random().toString(),
          weight: '',
          reps: '',
          status: 'idle' as SetStatus,
          isExtra: true,
        })),
      },
    ]);
    setIsSelectorOpen(false);
  }, []);

  const addSet = useCallback((exIndex: number) => {
    setExercises((prev) => {
      const newExs = [...prev];
      const last = newExs[exIndex].sets[newExs[exIndex].sets.length - 1];
      newExs[exIndex].sets.push({
        id: Math.random().toString(),
        weight: last ? last.weight : '',
        reps: '',
        status: 'idle',
        targetReps: last?.targetReps,
        isExtra: true,
      });
      return newExs;
    });
  }, []);

  const removeSet = useCallback((exIndex: number, setIndex: number) => {
    setExercises((prev) => {
      const newExs = [...prev];
      newExs[exIndex].sets.splice(setIndex, 1);
      return newExs;
    });
  }, []);

  const removeExercise = useCallback((exIndex: number) => {
    Alert.alert('Remover?', 'Tem certeza?', [
      { text: 'Cancelar' },
      { text: 'Sim', onPress: () => setExercises((prev) => prev.filter((_, i) => i !== exIndex)) },
    ]);
  }, []);

  const handleFinish = () => {
    if (exercises.length === 0) return Alert.alert('Vazio', 'Adicione exercícios.');
    const hasValid = exercises.some((ex) =>
      ex.sets.some((s) => s.status === 'completed' && s.weight.trim())
    );
    if (!hasValid) return Alert.alert('Inválido', 'Complete ao menos uma série com peso.');

    const endTime = new Date();
    const start = new Date(startTime!);
    const durationSeconds = Math.floor((endTime.getTime() - start.getTime()) / 1000);

    let totalSets = 0;
    const finalExs = exercises
      .map((ex) => ({
        exerciseId: ex.exerciseId || 'manual',
        name: ex.name,
        group: ex.group,
        sets: ex.sets.map((s) => {
          if (s.status === 'completed') totalSets++;
          return {
            weight: parseFloat(s.weight) || 0,
            reps: parseFloat(s.reps) || 0,
            completed: s.status === 'completed',
            duration: s.durationSeconds,
            startedAt: s.startedAt,
            completedAt: s.completedAt,
          };
        }),
      }))
      .filter((ex) => ex.sets.some((s) => s.completed));

    const xp = totalSets * 15;
    addWorkout({
      id: Math.random().toString(),
      date: startTime!,
      durationSeconds,
      xpEarned: xp,
      exercises: finalExs as any,
    });

    Alert.alert(
      'Treino Finalizado! 🚀',
      `Tempo: ${Math.floor(durationSeconds / 60)}min\nXP: +${xp}`,
      [{ text: 'Fechar', onPress: () => router.push('/(tabs)/history') }]
    );
  };

  return {
    exercises,
    startTime,
    globalStatus,
    isSelectorOpen,
    setIsSelectorOpen,
    actions: {
      handleMainAction,
      handleAddExercise,
      handleSetInteraction,
      updateSetInput,
      addSet,
      removeSet,
      removeExercise,
      removeExerciseFromList: removeExercise,
    },
  };
}
