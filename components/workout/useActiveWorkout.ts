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
  const [isFinished, setIsFinished] = useState(false);
  const [globalStatus, setGlobalStatus] = useState<'idle' | 'training' | 'resting'>('idle');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    if (!templateId) return;

    const tId = Array.isArray(templateId) ? templateId[0] : templateId;
    const template = templates.find((t) => t.id === tId);

    if (template) {
      const initial = template.exercises.map((tEx) => ({
        id: Math.random().toString(),
        exerciseId: tEx.exerciseId,
        name: tEx.name,
        group: tEx.group,
        isExtra: false,
        originalSetCount: tEx.sets,
        sets: Array.from({ length: tEx.sets }).map(() => ({
          id: Math.random().toString(),
          weight: '',
          reps: tEx.reps.replace(/\D/g, '') || '',
          distance: '',
          duration: '',
          status: 'idle' as SetStatus,
          targetReps: tEx.reps,
          isExtra: false,
        })),
      }));
      setExercises(initial);
    }
  }, [templateId, templates]);

  const checkSequence = (
    exIndex: number,
    setIndex: number,
    currentStatus: SetStatus,
    data: ActiveExercise[]
  ) => {
    const currentEx = data[exIndex];

    if (currentStatus === 'completed') {
      const nextSet = currentEx.sets[setIndex + 1];
      if (nextSet && nextSet.status !== 'idle')
        return 'Desfaça a próxima série antes de resetar esta.';

      const nextEx = data[exIndex + 1];
      if (!nextSet && nextEx && nextEx.sets[0]?.status !== 'idle')
        return 'Desfaça o próximo exercício antes de resetar este.';

      return null;
    }

    if (currentStatus === 'idle') {
      if (setIndex > 0) {
        if (currentEx.sets[setIndex - 1].status !== 'completed')
          return 'Complete a série anterior primeiro.';
      } else if (exIndex > 0) {
        const prevEx = data[exIndex - 1];
        const allDone = prevEx.sets.every((s) => s.status === 'completed');
        if (!allDone) return 'Complete todas as séries do exercício anterior.';
      }
      return null;
    }
    return null;
  };

  const changeSetStatus = useCallback((exIndex: number, setIndex: number, newStatus: SetStatus) => {
    setExercises((prev) => {
      const newExs = prev.map((ex, i) => (i === exIndex ? { ...ex, sets: [...ex.sets] } : ex));
      const set = { ...newExs[exIndex].sets[setIndex] };

      const now = new Date().toISOString();
      const isCardio = newExs[exIndex].group === 'Cardio';

      if (newStatus === 'working') {
        set.startedAt = now;
        setGlobalStatus('training');
      } else if (newStatus === 'completed') {
        if (isCardio) {
          const dist = parseFloat(set.distance?.replace(',', '.') || '0');
          const dur = parseFloat(set.duration?.replace(',', '.') || '0');
          if (dist <= 0) {
            Alert.alert('Inválido', 'Informe a distância (KM).');
            return prev;
          }
          if (dur <= 0) {
            Alert.alert('Inválido', 'Informe o tempo (Min).');
            return prev;
          }
        } else {
          const w = parseFloat(set.weight.replace(',', '.') || '0');
          const r = parseFloat(set.reps.replace(',', '.') || '0');
          if (w <= 0) {
            Alert.alert('Inválido', 'Informe o peso (KG).');
            return prev;
          }
          if (r <= 0) {
            Alert.alert('Inválido', 'Faça pelo menos 1 repetição.');
            return prev;
          }
        }

        set.completedAt = now;
        if (set.startedAt) {
          const start = new Date(set.startedAt).getTime();
          set.durationSeconds = Math.floor((new Date(now).getTime() - start) / 1000);
        }
        setGlobalStatus('resting');
      } else if (newStatus === 'idle') {
        set.startedAt = undefined;
        set.completedAt = undefined;
        set.durationSeconds = undefined;
      }

      set.status = newStatus;
      newExs[exIndex].sets[setIndex] = set;
      return newExs;
    });
  }, []);

  const handleSetInteraction = useCallback(
    (exIndex: number, setIndex: number) => {
      if (!startTime) return Alert.alert('Aguardando', 'Clique em "INICIAR" no topo.');

      setExercises((current) => {
        const status = current[exIndex].sets[setIndex].status;

        const error = checkSequence(exIndex, setIndex, status, current);

        if (error) {
          Alert.alert('Ordem Incorreta', error);
          return current;
        }

        setTimeout(() => {
          if (status === 'idle') changeSetStatus(exIndex, setIndex, 'working');
          else if (status === 'working') changeSetStatus(exIndex, setIndex, 'completed');
          else if (status === 'completed') {
            Alert.alert('Resetar?', 'Refazer série?', [
              { text: 'Não', style: 'cancel' },
              { text: 'Sim', onPress: () => changeSetStatus(exIndex, setIndex, 'idle') },
            ]);
          }
        }, 0);

        return current;
      });
    },
    [startTime, changeSetStatus]
  );

  const updateSetInput = useCallback(
    (exIndex: number, setIndex: number, field: string, value: string) => {
      setExercises((prev) =>
        prev.map((ex, i) =>
          i === exIndex
            ? {
                ...ex,
                sets: ex.sets.map((s, j) => (j === setIndex ? { ...s, [field]: value } : s)),
              }
            : ex
        )
      );
    },
    []
  );

  const handleAddExercise = useCallback((name: string, group: string) => {
    setExercises((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name,
        group,
        isExtra: true,
        originalSetCount: 0,
        sets: [
          {
            id: Math.random().toString(),
            weight: '',
            reps: '',
            distance: '',
            duration: '',
            status: 'idle',
            isExtra: true,
          },
        ],
      },
    ]);
    setIsSelectorOpen(false);
  }, []);

  const addSet = useCallback((exIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIndex) return ex;
        const last = ex.sets[ex.sets.length - 1];
        const isSetExtra = ex.sets.length >= (ex.originalSetCount || 0);

        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: Math.random().toString(),
              weight: last?.weight || '',
              distance: last?.distance || '',
              reps: '',
              duration: '',
              status: 'idle',
              targetReps: last?.targetReps,
              isExtra: isSetExtra,
            },
          ],
        };
      })
    );
  }, []);

  const removeSet = useCallback((exIndex: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIndex) } : ex
      )
    );
  }, []);

  const removeExercise = useCallback((exIndex: number) => {
    Alert.alert('Remover?', 'Isso apagará o exercício.', [
      { text: 'Cancelar' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => setExercises((prev) => prev.filter((_, i) => i !== exIndex)),
      },
    ]);
  }, []);

  const handleFinish = () => {
    const valid = exercises.some((ex) => ex.sets.some((s) => s.status === 'completed'));
    if (!valid) return Alert.alert('Inválido', 'Complete ao menos uma série.');

    setIsFinished(true);
    const end = new Date();
    const durationSeconds = Math.floor((end.getTime() - new Date(startTime!).getTime()) / 1000);

    const h = Math.floor(durationSeconds / 3600);
    const m = Math.floor((durationSeconds % 3600) / 60);
    const s = durationSeconds % 60;
    const formattedTime = h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;

    let setCounter = 0;
    const finalExs = exercises
      .map((ex) => ({
        exerciseId: ex.exerciseId || 'manual',
        name: ex.name,
        group: ex.group,
        sets: ex.sets
          .filter((s) => s.status === 'completed')
          .map((s) => {
            setCounter++;
            const isCardio = ex.group === 'Cardio';
            return {
              completed: true,
              weight: isCardio ? 0 : parseFloat(s.weight) || 0,
              reps: isCardio ? 0 : parseFloat(s.reps) || 0,
              distance: isCardio ? parseFloat(s.distance || '0') || 0 : 0,
              manualDuration: isCardio ? parseFloat(s.duration || '0') || 0 : 0,
              duration: s.durationSeconds || 0,
              startedAt: s.startedAt,
              completedAt: s.completedAt,
            };
          }),
      }))
      .filter((e) => e.sets.length > 0);

    const xp = setCounter * 15;
    addWorkout({
      id: Math.random().toString(),
      date: startTime!,
      durationSeconds,
      xpEarned: xp,
      exercises: finalExs as any,
    });

    Alert.alert('Parabéns! 🚀', `Tempo: ${formattedTime}\nXP: +${xp}`, [
      { text: 'Fechar', onPress: () => router.push('/(tabs)/history') },
    ]);
  };

  const handleMainAction = () => {
    if (!startTime) {
      if (!exercises.length) return Alert.alert('Vazio', 'Adicione exercícios.');
      const now = new Date().toISOString();
      setStartTime(now);
      setGlobalStatus('training');

      if (exercises.length > 0 && exercises[0].sets.length > 0) {
        if (exercises[0].sets[0].status === 'idle') changeSetStatus(0, 0, 'working');
      }
    } else {
      handleFinish();
    }
  };

  return {
    exercises,
    startTime,
    isFinished,
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
