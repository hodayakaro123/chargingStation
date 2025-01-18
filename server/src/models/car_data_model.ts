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
    type: Number,
    required: true,
  },
  fastChargingSpeed: {
    type: Number,
    required: true,
  },
  homeChargingSpeed: {
    type: Number,
    required: true,
  },
  batteryCapacity: {
    type: Number,
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