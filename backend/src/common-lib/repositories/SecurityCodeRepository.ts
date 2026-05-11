import { prisma } from "../config/prismaClient.js";

export class SecurityCodeRepository {
  async deleteByUserId(userId: string) {
    await prisma.security_code.deleteMany({
      where: { user_id: userId },
    });
  }

  async createCode(userId: string, code: number, validityPeriod: Date) {
    return prisma.security_code.create({
      data: {
        user_id: userId,
        code,
        validity_period: validityPeriod,
      },
    });
  }

  async findValidCode(userId: string, code: number) {
    return prisma.security_code.findFirst({
      where: {
        user_id: userId,
        code,
        validity_period: {
          gt: new Date(),
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}