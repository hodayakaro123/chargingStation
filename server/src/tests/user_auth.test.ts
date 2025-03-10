import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import path from "path";
import fs from "fs";

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

const testUserError: TestUser = {
  firstName: "Tom2",
  lastName: "Guter",
  email: "tom@user.com",
  password: "",
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
        .send(testUserError);
      expect(registerResponse.statusCode).not.toBe(200);
  
  });

  test("Auth Registration fail - register the same user", async () => {
    
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

  test("Auth Login fail - missing email", async () => {
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: "", password: "wrongPassword" });
    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.text).toBe("wrong email or password");
  });
  
  test("Auth Login fail - wrong password", async () => {
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: "wrongPassword" });
    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.text).toBe("wrong email or password");
  });
  
  test("Auth Login fail - wrong email", async () => {
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: "wrong@gmail.com", password: "wrongPassword" });
    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.text).toBe("wrong email or password");
  });

  test("should get user by id", async () => {
    const response = await request(app)
        .get(`/auth/getUserById/${testUser._id}`)
        .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
        .send();
    expect(response.statusCode).toBe(200);
  });

  test("should verify access token", async () => {
      const response = await request(app)
          .get("/auth/verifyAccessToken")
          .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
          .send();
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Token is valid");
  });
  
  test("should fail to verify access token - missing token", async () => {
    const response = await request(app)
        .get("/auth/verifyAccessToken")
        .set("authorization", `Bearer `)
        .send();
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("missing token");
  });
  
  test("should refresh token successfully", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: testUser.refreshTokens[1] });
  
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    testUser.refreshTokens[0] = response.body.accessToken;
    testUser.refreshTokens[1] = response.body.refreshToken;
  });

  test("should fail to refresh token - missing refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "" });
  
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Invalid token");
  });

  test("should update user by id", async () => {
    const imagePath = path.resolve(__dirname, "sedan_test.png");
        if (!fs.existsSync(imagePath)) {
          throw new Error(`File not found: ${imagePath}`);
        }

      const updatedUserData = {
          firstName: "UpdatedFirstName",
          lastName: "UpdatedLastName",
          phoneNumber: "0547654321"
      };
  
      const response = await request(app)
          .put(`/auth/updateUser/${testUser._id}`)
          .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
          .field("firstName", updatedUserData.firstName)
          .field("lastName", updatedUserData.lastName)
          .field("phoneNumber", updatedUserData.phoneNumber)

          
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty("message", "User updated successfully");
          expect(response.body.user).toHaveProperty("firstName", updatedUserData.firstName);
          expect(response.body.user).toHaveProperty("lastName", updatedUserData.lastName);
          expect(response.body.user).toHaveProperty("phoneNumber", updatedUserData.phoneNumber);
  });

  test("should fail to logout user - missing refresh token", async () => { 
    const response = await request(app)
        .post("/auth/logout")
        .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
        .send({ refreshToken: "" });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("missing refresh token");
  });

  test("should logout user", async () => {
    const response = await request(app)
        .post("/auth/logout")
        .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
        .send({ refreshToken: testUser.refreshTokens[1] });
    expect(response.statusCode).toBe(200);
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

  test("should delete user by id", async () => {
    const response = await request(app)
        .delete(`/auth/deleteUser/${testUser._id}`)
        .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
        .send();
    expect(response.statusCode).toBe(200);
  });
  

  
});
