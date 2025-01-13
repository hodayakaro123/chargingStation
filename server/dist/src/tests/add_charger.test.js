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
let app;
const testUser = {
    firstName: "Tom2",
    lastName: "Guter",
    email: "tom@user.com",
    password: "123456",
    phoneNumber: "0541234567",
    selectedChargingStations: [],
    token: "",
    _id: "",
};
const newChargingStation = {
    latitude: 40.7128,
    longitude: -74.006,
    price: 10,
    rating: 4.5,
    picture: "http://example.com/picture.jpg",
    description: "A new charging station",
    userId: "",
    comments: [
        {
            text: "Great station!!!!",
        },
    ],
};
const comment1 = {
    text: "Bad station!!!!",
};
newChargingStation.comments.push(comment1);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.deleteMany();
    yield add_charging_model_1.default.deleteMany();
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
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let chargerId;
describe("add charging station Test Suite", () => {
    test("should add a new charging station", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/addChargingStation/addCharger")
            .set("authorization", `JWT ${testUser.token}`)
            .send(newChargingStation);
        expect(response.status).toBe(201);
        chargerId = response.body.chargingStation._id;
    }));
    test("should get a charging station by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const getResponse = yield (0, supertest_1.default)(app).get(`/addChargingStation/getChargerById/${chargerId}`);
        expect(getResponse.status).toBe(200);
    }));
    test("should update charger details", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedDetails = {
            latitude: 41.1234,
            longitude: -75.1234,
            price: 15,
            rating: 4.8,
            picture: "http://example.com/newpicture.jpg",
            description: "Updated charging station description",
        };
        const updateResponse = yield (0, supertest_1.default)(app)
            .put(`/addChargingStation/updateCharger/${chargerId}`)
            .set("authorization", `JWT ${testUser.token}`)
            .send(updatedDetails);
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe("Charging station updated successfully");
        expect(updateResponse.body.chargingStation).toMatchObject(updatedDetails);
    }));
    test("should add a selected charging station to the user's list", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(`/addChargingStation/addSelectedChargingStation/${testUser._id}/${chargerId}`)
            .set("authorization", `JWT ${testUser.token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Charging station added to user's list successfully");
    }));
    test("should get all chargers by user ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/addChargingStation/getChargersByUserId/chargers/${testUser._id}`)
            .set("authorization", `JWT ${testUser.token}`);
        expect(response.status).toBe(200);
        expect(response.body.chargers).toBeInstanceOf(Array);
        expect(response.body.chargers.length).toBeGreaterThan(0);
    }));
    test("should delete a comment from the charging station", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(chargerId).toBeDefined();
        const deleteResponse = yield (0, supertest_1.default)(app)
            .delete(`/addChargingStation/deleteChargerById/${chargerId}`)
            .set("authorization", `JWT ${testUser.token}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Comment deleted successfully");
    }));
});
//# sourceMappingURL=add_charger.test.js.map