import { Request, Response } from "express";
import ChargingModel from "../models/add_charging_model";
import userModel from "../models/user_model";
import mongoose from "mongoose";

const addChargingStation = async (req: Request, res: Response) => {
    try {
      const { location, chargingRate, price, description } = req.body;
  
  
      const newChargingStation = new ChargingModel({
        location,
        price,
        chargingRate,
        description,
      });
  
      await newChargingStation.save();
  
      res.status(201).json({
        message: "Charging station added successfully",
        chargingStation: newChargingStation,
      });
    } catch (error) {
      console.error("Error in addChargingStation:", error);
      res.status(500).json({ message: "Failed to add charging station", error });
    }
  };
  

const getChargerById = async (req: Request, res: Response) => {
    try {
        const { chargerId } = req.params;

        const chargingStation = await ChargingModel.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }

  

        res.status(200).json({ message: "Charger retrieved successfully", chargingStation });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve charger", error });
    }
};

const getChargersByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const chargers = await ChargingModel.find({ userId });
        if (!chargers) {
            return res.status(404).json({ message: "No charging stations found for this user" });
        }

        res.status(200).json({ chargers });
    } catch (error) {
        res.status(500).json({ message: "Failed to get charging stations", error });
    }
};


const updateCharger = async (req: Request, res: Response) => {
    try {
        const { chargerId } = req.params;
        const updateData = req.body;

        const chargingStation = await ChargingModel.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }

        Object.keys(updateData).forEach(key => {
            (chargingStation as any)[key] = updateData[key];
        });

        await chargingStation.save();

        res.status(200).json({ message: "Charging station updated successfully", chargingStation });
    } catch (error) {
        res.status(500).json({ message: "Failed to update charging station", error });
    }
};

const deleteChargerById = async (req: Request, res: Response) => {
    try {
        const { chargerId } = req.params;

        await ChargingModel.findByIdAndDelete(chargerId);


        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete comment", error });
    }
};

const addSelectedChargingStation = async (req: Request, res: Response) => {
    try {
        const { userId, chargerId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const chargingStation = await ChargingModel.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }

        const chargerObjectId = new mongoose.Types.ObjectId(chargerId);

        
        if (!user.selectedChargingStations.includes(chargerObjectId)) {
            user.selectedChargingStations.push(chargerObjectId);
            await user.save();
        }

        

        res.status(200).json({ message: "Charging station added to user's list successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to add charging station to user's list", error });
    }
};

export default { addChargingStation, getChargerById, updateCharger, deleteChargerById, addSelectedChargingStation, getChargersByUserId };