import express from 'express';
import { getProjects, getProjectById, createProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);

export default router;
