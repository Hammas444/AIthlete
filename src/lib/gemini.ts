import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('CRITICAL: GEMINI_API_KEY environment variable is missing inside .env.local');
}

/**
 * Singleton instance of the official native Google GenAI client.
 * This client handles all multimodal text, vision, and structured JSON operations.
 */
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});