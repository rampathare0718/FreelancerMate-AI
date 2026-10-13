import express from 'express';
import { registerUser, loginUser, getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(getUsers);

router.post('/login', loginUser);

router.route('/:id')
  .get(getUserById);

export default router;
