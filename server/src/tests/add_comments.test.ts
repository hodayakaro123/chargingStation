import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";
import chargingStationModel from "../models/add_charging_model";

let app: Express;
let comment1Id: string;

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
  app = await initApp();

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


describe("add charging station Test Suite", () => {
    let chargingStationId: string;


    test("should add a new charging station", async () => {
        
        const response = await request(app)
            .post("/addChargingStation/addCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newChargingStation);

        expect(response.status).toBe(201);

        chargingStationId = response.body.chargingStation._id;

    });

    test("should add a comment to the charging station", async () => {
      const newComment = {
        text: "Could be a better station!!!!", 
      };
    
 
      const commentResponse = await request(app)
        .post(`/addComments/addComment/${chargingStationId}`) 
        .set("authorization", `JWT ${testUser.token}`) 
        .send(newComment); 
    

      expect(commentResponse.status).toBe(201); 
      expect(commentResponse.body.message).toBe("Comment added successfully"); 
      expect(commentResponse.body.chargingStation.comments).toContainEqual(
        expect.objectContaining(newComment) 
      );

      comment1Id = commentResponse.body.chargingStation.comments[0]._id;

    });

    test("should get a comment by ID from the charging station", async () => {
        expect(comment1Id).toBeDefined();
    
        const getResponse = await request(app)
            .get(`/addComments/getComment/${chargingStationId}/${comment1Id}`)
            .set("authorization", `JWT ${testUser.token}`);
    
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.message).toBe("Comment retrieved successfully");

    });

    test("should update a comment on the charging station", async () => {
        const updatedComment = {
          text: "Updated comment text",
        };
      
        const updateResponse = await request(app)
          .put(`/addComments/updateComment/${chargingStationId}/${comment1Id}`)
          .set("authorization", `JWT ${testUser.token}`)
          .send(updatedComment);
      
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe("Comment updated successfully");

    });

    test("should delete a comment from the charging station", async () => {
        expect(comment1Id).toBeDefined();
    
        const deleteResponse = await request(app)
            .delete(`/addComments/deleteComment/${chargingStationId}/${comment1Id}`)
            .set("authorization", `JWT ${testUser.token}`);
    
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Comment deleted successfully");
    

    });
});
  


