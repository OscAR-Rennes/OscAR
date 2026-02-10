import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import usersRoutes from '../routes/UsersRoutes.js';
import authRoutes from '../routes/AuthRoutes.js';
import adminRoutes from '../routes/AdminRoutes.js';
import { requireRole } from '../common-lib/middlewares/AuthMiddleware.js';
import cookieParser from 'cookie-parser';
import { errorHandler, errorHandlerBackend } from '../common-lib/errors/ErrorHandler.js';
import AppError from '../common-lib/errors/AppError.js';
import huntsRoutes from '../routes/HuntRoutes.js';
import stepsRoutes from '../routes/StepRoutes.js';
import difficultyRoutes from '../routes/DifficultyRoutes.js';
import { runMigrations } from '../common-lib/config/runMigrations.js';
import { RoleEnum } from '../common-lib/enum/roleEnum.js';
import indexRoutes from '../routes/IndexRoutes.js';
import culturalCenterRoutes from '../routes/CulturalCenterRoutes.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger/swagger.js";
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', usersRoutes);
app.use('/api', authRoutes);
app.use('/api', huntsRoutes);
app.use('/api', stepsRoutes);
app.use('/api', indexRoutes);
app.use('/api', difficultyRoutes)
app.use('/api', culturalCenterRoutes)

// Routes admin protégées par le middleware requireRole
app.use('/api/admin', requireRole(RoleEnum.ADMIN), adminRoutes);

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Routes non définies()
app.use((req, res, next) => {
  next(new AppError({
    userMessage: 'Route non trouvée',
    route: req.originalUrl,
    statusCode: 404,
  }));
});

app.use(errorHandler);

(async () => {
  let migrationError: AppError | null = null;

  try {
    console.log('[BOOT] Running migrations...');
    await runMigrations();
    console.log('[BOOT] Migrations finished');
  } catch (err) {
    migrationError = new AppError({
      userMessage: 'Échec des migrations de la base de données',
      statusCode: 500,
      details: err,
    });
  }

  app.listen(port, () => {
    console.log(`[BOOT] Backend listening on port ${port}`);

    if (migrationError) {
      errorHandlerBackend(migrationError);
    }
  });
})();
