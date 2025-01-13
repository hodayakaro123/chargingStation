import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";


let app: Express;


const testUser = {
    firstName: "Tom2",
    lastName: "Guter",
    email: "tom@user.com",
    password: "123456",
    phoneNumber: "0541234567",
    token: "",
    _id: "",
};

const newChargingStation = {
    latitude: 40.7128,
    longitude: -74.0060,
    price: 10,
    rating: 4.5,
    picture: "http://example.com/picture.jpg",
    description: "A great charging station",
    comments: ["Great place!", "Very convenient."],
};



beforeAll(async () => {
  app = await initApp();

  await userModel.deleteMany();

  const registerResponse = await request(app)
    .post("/auth/signUp")
    .send(testUser);
  expect(registerResponse.statusCode).toBe(200);

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({ email: testUser.email, password: testUser.password });
  expect(loginResponse.statusCode).toBe(200);

  testUser.token = loginResponse.body.accessToken;
  testUser._id = loginResponse.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("add charging station Test Suite", () => {
    test("should add a new charging station", async () => {
        
        const response = await request(app)
            .post("/addChargingStation/addCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newChargingStation);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newChargingStation);
    });
  
});
  


