export interface DashboardsService {
  getDashboardByHunt(huntId: string): Promise<any[]>;
  getDashboardByCulturalCenter(culturalCenterId: string): Promise<any[]>;
}