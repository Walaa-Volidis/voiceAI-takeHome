import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useUpload } from '../hooks/useUpload';

export default function UploadFile() {
  const { file, fileUrl, handleFileChange, handleUpload } =
    useUpload();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 space-y-4">
        <Input type="file" accept=".pdf" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file} className="w-full">
          Upload PDF
        </Button>
        {fileUrl &&(
          <div className="break-all">
            File URL: {fileUrl}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
