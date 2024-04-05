import dotenv from "dotenv";
import http from "http";
dotenv.config();
const PORT: number = parseInt(process.env.PORT || "3000");
const { message,portMessage }: { message: string,portMessage:string } = require("../utils.ts");

const server = http.createServer((req, res) => {
  res.end(message);
});

server.listen(PORT, () => {
  console.log(`${portMessage} ${PORT}`);
});
