import dotenv from "dotenv";
import express from "express";
import { PORT } from './config/env.js';
import { connectDB } from "./config/db.js";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import userRouter from './routes/user.routes.js';
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import middleware from "./middlewares/errors.middleware.js";
import cors from "cors";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
const app = express();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

dotenv.config();

//ELEVEN_LABS_VOICE_ID="Password" ADD TO .env WHEN DONE
app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use(middleware);

app.get('/', (req, res) => {
    res.send('Welcome to the Speak Spark!');
});

// Connecting DB
app.listen(PORT, async () => {
  console.log(`Server started at http://localhost:${PORT}`);
  await connectDB();
});

async function main(fileInput) {
  const myfile = await ai.files.upload({
    file: `${fileInput}`,
    config: { mimeType: "audio/mpeg" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "Please provide an array named wordList with the correct prnounciations of any words that were mispronounced in the audio file. Format the response as a javascript array inside a markdown code block. For example: ```javascript [ 'word1', 'word2' ] ```",
    ]),
  });

}

const correctPronouncation = await main("/Users/shahzaibjahangir/Documents/GitHub/Speech-Therapy/Queens College.mp3");
console.log(correctPronouncation);

export default app;