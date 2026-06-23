import { prisma } from "../config/prismaClient.js";
import { difficulty } from "@prisma/client";

export class DifficultyRepository {

  async getAll(): Promise<difficulty[]> {
    const difficulties = await prisma.difficulty.findMany();
    return difficulties;
  }
}
