/*
  Warnings:

  - A unique constraint covering the columns `[title,cultural_center_id]` on the table `hunts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,hunt_id]` on the table `index` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,index_id]` on the table `steps` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "step_ar" ADD COLUMN     "file_path_jpg" VARCHAR,
ADD COLUMN     "file_path_mtl" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "hunts_title_cultural_center_id_key" ON "hunts"("title", "cultural_center_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_name_hunt_id_key" ON "index"("name", "hunt_id");

-- CreateIndex
CREATE UNIQUE INDEX "steps_title_index_id_key" ON "steps"("title", "index_id");
