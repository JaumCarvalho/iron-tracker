import { TemplateExercise } from './template-exercise';

export interface WorkoutTemplate {
  id: string;
  name: string;
  color?: string;
  lastUsed?: string;
  exercises: TemplateExercise[];
}
