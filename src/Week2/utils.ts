import { Request } from "express";

export interface DecodedToken {
  username: string;
}

export interface ActiveSessions {
  [username: string]: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export interface UserData {
  [key: string]: {
    name: string;
    age: number;
    profession: string;
  };
}

export const userData: UserData = {
  alice: { name: "Alice", age: 30, profession: "Engineer" },
  bob: { name: "Bob", age: 35, profession: "Doctor" },
  charlie: { name: "Charlie", age: 25, profession: "Artist" },
};

export const users: LoginInfo[] = [
  {
    username: "user1",
    password: "password1",
  },
  {
    username: "user2",
    password: "password2",
  },
];

export interface LoginInfo {
  username: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export const SECRET_KEY = "yourSecretKey";
