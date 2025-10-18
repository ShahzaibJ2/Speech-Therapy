import { useState } from 'react';

export default function usePracticeSession(wordList = []) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentWord = wordList[currentIndex];
  const maxAttempts = 3;

  const nextWord = () => {
    setAttempts(0);
    setCurrentIndex((prev) => (prev + 1) % wordList.length);
  };

  const incrementAttempt = () => setAttempts((prev) => prev + 1);

  return { currentWord, attempts, maxAttempts, nextWord, incrementAttempt };
}
