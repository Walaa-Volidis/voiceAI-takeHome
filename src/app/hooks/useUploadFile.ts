import { uploadFile } from '@/lib/uploadFile';
import { useState } from 'react';
import z from 'zod';

const ZTextSchema = z.string();

export function useUploadFile() {
  const [file, setFile] = useState<File>();
  const [extractedText, setExtractedText] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === 'application/pdf' ||
        selectedFile.type === 'text/plain')
    ) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const data = await uploadFile(file);
      setExtractedText(ZTextSchema.parse(data.text));
      setFileName(file.name);
      setIsUploaded(true);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return {
    file,
    isUploaded,
    fileName,
    extractedText,
    handleFileChange,
    handleUpload,
  };
}
