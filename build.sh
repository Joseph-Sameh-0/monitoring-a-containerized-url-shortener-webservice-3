#!/bin/bash
set -e

echo "Building URL Shortener Microservices..."

# Build frontend first
echo "Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Build microservices
echo "Building microservices..."

cd microservices

# Build Auth Service
echo "Building Auth Service..."
cd auth-service
../gradlew clean build -x test --no-daemon
cd ..

# Build URL Service
echo "Building URL Service..."
cd url-service
../gradlew clean build -x test --no-daemon
cd ..

# Build File Service
echo "Building File Service..."
cd file-service
../gradlew clean build -x test --no-daemon
cd ..

# Build Note Service
echo "Building Note Service..."
cd note-service
../gradlew clean build -x test --no-daemon
cd ..

cd ..

echo ""
echo "======================================="
echo "Build complete!"
echo "======================================="
echo ""
echo "To start the microservices, run:"
echo "  docker compose up"
echo ""
