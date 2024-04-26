import express, { Request, Response, NextFunction } from "express";
import admin, { ServiceAccount } from "firebase-admin";
import multer, { Multer } from "multer";
import fs from "fs";

const serviceAccount =
  require("./firebaseInformation.json") as ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(express.json());
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req: Request, res: Response) => {
  res.render("upload");
});

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    console.log(req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { originalname, mimetype, size } = req.file;
      const fileContent = fs.readFileSync(req.file.path);
      const imagePath = `uploads/${originalname}`;
      fs.writeFileSync(imagePath, fileContent);

      await db.collection("images").add({
        originalname,
        mimetype,
        size,
        imagePath,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ imagePath });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
