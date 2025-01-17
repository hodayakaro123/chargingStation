import { Request, Response } from "express";
import BookCharger from "../models/book_a_chrager.model";

const bookCharger = async (req: Request, res: Response) => {
    try {
        const { chargerId, StartTime, EndTime, Date, userId } = req.body;
    
        const booking = new BookCharger({
        chargerId,
        StartTime,
        EndTime,
        Date,
        userId,
        });
    
        await booking.save();
    
        res.status(201).json({ message: "Charger booked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to book charger", error });
    }

};

export default { bookCharger };