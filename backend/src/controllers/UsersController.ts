import { Request, Response } from "express";
import { UsersServiceImpl } from "../services/impl/UsersServiceImpl.js";

export class UsersController  {

  private usersService: UsersServiceImpl;

  constructor() {
    this.usersService = new UsersServiceImpl();
  }

  async getAll(req: Request, res: Response, next: any) {
    try {
      console.log("Getting all users");
      const users = await this.usersService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: any) {
    try {
      console.log("Creating user");
      const userData = req.body;
      const newUser = await this.usersService.createUserWeb(userData);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  async getByCenterCultural(req: Request, res: Response, next:any) {
    try {
      console.log("Getting all user by cultural center")
      const { culturalcenter_id } =  req.params
      const users = await this.usersService.getAllUsersByCulturalCenter(culturalcenter_id)
      res.status(201).json(users)
    } catch (err) {
      next(err)
    }
  }

  async switchStatus(req: Request, res: Response, next:any) {
    try {
      console.log("Switch users Status")
      const ids = req.body.ids
      const result = await this.usersService.switchUsersStatus(ids)
       if (!result) {
          return res.status(500).json({ message: "Impossible de changer le statut des utilisateurs" });
        }
        return res.status(200).json({ success: true });
    } catch (err){
      next(err)
    }
  }
};