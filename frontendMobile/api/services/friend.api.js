import { apiClient } from "../apiClient";

export async function sendFriendRequest(recipientId) {
    return apiClient("/friends", {
        method: "POST",
        body: { recipient_id: recipientId },
    });
}

export async function acceptFriendRequest(friendRequestId) {
    return apiClient(`/friends/accept/${friendRequestId}`, {
        method: "PATCH",
    });
}

export async function refuseFriendRequest(friendRequestId) {
    return apiClient(`/friends/refuse/${friendRequestId}`, {
        method: "PATCH",
    });
}

export async function getPendingRequests() {
    return apiClient("/friends", {
        method: "GET",
    });
}

export async function getFriendLeaderboard() {
    return apiClient("/friends/leaderboard", {
        method: "GET",
    });
}