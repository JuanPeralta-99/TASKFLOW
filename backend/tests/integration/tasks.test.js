import request from "supertest";
import app from "../../app.js";

describe("Tasks API", () => {
  test("POST /tasks → crear tarea", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Tarea de prueba" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  test("GET /tasks → obtener tareas", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
