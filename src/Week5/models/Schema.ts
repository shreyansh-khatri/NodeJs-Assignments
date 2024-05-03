import mongoose, { Document, Schema } from "mongoose";
import { IPost,IUser } from "../interface";

const userSchema = new Schema<IUser>({
  username: String,
  email: String,
});

export const User = mongoose.model<IUser>("User", userSchema);

export const postSchema = new Schema<IPost>({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

postSchema.index({ title: "text", content: "text" });

export const Post = mongoose.model<IPost>("Post", postSchema);
