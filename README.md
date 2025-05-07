# Digital Memories Now - Backend

This is the backend server for the Digital Memories Now application. It provides APIs for album management and image storage using MongoDB and ImageKit.io.

## Features

- MongoDB integration for album data storage
- ImageKit.io integration for image uploads and storage
- RESTful API for album and image operations
- Express server with middleware for error handling and CORS

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digital-memories
NODE_ENV=development

# ImageKit.io Credentials
IMAGEKIT_PUBLIC_KEY=public_Ma/GzYXuWrzkHPH1rdSLqvo9b/M=
IMAGEKIT_PRIVATE_KEY=private_qVvgB8rWC17e7Bw3nAR0m2F3vNE=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/arjunb
```

3. Start MongoDB (if you're running locally):
```bash
# Install MongoDB if you haven't already
# For Windows: https://www.mongodb.com/try/download/community
# For Mac with Homebrew: brew tap mongodb/brew && brew install mongodb-community
# For Linux: Follow distribution-specific instructions

# Run MongoDB
# Windows: MongoDB runs as a service
# Mac/Linux: mongod --dbpath=/path/to/data/db
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

For production deployment on Render.com, create environment variables with the following values:

```
PORT=10000 # Or any port Render assigns
NODE_ENV=production
MONGODB_URI=mongodb+srv://your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
FRONTEND_URL=https://digital-memories.vercel.app
```

**Important:** For Render deployment with Vercel frontend, ensure that:
1. `FRONTEND_URL` matches exactly with your Vercel deployment URL 
2. Render.com's "Outbound Rules" in the web service settings allow access to your Vercel app
3. Port is properly set (usually handled automatically by Render)

All variables except FRONTEND_URL are required in production mode. FRONTEND_URL is required to correctly restrict CORS access.

## API Documentation

### Albums

- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album by ID
- `POST /api/albums` - Create a new album
- `PUT /api/albums/:id` - Update an existing album
- `DELETE /api/albums/:id` - Delete an album
- `POST /api/albums/:id/verify` - Verify album password

### Images

- `POST /api/upload` - Upload an image (with multipart/form-data)
- `GET /api/upload/auth` - Get ImageKit.io authentication parameters
- `DELETE /api/upload/:fileId` - Delete an image by file ID

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- ImageKit.io for image storage
- Multer for handling file uploads