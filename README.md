# Music Library Management API

This project is a RESTful API for managing a music library. It includes features for managing users, artists, albums, tracks, and favorites.

---

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Setup Instructions](#setup-instructions)
  - [Clone the Project](#clone-the-project)
  - [Install Dependencies](#install-dependencies)
  - [Set Up Environment Variables](#set-up-environment-variables)
  - [Set Up PostgreSQL Database](#set-up-postgresql-database)
- [Run the Application](#run-the-application)
- [Testing the Endpoints](#testing-the-endpoints)
- [Deployment](#deployment)

---

## Features
- User authentication with JSON Web Tokens (JWT)
- Role-based access control (Admin, Editor, Viewer)
- CRUD operations for users, artists, albums, tracks, and favorites
- Pagination for large datasets
- Environment-specific configuration management

---

## Requirements
To run this project, ensure you have the following installed on your machine:
- Node.js (v14 or later)
- npm (Node Package Manager)
- PostgreSQL (v12 or later)
- Git
- Postman (optional, for API testing)

---

## Setup Instructions

### Clone the Project
1. Open a terminal on your machine.
2. Run the following command to clone the project:
   ```bash
   git clone https://github.com/Rahulmadiraju/Music-Library-Management-API.git
   ```
3. Navigate into the project directory:
   ```bash
   cd <repository-name>
   ```

## Install Dependencies
1. Install the required npm packages:
   ```
   npm install
   npm install express jsonwebtoken bcryptjs pg dotenv cors uuid joi pg-pool express-validator
   npm install --save-dev nodemon jest supertest
   ```

### Set Up Environment Variables
1. Create a .env file in the root directory of the project add the following variables :

   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=postgresql://username:password@localhost:5432/music_library
   NODE_ENV=development
   ```

2. To Generate a JWT Secret Key :

- To generate a secure JWT secret key directly in the terminal, follow these steps:

   - Open your terminal in VS Code or any terminal of your choice.
   - Run the following command:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
- The command will output a random, secure 64-byte hexadecimal string.
- Copy the generated key.
- Open your .env file and replace your_jwt_secret_key with the generated key.
- Save the .env file.

3. Set Up PostgreSQL Credentials :

- Replace username and password with your PostgreSQL username and password.
- Replace music_library with the name of your database.


### Set Up PostgreSQL Database :

1. Open your PostgreSQL CLI or a database management tool like pgAdmin.
2. Create a new database:
   ```
   CREATE DATABASE music_library;
   ```
3. Connect to the music_library database:
   ```
   \c music_library
   ```
4. Enable the uuid-ossp extension for generating UUIDs:
   ```
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```
5. Create the necessary tables by running the following schema:
   ```
   -- Users table
    CREATE TABLE users (
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Artists table
    CREATE TABLE artists (
        artist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        grammy INTEGER DEFAULT 0,
        hidden BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
   

    -- Albums table
    CREATE TABLE albums (
        album_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        hidden BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tracks table
    CREATE TABLE tracks (
        track_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
        album_id UUID REFERENCES albums(album_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        hidden BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
   
    -- Favorites table
    CREATE TABLE favorites (
        favorite_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        category VARCHAR(10) NOT NULL CHECK (category IN ('artist', 'album', 'track')),
        item_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category, item_id)
    );
   ```

## Run the Application

1. Start the development server:
   ```
   npm run dev
   ```
2. The application will start and run on the port specified in .env (default: 3000).

## Testing the Endpoints

Use Postman or any API testing tool to interact with the endpoints.



