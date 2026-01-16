import { useState, useMemo, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useStore } from '@/store/useStore';
import { STREAK_TIERS } from '@/lib/constants';

dayjs.locale('pt-br');

export function useDashboard() {
  const router = useRouter();
  const { user, history, restDays, toggleRestDay, resetData, seedData } = useStore();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useFocusEffect(useCallback(() => {}, [history, restDays]));

  const tierColor = useMemo(() => {
    const tier =
      STREAK_TIERS.find((t) => user.streak >= t.days) || STREAK_TIERS[STREAK_TIERS.length - 1];
    return tier.color;
  }, [user.streak]);

  const totalSets = useMemo(() => {
    return history.reduce((acc, session) => {
      return acc + session.exercises.reduce((exAcc, ex) => exAcc + ex.sets.length, 0);
    }, 0);
  }, [history]);

  const filteredWorkouts = useMemo(() => {
    const targetDate = selectedDate.format('YYYY-MM-DD');
    return history.filter((workout) => workout.date.startsWith(targetDate));
  }, [selectedDate, history]);

  const isRestDay = useMemo(() => {
    const targetDate = selectedDate.format('YYYY-MM-DD');
    return restDays.includes(targetDate);
  }, [selectedDate, restDays]);

  const isToday = selectedDate.isSame(dayjs(), 'day');

  const handleToggleRest = () => toggleRestDay(selectedDate.toISOString());

  const handleNewWorkout = () => router.push('/workout/routines');

  return {
    user,
    history,
    selectedDate,
    setSelectedDate,

    tierColor,
    totalSets,
    filteredWorkouts,
    isRestDay,
    isToday,

    actions: {
      handleToggleRest,
      handleNewWorkout,
      resetData,
      seedData,
    },
  };
}
