import { StateCreator } from 'zustand';
import { AppState, TemplateSlice, WorkoutTemplate } from '../types';

export const createTemplateSlice: StateCreator<AppState, [], [], TemplateSlice> = (set) => ({
  templates: [],

  saveTemplate: (template: WorkoutTemplate) => {
    set((state) => {
      const index = state.templates.findIndex((t) => t.id === template.id);
      let newTemplates;

      if (index >= 0) {
        newTemplates = [...state.templates];
        newTemplates[index] = template;
      } else {
        newTemplates = [...state.templates, template];
      }

      return { templates: newTemplates };
    });
  },

  deleteTemplate: (id: string) => {
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    }));
  },
});
