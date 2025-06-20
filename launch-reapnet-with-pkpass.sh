#!/bin/bash

# REAPNET + PKPass Integration Launcher
# This script starts the APPLEPAYER server and REAPNET with PKPass generation

echo "🚀 Starting REAPNET + PKPass Integration..."

# Set up environment
export NODE_ENV=development
export APPLEPAYER_DIR="/home/kali/APPLEPAYER"
export REAPNET_DIR="/home/kali/Downloads/reap-linux"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Working directory: $APPLEPAYER_DIR${NC}"

# Change to APPLEPAYER directory
cd "$APPLEPAYER_DIR" || exit 1

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
    npm install
fi

# Start APPLEPAYER server in background
echo -e "${GREEN}🌐 Starting APPLEPAYER server on port 3000...${NC}"
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ APPLEPAYER server is running${NC}"
else
    echo -e "${RED}❌ Failed to start APPLEPAYER server${NC}"
    exit 1
fi

# Function to generate PKPass
generate_pkpass() {
    echo -e "${BLUE}🎫 Generating PKPass...${NC}"
    node generate-pkpass.js
}

# Function to launch REAPNET
launch_reapnet() {
    echo -e "${BLUE}🖥️  Launching REAPNET...${NC}"
    cd "$REAPNET_DIR" || exit 1
    ./REAPNET &
    REAPNET_PID=$!
    echo -e "${GREEN}✅ REAPNET launched (PID: $REAPNET_PID)${NC}"
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo -e "${GREEN}✅ APPLEPAYER server stopped${NC}"
    fi
    if [ ! -z "$REAPNET_PID" ]; then
        kill $REAPNET_PID 2>/dev/null
        echo -e "${GREEN}✅ REAPNET stopped${NC}"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Show menu
while true; do
    echo -e "\n${BLUE}🎛️  REAPNET + PKPass Integration Menu${NC}"
    echo "1. Generate PKPass"
    echo "2. Launch REAPNET"
    echo "3. Generate PKPass and Launch REAPNET"
    echo "4. Open APPLEPAYER in Browser"
    echo "5. View Server Status"
    echo "6. Exit"
    
    read -p "Choose an option (1-6): " choice
    
    case $choice in
        1)
            generate_pkpass
            ;;
        2)
            launch_reapnet
            ;;
        3)
            generate_pkpass
            echo -e "${YELLOW}⏱️  Waiting 2 seconds before launching REAPNET...${NC}"
            sleep 2
            launch_reapnet
            ;;
        4)
            echo -e "${BLUE}🌐 Opening APPLEPAYER in browser...${NC}"
            if command -v xdg-open > /dev/null; then
                xdg-open http://localhost:3000
            elif command -v firefox > /dev/null; then
                firefox http://localhost:3000 &
            else
                echo -e "${YELLOW}⚠️  Please open http://localhost:3000 in your browser${NC}"
            fi
            ;;
        5)
            echo -e "${BLUE}📊 Server Status:${NC}"
            if curl -s http://localhost:3000 > /dev/null; then
                echo -e "${GREEN}✅ APPLEPAYER server: Running${NC}"
            else
                echo -e "${RED}❌ APPLEPAYER server: Stopped${NC}"
            fi
            
            if ps -p $REAPNET_PID > /dev/null 2>&1; then
                echo -e "${GREEN}✅ REAPNET: Running (PID: $REAPNET_PID)${NC}"
            else
                echo -e "${RED}❌ REAPNET: Stopped${NC}"
            fi
            ;;
        6)
            cleanup
            ;;
        *)
            echo -e "${RED}❌ Invalid option. Please choose 1-6.${NC}"
            ;;
    esac
done