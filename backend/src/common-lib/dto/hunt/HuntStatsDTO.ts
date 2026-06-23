export type HuntStatsScope = "admin" | "cultural_center_manager" | "hunt_manager";

export interface HuntStatsStepDTO {
  id: string;
  title: string;
  index: {
    index: number;
    name: string | null;
  };
  completionsCount: number;
}

export interface HuntStatsDTO {
  id: string;
  title: string;
  creator: {
    username: string;
  };
  culturalCenter: {
    name: string;
  };
  difficulty: {
    name: string;
  };
  participantsCount: number;
  completedAttemptsCount: number;
  completionRate: number;
  stepStats: HuntStatsStepDTO[];
}

export interface HuntDashboardStatsDTO {
  scope: HuntStatsScope;
  summary: {
    huntsCount: number;
    participantsCount: number;
    completedAttemptsCount: number;
    averageCompletionRate: number | null;
  };
  hunts: HuntStatsDTO[];
}