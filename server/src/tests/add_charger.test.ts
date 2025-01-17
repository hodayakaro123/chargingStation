import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";
import chargingStationModel from "../models/add_charging_model";

let app: Express;

const testUser = {
  firstName: "Tom2",
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

const comment1 = {
  text: "Bad station!!!!",
};

newChargingStation.comments.push(comment1);

beforeAll(async () => {
  app = await moduleApp();

  await userModel.deleteMany();
  await chargingStationModel.deleteMany();

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
});

afterAll(async () => {
  await mongoose.connection.close();
});

let chargerId: string;

describe("add charging station Test Suite", () => {

  test("should add a new charging station", async () => {
    const response = await request(app)
      .post("/addChargingStation/addCharger")
      .set("authorization", `JWT ${testUser.token}`)
      .send(newChargingStation);

    expect(response.status).toBe(201);

    chargerId = response.body.chargingStation._id;
  });

  test("should get a charging station by ID", async () => {
    const getResponse = await request(app).get(
      `/addChargingStation/getChargerById/${chargerId}`
    );

    expect(getResponse.status).toBe(200);
  });

  test("should update charger details", async () => {
    const updatedDetails = {
      latitude: 41.1234,
      longitude: -75.1234,
      price: 15,
      rating: 4.8,
      picture: "http://example.com/newpicture.jpg",
      description: "Updated charging station description",
    };

    const updateResponse = await request(app)
      .put(`/addChargingStation/updateCharger/${chargerId}`)
      .set("authorization", `JWT ${testUser.token}`)
      .send(updatedDetails);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe(
      "Charging station updated successfully"
    );
    expect(updateResponse.body.chargingStation).toMatchObject(updatedDetails);
  });

  test("should add a selected charging station to the user's list", async () => {
    const response = await request(app)
      .post(`/addChargingStation/addSelectedChargingStation/${testUser._id}/${chargerId}`)
      .set("authorization", `JWT ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Charging station added to user's list successfully");
  });

  test("should get all chargers by user ID", async () => {
    const response = await request(app)
      .get(`/addChargingStation/getChargersByUserId/chargers/${testUser._id}`)
      .set("authorization", `JWT ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body.chargers).toBeInstanceOf(Array);
    expect(response.body.chargers.length).toBeGreaterThan(0);
  });


  test("should delete a comment from the charging station", async () => {
    expect(chargerId).toBeDefined();

    const deleteResponse = await request(app)
      .delete(`/addChargingStation/deleteChargerById/${chargerId}`)
      .set("authorization", `JWT ${testUser.token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Comment deleted successfully");
  });
});
