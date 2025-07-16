FROM --platform=linux/amd64 debian:stable-slim

# Set environment variables for EPICS
ENV EPICS_BASE=/opt/epics/base
ENV EPICS_HOST_ARCH=linux-x86_64
ENV PATH=$EPICS_BASE/bin/$EPICS_HOST_ARCH:$EPICS_BASE/lib/$EPICS_HOST_ARCH:$PATH
ENV LD_LIBRARY_PATH=$EPICS_BASE/lib/$EPICS_HOST_ARCH:$LD_LIBRARY_PATH

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    wget \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    libreadline-dev \
    libpcap-dev \
    libx11-dev \
    libxext-dev \
    libxmu-dev \
    libxt-dev \
    libxml2-dev \
    re2c \
    perl \
    ca-certificates \
    make \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Download and build EPICS base
RUN mkdir -p /opt/epics && \
    cd /opt/epics && \
    wget https://epics.anl.gov/download/base/base-7.0.6.1.tar.gz && \
    tar -xzf base-7.0.6.1.tar.gz && \
    rm base-7.0.6.1.tar.gz && \
    mv base-7.0.6.1 base && \
    cd base && \
    make -j$(nproc)

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies in venv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose WebSocket port
EXPOSE 8000

# Start the server
CMD ["python", "server/ophyd_ws_server.py"]
