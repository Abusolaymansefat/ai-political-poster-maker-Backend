import { GoogleGenAI } from "@google/genai";
import config from "../config";


export const gemini = new GoogleGenAI({
  apiKey:config.gemini_api_key
});