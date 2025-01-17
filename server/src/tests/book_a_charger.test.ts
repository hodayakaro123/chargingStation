import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";
import chargingStationModel from "../models/add_charging_model";
import bookChargerModel from "../models/book_a_chrager.model";

let app: Express;

const testUser = {
  firstName: "Tom3",
  lastName: "Guter",
  email: "tom@user.com",
  password: "123456",
  phoneNumber: "0541234567",
  selectedChargingStations: [],
  token: "",
  _id: "",
};

const newChargingStation = {
  location: "New York",
  latitude: 40.7128,
  longitude: -74.006,
  price: 10,
  rating: 4.5,
  chargingRate: 5,
  picture: "http://example.com/picture.jpg",
  description: "A new charging station",
  userId: "",
  comments: [
    {
      text: "Great station!!!!",
    },
  ],
};

const newBookCharger = {
    chargerId: "",
    StartTime: "2022-01-01T10:00:00.000Z",
    EndTime: "2022-01-01T12:00:00.000Z",
    Date: "2022-01-01",
    userId: "",
};


beforeAll(async () => {
  app = await moduleApp();

  await userModel.deleteMany();
  await chargingStationModel.deleteMany();
  await bookChargerModel.deleteMany();

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
  newChargingStation.userId = testUser._id;
  newBookCharger.userId = testUser._id;

});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Book a charger", () => {

  test("should add a new charging station", async () => {
      const response = await request(app)
        .post("/addChargingStation/addCharger")
        .set("authorization", `JWT ${testUser.token}`)
        .send(newChargingStation);
  
      expect(response.status).toBe(201);
  
  });  
  
  test("should book a charger", async () => {
        const addChargingStationResponse = await request(app)
            .post("/bookings/bookCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newChargingStation);
        expect(addChargingStationResponse.statusCode).toBe(201);
        newBookCharger.chargerId = addChargingStationResponse.body.chargingStation._id;

        const bookChargerResponse = await request(app)
            .post("/bookings/bookCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newBookCharger);
        expect(bookChargerResponse.statusCode).toBe(201);
        expect(bookChargerResponse.body.message).toBe("Charger booked successfully");
    });
});
