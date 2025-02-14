import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '../../../lib/uploadToS3';
import { parsePdfFromBuffer } from '../../../lib/bufferToPdf';
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extractedText = '';
    try {
      const extractedText = await parsePdfFromBuffer(buffer);
      console.log('Extracted text:', extractedText);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF' },
        { status: 500 }
      );
    }

    try {
      const publicUrl = await uploadToS3(buffer);
      console.log('Public URL:', publicUrl);

      return NextResponse.json({ url: publicUrl, text: extractedText });
    } catch (error) {
      console.error('Error uploading to S3:', error);
      return NextResponse.json(
        { error: 'Failed to upload PDF to S3' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
