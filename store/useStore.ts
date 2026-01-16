import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './types';

import { createUserSlice } from './slices/user-slice';
import { createWorkoutSlice } from './slices/workout-slice';
import { createDevSlice } from './slices/dev-slice';

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createWorkoutSlice(...a),
      ...createDevSlice(...a),
    }),
    {
      name: 'iron-streak-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        history: state.history,
        restDays: state.restDays,
        dietLog: state.dietLog,
      }),
    }
  )
);
