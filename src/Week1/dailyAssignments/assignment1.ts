import { TaskMessages } from "./interfaces";
const { task1Message, task2Message }: TaskMessages = require("../utils.ts");

const task1 = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(task1Message);
      resolve(task1Message);
    }, 2000);
  });
};

const task2 = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(task2Message);
      resolve(task2Message);
    }, 3000);
  });
};

const main = async () => {
  try {
    const result1 = await task1();
    const result2 = await task2();
    setTimeout(() => {
      console.log("Result from Task 1:", result1);
      console.log("Result from Task 2:", result2);
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
