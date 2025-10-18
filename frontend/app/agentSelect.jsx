import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-audio";
import { fetchVoices, talkToAgent } from "../util/api";

export default function AgentSelect() {
  const router = useRouter();
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Fallback demo coaches (always shown if no backend data) ---
  const demoVoices = [
    {
      agent_id: "demo1",
      name: "Coach Leo 🦁",
      image: require("../assets/images/male1_icon.png"),
      sample_phrase: "Hi! I’m Coach Leo. Let’s have some fun learning new words!",
    },
    {
      agent_id: "demo2",
      name: "Coach Ben 🧢",
      image: require("../assets/images/male2_icon.png"),
      sample_phrase: "Hey there! I’m Coach Ben, ready to practice with you!",
    },
    {
      agent_id: "demo3",
      name: "Coach Maya 🌸",
      image: require("../assets/images/female1_icon.png"),
      sample_phrase: "Hi! I’m Coach Maya, let’s learn to speak clearly together!",
    },
    {
      agent_id: "demo4",
      name: "Coach Luna 🌙",
      image: require("../assets/images/female2_icon.png"),
      sample_phrase: "Hello! I’m Coach Luna, let’s make speaking fun and easy!",
    },
  ];

  // --- Fetch available voices (backend or fallback) ---
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const data = await fetchVoices();
        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
        } else {
          setVoices(demoVoices);
        }
      } catch (err) {
        console.error("Error fetching voices:", err);
        setVoices(demoVoices);
      } finally {
        setLoading(false);
      }
    };
    loadVoices();
  }, []);

  // --- Play voice sample (demo text or backend) ---
  const handlePlayIntro = async (voice) => {
    try {
      setIsPlaying(true);
      setSelectedVoice(voice);

      // If backend voices exist, use ElevenLabs API
      if (!voice.agent_id.startsWith("demo")) {
        const audioBlob = await talkToAgent(
          voice.agent_id,
          voice.sample_phrase || "Hi there! I’m your speech coach!"
        );

        const uri = URL.createObjectURL(audioBlob);
        const { sound } = await Audio.Sound.createAsync({ uri });
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            sound.unloadAsync();
          }
        });
      } else {
        // If demo, just simulate “playing” for 2 seconds
        console.log(`🎧 Playing demo for ${voice.name}`);
        setTimeout(() => setIsPlaying(false), 2000);
      }
    } catch (error) {
      console.error("Error playing voice intro:", error);
      setIsPlaying(false);
    }
  };

  // --- Move to practice screen ---
  const handleSelectCoach = () => {
    if (!selectedVoice) return;
    router.push({
      pathname: "/practiceScreen",
      params: {
        coach: selectedVoice.name,
        agent_id: selectedVoice.agent_id,
      },
    });
  };

  // --- Loading spinner ---
  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={{ marginTop: 10 }}>Loading your coaches...</Text>
      </View>
    );

  // --- UI Render ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Pick Your Speech Coach!</Text>

      <View style={styles.grid}>
        {voices.map((voice) => (
          <TouchableOpacity
            key={voice.agent_id}
            style={[
              styles.box,
              selectedVoice?.agent_id === voice.agent_id && styles.selectedBox,
            ]}
            onPress={() => handlePlayIntro(voice)}
            disabled={isPlaying}
          >
            <Image
              source={
                voice.image?.uri
                  ? { uri: voice.image.uri }
                  : typeof voice.image === "string"
                  ? { uri: voice.image }
                  : voice.image
              }
              style={styles.image}
            />
            <Text style={styles.name}>
              {isPlaying && selectedVoice?.agent_id === voice.agent_id
                ? "🔊 "
                : ""}
              {voice.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={
          selectedVoice
            ? `Select ${selectedVoice.name}`
            : "Select a Coach to Begin"
        }
        onPress={handleSelectCoach}
        disabled={!selectedVoice || isPlaying}
        color="#FF7A00"
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FF7A00",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  box: {
    width: 140,
    height: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  selectedBox: {
    borderWidth: 3,
    borderColor: "#FF7A00",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
