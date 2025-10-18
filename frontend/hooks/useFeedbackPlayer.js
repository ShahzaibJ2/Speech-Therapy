import { Audio } from 'expo-audio';

export default function useFeedbackPlayer() {
  const playFeedback = async (audioUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
    } catch (error) {
      console.error('❌ Failed to play feedback audio:', error);
    }
  };

  return { playFeedback };
}
