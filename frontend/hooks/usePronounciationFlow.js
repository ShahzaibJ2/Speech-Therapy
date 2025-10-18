import { useState } from 'react';
import { analyzeSpeech } from '../util/api';
import { Audio } from 'expo-audio';

export default function usePronunciationFlow() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [transcript, setTranscript] = useState('');

  const analyzeAudio = async (fileUri) => {
    try {
      setIsAnalyzing(true);
      setFeedback('');

      const result = await analyzeSpeech(fileUri);

      setTranscript(result.transcript);
      setFeedback(result.feedback);

      if (result.feedbackAudioUrl) {
        const { sound } = await Audio.Sound.createAsync({
          uri: result.feedbackAudioUrl,
        });
        await sound.playAsync();
      }
    } catch (error) {
      console.error('❌ Error analyzing audio:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { isAnalyzing, feedback, transcript, analyzeAudio };
}
