export interface HuntDetailsResponse {
    id: string;
    title?: string;
    points?: number;
    steps?: Array<{ id: string; title: string }> | number;
    culturalCenter?: {
        name?: string;
    };
};