# Iron Streak - Rastreador de Treinos

Um aplicativo mobile completo para rastreamento de treinos, análise de performance e gamificação de progresso fitness, construído com React Native e Expo.

## 🎯 Funcionalidades

### 📊 Dashboard Principal

- Visualização do perfil do usuário com nível e XP
- Sistema de streak (sequência de treinos)
- Resumo diário de treinos realizados
- Marcação de dias de descanso
- Progresso visual por nível
- Calendário semanal interativo

### 🏋️ Gerenciamento de Treinos

- **Rotinas/Templates**: Criar, editar e salvar templates de treinos
- **Treinos Ativos**: Interface completa para registrar séries, pesos e repetições
- **Suporte Cardio**: Campos específicos para distância e tempo em exercícios cardiovasculares
- **Cronômetro**: Timer integrado durante os treinos
- **Estados de Série**: Idle, Working, Completed, com suporte a séries extras
- **Histórico Completo**: Acesso a todos os treinos realizados com filtros avançados

### 📈 Análise e Estatísticas

- **Análise de Exercício**: Histórico detalhado por exercício com gráficos de evolução
- **Evolução de Carga**: Visualização da progressão máxima de peso/distância
- **Análise Cardio**: Resumo de atividades cardiovasculares por período
- **Distribuição Muscular**: Gráfico de séries por grupo muscular
- **Filtros Temporais**: Análises por 7 dias, 30 dias, 1 ano ou todos os períodos

### 👤 Perfil e Personalização

- Edição de nome e foto de perfil
- Tema de cor customizável (accent color)
- Toggle de modo escuro/claro
- Estatísticas consolidadas (treinos, descansos, XP total, streak)
- Exportação de dados em JSON

### 🎮 Sistema de Gamificação

- **Níveis**: Progressão baseada em XP (1000 XP por nível)
- **Streak System**:
  - 1 dia: "Fagulha" (cinza)
  - 7 dias: "Iniciante"
  - 30 dias: "Guerreiro"
  - 90 dias: "Titã"
  - 365 dias: "Lendário"
  - 730 dias: "Imortal"
  - 1095 dias: "Titã"
  - 1825 dias: "Giga Chad Pro Max"
- **XP por Série**: 15 XP por série completada
- **Rest Days**: Sistema de descanso com congelamento de streak

### 🛠️ Dev Tools (Desenvolvimento)

- Console de logs em tempo real
- Seed de dados (1 semana de histórico)
- Injeção de rest days
- Criação de cenários de teste
- Stress test (500 dias)
- Reset granular (perfil, histórico ou total)

## 🛠️ Stack Tecnológica

### Frontend Framework

- **React Native** 0.76+
- **Expo** 52+
- **Expo Router** - Navegação nativa

### UI & Styling

- **Nativewind** - Tailwind CSS para React Native
- **React Native Reusables** - Componentes reutilizáveis
- **Lucide React Native** - Ícones vetoriais
- **React Native SVG** - Gráficos e visualizações

### State Management

- **Zustand** - Gerenciamento de estado global
- **Zustand Persist** - Persistência com AsyncStorage

### Utilitários

- **Day.js** - Manipulação de datas (com locale pt-br)
- **React Native Reanimated** - Animações de performance
- **React Native Safe Area Context** - Suporte a notches e safe areas

### Armazenamento

- **AsyncStorage** - Persistência de dados local

## 📋 Estrutura do Projeto

