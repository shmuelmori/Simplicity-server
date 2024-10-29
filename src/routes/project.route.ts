import express from "express";
import {createProject , updateProject, getAllProjects, deleteProject} from '../controllers/project.controllers'

const projectRouter = express.Router();

projectRouter.post('/createProject', createProject);
projectRouter.post('/updateProject', updateProject);
projectRouter.get('/getAllProjects', getAllProjects);
projectRouter.post('/deleteProject', deleteProject);

export default projectRouter;


