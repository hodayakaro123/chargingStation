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
const book_a_chrager_model_1 = __importDefault(require("../models/book_a_chrager.model"));
let app;
const testUser = {
    firstName: "Tom3",
    lastName: "Guter",
    email: "tom@user.com",
    password: "123456",
    phoneNumber: "0541234567",
    selectedChargingStations: [],
    token: "",
    _id: "",
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
    userId: "",
    comments: [
        {
            text: "Great station!!!!",
        },
    ],
};
const newBookCharger = {
    chargerId: "",
    StartTime: "2022-01-01T10:00:00.000Z",
    EndTime: "2022-01-01T12:00:00.000Z",
    Date: "2022-01-01",
    userId: "",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.deleteMany();
    yield add_charging_model_1.default.deleteMany();
    yield book_a_chrager_model_1.default.deleteMany();
    const registerResponse = yield (0, supertest_1.default)(app)
        .post("/auth/signUp")
        .send(testUser);
    expect(registerResponse.statusCode).toBe(200);
    const loginResponse = yield (0, supertest_1.default)(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
    expect(loginResponse.statusCode).toBe(200);
    testUser.token = loginResponse.body.accessToken;
    testUser._id = loginResponse.body._id;
    newChargingStation.userId = testUser._id;
    newBookCharger.userId = testUser._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Book a charger", () => {
    test("should add a new charging station", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/addChargingStation/addCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newChargingStation);
        expect(response.status).toBe(201);
    }));
    test("should book a charger", () => __awaiter(void 0, void 0, void 0, function* () {
        const addChargingStationResponse = yield (0, supertest_1.default)(app)
            .post("/bookings/bookCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newChargingStation);
        expect(addChargingStationResponse.statusCode).toBe(201);
        newBookCharger.chargerId = addChargingStationResponse.body.chargingStation._id;
        const bookChargerResponse = yield (0, supertest_1.default)(app)
            .post("/bookings/bookCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newBookCharger);
        expect(bookChargerResponse.statusCode).toBe(201);
        expect(bookChargerResponse.body.message).toBe("Charger booked successfully");
    }));
});
//# sourceMappingURL=book_a_charger.test.js.map