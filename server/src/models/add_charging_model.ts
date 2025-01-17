import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
});

const chargingSchema = new mongoose.Schema({
    location: {
        type: String,
        required: false,
    },
    latitude: {
        type: Number,
        required: false,
        default: 0.0,
    },
    longitude: {
        type: Number,
        required: false,
        default: 0.0,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    chargingRate: {
        type: Number,
        required: false,
        default: 0,
    },
    picture: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },

});

const chargingModel = mongoose.model("Charging", chargingSchema);
export default chargingModel;
