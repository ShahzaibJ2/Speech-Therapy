import dotenv from "dotenv";
import express from "express";
import { PORT } from './config/env.js';
import { connectDB } from "./config/db.js";
import { GoogleGenAI, createUserContent,createPartFromUri } from "@google/genai";
import userRouter from './routes/user.routes.js';
import authRouter from "./routes/auth.routes.js";
import fs from "fs";
import path from "path";
import cors from "cors";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

dotenv.config();
const app = express();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
//ELEVEN_LABS_VOICE_ID="Password" ADD TO .env WHEN DONE
app.use(express.json());
app.use(cors());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Speak Spark!');
});

// Connecting DB
app.listen(PORT, async () => {
  console.log(`Server started at http://localhost:${PORT}`);
  await connectDB();
});

// Gemini API
async function main() {
  const myfile = await ai.files.upload({
    file: "/Users/shahzaibjahangir/Documents/GitHub/Speech-Therapy/Queens-College.mp3",
    config: { mimeType: "audio/mpeg" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "Transcribe this audio clip",
    ]),
  });
  console.log(response.text);
}
await main();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});



export default app;