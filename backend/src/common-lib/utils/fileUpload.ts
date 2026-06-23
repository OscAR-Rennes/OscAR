import { PutObjectCommand } from "@aws-sdk/client-s3";

import path from "path";
import { MINIO_BUCKET, minioClient } from "../config/minIo.js";
import { Multer } from 'multer';

export class FileUploadUtil {

    async uploadTarget(file: Express.Multer.File): Promise<string> {
        const ext = path.extname(file.originalname);
        const key = `AR/target/${Date.now()}${ext}`;

        await minioClient.send(new PutObjectCommand({
            Bucket: MINIO_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        return key;
    }

    async uploadObjectZip(file: Express.Multer.File): Promise<string> {
        const key = `AR/obj/${Date.now()}_${file.originalname}`;

        await minioClient.send(new PutObjectCommand({
            Bucket: MINIO_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: "application/zip",
        }));

        return key;
    }

    private getContentType(ext: string): string {
        switch (ext) {
            case '.obj': return 'text/plain';
            case '.mtl': return 'text/plain';
            case '.jpg':
            case '.jpeg': return 'image/jpeg';
            case '.png': return 'image/png';
            default: return 'application/octet-stream';
        }
    }
}