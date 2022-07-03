import express from 'express';
// Controller
import UserController from "../controllers/UserController.mjs";
import FollowController from '../controllers/FollowController.mjs';
// Helpers
import checkAuth from '../helpers/auth.mjs';

export const userRoutes = express.Router();

userRoutes.get('/', checkAuth, UserController.showProfile);
userRoutes.get('/:id', checkAuth, UserController.showProfile);
userRoutes.post('/:userToFollow/follow', checkAuth, FollowController.followUnfollow);
userRoutes.get('/:id/following', checkAuth, FollowController.showFollowing);
userRoutes.get('/:id/followers', checkAuth, FollowController.showFollowers);