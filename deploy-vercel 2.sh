#!/bin/bash

echo "Vercel Deployment Script"
echo "========================"

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Test build
echo "Running local build test..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo ""
    echo "Starting Vercel deployment..."
    echo "Please follow these steps:"
    echo "1. Log in to your Vercel account"
    echo "2. Enter project name"
    echo "3. Proceed with default settings"
    echo ""
    vercel --prod
else
    echo "Build failed! Please check the errors."
    exit 1
fi 