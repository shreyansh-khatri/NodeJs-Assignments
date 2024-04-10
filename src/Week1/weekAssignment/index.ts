import express from "express";
import { promises as fs } from "fs";
import { Messages } from "./interfaces";
const { errorMessage, portMessage }: Messages = require("../utils.ts");
const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = "data.json";
app.use(express.json());

app.get("/process", async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const jsonData = JSON.parse(data);
    const processedData = jsonData.map((item: number) => item * 2);
    res.json(processedData);
  } catch (error) {
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`${portMessage} ${PORT}`);
});
