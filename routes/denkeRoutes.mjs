import express from 'express';
import { DenkeController } from "../controllers/DenkeController.mjs";

// Controller

export const denkesRoutes = express.Router();

denkesRoutes.get('/', DenkeController.showDenkes);