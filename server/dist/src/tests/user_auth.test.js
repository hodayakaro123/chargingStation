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
const testUserError = {
    firstName: "Tom2",
    lastName: "Guter",
    email: "tom@user.com",
    password: "",
    phoneNumber: "0541234567",
    picture: null,
    selectedChargingStations: [],
    carDetails: null,
    refreshTokens: [],
    _id: new mongoose_1.default.Types.ObjectId(),
};
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.findOneAndDelete({ email: testUser.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Auth Tests", () => {
    test("Auth Registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const registerResponse = yield (0, supertest_1.default)(app)
            .post("/auth/signUp")
            .send(testUser);
        expect(registerResponse.statusCode).toBe(200);
    }));
    test("Auth Registration fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const registerResponse = yield (0, supertest_1.default)(app)
            .post("/auth/signUp")
            .send(testUserError);
        expect(registerResponse.statusCode).not.toBe(200);
    }));
    test("Auth Registration fail - register the same user", () => __awaiter(void 0, void 0, void 0, function* () {
        const registerResponse = yield (0, supertest_1.default)(app)
            .post("/auth/signUp")
            .send(testUser);
        expect(registerResponse.statusCode).not.toBe(200);
    }));
    test("Auth Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: testUser.password });
        expect(loginResponse.statusCode).toBe(200);
        testUser.refreshTokens.push(loginResponse.body.accessToken);
        testUser.refreshTokens.push(loginResponse.body.refreshToken);
        ;
        testUser._id = loginResponse.body._id;
    }));
    test("Make sure two access tokens are not the same", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(testUser.refreshTokens[0]).not.toBe(testUser.refreshTokens[1]);
    }));
    test("Auth Login fail - missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "", password: "wrongPassword" });
        expect(loginResponse.statusCode).toBe(400);
        expect(loginResponse.text).toBe("wrong email or password");
    }));
    test("Auth Login fail - wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: "wrongPassword" });
        expect(loginResponse.statusCode).toBe(400);
        expect(loginResponse.text).toBe("wrong email or password");
    }));
    test("Auth Login fail - wrong email", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "wrong@gmail.com", password: "wrongPassword" });
        expect(loginResponse.statusCode).toBe(400);
        expect(loginResponse.text).toBe("wrong email or password");
    }));
    test("should get user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/auth/getUserById/${testUser._id}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send();
        expect(response.statusCode).toBe(200);
    }));
    test("should verify access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/verifyAccessToken")
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Token is valid");
    }));
    test("should fail to verify access token - missing token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/verifyAccessToken")
            .set("authorization", `Bearer `)
            .send();
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe("missing token");
    }));
    test("should refresh token successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/refresh")
            .send({ refreshToken: testUser.refreshTokens[1] });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        testUser.refreshTokens[0] = response.body.accessToken;
        testUser.refreshTokens[1] = response.body.refreshToken;
    }));
    test("should fail to refresh token - missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/refresh")
            .send({ refreshToken: "" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Invalid token");
    }));
    test("should update user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const imagePath = path_1.default.resolve(__dirname, "sedan_test.png");
        if (!fs_1.default.existsSync(imagePath)) {
            throw new Error(`File not found: ${imagePath}`);
        }
        const updatedUserData = {
            firstName: "UpdatedFirstName",
            lastName: "UpdatedLastName",
            phoneNumber: "0547654321"
        };
        const response = yield (0, supertest_1.default)(app)
            .put(`/auth/updateUser/${testUser._id}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .field("firstName", updatedUserData.firstName)
            .field("lastName", updatedUserData.lastName)
            .field("phoneNumber", updatedUserData.phoneNumber);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "User updated successfully");
        expect(response.body.user).toHaveProperty("firstName", updatedUserData.firstName);
        expect(response.body.user).toHaveProperty("lastName", updatedUserData.lastName);
        expect(response.body.user).toHaveProperty("phoneNumber", updatedUserData.phoneNumber);
    }));
    test("should fail to logout user - missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/logout")
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({ refreshToken: "" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("missing refresh token");
    }));
    test("should logout user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/logout")
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send({ refreshToken: testUser.refreshTokens[1] });
        expect(response.statusCode).toBe(200);
    }));
    test("Auth Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: testUser.password });
        expect(loginResponse.statusCode).toBe(200);
        testUser.refreshTokens.push(loginResponse.body.accessToken);
        testUser.refreshTokens.push(loginResponse.body.refreshToken);
        ;
        testUser._id = loginResponse.body._id;
    }));
    test("should delete user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/auth/deleteUser/${testUser._id}`)
            .set("authorization", `Bearer ${testUser.refreshTokens[0]}`)
            .send();
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=user_auth.test.js.map