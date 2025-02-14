import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { SERVER_SETTINGS } from '../settings';

const S3 = new S3Client({
  region: SERVER_SETTINGS.region,
  endpoint: SERVER_SETTINGS.endpoint,
  credentials: {
    accessKeyId: SERVER_SETTINGS.accessKeyId,
    secretAccessKey: SERVER_SETTINGS.secretAccessKey,
  },
});

const DEST_BUCKET = SERVER_SETTINGS.destBucket;

export async function uploadToS3(buffer: Buffer): Promise<string> {
  const fileName = crypto.randomBytes(16).toString('hex') + '.pdf';
  const command = new PutObjectCommand({
    Bucket: DEST_BUCKET,
    Key: fileName,
    Body: buffer,
    ACL: 'public-read',
    ContentType: 'application/pdf',
  });
  await S3.send(command);
  return `https://${DEST_BUCKET}.s3.${SERVER_SETTINGS.region}.amazonaws.com/${fileName}`;
}
