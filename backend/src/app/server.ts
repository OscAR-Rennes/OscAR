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
import { RoleEnum } from '../common-lib/enum/roleEnum.js';
import indexRoutes from '../routes/IndexRoutes.js';
import culturalCenterRoutes from '../routes/CulturalCenterRoutes.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger/swagger.js";
import { requestLogger } from '../common-lib/middlewares/LoggerMiddleware.js';
import logger from '../common-lib/utils/logger.js';
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
   origin: (origin, callback) => callback(null, true),  //origin: process.env.FRONT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

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

app.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);
});
