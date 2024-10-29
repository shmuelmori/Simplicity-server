import express from "express";
import { createTask, deleteTask, editTask, getTaskByGroup, exportTaskList, searchTask, getTaskByUser, assignTaskToUser, getUsersWithTask, } from '../controllers/task.controller';

const taskRouter = express.Router();

taskRouter.get('/getTaskByGroup/:_id', getTaskByGroup);
taskRouter.post('/createTask', createTask);
taskRouter.post('/updateTask', editTask);
taskRouter.post('/deleteTask', deleteTask);
taskRouter.post('/exportTaskList', exportTaskList);
taskRouter.get('/searchTask/:text/:id', searchTask);
taskRouter.get('/getTaskByUser/:_id', getTaskByUser);
taskRouter.post('/assignTaskToUser', assignTaskToUser);
taskRouter.get('/usersWithTask/:taskId', getUsersWithTask);




export default taskRouter;