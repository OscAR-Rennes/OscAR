-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "zip" VARCHAR,
    "city" VARCHAR,
    "longitude" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "street" VARCHAR,
    "street_number" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultural_centers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "address_id" UUID NOT NULL,
    "picture_path" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cultural_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difficulty" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "multiplicator" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "difficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hunts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty_id" UUID NOT NULL,
    "isactive" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "picture_path" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" UUID NOT NULL,
    "cultural_center_id" UUID NOT NULL,

    CONSTRAINT "hunts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hunts_period" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "beginning" DATE NOT NULL,
    "ending" DATE NOT NULL,
    "hunt_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hunts_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "index" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "index" INTEGER NOT NULL,
    "hunt_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "index_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hunt_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progression" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "hunt_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "right_user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "right_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "right_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rights" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_code" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "validity_period" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_ar" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "step_id" UUID NOT NULL,
    "file_path_object" VARCHAR NOT NULL,
    "file_path_target" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "step_ar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "hunt_id" UUID NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "index_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR NOT NULL,
    "firstname" VARCHAR,
    "lastname" VARCHAR,
    "password" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "age" INTEGER,
    "id_cultural_center" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isSecure" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "picture_path" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cultural_centers_name_key" ON "cultural_centers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "difficulty_name_key" ON "difficulty"("name");

-- CreateIndex
CREATE INDEX "idx_right_user_right_id" ON "right_user"("right_id");

-- CreateIndex
CREATE INDEX "idx_right_user_user_id" ON "right_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_right_user_unique" ON "right_user"("user_id", "right_id");

-- CreateIndex
CREATE UNIQUE INDEX "rights_name_key" ON "rights"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "cultural_centers" ADD CONSTRAINT "fk_cultural_centers_address" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hunts" ADD CONSTRAINT "constraint_1" FOREIGN KEY ("cultural_center_id") REFERENCES "cultural_centers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hunts" ADD CONSTRAINT "fk_hunts_creator" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hunts" ADD CONSTRAINT "fk_hunts_difficulty" FOREIGN KEY ("difficulty_id") REFERENCES "difficulty"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hunts_period" ADD CONSTRAINT "fk_hunts_period_hunt" FOREIGN KEY ("hunt_id") REFERENCES "hunts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "index" ADD CONSTRAINT "fk_index_step_hunt" FOREIGN KEY ("hunt_id") REFERENCES "hunts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_like_hunt" FOREIGN KEY ("hunt_id") REFERENCES "hunts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_like_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "progression" ADD CONSTRAINT "fk_progression_hunt" FOREIGN KEY ("hunt_id") REFERENCES "hunts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "progression" ADD CONSTRAINT "fk_progression_step" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "progression" ADD CONSTRAINT "fk_progression_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "right_user" ADD CONSTRAINT "right_user_right_id_fkey" FOREIGN KEY ("right_id") REFERENCES "rights"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "right_user" ADD CONSTRAINT "right_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security_code" ADD CONSTRAINT "fk_security_code_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "step_ar" ADD CONSTRAINT "fk_step_ar_step" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "fk_steps_hunt" FOREIGN KEY ("hunt_id") REFERENCES "hunts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "fk_steps_index_step" FOREIGN KEY ("index_id") REFERENCES "index"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_cultural_center" FOREIGN KEY ("id_cultural_center") REFERENCES "cultural_centers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
