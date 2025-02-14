'use client';
import UploadFile from './components/upload-file';
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <UploadFile />
      </div>
    </main>
  );
}
