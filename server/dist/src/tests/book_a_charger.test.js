"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const add_charging_model_1 = __importDefault(require("../models/add_charging_model"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let app;
const testUser = {
    firstName: "Tom2",
    lastName: "Guter",
    email: "tom@user.com",
    password: "123456",
    phoneNumber: "0541234567",
    picture: null,
    selectedChargingStations: [],
    carDetails: null,
    refreshTokens: [],
    _id: new mongoose_1.default.Types.ObjectId(),
};
const newChargingStation = {
    location: "New York",
    latitude: 40.7128,
    longitude: -74.006,
    price: 10,
    rating: 4.5,
    chargingRate: 5,
    picture: "http://example.com/picture.jpg",
    description: "A new charging station",
    userId: new mongoose_1.default.Types.ObjectId(),
    likes: 0,
    dislikes: 0,
    likedUsers: [],
    dislikedUsers: [],
    comments: [
        {
            userId: new mongoose_1.default.Types.ObjectId(),
            text: "Great station!!!!",
            likes: 0,
            dislikes: 0,
            likedUsers: [],
            dislikedUsers: [],
            Rating: 0,
            Date: new Date(),
        },
    ],
};
const bookingCharger = {
    bookingId: "",
    chargerId: "",
    StartTime: "10:00",
    EndTime: "12:00",
    Date: "2022-01-01",
    contactNumber: "0541234567",
    Message: "Booking for charging",
    Status: "Pending",
    userId: new mongoose_1.default.Types.ObjectId(),
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.findOneAndDelete({ email: testUser.email });
    yield add_charging_model_1.default.findOneAndDelete({
        location: newChargingStation.location,
    });
    const registerResponse = yield (0, supertest_1.default)(app)
        .post("/auth/signUp")
        .send(testUser);
    expect(registerResponse.statusCode).toBe(200);
    const loginResponse = yield (0, supertest_1.default)(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
    expect(loginResponse.statusCode).toBe(200);
    testUser.refreshTokens.push(loginResponse.body.accessToken);
    testUser.refreshTokens.push(loginResponse.body.refreshToken);
    testUser._id = loginResponse.body._id;
    newChargingStation.userId = testUser._id;
    bookingCharger.userId = testUser._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let chargerId;
describe("Book a charger", () => {
    test("should add a new charging station", () => __awaiter(void 0, void 0, void 0, function* () {
        const imagePath = path_1.default.resolve(__dirname, "sedan_test.png");
        console.log("imagePath", imagePath);
        if (!fs_1.default.existsSync(imagePath)) {
            throw new Error(`File not found: ${imagePath}`);
        }
        const response = yield (0, supertest_1.default)(app)
            .post("/addChargingStation/addCharger")
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .field("userId", testUser._id.toString())
            .field("location", newChargingStation.location)
            .field("chargingRate", newChargingStation.chargingRate.toString())
            .field("price", newChargingStation.price.toString())
            .field("description", newChargingStation.description)
            .field("latitude", newChargingStation.latitude.toString())
            .field("longitude", newChargingStation.longitude.toString())
            .field("test", "test")
            .attach("image", imagePath);
        if (response.status !== 201) {
            console.error("Error response:", response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Charging station added successfully");
        expect(response.body.chargingStation).toHaveProperty("_id");
        chargerId = response.body.chargingStation._id;
    }));
    test("should book a charger", () => __awaiter(void 0, void 0, void 0, function* () {
        bookingCharger.chargerId = chargerId;
        bookingCharger.userId = testUser._id;
        const bookChargerResponse = yield (0, supertest_1.default)(app)
            .post("/bookings/bookCharger")
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({
            chargerId: bookingCharger.chargerId,
            startTime: bookingCharger.StartTime,
            endTime: bookingCharger.EndTime,
            date: bookingCharger.Date,
            message: bookingCharger.Message,
            contactNumber: bookingCharger.contactNumber,
            userId: bookingCharger.userId,
        });
        expect(bookChargerResponse.statusCode).toBe(201);
        expect(bookChargerResponse.body.message).toBe("Charger booked successfully");
    }));
    test("should get all bookings", () => __awaiter(void 0, void 0, void 0, function* () {
        const getAllBookingsResponse = yield (0, supertest_1.default)(app)
            .get("/bookings/getAllBookings")
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(getAllBookingsResponse.statusCode).toBe(200);
        expect(getAllBookingsResponse.body.length).toBeGreaterThan(0);
    }));
    test("should get booking by charger id", () => __awaiter(void 0, void 0, void 0, function* () {
        const getBookingByChargerIdResponse = yield (0, supertest_1.default)(app)
            .get(`/bookings/getBookingByChargerId/${chargerId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(getBookingByChargerIdResponse.statusCode).toBe(200);
        expect(getBookingByChargerIdResponse.body.length).toBeGreaterThan(0);
    }));
    test("should get booking by userId", () => __awaiter(void 0, void 0, void 0, function* () {
        const getBookingByUserIdResponse = yield (0, supertest_1.default)(app)
            .get(`/bookings/getBookingByUserId/${testUser._id}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(getBookingByUserIdResponse.statusCode).toBe(200);
        expect(getBookingByUserIdResponse.body.length).toBeGreaterThan(0);
    }));
    test("should update booking", () => __awaiter(void 0, void 0, void 0, function* () {
        const getBookingByUserIdResponse = yield (0, supertest_1.default)(app)
            .get(`/bookings/getBookingByUserId/${testUser._id}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        const bookingId = getBookingByUserIdResponse.body[0]._id;
        const updateBookingResponse = yield (0, supertest_1.default)(app)
            .put(`/bookings/updateBooking/${bookingId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({
            bookingId: bookingId,
            chargerId: bookingCharger.chargerId,
            startTime: bookingCharger.StartTime,
            endTime: bookingCharger.EndTime,
            date: bookingCharger.Date,
            message: bookingCharger.Message,
            contactNumber: bookingCharger.contactNumber,
            userId: bookingCharger.userId,
            status: "Approved",
        });
        expect(updateBookingResponse.statusCode).toBe(200);
        expect(updateBookingResponse.body.message).toBe("Booking updated successfully");
    }));
    test("Should delete the created booking", () => __awaiter(void 0, void 0, void 0, function* () {
        const deleteBookingResponse = yield (0, supertest_1.default)(app)
            .delete(`/bookings/deleteBookingByID/${chargerId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        if (deleteBookingResponse.statusCode === 404) {
            expect(deleteBookingResponse.body.message).toBe("Booking not found");
        }
        else {
            expect(deleteBookingResponse.statusCode).toBe(200);
            expect(deleteBookingResponse.body.message).toBe("Booking deleted successfully");
        }
    }));
});
//# sourceMappingURL=book_a_charger.test.js.map