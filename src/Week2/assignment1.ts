import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken,ActiveSessions,users,LoginInfo,AuthenticatedRequest } from "./utils";

const app = express();
const PORT: number | string = process.env.PORT || 3000;
const secretKey: string = "yourSecretKey";
const activeSessions: ActiveSessions = {};
app.use(express.json());

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token: string = req.headers.authorization.split(" ")[1];

  try {
    const decoded: DecodedToken = jwt.verify(token, secretKey) as DecodedToken;
    if (activeSessions[decoded.username] !== token) {
      return res.status(401).json({ error: "Invalid session" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};


app.post("/login", (req: Request, res: Response): void => {
  const { username, password }: LoginInfo = req.body;
  const user: LoginInfo | undefined = users.find(
    (user: LoginInfo) =>
      user.username === username && user.password === password
  );

  if (user) {
    if (activeSessions[username]) {
      res.status(409).json({ error: "User already logged in" });
    }
    const token: string = jwt.sign({ username }, secretKey);
    activeSessions[username] = token; 
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post(
  "/logout",
  authenticate,
  (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { username }: DecodedToken = req.user;
    delete activeSessions[username];
    res.clearCookie("jwt"); 
    res.json({ message: "Logged out successfully" });
  }
);

app.get(
  "/protected",
  authenticate,
  (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { username }: DecodedToken = req.user;
    res.json({ message: "Protected endpoint accessed" });
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
