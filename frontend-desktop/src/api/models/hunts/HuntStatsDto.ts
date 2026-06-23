export interface HuntStepStatsDto {
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

export interface HuntStatsDto {
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
  stepStats: HuntStepStatsDto[];
}
