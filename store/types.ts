import { UserProfile } from '@/types/user-profile';
import { WorkoutSession } from '@/types/workout-session';

export interface UserSlice {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
  clearProfileOnly: () => void;
}

export interface WorkoutSlice {
  history: WorkoutSession[];
  restDays: string[];
  dietLog: Record<string, any>;

  addWorkout: (session: WorkoutSession) => void;
  toggleRestDay: (date: string) => void;
  checkStreak: () => void;
  clearHistoryOnly: () => void;
}

export interface DevSlice {
  devLogs: string[];
  addDevLog: (msg: string) => void;
  resetData: () => void;
  seedData: (daysToSimulate: number) => void;
}

export type AppState = UserSlice & WorkoutSlice & DevSlice;
