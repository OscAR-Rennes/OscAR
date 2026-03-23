import { apiClient } from "../apiClient";

export function saveProgress(data) {
    return apiClient('/progression/progress', {method: 'POST', body: data})
}

export function getTotalProgression() {
    return apiClient('/progression')
}

export function getProgressionByHunt(hunt_id) {
    return apiClient(`/progression/getByHunt/${hunt_id}`)
}