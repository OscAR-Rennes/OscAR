export interface FullStepDTO {
  id: string;
  title: string;
  description: string;
  points: number;
  latitude: number | null;
  longitude: number | null;
  hunt: {
    id: string;
    title: string;
    culturalCenter: {
      id: string;
      name: string;
    };
    creator: {
      id: string;
      username: string;
    };
  };
  index: {
    id: string;
    name: string | null;
    index: number;
  };
}