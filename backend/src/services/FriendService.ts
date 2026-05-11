export interface FriendService {
    create(userId: string, recipientId: string): Promise<any>;
    acceptFriendRequest(friendRequestId: string, userId: string): Promise<any>;
    refuseFriendRequest(friendRequestId: string, userId: string): Promise<any>;
    getPendingRequests(userId: string): Promise<any[]>;
    getFriendLeaderboard(userId: string): Promise<any[]>;
}