// types/active-workout.ts
export type SetStatus = 'idle' | 'working' | 'completed';

export interface ActiveSet {
  id: string;
  weight: string;
  reps: string;
  status: SetStatus;
  targetReps?: string;
  isExtra?: boolean;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
}

export interface ActiveExercise {
  id: string;
  exerciseId?: string;
  name: string;
  group: string;
  sets: ActiveSet[];
  isExtra?: boolean;
}
