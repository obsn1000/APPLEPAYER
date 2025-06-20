#!/bin/bash

# REAPNET Desktop Integration Launch Script
echo "🚀 Starting REAPNET Desktop Integration"
echo "======================================"

# Check if APPLEPAYER is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  APPLEPAYER server is not running"
    echo "💡 Start it with: cd /home/kali/APPLEPAYER && npm run dev"
    echo ""
fi

# Launch REAPNET Desktop App
echo "🖥️  Launching REAPNET Desktop App..."
cd "/home/kali/Downloads/reap-linux"
./REAPNET

echo "✅ REAPNET Desktop App launched"
echo "🌐 Integration available at: http://localhost:3000"
