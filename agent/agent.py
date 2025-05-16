import logging
import json
import asyncio
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    Agent,
    AgentSession,
    RunContext
)
from livekit.agents import llm
from livekit.plugins import silero, groq

load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")

class FileAgent(Agent):
    def __init__(self, file_content=""):
        super().__init__(
            instructions=(
                "You are a voice assistant created by LiveKit. Your interface with users will be voice. "
                "You should use short and concise responses, and avoiding usage of unpronouncable punctuation. "
                f"You have access to a file named '{{file_name}}'. Here is the content of that file: {file_content}. "
                "When asked questions, refer to this file content to provide answers. "
                "If the question is about the file content, directly answer from the content. "
                "If you don't find the answer in the file, clearly state that the information is not available in the file."
            )
        )
        self.file_content = file_content
        self.file_name = ""
        
    @llm.function_tool
    async def get_file_data(self, context: RunContext, metadata: str) -> str:
        """Gets file data from the provided metadata.
        
        Args:
            metadata: JSON string containing file metadata
        """
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
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    participant = await ctx.wait_for_participant()
    logger.info(f"starting voice assistant for participant {participant.identity}")
    file_content = ""
    file_name = ""
    if participant.metadata:
        temp_agent = FileAgent()
        await temp_agent.get_file_data(None, participant.metadata)
        file_content = temp_agent.file_content
        file_name = temp_agent.file_name
        logger.info(f"File content extracted: {file_content[:100]}...")
        file_agent = FileAgent(file_content)
    else:
        logger.error(f"Invalid or missing metadata.")
        file_agent = FileAgent()
    
    session = AgentSession(
        vad=ctx.proc.userdata["vad"],
        stt=groq.STT(model="whisper-large-v3"),
        llm=groq.LLM(model="llama-3.3-70b-versatile"),
        tts=groq.TTS(
        model="playai-tts",
        voice="Arista-PlayAI",
        ),
        # tts=groq.TTS(
        # model="playai-tts-arabic",
        # voice="Nasser-PlayAI",
        # ),
    )

    await session.start(
        agent=file_agent,
        room=ctx.room
    )    
    logger.info(f"participant name: {participant.name}")
    if file_name:
        greeting = f"Hey, I'm your LiveKit assistant. I can help you with questions about the file '{file_name}'. How can I assist you today?"
    else:
        greeting = "Hey, how can I help you today?"
    await session.say(greeting, allow_interruptions=True)


if __name__ == "__main__":
    asyncio.run(cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    ))