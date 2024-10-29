import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    workSpaceList: string[],
    icon: string,
}


export interface ServerResponse<T> {
    isSuccessful: boolean;               // האם הבקשה הצליחה
    displayMessage: string | null;       // הודעה למשתמש
    description: string | null;          // תיאור נוסף (אם קיים)
    exception: string | null;            // תיאור החריגה (אם קרתה שגיאה)
    data: T | null;                             // כל המידע הקשור לבקשה
}

export interface ITask {
    name: string;
    description: string;
    status: "TO DO" | "IN PROGRESS" | "COMPLETE";
    duration: number;
    groupId: string;
}


export interface IGroup {
    name: string;
    description: string;
    projectId: string;
}

export interface IProject {
    name: string;
    description: string;
    icon: string;
}