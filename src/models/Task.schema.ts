import mongoose, { Schema } from 'mongoose';
import { ITask } from '../utils/types';

const tsakSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['TO DO', 'IN PROGRESS', 'COMPLETE'],
        default: 'TO DO',
        required: true
    },
    duration: {
        type: Number,
        default: 0,
        min: [0, 'Duration must be a positive number'],
    },
    groupId: {
        type: String,
        required: true
    }
});

const Task = mongoose.model<ITask>('Tsak', tsakSchema);

export default Task;

