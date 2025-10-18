import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/genai"; 
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//Transcription function
async function transcribeAudio(audioPath) {
  try {
    const audioData = fs.readFileSync(audioPath);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Transcribe the following audio file: ${audioData.toString('base64')}`,
    });
    return response.text || "Transcription failed";
  } catch (error) {
    console.error("Error during transcription:", error);
    return null;
  }
}

//Testing
(async () => {
  const audioPath = "/Users/shahzaibjahangir/Documents/GitHub/Speech-Therapy/Queens-College.mp3"; // replace with test mp3
  const transcript = await transcribeAudio(audioPath);
  console.log("Transcript:", transcript);
})();