import multer from "multer";

export const uploadStepFiles = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, 
}).fields([
    { name: 'image_file', maxCount: 1 },
    { name: 'model_file', maxCount: 1 },
]);