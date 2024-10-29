import mongoose, { Schema } from 'mongoose';
import { IProject } from '../utils/types';

const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ""
    }
});

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;

