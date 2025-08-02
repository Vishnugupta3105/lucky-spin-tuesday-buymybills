#!/bin/bash

echo "🎡 Starting Lucky Spin Tuesday - BuyMyBills (React Version)"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting React development server..."
echo "🌐 Open http://localhost:3000 in your browser"
echo "📱 Optimized for mobile devices!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm start 