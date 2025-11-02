export interface MacroGoal {
  id: string;
  name: string;
  description?: string;
  type: "percentage" | "hours";
  totalHours?: number;
  icon?: string;
}

export interface MicroGoal {
  id: string;
  macroGoalId: string;
  name: string;
  completion: number;
  hours: number;
}

export interface ProgressEntry {
  id: string;
  goalId: string;
  date: string;
  value: number;
  type: "macro" | "micro";
}

export interface Milestone {
  id: string;
  goalId: string;
  name: string;
  targetValue: number;
  achievedDate?: string;
  icon: string;
}

export interface Streak {
  goalId: string;
  currentStreak: number;
  longestStreak: number;
  lastUpdated: string;
}
