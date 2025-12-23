#!/bin/bash

echo "🚀 Installing Hackathon Scrapers..."
echo ""

# Install Devpost scraper
echo "📦 Installing Devpost scraper..."
cd devpost-scraper
npm install
cd ..

# Install Kaggle scraper
echo "📦 Installing Kaggle scraper..."
cd kaggle-scraper
npm install
cd ..

# Install Unstop scraper
echo "📦 Installing Unstop scraper v2..."
cd unstop-scraper-v2
npm install
cd ..

echo ""
echo "✅ All scrapers installed!"
echo ""
echo "Next steps:"
echo "  cd devpost-scraper && npm run api    # Start Devpost API (port 3001)"
echo "  cd kaggle-scraper && npm run api     # Start Kaggle API (port 3002)"
echo "  cd unstop-scraper-v2 && npm run api  # Start Unstop API (port 3003)"
