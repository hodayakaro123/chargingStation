import request from "supertest";
import moduleApp from "../server";
import { Express } from "express";
import mongoose from "mongoose";


let app: Express;


beforeAll(async () => {
    app = await moduleApp();
}); 

afterAll(async () => {
  await mongoose.connection.close();

});

describe("POST /gemini/generate-content", () => {
  test("should return generated content for a valid text input", async () => {
    const response = await request(app)
      .post("/gemini/generate-content")
      .send({ text: "tesla model 3 2024 rwd" }) 
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200); 
    });

  
});
