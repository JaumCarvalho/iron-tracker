import { StateCreator } from 'zustand';
import { AppState, UserSlice } from '../types';

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
  user: {
    name: 'Giga Chad',
    streak: 0,
    lastActivityDate: null,
    level: 1,
    totalXp: 0,
  },

  updateUser: (data) => {
    set((state) => ({
      user: { ...state.user, ...data },
    }));
  },

  clearProfileOnly: () => {
    set((state) => ({
      user: { ...state.user, level: 1, currentXp: 0, totalXp: 0, streak: 0 },
    }));
    get().addDevLog('Perfil/Stats resetados.');
  },
});
