const {
  task1Message,
  task2Message,
}: { task1Message: string; task2Message: string } = require("../utils.ts");

const task1 = async (): Promise<string> => {
  const task1Message = await new Promise<string>((resolve) => {
    setTimeout(() => {
      const message = "Task 1 completed";
      console.log(message);
      resolve(message);
    }, 2000);
  });
  return task1Message;
};

const task2 = async (): Promise<string> => {
  const task2Message = await new Promise<string>((resolve) => {
    setTimeout(() => {
      const message = "Task 2 completed";
      console.log(message);
      resolve(message);
    }, 3000);
  });
  return task2Message;
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
