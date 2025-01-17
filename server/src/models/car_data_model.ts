import mongoose from "mongoose";

const carDataSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  range: {
    type: String,
    required: true,
  },
  fastChargingSpeed: {
    type: String,
    required: true,
  },
  homeChargingSpeed: {
    type: String,
    required: true,
  },
  batteryCapacity: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const carDataModel = mongoose.model("CarData", carDataSchema);
export default carDataModel;