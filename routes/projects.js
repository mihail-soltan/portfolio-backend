import Router from 'express';
import multer from 'multer';
import { getProjects, createProject } from '../controllers/projects.js';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  // Only accept JPEG and PNG image files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};
const upload = multer({ storage, fileFilter });
const projectRouter = Router()

projectRouter
    .route("/")
    .get(getProjects)
    // .post(upload.single('image'),createProject)
    .post(upload.array('images', 2), createProject)

export default projectRouter