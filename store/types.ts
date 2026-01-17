import { UserProfile } from '@/types/user-profile';
import { WorkoutSession } from '@/types/workout-session';
import { WorkoutTemplate } from '@/types/workout-template';

export interface UserSlice {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
  clearProfileOnly: () => void;
  setAccentColor: (color: string) => void;
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
export interface TemplateSlice {
  templates: WorkoutTemplate[];
  saveTemplate: (template: WorkoutTemplate) => void;
  deleteTemplate: (id: string) => void;
}
export type AppState = UserSlice & WorkoutSlice & DevSlice & TemplateSlice;
export { WorkoutTemplate };
