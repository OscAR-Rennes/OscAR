import { FriendService } from "../FriendService.js";
import { AppError } from "../../common-lib/errors/AppError.js";
import { FriendRepository } from "../../common-lib/repositories/FriendRepository.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { LeaderboardUserDTO } from "../../common-lib/dto/users/LeaderboardUserDTO.js";

const friendRepository = new FriendRepository();
const userRepository = new UserRepository();
    
export class FriendServiceImpl implements FriendService {

    async create(userId: string, recipientUsername: string): Promise<any> {
        try {
            const recipient = await userRepository.findByUsername(recipientUsername);
            if (!recipient) {
                throw new AppError({
                    userMessage: "User not found",
                    statusCode: 404,
                });
            }

            if (recipient.id === userId) {
                throw new AppError({
                    userMessage: "You cannot add yourself as a friend",
                    statusCode: 400,
                });
            }

            const existing = await friendRepository.findExisting(userId, recipient.id);
            if (existing) {
                throw new AppError({
                    userMessage: "A friend request already exists",
                    statusCode: 409,
                });
            }

            return friendRepository.create(userId, recipient.id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError({ userMessage: "Error creating friend request", statusCode: 500 });
        }
    }

    async acceptFriendRequest(friendRequestId: string, userId: string): Promise<any> {
        try {
            const request = await friendRepository.findById(friendRequestId);

            if (!request) {
                throw new AppError({ userMessage: "Friend request not found", statusCode: 404 });
            }

            if (request.recipient_id !== userId) {
                throw new AppError({ userMessage: "You are not authorized to accept this request", statusCode: 403 });
            }

            if (!request.isPending) {
                throw new AppError({ userMessage: "This request has already been processed", statusCode: 400 });
            }

            return friendRepository.accept(friendRequestId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError({ userMessage: "Error accepting friend request", statusCode: 500 });
        }
    }

    async refuseFriendRequest(friendRequestId: string, userId: string): Promise<any> {
        try {
            const request = await friendRepository.findById(friendRequestId);

            if (!request) {
                throw new AppError({ userMessage: "Friend request not found", statusCode: 404 });
            }

            if (request.recipient_id !== userId) {
                throw new AppError({ userMessage: "You are not authorized to refuse this request", statusCode: 403 });
            }

            if (!request.isPending) {
                throw new AppError({ userMessage: "This request has already been processed", statusCode: 400 });
            }

            return friendRepository.refuse(friendRequestId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError({ userMessage: "Error refusing friend request", statusCode: 500 });
        }
    }

    async getPendingRequests(userId: string): Promise<any[]> {
        try {
            return friendRepository.getPendingRequests(userId);
        } catch (error) {
            throw new AppError({ userMessage: "Error getting pending requests", statusCode: 500 });
        }
    }

    async getFriendLeaderboard(userId: string): Promise<LeaderboardUserDTO[]> {
    try {
        const friends = await friendRepository.getFriendLeaderboard(userId);

        if (friends.length === 0) return [];

        const currentUser = await userRepository.findById(userId);

        const leaderboard = [
            ...friends.map((user: any) => ({
                id: user.id,
                username: user.username,
                points: user.points,
            })),
            {
                id: currentUser?.id,
                username: currentUser?.username,
                points: currentUser?.points,
            }
        ];

        return leaderboard.sort((a, b) => b.points - a.points);

    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError({ userMessage: "Error getting friend leaderboard", statusCode: 500 });
    }
}
}