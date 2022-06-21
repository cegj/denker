import express from 'express';
import AuthController from '../controllers/AuthController.mjs';

// Controller

export const authRoutes = express.Router();

authRoutes.get('/login', AuthController.login);
authRoutes.post('/login', AuthController.loginPost);
authRoutes.get('/register', AuthController.register);
authRoutes.post('/register', AuthController.registerPost);
authRoutes.get('/logout', AuthController.logout);