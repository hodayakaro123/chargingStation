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

const getAllBookings = async (req: Request, res: Response) => {
    try {
      const bookings = await BookCharger.find({});
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings", error });
    }
  };
  
  const getBookingById = async (req: Request, res: Response) => {
    try {
      const bookingId = req.params.bookingId;
      const booking = await BookCharger.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking", error });
    }
  };
  
  const deleteBookingByID = async (req: Request, res: Response) => {
    try {
      const bookingId = req.params.bookingId;
      const booking = await BookCharger.findByIdAndDelete(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete booking", error });
    }
};
  
export default { bookCharger, getAllBookings, getBookingById, deleteBookingByID };

