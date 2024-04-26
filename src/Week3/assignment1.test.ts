import request from "supertest";
import app from "./assignment1";
import { Response } from "supertest";

describe("GET /users", (): void => {
  test("It should respond with an array of users", async (): Promise<void> => {
    const response: Response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET /users/:id", (): void => {
  test("It should respond with a single user object", async (): Promise<void> => {
    const createUserResponse: Response = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com",
        age: 30,
      });
    const userId: string = createUserResponse.body.id.toString();
    const getUserResponse: Response = await request(app).get(
      `/users/${userId}`
    );
    expect(getUserResponse.statusCode).toBe(200);
    expect(getUserResponse.body.name).toBe("Test User");
  });

  test("It should respond with 404 if user does not exist", async (): Promise<void> => {
    const response: Response = await request(app).get("/users/nonexistent-id");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /users", (): void => {
  test("It should create a new user", async (): Promise<void> => {
    const response: Response = await request(app).post("/users").send({
      name: "New User",
      email: "newuser@example.com",
      age: 25,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeTruthy();
  });
});

describe("PUT /users/:id", (): void => {
  test("It should update an existing user", async (): Promise<void> => {
    const createUserResponse: Response = await request(app)
      .post("/users")
      .send({
        name: "Update Test User",
        email: "update@test.com",
        age: 40,
      });
    const userId: string = createUserResponse.body.id;
    const updateUserResponse: Response = await request(app)
      .put(`/users/${userId}`)
      .send({
        name: "Updated User Name",
        email: "updated@example.com",
        age: 35,
      });
    expect(updateUserResponse.statusCode).toBe(200);
    expect(updateUserResponse.body.message).toBe("User updated successfully");
  });
});

describe("DELETE /users/:id", (): void => {
  test("It should delete an existing user", async (): Promise<void> => {
    const createUserResponse: Response = await request(app)
      .post("/users")
      .send({
        name: "Delete Test User",
        email: "delete@test.com",
        age: 50,
      });
    const userId: string = createUserResponse.body.id;
    const deleteUserResponse: Response = await request(app).delete(
      `/users/${userId}`
    );
    expect(deleteUserResponse.statusCode).toBe(200);
    expect(deleteUserResponse.body.message).toBe("User deleted successfully");
  });
});
