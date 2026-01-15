export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
};

export type WorkoutSet = {
  weight: number;
  reps: number;
  completed: boolean;
  distance?: number;
  duration?: number;
};

export type ExerciseLog = {
  exerciseId: string;
  name: string;
  group: string;
  sets: WorkoutSet[];
};

export type WorkoutSession = {
  id: string;
  date: string;
  durationSeconds: number;
  exercises: ExerciseLog[];
  xpEarned: number;
};

export type UserProfile = {
  name: string;
  streak: number;
  lastActivityDate: string | null;
  level: number;
  totalXp: number;
};
