'use server';

import { parsePdfFromBuffer } from './bufferToPdf';
import z from 'zod';

const ZTextSchema = z.string();
export async function uploadFile(file: File) {
  if (!file.type.includes('pdf')) {
    const content = await file.text();
    ZTextSchema.parse(content);
    return { text: content };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const extractedText = await parsePdfFromBuffer(buffer);
    console.log('Extracted text:', extractedText);
    ZTextSchema.parse(extractedText);
    return { text: extractedText };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
