# Node.js Multithreaded Image Processor

An image processing application using multithreading in Node.js. This scripts uses `worker_threads` to handle multiple image processing tasks..

## Features

- Multiple image processing using multithreading.
- Image grayscale conversion.
- Image resizing to 500px in width.
- Fetch images from URLs.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **worker_threads**: Module for multithreading in Node.js
- **sharp**: High-performance Node.js image processing library
- **axios**: Promise-based HTTP client for making requests

## Short guide

1. git clone the repository
2. npm install .
3. node server.js
4. curl -X POST http://localhost:4000/process-images \
    -H "Content-Type: application/json" \
    -d '{
      "imgUrls": [
        "<image_url>" 
      ]
    }'
5. curl -X GET https://localhost:4000/progress
