import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Task } from "./models/Schema";
require("./db");

const app = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/tasks", async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error getting tasks" });
  }
});

app.post("/tasks", async (req: Request, res: Response): Promise<void> => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed || false,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ error: "Error creating task" });
  }
});

app.put("/tasks/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed || task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: "Error updating task" });
  }
});

app.delete("/tasks/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
