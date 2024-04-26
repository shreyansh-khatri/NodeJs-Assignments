import mongoose, { Schema } from "mongoose";
import { TaskInterface } from "../interface";

const taskSchema: Schema<TaskInterface> = new Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Task = mongoose.model<TaskInterface>("Task", taskSchema);

export { Task };
