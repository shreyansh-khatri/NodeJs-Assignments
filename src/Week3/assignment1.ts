import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import admin, { ServiceAccount } from "firebase-admin";
import {
  DocumentSnapshot,
  DocumentReference,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { User } from "./interface";

const app: Application = express();
const port: number = 3000;

const serviceAccount = require("./firebaseInformation.json") as ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

const db: admin.firestore.Firestore = admin.firestore();
app.use(bodyParser.json());

app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot: QuerySnapshot = await db.collection("users").get();
    const users: any[] = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error getting users." });
  }
});

app.get("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const doc: DocumentSnapshot = await db
      .collection("users")
      .doc(req.params.id)
      .get();
    if (!doc.exists) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting user." });
  }
});

app.post("/users", async (req: Request<User>, res: Response): Promise<void> => {
  try {
    const { name, email, age } = req.body;
    const querySnapshot: QuerySnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!querySnapshot.empty) {
      res.status(400).json({ error: "User with this email already exists." });
      return;
    }
    const userRef: DocumentReference = await db
      .collection("users")
      .add({ name, email, age });
    res.json({ id: userRef.id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user." });
  }
});

app.put(
  "/users/:id",
  async (req: Request<{ id: string }, User>, res: Response): Promise<void> => {
    try {
      const { name, email, age } = req.body;
      const userId = req.params.id;
      const userDoc: DocumentSnapshot = await db
        .collection("users")
        .doc(userId)
        .get();
      if (!userDoc.exists) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      await db.collection("users").doc(userId).set({ name, email, age });
      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error updating user." });
    }
  }
);

app.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userRef: DocumentReference = db
      .collection("users")
      .doc(req.params.id);
    const userDoc: DocumentSnapshot = await userRef.get();
    if (!userDoc.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await userRef.delete();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.listen(port, (): void => {
  console.log(`App listening at http://localhost:${port}`);
});

export default app;
