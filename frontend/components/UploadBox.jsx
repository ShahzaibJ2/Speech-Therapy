import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function UploadBox({ onSelectFile }) {
  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
    });
    if (result.type === "success") {
      onSelectFile(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>🎤 Upload your voice recording (.mp3)</Text>
      <Button title="Choose File" onPress={pickAudioFile} color="#FF7A00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  instruction: { fontSize: 16, marginBottom: 10, color: "#333" },
});
