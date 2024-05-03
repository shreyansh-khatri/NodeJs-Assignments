import mongoose from "mongoose";


mongoose
  .connect("mongodb://localhost:27017/myapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err: Error) => console.error(err));

export default mongoose.connection;
