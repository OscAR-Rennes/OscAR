export type HuntStatsScope = "admin" | "cultural_center_manager" | "hunt_manager";

export interface HuntStatsStepDTO {
  id: string;
  title: string;
  index: {
    id: string;
    index: number;
    name: string | null;
  };
  averageDurationMs: number | null;
  completionsCount: number;
}

export interface HuntStatsDTO {
  id: string;
  title: string;
  creator: {
    id: string;
    username: string;
  };
  culturalCenter: {
    id: string;
    name: string;
  };
  difficulty: {
    id: string;
    name: string;
  };
  totalSteps: number;
  participantsCount: number;
  completedAttemptsCount: number;
  completionRate: number;
  averageCompletionTimeMs: number | null;
  averageStepDurationMs: number | null;
  stepStats: HuntStatsStepDTO[];
}

export interface HuntDashboardStatsDTO {
  scope: HuntStatsScope;
  summary: {
    huntsCount: number;
    participantsCount: number;
    completedAttemptsCount: number;
    averageCompletionTimeMs: number | null;
    averageStepDurationMs: number | null;
    averageCompletionRate: number | null;
  };
  hunts: HuntStatsDTO[];
}