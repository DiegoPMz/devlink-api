# DevLinks-api :paperclip:

An API to manage and share links easily. This project allows users to authenticate, create profiles and upload links.

## Table of Contents :clipboard:

- [DevLinks-api :paperclip:](#devlinks-api-paperclip)
  - [Table of Contents :clipboard:](#table-of-contents-clipboard)
  - [Overview :book:](#overview-book)
    - [Screenshot :camera:](#screenshot-camera)
  - [Features :sparkles:](#features-sparkles)
  - [Tech Stack :hammer:](#tech-stack-hammer)
    - [Backend:](#backend)
    - [Development Tools:](#development-tools)
  - [Setup \& Installation ⚙️](#setup--installation-️)
  - [Usage :traffic_light:](#usage-traffic_light)
  - [Project Structure :file_folder:](#project-structure-file_folder)

---

## Overview :book:

This project implements a **link-sharing API** that allows users to authenticate, create profiles, and manage their links. The focus is on providing a RESTful interface to manage and share links with secure authentication.

### Screenshot :camera:

![App Screenshot](./public/devlink-dek-prev.png)

---

## Features :sparkles:

- **User Authentication**: Register and login via JWT tokens.
- **Link Management:** Create, read, update, and delete links.
- **Secure:** Protect user data and API endpoints with authentication.

---

## Tech Stack :hammer:

### Backend:

- **Node.js (v20.16.0)**: JavaScript runtime for the server-side application.
- **Express (4.19.2)**: Web framework for Node.js to build API endpoints.
- **Mongoose (8.6.1)**: NoSQL database for storing user data and links.
- **JWT (jsonwebtoken 9.0.2)**: JSON Web Tokens for secure user authentication.
- **bcryptjs (2.4.3)**: Library for hashing passwords to enhance security.
- **Cloudinary (2.5.0)**: Cloud service for storing and managing media assets like images.
- **Multer (1.4.5-lts.1)**: Middleware for handling file uploads in Node.js.
- **CORS (2.8.5)**: Middleware for enabling Cross-Origin Request Sharing (CORS) in your app.

### Development Tools:

- **TypeScript**: For type-safe development and enhanced editor support.
- **ts-node**: TypeScript execution engine for Node.js
- **ts-patch**: A tool that enables the use of custom TypeScript transformers by patching the TypeScript compiler (tsc). It allows developers to enhance the build process with additional capabilities, such as path alias resolution or advanced code transformations.
- **typescript-transform-paths**: A TypeScript transformer that automatically resolves and rewrites module path aliases configured in tsconfig.json. It simplifies the build process and avoids runtime errors related to unresolved module paths. Works seamlessly with ts-patch for easy integration.
- **ESLint & Prettier**: Code linting and formatting.
- **Zod**: Schema validation library for input and API responses.
- **nodemon**: Development utility that automatically restarts the server when file changes are detected.
- **morgan**: HTTP request logger middleware for Node.js.

---

## Setup & Installation ⚙️

Follow these steps to get the project running locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DiegoPMz/devlink-api.git
   cd devlink-api
   ```
2. **Install dependencies**:
   - Use the following command to install all the required packages.
   ```bash
   npm install
   ```
3. **Environment variables**:

   - Create a .env file in the root directory and configure it with the required environment variables

   ```bash
   CLOUD_STORAGE_API_KEY=value
   CLOUD_STORAGE_API_SECRET=value
   CLOUD_STORAGE_NAME=value
   DB_URL=value
   API_PORT=value
   JWT_PRIVATE_KEY=value
   JWT_APP_ISSUER=value
   FRONTEND_CORS=value
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

---

## Usage :traffic_light:

- **Manage Links**: You can create, view, update, and delete links via the API endpoints.
- **Authenticate**: Users must register and log in to access protected routes using JWT tokens.

---

## Project Structure :file_folder:

src/

├── config/ # Contains configuration files for the application. This could include database connection settings, API keys, third-party service configurations, and other global settings.

├── controllers/ # Contains the logic for handling requests. Each controller typically maps to a specific route or feature of the application, handling the business logic for user authentication, link management, and other core functionalities.

├── data/ # Stores any static or seed data used by the application, such as default user profiles or initial configurations. This can also be used for database seeding in development environments.

├── middlewares/ # Includes middleware functions that are used to process requests before they reach the route handlers. This may include authentication checks, input validation, logging, and error handling.

├── models/ # Contains the Mongoose models for interacting with the MongoDB database. These define the schema and structure of the data being saved and retrieved, such as User, Link, and Collection models.

├── routes/ # Defines the API routes and maps them to the appropriate controller functions. This is where the URL paths and HTTP methods (GET, POST, PUT, DELETE) are specified, pointing to the corresponding controller logic.

├── schemas/ # Stores schema definitions, typically using libraries like Zod. These schemas validate incoming data for API requests and responses, ensuring that they meet the required format and types before being processed.

├── services/ # Contains reusable logic and services for interacting with external resources or APIs, such as Cloudinary for image storage. This may also handle business logic that doesn't belong directly in the controllers.

├── utils/ # Holds utility functions that are used throughout the application, such as helper functions for token generation, data formatting, or logging. These are generally small, reusable functions.

├── app.ts # The main entry point of the application. It initializes the app, configures middleware, sets up routes, and starts the server. It's the file that wires everything together.

└── index.ts # Typically the file where the application starts running. It may import and call app.ts or perform additional setup such as database connections or environment-specific configurations.

---
