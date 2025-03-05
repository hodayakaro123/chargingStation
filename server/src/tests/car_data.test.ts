import request from "supertest";
import moduleApp from "../server";
import { Express } from "express";
import mongoose from "mongoose";
import userModel from "../models/user_model";


let app: Express;
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


beforeAll(async () => {
    app = await moduleApp();

    await userModel.findOneAndDelete({ email: testUser.email });

      const registerResponse = await request(app)
        .post("/auth/signUp")
        .send(testUser);
      expect(registerResponse.statusCode).toBe(200);
    
      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
      expect(loginResponse.statusCode).toBe(200);
    
      testUser.refreshTokens.push(loginResponse.body.accessToken)  ;
      testUser.refreshTokens.push(loginResponse.body.refreshToken);  ;
      testUser._id = loginResponse.body._id;
}); 

afterAll(async () => {
   await userModel.findOneAndDelete({ email: testUser.email });
   await mongoose.connection.close();

});

describe("create gemini content", () => {
  test("should get car data", async () => {
    const response = await request(app)
      .post("/carData/get-car-data")
      .send({ userId: testUser._id });
    expect(response.statusCode).toBe(200);
    expect(response.body[0].userId).toEqual(testUser._id);
  }, 5000);

  test("should delete car data", async () => {
    const response = await request(app)
      .delete("/carData/delete-car-data")
      .send({ userId: testUser._id });
    expect(response.statusCode).toBe(200);
  }, 5000);



  
});
