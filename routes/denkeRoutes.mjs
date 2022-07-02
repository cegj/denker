import express from 'express';
// Controller
import DenkeController from "../controllers/DenkeController.mjs";
// Helpers
import checkAuth from '../helpers/auth.mjs';

export const denkesRoutes = express.Router();

denkesRoutes.post('/add', checkAuth, DenkeController.createDenkeSave);
denkesRoutes.get('/edit/:id', checkAuth, DenkeController.editDenke);
denkesRoutes.post('/edit', checkAuth, DenkeController.editDenkeSave);
denkesRoutes.post('/remove', checkAuth, DenkeController.removeDenke);
denkesRoutes.get('/:id', checkAuth, DenkeController.showDenke);
denkesRoutes.get('/', checkAuth, DenkeController.showDenkes);