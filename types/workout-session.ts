import { ExerciseLog } from './exercise-log';

export type WorkoutSession = {
  id: string;
  date: string;
  durationSeconds: number;
  exercises: ExerciseLog[];
  xpEarned: number;
};
