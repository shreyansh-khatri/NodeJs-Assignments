import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
}

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser["_id"];
}