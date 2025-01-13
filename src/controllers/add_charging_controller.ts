import { Request, Response } from "express";
import ChargingModel from "../models/add_charging_model";

const addChargingStation = async (req: Request, res: Response) => {
    console.log("addChargingStation");
    try {
        const { latitude, longitude, price, rating, picture, description, comments } = req.body;
        const newChargingStation = new ChargingModel({
            latitude,
            longitude,
            price,
            rating,
            picture,
            description,
            comments,
        });
        await newChargingStation.save();
        res.status(201).json(newChargingStation);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

const addCommentToChargingStation = async (req: Request, res: Response) => {
    try {
      const { chargerId } = req.params;
      const { comment } = req.body;
      const sender = "req.user?._id; "
  
      if (!chargerId || !comment) {
        return res.status(400).json({ error: "Missing charger ID or comment" });
      }
  
      const chargingStation = await ChargingModel.findById(chargerId);
      if (!chargingStation) {
        return res.status(404).json({ error: "Charging station not found" });
      }
  
    //   chargingStation.comments.push({ sender, comment });
      await chargingStation.save();
  
      const updatedChargingStation = await ChargingModel.findById(chargerId).populate("comments.sender");
      res.status(200).json(updatedChargingStation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  };

export default { addChargingStation, addCommentToChargingStation };