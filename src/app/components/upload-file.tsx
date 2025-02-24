import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface UploadFileProps {
  file: File | undefined;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}
export default function UploadFile({
  file,
  handleFileChange,
  handleUpload,
}: UploadFileProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 space-y-4">
        <Input type="file" accept=".pdf, .txt" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file} className="w-full">
          Upload PDF or TXT file
        </Button>
      </CardContent>
    </Card>
  );
}
