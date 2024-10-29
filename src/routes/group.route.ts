import express from "express";
import { getGroupsByProject, createGroup, updateGroup, deleteGroup } from '../controllers/group.controller'

const groupRouter = express.Router();

groupRouter.get('/getGroupsByProject/:_id', getGroupsByProject);
groupRouter.post('/createGroup', createGroup);
groupRouter.patch('/updateGroup/:_id', updateGroup);
groupRouter.delete('/deleteGroup/:_id', deleteGroup);


export default groupRouter;