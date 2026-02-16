import { prisma } from "../config/prismaClient";
import { CreateHuntRequestDTO } from "../dto/hunt/CreateHuntRequestDTO";
import { EditHuntRequestDTO } from "../dto/hunt/EditHuntRequestDTO";
import { HuntEntity } from "../entity/HuntEntity";

export class HuntRepository {

  async create(huntData: CreateHuntRequestDTO): Promise<HuntEntity> {
    const huntRecord = await prisma.hunts.create({
      data: { ...huntData },
    });
    return new HuntEntity(huntRecord);
  }

  async getAll(): Promise<HuntEntity[]> {
    const hunts = await prisma.hunts.findMany();
    return hunts.map(h => new HuntEntity(h));
  }

  async getByID(id: string): Promise<HuntEntity | null> {
    const hunt = await prisma.hunts.findUnique({
      where: { id },
    });
    return hunt ? new HuntEntity(hunt) : null;
  }

  async edit(huntData: EditHuntRequestDTO): Promise<HuntEntity> {
    const huntRecord = await prisma.hunts.update({
      where: { id: huntData.id },
      data: { ...huntData },
    });
    return new HuntEntity(huntRecord);
  }
}
