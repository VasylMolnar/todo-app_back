import request from "supertest";
import { app } from "../server";

describe("Todos API", () => {
  it("should return 400 if category has more than 5 todos", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/todos")
        .send({
          title: `Todo ${i}`,
          description: "Test",
          category: "work",
          completed: false,
        });
    }

    const res = await request(app).post("/api/todos").send({
      title: "Overflow Todo",
      description: "Test",
      category: "work",
      completed: false,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Max 5 tasks per category");
  });
});