```
iron-tracker/
├── app/                              # Rotas e screens (Expo Router)
│   ├── _layout.tsx                   # Layout raiz
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Layout com abas
│   │   ├── index.tsx                 # Dashboard
│   │   ├── history.tsx               # Histórico de treinos
│   │   └── workout.tsx               # Placeholder (navega para rotinas)
│   ├── workout/
│   │   ├── new.tsx                   # Treino ativo
│   │   ├── routines.tsx              # Gerenciamento de rotinas
│   │   └── editor.tsx                # Editor de templates
│   ├── analytics/
│   │   └── exercise-details.tsx      # Análise detalhada de exercício
│   └── profile/
│       └── index.tsx                 # Perfil e configurações
├── components/                       # Componentes reutilizáveis
│   ├── ui/                           # Componentes de UI base
│   ├── dashboard/                    # Componentes do dashboard
│   ├── features/                     # Componentes de funcionalidades
│   ├── workout/                      # Componentes de treino
│   └── profile/                      # Componentes de perfil
├── store/                            # Zustand store
│   ├── useStore.ts                   # Store principal
│   ├── types.ts                      # Tipos do store
│   └── slices/                       # Slices do store
│       ├── user-slice.ts
│       ├── workout-slice.ts
│       ├── dev-slice.ts
│       └── template-slice.ts
├── lib/                              # Utilitários e constantes
│   ├── constants.ts                  # Constantes (streak tiers, simulação)
│   ├── exercises.ts                  # Database de exercícios
│   ├── theme.ts                      # Tema da aplicação
│   └── utils.ts                      # Funções utilitárias
├── types/                            # Tipos TypeScript
│   ├── user-profile.ts
│   ├── active-workout.ts
│   ├── exercise-log.ts
│   └── ...
├── global.css                        # Estilos globais (Tailwind)
├── tailwind.config.js                # Configuração do Tailwind
├── nativewind.config.js              # Configuração do Nativewind
└── package.json
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`

### Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd iron-tracker

# Instale as dependências
npm install
# ou
yarn install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run start
# ou
yarn start
```

Isso abrirá o Expo Dev Server. Você pode:

- Pressionar `i` para abrir no simulador iOS (Mac only)
- Pressionar `a` para abrir no emulador Android
- Pressionar `w` para abrir no navegador (web)
- Escanear o QR code com o app [Expo Go](https://expo.dev/go) em um dispositivo físico

### Build e Deploy

#### iOS

```bash
eas build --platform ios
eas submit --platform ios
```

#### Android

```bash
eas build --platform android
eas submit --platform android
```

Mais informações em [EAS Documentation](https://docs.expo.dev/build/introduction/)

## 📱 Tipos Principais

### WorkoutSession

```typescript
{
  id: string
  date: string (ISO)
  durationSeconds: number
  xpEarned: number
  exercises: {
    exerciseId: string
    name: string
    group: MuscleGroup
    sets: {
      weight?: number
      reps?: number
      distance?: number
      manualDuration?: number
      completed: boolean
    }[]
  }[]
}
```

### UserProfile

```typescript
{
  name: string
  streak: number
  lastActivityDate: string | null
  level: number
  totalXp: number
  avatarUri?: string
  accentColor: string
}
```

### WorkoutTemplate

```typescript
{
  id: string
  name: string
  exercises: {
    name: string
    group: MuscleGroup
    sets: number
    reps: string
  }[]
  lastUsed?: string
}
```

## 🗄️ Banco de Exercícios

O aplicativo contém um database completo de exercícios organizados por grupos musculares:

- **Peito**: 7 exercícios
- **Costas**: 7 exercícios
- **Pernas**: 10 exercícios
- **Ombros**: 5 exercícios
- **Braços**: 7 exercícios
- **Abdômen**: 4 exercícios
- **Cardio**: 4 tipos
- **Outros**: Customizáveis

Veja [lib/exercises.ts](lib/exercises.ts) para a lista completa.

## 🎨 Personalização

### Temas de Cor

O aplicativo suporta 8 cores de accent personalizáveis, cada uma com um ícone e tier associado.

### Modo Escuro

Toggle automático baseado no tema do sistema, com suporte manual.

## 💾 Persistência de Dados

Os seguintes dados são persistidos localmente com AsyncStorage:

- Perfil do usuário (name, level, XP, streak, etc.)
- Histórico de treinos
- Dias de descanso
- Templates de rotinas
- Diet log (estrutura preparada para expansão futura)

## 🔒 Segurança

- Dados armazenados localmente, sem sincronização com servidor
- Exportação manual em JSON para backup
- Função de reset total disponível

## 📈 Performance

- Lazy loading de histórico com paginação (15 itens por página)
- Memoização de componentes
- Otimização de renders com useMemo e useCallback
- FlatList otimizado para listas grandes
- Renderização condicional inteligente

## 🐛 Dev Tools

Acesse o console de desenvolvimento pressionando o botão flutuante no dashboard:

- **Ferramentas**: Seed de dados, injeção de rest days, stress test
- **Logs**: Visualização de eventos do sistema
- **Reset**: Opções granulares de reset de dados

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Nativewind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📄 Licença

MIT

---

**Built with ❤️ using React Native, Expo, and Nativewind**
