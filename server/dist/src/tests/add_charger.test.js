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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const add_charging_model_1 = __importDefault(require("../models/add_charging_model"));
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
const comment1 = {
    userId: new mongoose_1.default.Types.ObjectId(),
    text: "Bad station!!!!",
    likes: 0,
    dislikes: 0,
    likedUsers: [],
    dislikedUsers: [],
    Rating: 0,
    Date: new Date(),
};
newChargingStation.comments.push(comment1);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.findOneAndDelete({ email: testUser.email });
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
    ;
    testUser._id = loginResponse.body._id;
    newChargingStation.userId = testUser._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let chargerId;
describe("add charging station Test Suite", () => {
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
    test("should get charging station by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/addChargingStation/getChargerById/${chargerId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(response.status).toBe(200);
    }));
    test("should get charging station by user id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/addChargingStation/getChargersByUserId/chargers/${testUser._id}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(response.status).toBe(200);
    }));
    test("shuold update the charging station", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/addChargingStation/updateCharger/${chargerId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({ Description: "updated station" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Charging station updated successfully");
        const charger = yield add_charging_model_1.default.findById(chargerId);
        expect(charger === null || charger === void 0 ? void 0 : charger.description).toBe("updated station");
    }));
    test("should toggleLikeDislikeCharger - increase likes", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app)
            .post(`/addChargingStation/toggleLikeDislikeCharger`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({
            chargerId: chargerId,
            userId: testUser._id,
            like: true
        });
        expect(response.status).toBe(200);
        expect(response.body.likes).toBe(1);
        expect(response.body.dislikes).toBe(0);
        response = yield (0, supertest_1.default)(app)
            .post(`/addChargingStation/toggleLikeDislikeCharger`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({
            chargerId: chargerId,
            userId: testUser._id,
            dislike: true
        });
        expect(response.status).toBe(200);
        expect(response.body.likes).toBe(0);
        expect(response.body.dislikes).toBe(1);
    }));
    test("should get all charging stations", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/addChargingStation/getAllChargers`);
        expect(response.status).toBe(200);
        expect(response.body.chargers.length).toBeGreaterThan(0);
    }));
    test("should get user by charger id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/addChargingStation/getUserByChargerId/${chargerId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(response.status).toBe(200);
    }));
    test("should delete the charging station", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/addChargingStation/deleteChargerById/${chargerId}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment deleted successfully");
        const charger = yield add_charging_model_1.default.findById(chargerId);
        expect(charger).toBeNull();
    }), 5000);
});
//# sourceMappingURL=add_charger.test.js.map