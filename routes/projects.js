import Router from 'express';

import { getProjects, createProject } from '../controllers/projects.js';

const projectRouter = Router()

projectRouter
    .route("/")
    .get(getProjects)
    .post(createProject)

export default projectRouter