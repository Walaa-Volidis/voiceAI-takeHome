import { z } from 'zod';

export const ZServerSettings = z.object({
  groqApi : z.string(),
  liveKitApi: z.string(),
  liveKitApiSecret: z.string(),
  liveKitUrl: z.string(),
});

export const SERVER_SETTINGS = ZServerSettings.parse({
  groqApi: process.env['GROQ_API_KEY'],
  liveKitApi: process.env['LIVEKIT_API_KEY'],
  liveKitApiSecret: process.env['LIVEKIT_API_SECRET'],
  liveKitUrl: process.env['LIVEKIT_URL'],
});
