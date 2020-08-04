import { Document } from "mongoose";

interface IUser {
    uid: string;
    name: string;
    age: number;
    email: string;
    createdAt: Date;
}

interface IUserModel extends IUser, Document {}

export default IUserModel;
