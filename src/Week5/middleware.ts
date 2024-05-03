import { Request, Response, NextFunction } from "express";
import { User } from "./models/Schema";

export const checkAuthorExists: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req, res, next) => {
  try {
    const { author } = req.body;
    const existingAuthor = await User.findById(author);
    console.log(existingAuthor)
    if (!existingAuthor) {
      return res.status(400).json({ message: "Author not found" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Author not found" });
  }
};
