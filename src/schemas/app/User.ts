import UserModel from "~/types/app/User";
import { Schema } from "mongoose";

const User: Schema<UserModel> = new Schema<UserModel>({
    id: String,
    uid: String,
    name: String,
    age: Number,
    email: String,
    createdAt: Date
});

export default User;
