#!/bin/sh

echo "Waiting for Postgres..."
until pg_isready -h postgres -p 5432 -U oscAR; do
  sleep 1
done
echo "Postgres is ready!"

echo "Refreshing Node dependencies..."
npm install

echo "Running migrations..."
npx prisma migrate deploy || echo "MIGRATION FAILED"

echo "Seeding database..."
npx prisma db seed || echo "SEED FAILED"

echo "Starting dev server..."
npm run dev