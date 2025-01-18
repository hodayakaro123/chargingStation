// // Tom-Guter-316487230
// // Hodaya-Karo-322579848

import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import addChargingStation from "./routes/charger_route";
import cors from "cors";
import addComments from "./routes/commentsOnCharger_route";
import userRouter from "./routes/user_route";
import carDaraRouter from "./routes/car_data_route";
import bookCharger from "./routes/book_a_charger_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import geminiRouter from "./routes/gemini_route";

const app = express();
dotenv.config();

app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Assignment 2 2025 REST API",
      version: "1.0.0",
      description:
        "REST server including authentication using JWT, CRUD operations on charging stations, comments, and a user registration system.",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const moduleApp = async (): Promise<Express> => {
  if (!process.env.DB_CONNECT) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/auth", userRouter);
  app.use("/addChargingStation", addChargingStation);
  app.use("/addComments", addComments);
  app.use("/gemini", geminiRouter);
  app.use("/bookings", bookCharger);
  app.use("/carData", carDaraRouter);

  return app;
};

export default moduleApp;
