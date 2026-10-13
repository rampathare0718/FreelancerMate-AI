import express from 'express';
import { registerUser, getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(getUsers);

router.route('/:id')
  .get(getUserById);

export default router;
