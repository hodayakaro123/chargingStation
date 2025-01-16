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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set in the .env file");
}
const agent = new https_1.default.Agent({
    keepAlive: false, // Disable keep-alive
    maxSockets: 1, // Limit concurrent connections
});
const generateCarInfo = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    const systemPrompt = `Provide only the range (in km), charging speed (in kW) and battery capacity (in kWh) for ${text}. 
                       Format response exactly like this: range: number, charging speed: number, battery capacity: number.
                       Only provide these two metrics, no additional text.`;
    const payload = {
        contents: [
            {
                parts: [{ text: systemPrompt }],
            },
        ],
    };
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            httpsAgent: agent,
            timeout: 10000,
        };
        const response = yield axios_1.default.post(url, payload, config);
        const data = response.data;
        const text = data.candidates[0].content.parts[0].text.trim();
        const [rangePart, chargingPart, batteryPart] = text.split(',').map(part => part.trim());
        const range = parseInt(rangePart.split(':')[1]);
        const chargingSpeed = parseInt(chargingPart.split(':')[1]);
        const batteryCapacity = parseInt(batteryPart.split(':')[1]);
        return `Range: ${range}km, Charging Speed: ${chargingSpeed}kw, Battery Capacity: ${batteryCapacity}kwh`;
    }
    catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
    finally {
        agent.destroy();
    }
});
exports.default = generateCarInfo;
//// a simple foramt to get data from gemini api
// import dotenv from "dotenv";
// import axios from "axios";
// import type { AxiosRequestConfig } from 'axios/index';
// import https from "https";
// dotenv.config();
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
// interface GeminiResponse {
//   candidates: {
//     avgLogprobs: number;
//     content: {
//       parts: {
//         text: string;
//       }[];
//       role: string;
//     };
//     finishReason: string;
//   }[];
//   modelVersion: string;
//   usageMetadata: {
//     candidatesTokenCount: number;
//     promptTokenCount: number;
//     totalTokenCount: number;
//   };
// }
// if (!GEMINI_API_KEY) {
//   throw new Error("Gemini API key is not set in the .env file");
// }
// const agent = new https.Agent({
//   keepAlive: false, // Disable keep-alive
//   maxSockets: 1, // Limit concurrent connections
// });
// const generateContent = async (text: string): Promise<string> => {
//   const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
//   const payload = {
//     contents: [
//       {
//         parts: [{ text }],
//       },
//     ],
//   };
//   try {
//     const config = {
//       headers: { "Content-Type": "application/json" },
//       httpsAgent: agent,
//       timeout: 5000,
//     } as AxiosRequestConfig;
//     const response = await axios.post(url, payload, config as any);
//     const data = response.data as GeminiResponse;
//     const generatedText = data.candidates[0].content.parts[0].text;
//     return generatedText;
//   } catch (error) {
//     console.error("Error generating content:", error);
//     throw error;
//   } finally {
//     agent.destroy();
//   }
// };
// export default generateContent;
// import dotenv from "dotenv";
// import axios from "axios";
// dotenv.config();
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
// interface GeminiResponse {
//   candidates: {
//     avgLogprobs: number;
//     content: {
//       parts: {
//         text: string;
//       }[];
//       role: string;
//     };
//     finishReason: string;
//   }[];
//   modelVersion: string;
//   usageMetadata: {
//     candidatesTokenCount: number;
//     promptTokenCount: number;
//     totalTokenCount: number;
//   };
// }
// if (!GEMINI_API_KEY) {
//   throw new Error("Gemini API key is not set in the .env file");
// }
// export const generateContent = async (text: string): Promise<string> => {
//   const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
//   const payload = {
//     contents: [
//       {
//         parts: [{ text }],
//       },
//     ],
//   };
//   try {
//     const response = await axios.post(url, payload, {
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = response.data as GeminiResponse;
//     const generatedText = data.candidates[0].content.parts[0].text;
//     return generatedText;
//   } catch (error) {
//     console.error("Error generating content:", error);
//     throw error;
//   }
// };
//# sourceMappingURL=geminiService.js.map