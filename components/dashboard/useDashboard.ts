import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useStore } from '@/store/useStore';

dayjs.locale('pt-br');

export function useDashboard() {
  const router = useRouter();
  const { user, history, restDays, toggleRestDay, resetData, seedData } = useStore();
  const tierColor = user.accentColor || '#a1a1aa';
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [optimisticRestState, setOptimisticRestState] = useState<boolean | null>(null);

  const timeoutRef = useRef<any>(null);

  const isRestDayRealRef = useRef(false);

  useEffect(() => {
    setOptimisticRestState(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [selectedDate]);

  const totalSets = useMemo(() => {
    return history.reduce((acc, session) => {
      return acc + session.exercises.reduce((exAcc, ex) => exAcc + ex.sets.length, 0);
    }, 0);
  }, [history]);

  const filteredWorkouts = useMemo(() => {
    return history.filter((workout) => {
      if (!workout.date) return false;
      return dayjs(workout.date).isSame(selectedDate, 'day');
    });
  }, [selectedDate, history]);

  const isRestDayReal = useMemo(() => {
    const targetDateStr = selectedDate.format('YYYY-MM-DD');
    const isRest = restDays.includes(targetDateStr);
    isRestDayRealRef.current = isRest;
    return isRest;
  }, [selectedDate, restDays]);

  const isRestDay = optimisticRestState !== null ? optimisticRestState : isRestDayReal;

  const effectiveRestDays = useMemo(() => {
    if (optimisticRestState === null) return restDays;

    const targetDateStr = selectedDate.format('YYYY-MM-DD');
    if (optimisticRestState === true) {
      return restDays.includes(targetDateStr) ? restDays : [...restDays, targetDateStr];
    } else {
      return restDays.filter((d) => d !== targetDateStr);
    }
  }, [restDays, optimisticRestState, selectedDate]);

  const isToday = useMemo(() => selectedDate.isSame(dayjs(), 'day'), [selectedDate]);

  const handleToggleRest = useCallback(() => {
    const dateStr = selectedDate.format('YYYY-MM-DD');

    const currentState =
      optimisticRestState !== null ? optimisticRestState : isRestDayRealRef.current;
    const newState = !currentState;

    setOptimisticRestState(newState);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (newState !== isRestDayRealRef.current) {
        toggleRestDay(dateStr);
      }
      setOptimisticRestState(null);
    }, 600);
  }, [selectedDate, optimisticRestState, toggleRestDay]);

  const handleNewWorkout = useCallback(() => {
    router.push('/workout/routines');
  }, [router]);

  return {
    user,
    history,
    selectedDate,
    setSelectedDate,
    tierColor,
    totalSets,
    filteredWorkouts,
    isRestDay,
    effectiveRestDays,
    isToday,
    actions: {
      handleToggleRest,
      handleNewWorkout,
      resetData,
      seedData,
    },
  };
}
