import { StateCreator } from 'zustand';
import dayjs from 'dayjs';
import { AppState, DevSlice } from '../types';

export const createDevSlice: StateCreator<AppState, [], [], DevSlice> = (set, get) => ({
  devLogs: [],

  addDevLog: (msg: string) => {
    const time = dayjs().format('HH:mm:ss');
    set((state) => {
      const currentLogs = state.devLogs || [];
      return { devLogs: [`[${time}] ${msg}`, ...currentLogs].slice(0, 50) };
    });
  },

  resetData: () => {
    set({
      user: {
        name: 'Usuário',
        streak: 0,
        lastActivityDate: null,
        level: 1,
        totalXp: 0,
        avatarUri: undefined,
        accentColor: '#09090b',
      },
      history: [],
      restDays: [],
      dietLog: {},
      devLogs: [],
    });
    get().addDevLog('Factory Reset executado.');
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
        name: 'Giga Chad Pro',
        streak: 0,
        lastActivityDate: new Date().toISOString(),
        level: Math.floor(totalXp / 1000) + 1,
        totalXp: totalXp,
        avatarUri: undefined,
        accentColor: '#ea580c',
      },
      history,
      dietLog,
    });

    get().checkStreak();
    get().addDevLog(`Seed de ${daysToSimulate} dias aplicado.`);
  },
});
