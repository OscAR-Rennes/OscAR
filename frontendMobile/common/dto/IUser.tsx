export interface FullUserDTO {
    id: string
    username: string;
    firstname: string | null;
    lastname: string | null;
    points: number;
    email: string;
    age: number | null
}