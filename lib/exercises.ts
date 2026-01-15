// lib/exercises.ts

export type MuscleGroup =
  | 'Peito'
  | 'Costas'
  | 'Pernas'
  | 'Ombros'
  | 'Braços'
  | 'Abdômen'
  | 'Cardio'
  | 'Outros';

export const EXERCISE_DATABASE: Record<MuscleGroup, string[]> = {
  Peito: [
    'Supino Reto (Barra)',
    'Supino Inclinado (Halteres)',
    'Supino Declinado',
    'Crucifixo',
    'Flexão de Braço',
    'Crossover (Polia)',
    'Voador (Peck Deck)',
  ],
  Costas: [
    'Levantamento Terra',
    'Barra Fixa',
    'Puxada Alta',
    'Remada Curvada',
    'Remada Sentada',
    'Serrote (Unilateral)',
    'Pull-down',
  ],
  Pernas: [
    'Agachamento Livre',
    'Leg Press 45º',
    'Cadeira Extensora',
    'Mesa Flexora',
    'Stiff',
    'Afundo / Passada',
    'Elevação Pélvica',
    'Panturrilha em Pé',
  ],
  Ombros: [
    'Desenvolvimento Militar',
    'Elevação Lateral',
    'Elevação Frontal',
    'Crucifixo Inverso',
    'Encolhimento',
  ],
  Braços: [
    'Rosca Direta',
    'Rosca Martelo',
    'Rosca Scott',
    'Tríceps Testa',
    'Tríceps Corda',
    'Tríceps Francês',
    'Mergulho',
  ],
  Abdômen: ['Abdominal Supra', 'Prancha Isométrica', 'Elevação de Pernas', 'Abdominal Infra'],
  Cardio: ['Esteira', 'Bicicleta', 'Elíptico', 'Pular Corda'],
  Outros: [],
};
