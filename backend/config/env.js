import { config } from 'dotenv';
config();

export const { PORT, MONGO_URI, GEMINI_API_KEY, ELEVEN_LABS_API_KEY} = process.env;