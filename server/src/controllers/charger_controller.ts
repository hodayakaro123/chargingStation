import { Request, Response } from "express";
import ChargingModel from "../models/add_charging_model";
import userModel from "../models/user_model";
import mongoose from "mongoose";
import axios from 'axios';



const getCoordinates = async (address: string) => {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `${process.env.OPENCAGE_API_URL}=${encodeURIComponent(address)}&key=${apiKey}`;  
    try {
      const response = await axios.get(url);
      const data = response.data as { results: { geometry: { lat: number, lng: number } }[] };
  
      if (data.results.length > 0) {
        const latitude = data.results[0].geometry.lat;
        const longitude = data.results[0].geometry.lng;
  
        console.log('Coordinates:', latitude, longitude);
        return { latitude, longitude };
      } else {
        console.error('No results found for the given address.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };
  



const addChargingStation = async (req: Request, res: Response) => {
    

    try {
      const { location, chargingRate, price, description } = req.body;
  
      const coordinates = await getCoordinates(location);
      if (!coordinates) {
        return res.status(400).json({ error: 'Invalid location' });
      }
      const { latitude, longitude } = coordinates;

      const newChargingStation = new ChargingModel({
        location,
        latitude,
        longitude,
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