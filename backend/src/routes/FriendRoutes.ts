import { Router } from "express";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";
import { requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { FriendController } from "../controllers/FriendController.js";

const friendRoutes = Router();

const friendController = new FriendController();

friendRoutes.post(
    "/friends",
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.HUNT_MANAGER]),
    (req, res, next) => friendController.create(req, res, next)
)

friendRoutes.patch(
    "/friends/refuse/:id",
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.HUNT_MANAGER]),
    (req, res, next) => friendController.refuseFriendRequest(req, res, next)
)

friendRoutes.patch(
    "/friends/accept/:id",
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.HUNT_MANAGER]),
    (req, res, next) => friendController.acceptFriendRequest(req, res, next)
)

friendRoutes.get(
    "/friends",
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.HUNT_MANAGER]),
    (req, res, next) => friendController.getPendingRequests(req, res, next)
)

friendRoutes.get(
    "/friends/leaderboard",
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.HUNT_MANAGER]),
    (req, res, next) => friendController.getFriendLeaderboard(req, res, next)
)

export default friendRoutes;