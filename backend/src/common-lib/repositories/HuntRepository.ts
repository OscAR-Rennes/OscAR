import { hunts } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { CreateHuntRequestDTO } from "../dto/hunt/CreateHuntRequestDTO.js";
import { EditHuntRequestDTO } from "../dto/hunt/EditHuntRequestDTO.js";

export class HuntRepository {

  async create(huntData: CreateHuntRequestDTO): Promise<hunts> {
    const huntRecord = await prisma.hunts.create({
      data: { ...huntData },
    });
    return huntRecord;
  }

  async getAll(): Promise<hunts[]> {
    const hunts = await prisma.hunts.findMany();
    return hunts;
  }

  async getByID(id: string): Promise<hunts | null> {
    const hunt = await prisma.hunts.findUnique({
      where: { id },
    });
    return hunt;
  }

  async edit(huntData: EditHuntRequestDTO): Promise<hunts> {
    const huntRecord = await prisma.hunts.update({
      where: { id: huntData.id },
      data: { ...huntData },
    });
    return huntRecord;
  }
}
