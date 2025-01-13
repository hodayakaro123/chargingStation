import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
});

const chargingSchema = new mongoose.Schema({

    latitude: {
        type: Number,
        required: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
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
