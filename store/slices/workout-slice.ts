import { StateCreator } from 'zustand';
import dayjs from 'dayjs';
import { AppState, WorkoutSlice } from '../types';

export const createWorkoutSlice: StateCreator<AppState, [], [], WorkoutSlice> = (set, get) => ({
  history: [],
  restDays: [],
  dietLog: {},

  toggleRestDay: (dateIso: string) => {
    const dateStr = dayjs(dateIso).format('YYYY-MM-DD');
    set((state) => {
      const currentRestDays = state.restDays || [];
      const exists = currentRestDays.includes(dateStr);
      return {
        restDays: exists
          ? currentRestDays.filter((d) => d !== dateStr)
          : [...currentRestDays, dateStr],
      };
    });
    get().checkStreak();
    get().addDevLog(`Rest Day alterado: ${dateStr}`);
  },

  addWorkout: (session) => {
    set((state) => {
      const workoutDateStr = dayjs(session.date).format('YYYY-MM-DD');

      const newRestDays = state.restDays.filter((d) => d !== workoutDateStr);

      const newXp = state.user.totalXp + session.xpEarned;
      const newLevel = Math.floor(newXp / 1000) + 1;

      return {
        history: [session, ...state.history],
        restDays: newRestDays,
        user: {
          ...state.user,
          totalXp: newXp,
          level: newLevel,
          lastActivityDate: session.date,
        },
      };
    });
    get().checkStreak();
    get().addDevLog('Treino registrado.');
  },

  checkStreak: () => {
    const { history, restDays } = get();

    const workoutMap = new Set(history.map((h) => dayjs(h.date).format('YYYY-MM-DD')));
    const restMap = new Set(restDays);

    let streak = 0;
    let checkDate = dayjs();

    const todayStr = checkDate.format('YYYY-MM-DD');
    if (!workoutMap.has(todayStr) && !restMap.has(todayStr)) {
      checkDate = checkDate.subtract(1, 'day');
    }

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.format('YYYY-MM-DD');
      if (workoutMap.has(dateStr)) {
        streak++;
        checkDate = checkDate.subtract(1, 'day');
      } else if (restMap.has(dateStr)) {
        checkDate = checkDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    set((state) => ({
      user: { ...state.user, streak },
    }));
  },

  clearHistoryOnly: () => {
    set({ history: [] });
    get().addDevLog('Histórico limpo com sucesso.');
  },
});
