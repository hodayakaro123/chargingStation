import { Request, Response } from "express";
import ChargingModel from "../models/add_charging_model";

const addComment = async (req: Request, res: Response) => {
    try {
      const { chargerId } = req.params; 
      const { text } = req.body; 
  
      if (!text) {
        return res.status(400).json({ error: "Comment text is required" });
      }
  
  
      const chargingStation = await ChargingModel.findById(chargerId);
      if (!chargingStation) {
        return res.status(404).json({ error: "Charging station not found" });
      }
  
  
      chargingStation.comments.push({ text });
      await chargingStation.save();
  
      res.status(201).json({
        message: "Comment added successfully",
        chargingStation,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to add charging station", error });
  }
};

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { chargerId, commentId } = req.params;

        const chargingStation = await ChargingModel.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }

        const comment = chargingStation.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({ message: "Comment retrieved successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve comment", error });
    }
};


const updateComment = async (req: Request, res: Response) => {
    console.log("addComment");

    try {
        const { chargerId, commentId } = req.params;
        const { text } = req.body;

        const chargingStation = await ChargingModel.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }

        const comment = chargingStation.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.text = text;
        await chargingStation.save();

        res.status(200).json({ message: "Comment updated successfully", chargingStation });
    } catch (error) {
        res.status(500).json({ message: "Failed to update comment", error });
    }
};

const deleteCommentById = async (req: Request, res: Response) => {
    try {
        const { chargerId, commentId } = req.params;

        const chargingStation = await ChargingModel.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }

        const comment = chargingStation.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.deleteOne();
        await chargingStation.save();

        res.status(200).json({ message: "Comment deleted successfully", chargingStation });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete comment", error });
    }
};

export default { addComment, updateComment, deleteCommentById, getCommentById };