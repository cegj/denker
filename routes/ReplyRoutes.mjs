import express from 'express';
//Controller
import ReplyController from "../controllers/ReplyController.mjs";
//Helpers
import checkAuth from "../helpers/auth.mjs";

export const replyRoutes = express.Router();

replyRoutes.post('/add', checkAuth, ReplyController.saveReply);