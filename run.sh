#!/bin/bash

echo "Starting ProxyShift application with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p ./data

# Build and start the application
echo "Building Docker image..."
docker-compose build

echo "Starting application..."
docker-compose up -d

echo "Application should be running at http://localhost:8080"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"