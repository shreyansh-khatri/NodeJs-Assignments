import express, { Request, Response } from "express";
import { IUser,IPost } from "./interface";
import { User,Post,postSchema } from "./models/Schema";
import { checkAuthorExists } from "./middleware";
require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

postSchema.pre<IPost>("save", checkAuthorExists as (next: any) => void);
app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    const user = new User({ username, email });
    await user.save();
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/posts",checkAuthorExists, async (req: Request, res: Response) => {
  try {
    const { title, content, author } = req.body;
    const post = new Post({ title, content, author });
    await post.save();
    res.status(201).json(post);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author");
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: "$author",
          totalPosts: { $sum: 1 },
        },
      },
    ]);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/search", async (req: Request, res: Response) => {
  try {
    const { q } = req.query; 
    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Invalid search query" });
    }

    const posts = await Post.find({ $text: { $search: q } });
       if (posts.length === 0) {
         return res.status(404).json({ message: "No posts found" });
       }

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
