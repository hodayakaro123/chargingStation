import request from "supertest";
import moduleApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";
import path from "path";
import fs from "fs";
import chargingStationModel from "../models/add_charging_model";

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

const newChargingStation = {
  location: "New York",
  latitude: 40.7128,
  longitude: -74.006,
  price: 10,
  rating: 4.5,
  chargingRate: 5,
  picture: "http://example.com/picture.jpg",
  description: "A new charging station",
  userId: new mongoose.Types.ObjectId(),
  likes: 0,
  dislikes: 0,
  likedUsers: [],
  dislikedUsers: [],
  comments: [
    {
      userId: new mongoose.Types.ObjectId(), 
      text: "Great station!!!!",
      likes: 0,
      dislikes: 0,
      likedUsers: [],
      dislikedUsers: [],
      Rating: 0,
      Date: new Date(),
    },
  ],
};

const comment1 = {
  userId: new mongoose.Types.ObjectId(), 
  text: "Bad station!!!!",
  likes: 0,
  dislikes: 0,
  likedUsers: [],
  dislikedUsers: [],
  Rating: 0,
  Date: new Date(),
};

newChargingStation.comments.push(comment1);

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
  newChargingStation.userId = testUser._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});




let chargerId: string;

describe("add charging station Test Suite", () => {

  test("should add a new charging station", async () => {
    const imagePath = path.resolve(__dirname, "sedan_test.png");
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    const response = await request(app)
      .post("/addChargingStation/addCharger")
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
      .field("userId", testUser._id.toString())
      .field("location", newChargingStation.location)
      .field("chargingRate", newChargingStation.chargingRate.toString())
      .field("price", newChargingStation.price.toString())
      .field("description", newChargingStation.description)
      .field("latitude", newChargingStation.latitude.toString())
      .field("longitude", newChargingStation.longitude.toString())
      .field("test", "test")
      .attach("image", imagePath);

    if (response.status !== 201) {
      console.error("Error response:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Charging station added successfully");
    expect(response.body.chargingStation).toHaveProperty("_id");

    chargerId = response.body.chargingStation._id;

  });

  test("should get charging station by id", async () => {
    const response = await request(app)
      .get(`/addChargingStation/getChargerById/${chargerId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);

    expect(response.status).toBe(200);
  });

  test("should fail to get charging station by id - invalid id", async () => {
    const wrongId = "178b07b45241b1227ffe2b9a";
    const response = await request(app)
      .get(`/addChargingStation/getChargerById/${wrongId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);

    expect(response.status).toBe(404);
  });

  test("should fail to get charging station by user id - invalid id", async () => {
    const wrongId = "178b07b45241b1227ffe2b9p";
    const response = await request(app)
    .get(`/addChargingStation/getChargersByUserId/chargers/${wrongId}`)
    .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to get charging stations");
  });
  
  test("should get charging station by user id", async () => {
    const response = await request(app)
      .get(`/addChargingStation/getChargersByUserId/chargers/${testUser._id}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);

    expect(response.status).toBe(200);
  });

  
  test("shuold update the charging station", async () => {
    const response = await request(app)
      .put(`/addChargingStation/updateCharger/${chargerId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
      .send({ Description: "updated station", Price: 20 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Charging station updated successfully");

    const charger = await chargingStationModel.findById(chargerId);
    expect(charger?.description).toBe("updated station");
  });

  test("should toggleLikeDislikeCharger", async () => {
    let response = await request(app)
      .post(`/addChargingStation/toggleLikeDislikeCharger`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
      .send({
        chargerId: chargerId,
        userId: testUser._id,
        like: true
    });

    expect(response.status).toBe(200);
    expect(response.body.likes).toBe(1);
    expect(response.body.dislikes).toBe(0);

    response = await request(app)
      .post(`/addChargingStation/toggleLikeDislikeCharger`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
      .send({
        chargerId: chargerId,
        userId: testUser._id,
        dislike: true
    });

    expect(response.status).toBe(200);
    expect(response.body.likes).toBe(0);
    expect(response.body.dislikes).toBe(1);

  });

  test("should fail to toggleLikeDislikeCharger - invalid id", async () => {
    const wrongId = "178b07b45241b1227ffe2rra";
    const response = await request(app)
      .post(`/addChargingStation/toggleLikeDislikeCharger`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
      .send({
        chargerId: wrongId,
        userId: testUser._id,
        like: true
    });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error");
  });

  test("should get all charging stations", async () => {
    const response = await request(app)
      .get(`/addChargingStation/getAllChargers`)


    expect(response.status).toBe(200);
    expect(response.body.chargers.length).toBeGreaterThan(0);
  });

  test("should get user by charger id", async () => {
    const response = await request(app)
      .get(`/addChargingStation/getUserByChargerId/${chargerId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
    expect(response.status).toBe(200);
  });

  test("should fail to get user by charger id - invalid id", async () => {
    const wrongId = "178b07b45241b1227ffe2b9r";
    const response = await request(app)
      .get(`/addChargingStation/getUserByChargerId/${wrongId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to get user");
  });


  test("should delete the charging station", async () => {
    const response = await request(app)
      .delete(`/addChargingStation/deleteChargerById/${chargerId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)

      
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment deleted successfully");

    const charger = await chargingStationModel.findById(chargerId);
    expect(charger).toBeNull();


  }, 5000);

  test("should fail to delete the charging station - invalid id", async () => {
    const wrongId = "178b07b45241b1227ffe2f6a";
    const response = await request(app)
      .delete(`/addChargingStation/deleteChargerById/${wrongId}`)
      .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Charging station not found");
  });

});
