import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

interface UploadFileProps {
  file: File | undefined;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  isLoading?: boolean;
  error?: string | null;
}
export default function UploadFile({
  file,
  handleFileChange,
  handleUpload,
  isLoading = false,
  error = null,
}: UploadFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {' '}
      <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-slate-700 bg-[#111111] text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center text-white">
            Voice AI Take Home
          </CardTitle>
          <CardDescription className="text-center text-slate-300">
            Upload a document to start a conversation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf, .txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-300"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>{' '}
                <p className="text-sm text-slate-300 font-medium">
                  {file ? file.name : 'Click to browse or drag & drop'}
                </p>
                <p className="text-xs text-slate-400">
                  PDF or TXT files only (Max 1MB)
                </p>
                {error && (
                  <p className="text-sm text-red-500 mt-2 font-medium">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full font-medium bg-slate-700 hover:bg-slate-600 text-white py-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : file ? (
              'Upload and Start Conversation'
            ) : (
              'Select a File First'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
