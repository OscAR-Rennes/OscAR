import { HuntStatsDto } from "./HuntStatsDto";

export interface HuntDashboardStatsDto {
  scope: "admin" | "cultural_center_manager" | "hunt_manager";
  summary: {
    huntsCount: number;
    participantsCount: number;
    completedAttemptsCount: number;
    averageCompletionTimeMs: number | null;
    averageStepDurationMs: number | null;
    averageCompletionRate: number | null;
  };
  hunts: HuntStatsDto[];
}
