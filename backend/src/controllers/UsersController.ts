import { Request, Response } from "express";
import { UsersServiceImpl } from "../services/impl/UsersServiceImpl.js";
import logger from "../common-lib/utils/logger.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";

export class UsersController  {

  private usersService: UsersServiceImpl;

  constructor() {
    this.usersService = new UsersServiceImpl();
  }

  async getAll(req: Request, res: Response, next: any) {
    try {
      const users = await this.usersService.getAllUsers();
      logger.debug("All users retrieved", { route: req.originalUrl, userId: req.user?.id, count: users.length });
      res.status(200).json(users);
    } catch (err) {
      logger.error("Error getting all users", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: any) {
    try {
      const userData = req.body;
      const newUser = await this.usersService.createUserWeb(userData);
      logger.info("User created successfully", { route: req.originalUrl, userId: newUser.id });
      res.status(201).json(newUser);
    } catch (err) {
      logger.error("Error creating user", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async createUserMobile(req: Request, res: Response, next: any) {
    try {
      const userData = req.body;
      const newUser = await this.usersService.createUserMobile(userData);
      logger.info("User created successfully", { route: req.originalUrl, userId: newUser.id });
      res.status(201).json(newUser);
    } catch (err) {
      logger.error("Error creating user", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getByCenterCultural(req: Request, res: Response, next:any) {
    try {
      const culturalcenter_id = req.user?.id_cultural_center;
      if (!culturalcenter_id && !req.user?.rights.includes(RoleEnum.ADMIN)) {
        logger.warn("User's cultural center ID missing", { route: req.originalUrl, userId: req.user?.id });
        throw new Error("Centre culturel de l'utilisateur introuvable");
      }
      if (culturalcenter_id) {
        const users = await this.usersService.getAllUsersByCulturalCenter(culturalcenter_id)
        logger.debug("Users retrieved by cultural center", { route: req.originalUrl, userId: req.user?.id, count: users.length });
        res.status(200).json(users)
      }
      if (req.user?.rights.includes(RoleEnum.ADMIN)) {
        const users = await this.usersService.getAllUsers();
        logger.debug("All users retrieved for admin", { route: req.originalUrl, userId: req.user?.id, count: users.length });
        res.status(200).json(users)
      }
    } catch (err) {
      logger.error("Error getting all users by cultural center", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err)
    }
  }

  async switchStatus(req: Request, res: Response, next:any) {
    try {
      logger.info("Switch users Status")
      const ids = req.body.ids
      const result = await this.usersService.switchUsersStatus(ids)
      if (!result) {
        logger.warn("Switch users status failed", { route: req.originalUrl, count: Array.isArray(ids) ? ids.length : 0 });
        return res.status(500).json({ message: "Impossible de changer le statut des utilisateurs" });
      }
      logger.info("Users status switched successfully", { route: req.originalUrl, count: Array.isArray(ids) ? ids.length : 0, userId: req.user?.id });
      return res.status(200).json({ success: true });
    } catch (err){
      logger.error("Error switching users status", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err)
    }
  }

  async getById(req: Request, res: Response, next: any) {
    try {
      const id = req.params.id;
      const user = req.user
      if (!user) {
        logger.warn("User missing in request for get user by id", { route: req.originalUrl });
        throw new Error("User not found in request");
      }
      const data = await this.usersService.getById(id, user)
      if (!data) {
        logger.warn(`User with id ${id} not found`, { route: req.originalUrl })
        res.status(404)
      }
      logger.info(`User with id ${id} retrieved succesfully`, { route: req.originalUrl })
      res.status(200).json(data)
    } catch (err) {
      logger.error("Error getting user by id", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }
};