import express, { Request, Response } from "express";
import { userData } from "./utils";

const app = express();

app.get("/users/:username", (req: Request, res: Response) => {
  const username: string = req.params.username;
  const user = userData[username];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/users/profession/:profession", (req: Request, res: Response) => {
  const profession: string = req.params.profession.toLowerCase();
  const users = Object.values(userData).filter(
    (user) => user.profession.toLowerCase() === profession
  );
  if (users.length > 0) {
    res.json(users);
  } else {
    res
      .status(404)
      .json({ error: "Users with specified profession not found" });
  }
});

app.get("/users/age/:min/:max", (req: Request, res: Response) => {
  const minAge: number = parseInt(req.params.min);
  const maxAge: number = parseInt(req.params.max);
  const users = Object.values(userData).filter(
    (user) => user.age >= minAge && user.age <= maxAge
  );
  if (users.length > 0) {
    res.json(users);
  } else {
    res
      .status(404)
      .json({ error: "Users within specified age range not found" });
  }
});

const PORT: number | string = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
