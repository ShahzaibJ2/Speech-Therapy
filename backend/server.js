import dotenv from "dotenv";
import express from "express";
import { PORT } from './config/env.js';
import { connectDB } from "./config/db.js";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import userRouter from './routes/user.routes.js';
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import middleware from "./middlewares/errors.middleware.js";

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
      "Transcribe this audio clip and find the mispronounced words. I need you to create an arrays called wordsCorrectlyProunounced that will store the words that were incorrectly pronounced and provide an enunciation of the words in paranthesis next to the correct word. So something like 'apple'('ah-puh-le'",
    ]),
  });

  const filtering = response.text.match(/```javascript([\s\S]*?)```/);
  const correctPronouncation = filtering[1].trim();
  return correctPronouncation;
}

const correctPronouncation = await main("Recording (3).m4a");
console.log(correctPronouncation);

export default app;