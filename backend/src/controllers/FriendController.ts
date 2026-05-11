import { Request, Response } from "express";
import logger from "../common-lib/utils/logger.js";
import { FriendServiceImpl } from "../services/impl/FriendServiceImpl.js";

export class FriendController {

    private friendService: FriendServiceImpl;

    constructor() {
        this.friendService = new FriendServiceImpl();
    }

    async create(req: Request, res: Response, next: any) {
        try {
            const userId = (req as any).user.id;
            const { recipient_id } = req.body;
            const result = await this.friendService.create(userId, recipient_id);
            logger.debug("Friend request sent", { route: req.originalUrl, userId, recipient_id });
            res.status(201).json(result);
        } catch (err) {
            logger.error("Error while sending friend request", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }

    async acceptFriendRequest(req: Request, res: Response, next: any) {
        try {
            const userId = (req as any).user.id;
            const { id } = req.params;
            const result = await this.friendService.acceptFriendRequest(id, userId);
            logger.debug("Friend request accepted", { route: req.originalUrl, userId, friendId: id });
            res.status(200).json(result);
        } catch (err) {
            logger.error("Error while accepting friend request", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }

    async refuseFriendRequest(req: Request, res: Response, next: any) {
        try {
            const userId = (req as any).user.id;
            const { id } = req.params;
            const result = await this.friendService.refuseFriendRequest(id, userId);
            logger.debug("Friend request refused", { route: req.originalUrl, userId, friendId: id });
            res.status(200).json(result);
        } catch (err) {
            logger.error("Error while refusing friend request", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }

    async getPendingRequests(req: Request, res: Response, next: any) {
        try {
            const userId = (req as any).user.id;
            const result = await this.friendService.getPendingRequests(userId);
            logger.debug("Pending friend requests retrieved", { route: req.originalUrl, userId, count: result.length });
            res.status(200).json(result);
        } catch (err) {
            logger.error("Error while getting pending friend requests", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }

    async getFriendLeaderboard(req: Request, res: Response, next: any) {
        try {
            const userId = (req as any).user.id;
            const result = await this.friendService.getFriendLeaderboard(userId);
            logger.debug("Friend leaderboard retrieved", { route: req.originalUrl, userId, count: result.length });
            res.status(200).json(result);
        } catch (err) {
            logger.error("Error while getting friend leaderboard", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }
}