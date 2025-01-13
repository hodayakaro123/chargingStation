import mongoose from "mongoose";

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
        type: [String],
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    // const testComment = {
    //     comment: "This is a great charging station!", // The comment text you want to add
    //   };
});

const chargingModel = mongoose.model("Charging", chargingSchema);
export default chargingModel;
