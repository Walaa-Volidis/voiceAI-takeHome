# VoiceAI-takeHome - Document Conversation Agent

## Overview

VoiceAI is an advanced web application that enables users to have voice conversations with AI about uploaded documents. This project leverages LiveKit's real-time communication technology combined with various AI services to create an intuitive voice assistant that can understand, analyze, and discuss document contents with users.

## Features

- 📄 **Document Upload & Analysis**: Upload PDF documents for AI processing
- 🗣️ **Voice Conversations**: Natural voice interaction with the AI about document contents
- 🎧 **Real-time Audio Processing**: Krisp noise filtering for clear communication
- 🧠 **Intelligent Context Awareness**: AI retains context of the uploaded document throughout the conversation
- 💻 **Modern UI**: Beautiful and responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) (v15) - React framework for server-side rendering and static site generation
- [React](https://reactjs.org/) (v19) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [LiveKit Components](https://github.com/livekit/components-js) - React components for real-time communication

### Backend

- [Python](https://www.python.org/) - For the AI agent implementation
- [LiveKit Agents](https://github.com/livekit/agents) - SDK for building LiveKit agents
- [Groq](https://groq.com/) - AI services for STT (Speech-to-Text), LLM (Language Model), and TTS (Text-to-Speech)
- [Silero VAD](https://github.com/snakers4/silero-vad) - Voice Activity Detection

### File Processing

- [PDF2JSON](https://www.npmjs.com/package/pdf2json) - For extracting text from PDF documents

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Python](https://www.python.org/) v3.9 or higher
- [LiveKit Account](https://livekit.io/) for API key and secret
- [Groq API Key](https://console.groq.com/) for AI services

## Installation

### 1. Clone the repository

```bash
git clone [repository-url]
cd voiceai-takehome
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up Python environment for the agent

```bash
# Navigate to agent directory
cd agent

# Create a Python virtual environment (if it doesn't exist)
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Install Python dependencies from requirements.txt
pip install -r requirements.txt

# Download required model files
python agent.py download-files

# Start the agent in development mode
python agent.py dev
```

The `requirements.txt` file includes all necessary Python dependencies for the voice agent:

- LiveKit agent packages with support for Groq AI services
- LiveKit noise cancellation plugin
- Additional utilities like dotenv for environment variable management

### 4. Configure environment variables

Create a `.env.local` file in the root directory with the following variables:

```
# LiveKit settings
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=your_livekit_url


# Groq API key
GROQ_API_KEY=your_groq_api_key

# Next.js specific
NEXT_PUBLIC_CONN_DETAILS_ENDPOINT=/api/connection-details
```

## Running the Application

### Development Mode

1. Start the Next.js frontend:

```bash
npm run dev
```

2. In a separate terminal, start the agent:

```bash
cd agent
.\venv\Scripts\Activate.ps1
python agent.py dev
```

### Production Mode

1. Build the Next.js application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

3. Start the agent in production mode:

```bash
cd agent
.\venv\Scripts\Activate.ps1
python agent.py start
```

## Usage

1. Open the application in your browser (default is `http://localhost:3000`)
2. Upload a PDF document using the file upload interface
3. Once the document is processed, click "Connect" to start the voice assistant
4. Speak naturally to ask questions about the document content
5. The AI will respond with information based on the document


