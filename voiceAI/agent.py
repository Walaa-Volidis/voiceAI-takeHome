import logging
import json
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import silero, openai, elevenlabs

load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")

class FileContext(llm.FunctionContext):
    def get_file_data(self, metadata: str) -> str:
        try:
            parsed_data = json.loads(metadata)
            self.file_content = str(parsed_data.get('content'))
            self.file_name = str(parsed_data.get('fileName'))
            logger.info(f"Successfully got metadata: '{self.file_name}' '{self.file_content}'")
            return self.file_content
        except Exception as e:
            logger.error(f"Failed to get file from metadata: {e}")
            return ""

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are a voice assistant created by LiveKit. Your interface with users will be voice. "
            "You should use short and concise responses, and avoiding usage of unpronouncable punctuation. "
            "check out this file for more information using {get_file_data} and answer the user's questions."
        ),
    )

    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for the first participant to connect
    participant = await ctx.wait_for_participant()
    logger.info(f"starting voice assistant for participant {participant.identity}")

    file_handler = FileContext()
    if participant.metadata:
        file_handler.get_file_data(participant.metadata)

    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=openai.STT.with_groq(model="whisper-large-v3"),
        llm=openai.LLM.with_groq(model="llama-3.3-70b-versatile"),
        tts=elevenlabs.TTS(),
        chat_ctx=initial_ctx,
        fnc_ctx=file_handler,
    )

    agent.start(ctx.room, participant)
    logger.info(f"participant name: {participant.name}")
    # The agent should be polite and greet the user when it joins :)
    await agent.say("Hey, how can I help you today?", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )

