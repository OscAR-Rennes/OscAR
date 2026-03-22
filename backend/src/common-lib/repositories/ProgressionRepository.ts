import { progression } from "@prisma/client";
import { prisma } from "../config/prismaClient.js";
import { AddProgressionRequestDTO } from "../dto/progression/AddProgressionRequestDTO.js";

export class ProgressionRepository {

    async saveProgression(data:AddProgressionRequestDTO, user_id:string) {
        await prisma.progression.create({
            data: {
                hunt_id: data.hunt_id,
                step_id: data.step_id,
                user_id: user_id
            },
        });
    }

    async findProgression(user_id: string, step_id: string) {
        return await prisma.progression.findFirst({
            where: { user_id, step_id }
        });
    }

    async getStepPoints(step_id: string) {
        return await prisma.steps.findUnique({
            where: { id: step_id },
            select: { points: true }
        });
    }

    async getTotalProgression(user_id: string) {
        const progressions = await prisma.progression.findMany({
            where: { user_id },
            select: {
                hunt_id: true,
                step_id: true,
            }
        });

        const huntIds = [...new Set(progressions.map(p => p.hunt_id))];

        const hunts = await prisma.hunts.findMany({
            where: { id: { in: huntIds } },
            include: {
                steps: {
                    include: {
                        index: true
                    }
                }
            }
        });

        return { progressions, hunts };
    }

    async getProgressionByHunt(user_id: string, hunt_id: string) {
        const progressions = await prisma.progression.findMany({
            where: { user_id, hunt_id },
            select: {
                hunt_id: true,
                step_id: true,
            }
        });

        const hunt = await prisma.hunts.findUnique({
            where: { id: hunt_id },
            include: {
                steps: {
                    include: { index: true }
                }
            }
        });

        return { progressions, hunt };
    }

}