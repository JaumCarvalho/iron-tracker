import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WorkoutSession } from './types';
import dayjs from 'dayjs';

interface AppState {
  user: UserProfile;
  history: WorkoutSession[];
  dietLog: Record<string, any>;
  addWorkout: (session: WorkoutSession) => void;
  resetData: () => void;
  checkStreak: () => void;
  seedData: (daysToSimulate: number) => void;
  restDays: string[];
  toggleRestDay: (date: string) => void;
  clearHistoryOnly: () => void;
  clearProfileOnly: () => void;
  devLogs: string[];
  addDevLog: (msg: string) => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: { name: 'Giga Chad', streak: 0, lastActivityDate: null, level: 1, totalXp: 0 },
      history: [],
      dietLog: {},
      restDays: [],
      devLogs: [],
      updateUser: (data) => {
        set((state) => ({
          user: { ...state.user, ...data },
        }));
      },

      addDevLog: (msg: string) => {
        const time = dayjs().format('HH:mm:ss');
        set((state) => {
          const currentLogs = state.devLogs || [];
          const newLog = `[${time}] ${msg}`;
          return { devLogs: [newLog, ...currentLogs].slice(0, 50) };
        });
      },

      clearHistoryOnly: () => {
        set({ history: [] });
        get().addDevLog('Histórico limpo com sucesso.');
      },

      clearProfileOnly: () => {
        set((state) => ({
          user: { ...state.user, level: 1, currentXp: 0, totalXp: 0, streak: 0 },
        }));
        get().addDevLog('Perfil/Stats resetados.');
      },

      resetData: () => {
        set({
          user: { name: 'Giga Chad', streak: 0, lastActivityDate: null, level: 1, totalXp: 0 },
          history: [],
          restDays: [],
          dietLog: {},
          devLogs: [],
        });
        get().addDevLog('Factory Reset executado.');
      },

      toggleRestDay: (dateIso: string) => {
        const dateStr = dayjs(dateIso).format('YYYY-MM-DD');

        set((state) => {
          const currentRestDays = state.restDays || [];
          const exists = currentRestDays.includes(dateStr);
          let newRestDays;

          if (exists) {
            newRestDays = currentRestDays.filter((d) => d !== dateStr);
          } else {
            newRestDays = [...currentRestDays, dateStr];
          }

          return { restDays: newRestDays };
        });

        get().checkStreak();
        get().addDevLog(`Rest Day alterado: ${dateStr}`);
      },

      addWorkout: (session) => {
        set((state) => {
          const workoutDateStr = dayjs(session.date).format('YYYY-MM-DD');
          const currentRestDays = state.restDays || [];
          const newRestDays = currentRestDays.filter((d) => d !== workoutDateStr);

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
        const restMap = new Set(restDays || []);

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

      seedData: (daysToSimulate = 365) => {
        const today = dayjs();
        const history: any[] = [];
        const dietLog: any = {};
        const restDays: string[] = [];

        const baseStats: Record<string, number> = {
          'Supino Reto (Barra)': 40,
          'Tríceps Corda': 15,
          'Puxada Alta': 35,
          'Rosca Direta': 8,
          'Agachamento Livre': 50,
          'Desenvolvimento Militar': 20,
        };

        const cardioOptions = [
          { name: 'Esteira', baseSpeed: 10, minMin: 20, maxMin: 45 },
          { name: 'Bicicleta', baseSpeed: 22, minMin: 40, maxMin: 60 },
          { name: 'Elíptico', baseSpeed: 6, minMin: 20, maxMin: 40 },
          { name: 'Remo', baseSpeed: 12, minMin: 15, maxMin: 30 },
          { name: 'Pular Corda', baseSpeed: 0, minMin: 10, maxMin: 20 },
        ];

        for (let i = daysToSimulate; i >= 0; i--) {
          const dateObj = today.subtract(i, 'day');
          const dateStr = dateObj.format('YYYY-MM-DD');
          const isoDate = dateObj.toISOString();

          const randomCal = Math.floor(Math.random() * 400);
          dietLog[dateStr] = {
            date: dateStr,
            caloriesGoal: 2000,
            caloriesConsumed: 2000 + randomCal - 200,
            meals: [],
          };

          if (i % 7 === 0) {
            restDays.push(dateStr);
            continue;
          }

          let exercises = [];
          const mode = i % 3;

          if (mode === 0) {
            exercises.push({
              exerciseId: Math.random().toString(),
              name: 'Supino Reto (Barra)',
              group: 'Peito',
              sets: [
                {
                  weight: baseStats['Supino Reto (Barra)'],
                  reps: 10,
                  completed: true,
                  distance: 0,
                  duration: 0,
                },
              ],
            });
            exercises.push({
              exerciseId: Math.random().toString(),
              name: 'Tríceps Corda',
              group: 'Braços',
              sets: [
                {
                  weight: baseStats['Tríceps Corda'],
                  reps: 12,
                  completed: true,
                  distance: 0,
                  duration: 0,
                },
              ],
            });
          } else if (mode === 1) {
            exercises.push({
              exerciseId: Math.random().toString(),
              name: 'Puxada Alta',
              group: 'Costas',
              sets: [
                {
                  weight: baseStats['Puxada Alta'],
                  reps: 12,
                  completed: true,
                  distance: 0,
                  duration: 0,
                },
              ],
            });
            exercises.push({
              exerciseId: Math.random().toString(),
              name: 'Agachamento Livre',
              group: 'Pernas',
              sets: [
                {
                  weight: baseStats['Agachamento Livre'],
                  reps: 10,
                  completed: true,
                  distance: 0,
                  duration: 0,
                },
              ],
            });
          } else {
            const cType = cardioOptions[i % cardioOptions.length];
            exercises.push({
              exerciseId: Math.random().toString(),
              name: cType.name,
              group: 'Cardio',
              sets: [{ weight: 0, reps: 0, completed: true, duration: 30, distance: 5 }],
            });
          }

          if (exercises.length > 0) {
            history.push({
              id: Math.random().toString(),
              date: isoDate,
              durationSeconds: 3600,
              exercises: exercises,
              xpEarned: 150,
            });
          }
        }

        history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const totalXp = history.reduce((acc, curr) => acc + curr.xpEarned, 0);

        set({
          restDays,
          user: {
            name: 'Giga Chad Pro Max',
            streak: 0,
            lastActivityDate: new Date().toISOString(),
            level: Math.floor(totalXp / 1000) + 1,
            totalXp: totalXp,
          },
          history,
          dietLog,
        });

        get().checkStreak();
        get().addDevLog(`Seed de ${daysToSimulate} dias aplicado.`);
      },
    }),
    {
      name: 'iron-streak-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
