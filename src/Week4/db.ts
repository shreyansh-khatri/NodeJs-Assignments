import mongoose from "mongoose";

const mongoURI: string = "mongodb://localhost:27017/task_manager";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err: any) => console.log(err));

export default mongoose.connection;
