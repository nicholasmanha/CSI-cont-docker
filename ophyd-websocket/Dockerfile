FROM prjemian/synapps:latest

# Install Python and pip
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create virtual environment to avoid externally-managed-environment issues
RUN python3 -m venv /opt/venv

# Activate virtual environment by updating PATH
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies in the virtual environment
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose WebSocket port
EXPOSE 8000

# Start the server (using python from venv)
CMD ["python", "server/ophyd_ws_server.py"]
