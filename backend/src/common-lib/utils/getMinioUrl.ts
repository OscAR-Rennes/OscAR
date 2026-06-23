const MINIO_BASE_URL = process.env.MINIO_ENDPOINT?.replace(/\/$/, "");
const MINIO_BUCKET = "lootopia";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { minioClient } from "../config/minIo.js";
import { Readable } from "stream";

export function getMinioUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${MINIO_BASE_URL}/${MINIO_BUCKET}/${path}`;
}

export async function downloadFromMinio(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: "lootopia",
        Key: key,
    });
    const response = await minioClient.send(command);
    const stream = response.Body as Readable;

    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}