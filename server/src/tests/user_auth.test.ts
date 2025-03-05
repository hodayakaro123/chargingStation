import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";

interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  picture: string | null;
  selectedChargingStations: [];
  carDetails: string | null;
  refreshTokens: string[];
  _id: mongoose.Types.ObjectId;

}

const testUser: TestUser = {
  firstName: "Tom2",
  lastName: "Guter",
  email: "tom@user.com",
  password: "123456",
  phoneNumber: "0541234567",
  picture: null, 
  selectedChargingStations: [], 
  carDetails: null,
  refreshTokens: [], 
  _id: new mongoose.Types.ObjectId(), 
};

let app: Express;

beforeAll(async () => {
  app = await moduleApp();
  await userModel.findOneAndDelete({ email: testUser.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});




describe("Auth Tests", () => {
  test("Auth Registration", async () => {
    const registerResponse = await request(app)
        .post("/auth/signUp")
        .send(testUser);
      expect(registerResponse.statusCode).toBe(200);
  });

  test("Auth Registration fail", async () => {
    
    const registerResponse = await request(app)
        .post("/auth/signUp")
        .send(testUser);
      expect(registerResponse.statusCode).not.toBe(200);
  
  });

  test("Auth Login", async () => {
     const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
      expect(loginResponse.statusCode).toBe(200);
    
      testUser.refreshTokens.push(loginResponse.body.accessToken)  ;
      testUser.refreshTokens.push(loginResponse.body.refreshToken);  ;
      testUser._id = loginResponse.body._id;
  });

  test("Make sure two access tokens are not the same", async () => {
    
    expect(testUser.refreshTokens[0]).not.toBe(testUser.refreshTokens[1]);
  });

  test("Auth Login fail", async () => {
    const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: "wrongPassword" });
      expect(loginResponse.statusCode).not.toBe(200);
  });

  
});
