import { WorkoutSet } from './workout-set';

export type ExerciseLog = {
  exerciseId: string;
  name: string;
  group: string;
  sets: WorkoutSet[];
};
