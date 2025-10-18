import dotenv from "dotenv";
import express from "express";
import { PORT } from './config/env.js';
import { connectDB } from "./config/db.js";
import { GoogleGenAI } from "@google/genai";
import userRouter from './routes/user.routes.js';
import authRouter from "./routes/auth.routes.js";
import multer from "multer";  
import fs from "fs";
import path from "path";
import cors from "cors";
import errorMiddleware from "./middlewares/errors.middleware.js";

const app = express();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use(errorMiddleware);

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
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}
main();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)){ 
      fs.mkdirSync(uploadPath);}
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);//a unique filename
  },
});
const upload = multer({ storage: storage });

async function transcribeAudio(audioPath) {
  try{
    const audioData = fs.readFileSync(audioPath);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Transcribe the following audio file: ${audioData.toString('base64')}`,
    });
  return response.text || "Transcription failed";
  }
  catch (error) {
    console.error("Error during transcription:", error);
    return null;
  }
}

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;
    console.log("Audio uploaded:", audioPath);
    const transcript = await transcribeAudio(audioPath); // Call the transcription function, get script

    res.json({ message: "Audio uploaded and transcribed!", transcript });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Audio processing failed" });
  }
});
console.log("Server is running and ready to accept requests.");
export default app;