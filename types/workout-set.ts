export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;

  distance?: number;
  manualDuration?: number;
  duration?: number;
  startedAt?: string;
  completedAt?: string;
}
