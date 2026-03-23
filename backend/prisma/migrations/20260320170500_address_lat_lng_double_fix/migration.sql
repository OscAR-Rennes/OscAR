-- Fix previous empty migration: convert address coordinates to double precision
ALTER TABLE "address"
  ALTER COLUMN "latitude" TYPE DOUBLE PRECISION USING "latitude"::double precision,
  ALTER COLUMN "longitude" TYPE DOUBLE PRECISION USING "longitude"::double precision;
