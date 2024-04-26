import { Document } from "mongoose";

export interface TaskInterface extends Document {
  title: string;
  description: string;
  completed: boolean;
}
