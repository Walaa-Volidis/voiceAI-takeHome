import {
  AccessToken,
  AccessTokenOptions,
  VideoGrant,
} from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { SERVER_SETTINGS } from '../../../settings';
import { z } from 'zod';

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = SERVER_SETTINGS.liveKitApi;
const API_SECRET = SERVER_SETTINGS.liveKitApiSecret;
const LIVEKIT_URL = SERVER_SETTINGS.liveKitUrl;

// don't cache the results
export const revalidate = 0;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

const ZRequestBodySchema = z.object({
  content: z.string(),
  fileName: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    if (!SERVER_SETTINGS.liveKitApi || !SERVER_SETTINGS.liveKitApiSecret)
      throw new Error('LIVEKIT credentials is not defined');

    if (!SERVER_SETTINGS.liveKitUrl)
      throw new Error('LIVEKIT_URL is not defined');

    const body = ZRequestBodySchema.parse(await request.json());
    // Generate participant token
    const participantIdentity = `voice_assistant_user_${Math.floor(
      Math.random() * 10_000
    )}`;
    const roomName = `voice_assistant_room_${Math.floor(
      Math.random() * 10_000
    )}`;
    const participantToken = await createParticipantToken(
      {
        identity: participantIdentity,
        metadata: JSON.stringify({
          content: body.content,
          fileName: body.fileName,
        }),
      },
      roomName
    );
    console.log('hey participantToken', participantToken);
    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName: participantIdentity,
    };
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string
) {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  return at.toJwt();
}
