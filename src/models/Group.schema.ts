import mongoose, { Schema } from 'mongoose';
import { IGroup } from '../utils/types';

const groupSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    }
});

const Group = mongoose.model<IGroup>('Group', groupSchema);

export default Group;

