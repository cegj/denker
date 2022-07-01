import express from 'express';
// Controller
import UserController from "../controllers/UserController.mjs";
// Helpers
import checkAuth from '../helpers/auth.mjs';

export const userRoutes = express.Router();

userRoutes.get('/', checkAuth, UserController.showProfile);
userRoutes.get('/:id', checkAuth, UserController.showProfile);