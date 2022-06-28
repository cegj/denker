import express from 'express';
// Controller
import DenkeController from "../controllers/DenkeController.mjs";
// Helpers
import checkAuth from '../helpers/auth.mjs';

export const denkesRoutes = express.Router();

denkesRoutes.get('/add', checkAuth, DenkeController.createDenke);
denkesRoutes.post('/add', checkAuth, DenkeController.createDenkeSave);
denkesRoutes.get('/edit/:id', checkAuth, DenkeController.editDenke);
denkesRoutes.post('/edit', checkAuth, DenkeController.editDenkeSave);
denkesRoutes.get('/dashboard', checkAuth, DenkeController.dashboard);
denkesRoutes.post('/remove', checkAuth, DenkeController.removeDenke);
denkesRoutes.get('/', DenkeController.showDenkes);