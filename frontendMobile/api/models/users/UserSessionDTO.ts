export interface UserSessionDTO {
    id: string,
    username: string,
    rights: string[],
    id_cultural_center: string | null,
}