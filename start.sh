#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
  echo "Please edit the .env file with your actual values before continuing."
  exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

# Check if certificates exist
if [ ! -d certs ] || [ ! "$(ls -A certs 2>/dev/null)" ]; then
  echo "Creating certs directory..."
  mkdir -p certs
  echo "Warning: You need to add your certificate files to the certs directory."
fi

# Start the server
echo "Starting ApplePaySDK..."
npm run dev