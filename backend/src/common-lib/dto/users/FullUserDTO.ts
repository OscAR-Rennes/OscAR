export interface FullUserDTO {
    id: string
    username: string;
    firstname: string | null;
    lastname: string | null;
    points: number;
    email: string;
    age: number | null
    //rights: string[];
    //id_cultural_center?: string;
}