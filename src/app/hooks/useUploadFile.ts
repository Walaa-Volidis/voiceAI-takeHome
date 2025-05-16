import { uploadFile } from '@/lib/uploadFile';
import { useState } from 'react';
import z from 'zod';

const ZTextSchema = z.string();
const MAX_FILE_SIZE = 1 * 1024 * 1024;

export function useUploadFile() {
  const [file, setFile] = useState<File>();
  const [extractedText, setExtractedText] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (
        selectedFile.type !== 'application/pdf' &&
        selectedFile.type !== 'text/plain'
      ) {
        setError('Only PDF and TXT files are allowed');
        return;
      }
      
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 1MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)`);
        e.target.value = ''; 
        return;
      }
      
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
    error,
    handleFileChange,
    handleUpload,
  };
}
