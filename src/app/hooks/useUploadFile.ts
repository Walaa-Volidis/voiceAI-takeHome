import { useState } from 'react';

export function useUploadFile() {
  const [file, setFile] = useState<File>();
  const [extractedText, setExtractedText] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setExtractedText(data.text);
      setIsUploaded(true);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return {
    file,
    isUploaded,
    extractedText,
    handleFileChange,
    handleUpload,
  };
}
