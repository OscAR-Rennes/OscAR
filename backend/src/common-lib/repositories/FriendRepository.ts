import { prisma } from "../config/prismaClient.js";

export class FriendRepository {

    async create(applicantId: string, recipientId: string) {
        return prisma.friends.create({
            data: {
                applicant_id: applicantId,
                recipient_id: recipientId,
                isPending: true,
                isRefused: false,
            }
        });
    }

    async findById(id: string) {
        return prisma.friends.findUnique({
            where: { id }
        });
    }

    async findExisting(applicantId: string, recipientId: string) {
        return prisma.friends.findFirst({
            where: {
                OR: [
                    { applicant_id: applicantId, recipient_id: recipientId },
                    { applicant_id: recipientId, recipient_id: applicantId },
                ]
            }
        });
    }

    async accept(id: string) {
        return prisma.friends.update({
            where: { id },
            data: {
                isPending: false,
                isRefused: false,
            }
        });
    }

    async refuse(id: string) {
        return prisma.friends.update({
            where: { id },
            data: {
                isPending: false,
                isRefused: true,
            }
        });
    }

    async getPendingRequests(userId: string) {
        return prisma.friends.findMany({
            where: {
                recipient_id: userId,
                isPending: true,
                isRefused: false,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        });
    }

    async getFriendLeaderboard(userId: string) {
        const friends = await prisma.friends.findMany({
            where: {
                OR: [
                    { applicant_id: userId },
                    { recipient_id: userId },
                ],
                isPending: false,
                isRefused: false,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        username: true,
                        picture_path: true,
                        points: true,
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        username: true,
                        picture_path: true,
                        points: true,
                    }
                }
            }
        });

        return friends
            .map((f: { applicant_id: string; recipient: any; applicant: any; }) => f.applicant_id === userId ? f.recipient : f.applicant)
            .sort((a: { points: any; }, b: { points: any; }) => (b.points ?? 0) - (a.points ?? 0));
    }
}