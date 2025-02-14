import { useState } from 'react';

export function useUpload() {
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState('');
  const [extractedText, setExtractedText] = useState('');

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
      setFileUrl(data.url);
      setExtractedText(data.text);
      console.log()
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return {
    file,
    fileUrl,
    extractedText,
    handleFileChange,
    handleUpload,
  };
}