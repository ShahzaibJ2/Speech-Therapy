import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import AIVoiceIcon from "../components/AIVoiceIcon";
import UploadBox from "../components/UploadBox";
import { Audio } from "expo-audio";

export default function PracticeScreen() {
  const [promptSentence, setPromptSentence] = useState("I love learning new words every day!");
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setFeedback("");

    try {
      // Send audio to backend for Gemini + ElevenLabs analysis
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.uri,
        type: "audio/mpeg",
        name: selectedFile.name,
      });

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setFeedback(data.feedback);

      // Play feedback audio
      if (data.feedbackAudioUrl) {
        setIsSpeaking(true);
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: data.feedbackAudioUrl });
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsSpeaking(false);
            sound.unloadAsync();
          }
        });
      }
    } catch (error) {
      console.error("❌ Error analyzing audio:", error);
      setFeedback("Oops! Something went wrong. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗣️ Practice Time!</Text>

      {/* Animated AI voice icon */}
      <AIVoiceIcon isSpeaking={isSpeaking} />

      {/* Sentence to read aloud */}
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{promptSentence}</Text>
      </View>

      {/* Upload section */}
      <UploadBox onSelectFile={setSelectedFile} />

      {/* Analyze button */}
      <Button
        title="✨ Analyze My Voice"
        onPress={handleAnalyze}
        disabled={!selectedFile || isAnalyzing}
        color="#FF7A00"
      />

      {isAnalyzing && <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 20 }} />}

      {/* Feedback area */}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#FFF9E6" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7A00", marginVertical: 20 },
  promptContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  promptText: { fontSize: 22, fontWeight: "600", color: "#444", textAlign: "center" },
  feedback: { marginTop: 20, fontSize: 18, textAlign: "center", color: "#333" },
});
