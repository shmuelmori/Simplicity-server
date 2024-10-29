import { Request, Response } from 'express';
import { buildResponse } from '../utils/helper';
import Task from '../models/Task.schema';
import Group from '../models/Group.schema';
import { write, utils } from 'xlsx';
import User from '../models/user.schema';
import { IUser } from '../utils/types';


// get task by group
export const getTaskByGroup = async (req: Request, res: Response) => {
    const { _id } = req.params;

    if (!_id) {
        const response = buildResponse(false, "id is NOT valid", null, null);
        res.status(400).send(response);
        return;
    }
    try {
        const tasks = await Task.find();
        const taskByGroup = tasks.filter((task) => task.groupId === _id);

        if (tasks.length === 0 || taskByGroup.length === 0) {
            const response = buildResponse(false, "We NOT found the group", null, null);
            res.status(400).send(response);
            return;
        }

        const response = buildResponse(true, "we found the tasks", null, null, taskByGroup);
        res.status(200).send(response);
        return;
    } catch (error) {
        const response = buildResponse(
            false, 'Failed to get tasks', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }
}


// create task
export const createTask = async (req: Request, res: Response) => {
    const { name, description, status, duration, groupId } = req.body;

    if (!name || !description || !status || !duration || !groupId) {
        const response = buildResponse(false, "all fildes most be valid!", null, null);
        res.status(400).send(response);
        return;
    }

    try {

        const group = await Group.findById(groupId);

        if (!group) {
            const response = buildResponse(false, "We NOT find a group!", null, null);
            res.status(400).send(response);
            return;
        }

        const newTask = await Task.create({
            name,
            description,
            status,
            duration,
            groupId
        })

        if (newTask) {
            const response = buildResponse(true, "Task create succefully!", null, null, newTask);
            res.status(200).send(response);
            return;
        }

    } catch (error) {
        const response = buildResponse(
            false, 'Failed to create task', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }

}


//edit task
export const editTask = async (req: Request, res: Response) => {
    const { taskId, data, type } = req.body;

    if (!taskId || !data || !type) {
        const response = buildResponse(false, "Fullfild the data!", null, null);
        res.status(400).send(response);
        return;
    }

    try {

        const task = await Task.findById(taskId);

        if (!task) {
            const response = buildResponse(false, "We NOT find the task!", null, null);
            res.status(400).send(response);
            return;
        }

        if (type === "name")
            task.name = data;
        else if (type === "description")
            task.description = data;
        else if (type === "status")
            task.status = data;
        else if (type === "duration") {
            if (data <= 0) {
                const response = buildResponse(false, "The duration most be positive!", null, null);
                res.status(400).send(response);
                return;
            }
            task.duration = data;
        }

        await task.save();

        const response = buildResponse(true, `update ${type} succefully!`, null, null, task);
        res.status(200).send(response);
        return;


    } catch (error) {
        const response = buildResponse(
            false, 'Failed to create task', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }

}


// delete task
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
        const response = buildResponse(false, "Task ID must be provided!", null, null);
        res.status(400).send(response);
        return;
    }

    try {
        const taskToDelete = await Task.findById(id);

        if (!taskToDelete) {
            const response = buildResponse(false, "Task not found!", null, null);
            res.status(404).send(response);
            return;
        }

        await taskToDelete.deleteOne();

        const response = buildResponse(true, "Task deleted successfully!", null, null, taskToDelete);
        res.status(200).send(response);
    } catch (error) {
        const response = buildResponse(
            false, 'Failed to delete task', null, error instanceof Error ? error.message : 'Unknown error', null
        );
        res.status(500).json(response);
    }
};


// export task list
export const exportTaskList = async (req: Request, res: Response) => {
    const { _id } = req.body;

    try {
        const tasksList = await Task.find({ groupId: _id });

        if (!tasksList || tasksList.length === 0) {
            throw new Error("No tasks found");
        }

        const formattedTasks = tasksList.map((task, index) => ({
            ID: (index + 1).toString(),
            Name: task.name,
            Description: task.description,
            Status: task.status,
            Duration: task.duration,
        }));


        const ws = utils.json_to_sheet(formattedTasks);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Tasks');

        ws['!cols'] = [
            { wch: 5 },    // מספר משימה - עמודה צרה יותר
            { wch: 20 },   // שם משימה
            { wch: 40 },   // תיאור
            { wch: 15 },   // סטטוס
            { wch: 10 },   // משך
        ];

        const buffer = write(wb, { bookType: 'xlsx', type: 'buffer' });
        const base64File = buffer.toString('base64');

        const response = buildResponse(true, 'Task export succeeded', null, null, base64File);
        res.status(200).json(response);

    } catch (error) {
        const response = buildResponse(
            false, 'Error when exporting tasks', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }
};


export const searchTask = async (req: Request, res: Response) => {
    try {
        const { text, id } = req.params; // id כאן הוא ה-groupId

        const regex = new RegExp(text, 'i');

        // חיפוש משימות עם groupId תואם
        const matchesTasks = await Task.find({
            groupId: id, // הוסף את התנאי של groupId
            $or: [
                { name: regex },
                { description: regex },
                { status: regex }
            ]
        });

        if (!matchesTasks || matchesTasks.length === 0) {
            throw new Error("There are no matching tasks");
        }
        
        const response = buildResponse(true, 'Search tasks successfully', null, null, matchesTasks);
        res.status(200).json(response);

    } catch (err) {
        const response = buildResponse(false, 'Failed to search tasks', null, err instanceof Error ? err.message : 'Unknown error', null);
        res.status(500).json(response);
    }
};


export const getTaskByUser = async (req: Request, res: Response) => {
    const { _id } = req.params;

    if (!_id) {
        const response = buildResponse(false, "ID is not valid", null, null);
        res.status(400).send(response);
        return;
    }

    try {
        const user = await User.findById(_id);

        if (!user) {
            const response = buildResponse(false, "User not found", null, null);
            res.status(400).send(response);
            return;
        }

        // Use Promise.all to wait for all task fetches to resolve
        const tasks = await Promise.all(
            user.workSpaceList.map(async (taskId) => {
                const task = await Task.findById(taskId);
                return task;
            })
        );

        const response = buildResponse(true, 'Tasks retrieved successfully', null, null, tasks);
        res.status(200).json(response);

    } catch (err) {
        const response = buildResponse(false, 'Failed to get tasks', null, err instanceof Error ? err.message : 'Unknown error', null);
        res.status(500).json(response);
    }
};


export const assignTaskToUser = async (req: Request, res: Response) => {
    const { userId, taskId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            const response = buildResponse(false, "User not found", null, null);
            res.status(400).send(response);
            return;
        }

        const task = await Task.findById(taskId);

        if (!task) {
            const response = buildResponse(false, "Task not found", null, null);
            res.status(400).send(response);
            return;
        }

        const taskIndex = user.workSpaceList.indexOf(taskId);

        if (taskIndex !== -1) {
            user.workSpaceList.splice(taskIndex, 1);
            await user.save();

            const response = buildResponse(true, `${user.email} removed from list`, null, null, null);
            res.status(200).send(response);
            return;
        }

        user.workSpaceList.push(taskId);
        await user.save();

        const response = buildResponse(true, `task assin to ${user.email}`, null, null, user);
        res.status(200).json(response);
        return;

    } catch (err) {
        const response = buildResponse(false, 'Failed to search tasks', null, err instanceof Error ? err.message : 'Unknown error', null);
        res.status(500).json(response);
    }
};

export const getUsersWithTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!taskId) {
        const response = buildResponse(false, "Task ID is required", null, null);
        res.status(400).send(response);
        return;
    }

    try {
        // Find users whose workSpaceList includes the given taskId
        const users = await User.find({ workSpaceList: taskId });

        if (users.length === 0) {
            const response = buildResponse(false, "No users found with this task", null, null);
            res.status(404).send(response);
            return;
        }

        const response = buildResponse(true, 'Users found with the specified task', null, null, users);
        res.status(200).json(response);

    } catch (err) {
        const response = buildResponse(false, 'Failed to retrieve users', null, err instanceof Error ? err.message : 'Unknown error', null);
        res.status(500).json(response);
    }
};


