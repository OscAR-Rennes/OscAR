#!/bin/sh
set -e

echo "Waiting for Postgres..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting dev server..."
npm run dev
