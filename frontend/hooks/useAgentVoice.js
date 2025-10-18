import { Audio } from "expo-audio";

export const useAgentVoice = () => {
  const playVoice = async (url) => {
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  };
  return { playVoice };
};
