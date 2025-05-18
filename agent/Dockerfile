# Use the official Python slim image
FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a non-privileged user to run the app
ARG UID=10001
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home "/home/appuser" \
  --shell "/sbin/nologin" \
  --uid "${UID}" \
  appuser

# Install build dependencies
RUN apt-get update && \
  apt-get install -y \
  gcc \
  g++ \
  python3-dev \
  && rm -rf /var/lib/apt/lists/*

USER appuser

# Set up working directory
WORKDIR /home/appuser

RUN python -m pip install --upgrade pip

# Copy and install dependencies
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Download any necessary files at build time
RUN python agent.py download-files

# expose healthcheck port
EXPOSE 8081

# Set the entry point for the container
ENTRYPOINT ["python", "agent.py"]
CMD ["start"]
