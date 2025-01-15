import dotenv from "dotenv";
import axios from "axios";
import type { AxiosRequestConfig } from 'axios/index';
import https from "https";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;



interface GeminiResponse {
  candidates: {
    avgLogprobs: number;
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
  }[];
  modelVersion: string;
  usageMetadata: {
    candidatesTokenCount: number;
    promptTokenCount: number;
    totalTokenCount: number;
  };
}

if (!GEMINI_API_KEY) {
  throw new Error("Gemini API key is not set in the .env file");
}


const agent = new https.Agent({
  keepAlive: false, // Disable keep-alive
  maxSockets: 1, // Limit concurrent connections
});

const generateCarInfo = async (text: string): Promise<string> => {
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
    } as AxiosRequestConfig;

    const response = await axios.post(url, payload, config as any);

    const data = response.data as GeminiResponse;
    const text = data.candidates[0].content.parts[0].text.trim();
    

    const [rangePart, chargingPart, batteryPart] = text.split(',').map(part => part.trim());
    const range: number = parseInt(rangePart.split(':')[1]);
    const chargingSpeed: number = parseInt(chargingPart.split(':')[1]);
    const batteryCapacity: number = parseInt(batteryPart.split(':')[1]);

    return `Range: ${range}km, Charging Speed: ${chargingSpeed}kw, Battery Capacity: ${batteryCapacity}kwh`;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  } finally {
    
    agent.destroy();
  }
};

export default generateCarInfo;








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