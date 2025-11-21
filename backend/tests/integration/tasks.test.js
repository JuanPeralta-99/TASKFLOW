
/**
 * @jest-environment node
 */

import request from "supertest";
import app from "../../app";

describe("Task API integration tests", () => {
    test("GET /tasks returns list", async () => {
        const res = await request(app).get("/tasks");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
