# 🏋️ Iron Tracker - Rastreador de Treinos

<p align="center">
  <img src="assets/images/icon.png" alt="Iron Tracker Logo" width="120" height="120" />
</p>

<p align="center">
  Um aplicativo mobile completo para rastreamento de treinos, análise de performance e gamificação de progresso fitness, construído com React Native e Expo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.76+-61DAFB?style=flat-square&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-52+-000020?style=flat-square&logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-NativeWind-38B2AC?style=flat-square&logo=tailwindcss" alt="NativeWind" />
</p>

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar](#-como-rodar)
- [Tipos Principais](#-tipos-principais)
- [Banco de Exercícios](#-banco-de-exercícios)
- [Personalização](#-personalização)
- [Persistência de Dados](#-persistência-de-dados)
- [Performance](#-performance)
- [Dev Tools](#-dev-tools)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Funcionalidades

### 📊 Dashboard Principal

| Funcionalidade         | Descrição                                        |
| ---------------------- | ------------------------------------------------ |
| **Perfil do Usuário**  | Visualização de nível, XP e avatar personalizado |
| **Sistema de Streak**  | Sequência de dias consecutivos de treino         |
| **Resumo Diário**      | Treinos realizados no dia selecionado            |
| **Dias de Descanso**   | Marcação de rest days (preserva streak)          |
| **Calendário Semanal** | Navegação interativa entre dias                  |
| **Barra de Progresso** | Visualização do XP para próximo nível            |

### 🏋️ Gerenciamento de Treinos

- **Rotinas/Templates**: Criar, editar e salvar templates de treinos reutilizáveis
- **Treinos Ativos**: Interface completa para registrar séries, pesos e repetições
- **Suporte Cardio**: Campos específicos para distância (km) e tempo (min)
- **Cronômetro Integrado**: Timer automático durante os treinos
- **Estados de Série**:
  - `idle` - Aguardando início
  - `working` - Em execução
  - `completed` - Finalizada
- **Séries Extras**: Adicione séries além do planejado (destacadas em azul)
- **Histórico Completo**: Filtros por período, grupo muscular e busca textual

### 📈 Análise e Estatísticas

```
┌─────────────────────────────────────────┐
│  📊 Distribuição Muscular (Donut Chart) │
│  📈 Evolução de Carga (Line Chart)      │
│  🏃 Análise de Cardio                   │
│  🔍 Detalhes por Exercício              │
└─────────────────────────────────────────┘
```

- **Análise de Exercício**: Histórico detalhado com gráficos de evolução
- **Evolução de Carga**: Progressão máxima de peso ao longo do tempo
- **Análise Cardio**: Distância total, tempo e sessões por atividade
- **Distribuição Muscular**: Gráfico de séries por grupo muscular
- **Filtros Temporais**: 7 dias, 30 dias, 1 ano ou todos os períodos

### 👤 Perfil e Personalização

- ✏️ Edição de nome e foto de perfil
- 🎨 8 cores de tema personalizáveis
- 🌙 Toggle de modo escuro/claro
- 📊 Estatísticas consolidadas
- 📤 Exportação de dados em JSON

### 🎮 Sistema de Gamificação

#### Níveis

- **Progressão**: 1000 XP por nível
- **XP por Série**: 15 XP por série completada

#### Sistema de Streak (Tiers)

| Dias | Tier              | Cor       | Ícone |
| ---- | ----------------- | --------- | ----- |
| 0    | Fagulha           | Cinza     | 🔥    |
| 7    | Iniciante         | Laranja   | 🔥    |
| 30   | Guerreiro         | Vermelho  | 🔥    |
| 90   | Campeão           | Roxo      | ⭐    |
| 180  | Elite             | Azul      | ⭐    |
| 365  | Lendário          | Amarelo   | 👑    |
| 730  | Imortal           | Ciano     | 👑    |
| 1095 | Titã              | Rosa      | 👑    |
| 1825 | GIGA CHAD PRO MAX | Esmeralda | 👑    |

> **Rest Days**: Marcar um dia como descanso preserva o streak!

---

## 🛠️ Stack Tecnológica

### Core Framework

```
React Native 0.76+  ──►  Expo 52+  ──►  Expo Router
```

### UI & Styling

| Tecnologia                  | Uso                                   |
| --------------------------- | ------------------------------------- |
| **NativeWind**              | Tailwind CSS para React Native        |
| **React Native Reusables**  | Componentes de UI reutilizáveis       |
| **Lucide React Native**     | Biblioteca de ícones vetoriais        |
| **React Native SVG**        | Gráficos e visualizações customizadas |
| **React Native Reanimated** | Animações de alta performance         |

### State Management

```typescript
Zustand + Persist (AsyncStorage)
├── user-slice      // Perfil, XP, streak
├── workout-slice   // Histórico, rest days
├── template-slice  // Rotinas salvas
└── dev-slice       // Logs e ferramentas de dev
```

### Utilitários

- **Day.js** - Manipulação de datas (locale pt-br)
- **Expo Image Picker** - Seleção de avatar
- **Expo Clipboard** - Exportação de dados

---

## 📂 Estrutura do Projeto

```
iron-tracker/
├── 📁 app/                           # Rotas (Expo Router)
│   ├── _layout.tsx                   # Layout raiz + tema
│   ├── 📁 (tabs)/                    # Tab Navigator
│   │   ├── _layout.tsx               # Config das tabs
│   │   ├── index.tsx                 # Dashboard
│   │   ├── history.tsx               # Histórico
│   │   └── workout.tsx               # Placeholder
│   ├── 📁 workout/
│   │   ├── new.tsx                   # Treino ativo
│   │   ├── routines.tsx              # Lista de rotinas
│   │   └── editor.tsx                # Editor de templates
│   ├── 📁 analytics/
│   │   └── exercise-details.tsx      # Análise de exercício
│   └── 📁 profile/
│       └── index.tsx                 # Perfil e ajustes
│
├── 📁 components/
│   ├── 📁 ui/                        # Componentes base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── text.tsx
│   ├── 📁 dashboard/
│   │   ├── dashboard-components.tsx
│   │   └── useDashboard.ts
│   ├── 📁 features/
│   │   ├── user-header.tsx
│   │   ├── exercise-selector.tsx
│   │   ├── muscle-distribution.tsx
│   │   ├── cardio-analysis.tsx
│   │   ├── workout-history-item.tsx
│   │   ├── theme-toggle.tsx
│   │   └── dev-floating-menu.tsx
│   ├── 📁 workout/
│   │   ├── active-workout-components.tsx
│   │   ├── workout-timer.tsx
│   │   └── useActiveWorkout.ts
│   └── 📁 profile/
│       ├── profile-components.tsx
│       └── useProfile.ts
│
├── 📁 store/
│   ├── useStore.ts                   # Store principal
│   ├── types.ts                      # Tipos do store
│   └── 📁 slices/
│       ├── user-slice.ts
│       ├── workout-slice.ts
│       ├── template-slice.ts
│       └── dev-slice.ts
│
├── 📁 lib/
│   ├── constants.ts                  # STREAK_TIERS, etc.
│   ├── exercises.ts                  # Database de exercícios
│   ├── theme.ts                      # NAV_THEME
│   └── utils.ts                      # cn() helper
│
├── 📁 types/
│   ├── user-profile.ts
│   ├── workout-session.ts
│   ├── workout-template.ts
│   ├── template-exercise.ts
│   ├── active-workout.ts
│   └── exercise-log.ts
│
├── 📁 assets/images/
├── global.css                        # Tailwind base styles
├── tailwind.config.js
├── metro.config.js                   # NativeWind config
└── package.json
```

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- (Opcional) Android Studio / Xcode para emuladores

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/iron-tracker.git
cd iron-tracker

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run start
```

### Comandos Disponíveis

| Comando           | Descrição                |
| ----------------- | ------------------------ |
| `npm run start`   | Inicia o Expo Dev Server |
| `npm run android` | Abre no emulador Android |
| `npm run ios`     | Abre no simulador iOS    |
| `npm run web`     | Abre no navegador        |
| `npm run lint`    | Executa o linter         |

### Build de Produção

```bash
# iOS
eas build --platform ios
eas submit --platform ios

# Android
eas build --platform android
eas submit --platform android
```

---

## 📱 Tipos Principais

### WorkoutSession

```typescript
interface WorkoutSession {
  id: string;
  date: string; // ISO 8601
  durationSeconds: number;
  xpEarned: number;
  exercises: {
    exerciseId: string;
    name: string;
    group: MuscleGroup;
    sets: {
      weight?: number; // kg (musculação)
      reps?: number; // repetições
      distance?: number; // km (cardio)
      manualDuration?: number; // minutos (cardio)
      duration?: number; // segundos (automático)
      completed: boolean;
      startedAt?: string;
      completedAt?: string;
    }[];
  }[];
}
```

### UserProfile

```typescript
interface UserProfile {
  name: string;
  streak: number;
  lastActivityDate: string | null;
  level: number;
  totalXp: number;
  avatarUri?: string;
  accentColor: string; // Hex color
}
```

### WorkoutTemplate

```typescript
interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    name: string;
    group: MuscleGroup;
    sets: number;
    reps: string; // "8-12" ou "10"
  }[];
  lastUsed?: string;
}
```

---

## 🗄️ Banco de Exercícios

O app possui um database completo em [lib/exercises.ts](lib/exercises.ts):

| Grupo       | Exercícios | Exemplos                          |
| ----------- | ---------- | --------------------------------- |
| **Peito**   | 7          | Supino Reto, Crucifixo, Crossover |
| **Costas**  | 7          | Puxada Alta, Remada, Barra Fixa   |
| **Pernas**  | 10         | Agachamento, Leg Press, Stiff     |
| **Ombros**  | 5          | Desenvolvimento, Elevação Lateral |
| **Braços**  | 7          | Rosca Direta, Tríceps Corda       |
| **Abdômen** | 4          | Prancha, Abdominal Supra          |
| **Cardio**  | 4          | Esteira, Bicicleta, Elíptico      |
| **Outros**  | ∞          | Exercícios customizados           |

> 💡 **Dica**: Ao pesquisar um exercício que não existe, você pode criá-lo na hora!

---

## 🎨 Personalização

### Temas de Cor

8 cores de accent disponíveis, cada uma com identidade visual única:

```
⚫ #09090b  (Padrão)
🔴 #ef4444  (Vermelho)
🟠 #f97316  (Laranja)
🟡 #eab308  (Amarelo)
🟢 #22c55e  (Verde)
🔵 #3b82f6  (Azul)
🟣 #8b5cf6  (Roxo)
⚪ #a1a1aa  (Cinza)
```

### Modo Escuro

- Toggle manual disponível no perfil e dashboard
- Suporte completo a cores dinâmicas
- Ícones e componentes adaptáveis

---

## 💾 Persistência de Dados

Dados persistidos localmente com **AsyncStorage**:

```typescript
{
  user: UserProfile,
  history: WorkoutSession[],
  restDays: string[],              // "YYYY-MM-DD"
  templates: WorkoutTemplate[],
  dietLog: Record<string, any>,    // Preparado para expansão
}
```

### Backup e Exportação

- 📋 Copiar dados como JSON para clipboard
- 📁 Exportação de arquivo (em desenvolvimento)

---

## 📈 Performance

| Otimização       | Implementação                            |
| ---------------- | ---------------------------------------- |
| **Lazy Loading** | Paginação de histórico (15 items/página) |
| **Memoização**   | `memo()`, `useMemo()`, `useCallback()`   |
| **FlatList**     | Virtualização para listas grandes        |
| **Animações**    | React Native Reanimated (thread nativa)  |
| **Renderização** | Condicional e otimizada                  |

---

## 🛠️ Dev Tools

Acesse o console flutuante no Dashboard (botão 🔧):

### Ferramentas

| Ação                | Descrição                              |
| ------------------- | -------------------------------------- |
| **Seed 1 Semana**   | Popula histórico com 7 dias de treinos |
| **Criar Buraco**    | Remove treino de ontem (testa streak)  |
| **Toggle Descanso** | Marca/desmarca rest day                |
| **Stress Test**     | Gera 500 dias de histórico             |
| **Reset Granular**  | Limpa histórico, perfil ou tudo        |

### Console de Logs

Visualização em tempo real de eventos do sistema:

- Treinos registrados
- Alterações de streak
- Seeds aplicados
- Erros e warnings

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
- **Código**: ESLint + Prettier
- **Componentes**: Functional components + hooks

---

## 📚 Recursos

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Reusables](https://rnr-docs.vercel.app/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/icons/)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  <strong>Built with ❤️ using React Native, Expo, and NativeWind</strong>
</p>

<p align="center">
  <a href="#-iron-tracker---rastreador-de-treinos">⬆️ Voltar ao topo</a>
</p>
