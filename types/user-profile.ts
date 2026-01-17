export type UserProfile = {
  name: string;
  streak: number;
  lastActivityDate: string | null;
  level: number;
  totalXp: number;
  avatarUri?: string;
  accentColor: string;
};
