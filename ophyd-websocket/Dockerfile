FROM python:3.12-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose WebSocket port
EXPOSE 8000

# Start the server
CMD ["python", "server/ophyd_ws_server.py"]
