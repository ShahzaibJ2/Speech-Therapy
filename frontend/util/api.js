// Base URL from your .env (e.g. EXPO_PUBLIC_API_BASE_URL=http://localhost:5000)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// 🧠 1️⃣ Ping — test backend connection
export const pingServer = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/ping`);
    const text = await res.text();
    console.log("✅ Server says:", text);
  } catch (err) {
    console.error("❌ Failed to reach backend:", err);
  }
};

// 🗣️ 2️⃣ Fetch all available ElevenLabs coaches
// Example backend endpoint: GET /voices
export const fetchVoices = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/voices`);
    if (!res.ok) throw new Error("Failed to fetch voices");
    return await res.json(); // { voices: [...] }
  } catch (err) {
    console.error("Error fetching voices:", err);
    return { voices: [] };
  }
};

// 💬 3️⃣ Request an ElevenLabs agent to speak (e.g., greeting, feedback)
// Example backend endpoint: POST /agent/talk
export const talkToAgent = async (agent_id, text) => {
  try {
    const res = await fetch(`${API_BASE_URL}/agent/talk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id, text }),
    });

    if (!res.ok) throw new Error("Failed to get response from agent");
    return await res.blob(); // Returns audio blob (.mp3)
  } catch (err) {
    console.error("Error talking to agent:", err);
    throw err;
  }
};

// 🔊 4️⃣ Upload and analyze child’s recorded MP3
// Example backend endpoint: POST /analyze
export const analyzeSpeech = async (audioFile, agent_id) => {
  const formData = new FormData();
  formData.append("file", {
    uri: audioFile.uri,
    type: "audio/mpeg",
    name: audioFile.name || "speech.mp3",
  });

  if (agent_id) formData.append("agent_id", agent_id);

  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to analyze speech");
    return await res.json(); // Expecting structured response { feedback, feedbackAudioUrl, isCorrect }
  } catch (err) {
    console.error("Error analyzing speech:", err);
    throw err;
  }
};
