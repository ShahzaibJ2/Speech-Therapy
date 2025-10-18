import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

export default function useFilePicker() {
  const [selectedFile, setSelectedFile] = useState(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/mpeg',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSelectedFile(result.assets[0]);
      } else {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const clearFile = () => setSelectedFile(null);

  return { selectedFile, pickFile, clearFile };
}
