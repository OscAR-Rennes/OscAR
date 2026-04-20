import { PutObjectCommand } from "@aws-sdk/client-s3";

import unzipper from "unzipper";
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

    async uploadObjectZip(file: Express.Multer.File): Promise<{ obj: string, mtl: string, jpg: string }> {
        const paths = { obj: '', mtl: '', jpg: '' };

        const directory = await unzipper.Open.buffer(file.buffer);

        for (const entry of directory.files) {
            const ext = path.extname(entry.path).toLowerCase();
            let folder = '';

            if (ext === '.obj') folder = 'AR/obj';
            else if (ext === '.mtl') folder = 'AR/mtl';
            else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') folder = 'AR/jpg';
            else continue;

            const buffer = await entry.buffer();
            const filename = path.basename(entry.path);
            const key = `${folder}/${Date.now()}_${filename}`;

            await minioClient.send(new PutObjectCommand({
                Bucket: MINIO_BUCKET,
                Key: key,
                Body: buffer,
                ContentType: this.getContentType(ext),
            }));

            if (ext === '.obj') paths.obj = key;
            else if (ext === '.mtl') paths.mtl = key;
            else paths.jpg = key;
        }

        return paths;
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