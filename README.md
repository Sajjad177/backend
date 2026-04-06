# Social Media Backend API

## Project Description
A robust and scalable Node.js backend built with Express and TypeScript for a dynamic social media application. This API handles user authentication, profile management, and social feed functionalities including post creation (with visibility controls), commenting, threaded replies, and a universal liking system. It emphasizes modern API design, integrating secure JWT-based authentication, structured type validation, centralized error handling, and file processing workflows.

## Tech Stack
- **Framework & Runtime:** Node.js, Express.js
- **Language:** TypeScript
- **Database & ORM:** MongoDB, Mongoose
- **Authentication:** JSON Web Token (JWT), bcrypt (password hashing)
- **Validation:** Zod
- **Media Uploads:** Cloudinary, Multer
- **Security & Middleware:** Helmet, CORS, Express Rate Limit, Express Mongo Sanitize, XSS Clean, HPP
- **Logging:** Pino, Pino-HTTP
- **Other Utilities:** Socket.io (real-time communication), Nodemailer (emails), Stripe (payments integration)

## Features
- **User Authentication:** 
  - Secure registration, login, and refresh token rotation.
  - Encrypted password storage using `bcrypt`.
- **Feed & Post Management (CRUD):** 
  - Create, read, update, and delete posts.
  - Granular privacy settings to manage **Private/Public** post visibility securely.
- **Engagement Interactions:**
  - **Likes:** Add or remove likes on both posts and individual comments.
  - **Comments:** Discuss posts with standard top-level comments.
  - **Replies:** Add nested replies directly to comments to support structured conversations.
- **Media Integration:** Profile picture and post attachment uploads seamlessly optimized via Cloudinary.
- **Robust Security:** Active request throttling, Cross-Site Scripting (XSS) prevention, and NoSQL injection protection.

## Installation Instructions

Follow these step-by-step instructions to get the backend running locally:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd job-task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Duplicate the provided `.env.example` file and rename it to `.env`. Fill in the required credentials and configuration settings.
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   *Note: Using `npm run dev` leverages `ts-node-dev` for fast, automatic restarts upon file changes.*

5. **Build and Start (Production):**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

The project relies on these core environment variables. Ensure they are correctly mapped in your `.env` file:

| Variable | Description | Example |
|---|---|---|
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Application environment state | `development` or `production` |
| `MONGODB_URL` | MongoDB cluster connection string URI | `mongodb+srv://...` |
| `BCRYPT_SALT_ROUNDS`| Salt rounds parameter for hashing passwords | `10` |
| `JWT_SECRET` | Secret key for signing Access Tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | Life cycle duration of the Access Token | `7d` |
| `JWT_REFRESH_TOKEN_SECRET`| Secret key for signing Refresh Tokens | `your-refresh-secret` |
| `JWT_REFRESH_EXPIRES_IN`| Life cycle duration of the Refresh Token | `30d` |
| `EMAIL_ADDRESS` | SMTP email for automated dispatch | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | App Password associated with the SMTP email | `password-hash` |
| `CLOUDINARY_CLOUD_NAME`| Cloud Name of your Cloudinary bucket | `...` |
| `CLOUDINARY_API_KEY`| Standard API Key for Cloudinary | `...` |
| `CLOUDINARY_API_SECRET`| Secure API Secret for Cloudinary uploads | `...` |
| `AES_KEY` | Hexadecimal Crypto AES Key for encryptions | `...` |
| `AES_IV` | Hexadecimal Crypto Initialization Vector | `...` |

## API Endpoints

A brief overview of the main API routes available. Paths are typically mounted under a global router (e.g., `/api/v1` or directly at root):

- **Authentication (`/auth`)**
  - `POST /auth/register` - Create a new user account
  - `POST /auth/login` - Authenticate and fetch tokens
- **Users (`/user`)**
  - `GET /user/:id` - Fetch user profile details
  - `PUT /user/:id` - Modify user details
- **Posts (`/post`)**
  - `POST /post` - Publish a new post
  - `GET /post` - Retrieve social feed (factors in public/private auth boundaries)
  - `GET /post/:id` - Fetch specific post
  - `PUT /post/:id` - Edit post content
  - `DELETE /post/:id` - Delete an authored post
- **Comments (`/comment`)**
  - `POST /comment` - Create a comment on a defined post
  - `GET /comment/:postId` - Aggregate all top-level comments for a given post
- **Replies (`/replyComment`)**
  - `POST /replyComment` - Append a nested reply into a comment
  - `GET /replyComment/:commentId` - Retrieve threaded reply discussions
- **Likes (`/like`)**
  - `POST /like` - Toggle user like action on varying target entities

## Database Models

- **User**: The central entity governing identity, preserving hashed credentials, roles, and aggregate profile settings.
- **Post**: Represents generic feed items, storing text and media URLs, linking author IDs, maintaining timeline timestamps, and enforcing `public`/`private` scopes.
- **Comment**: Dedicated to housing contextual feedback belonging to a specific Post ID and authored by a User.
- **Reply**: Structurally dependent child records nested under a parent Comment to represent extended conversational trees.
- **Like**: Employs referenced interactions capturing the target association (Post or Comment) to efficiently sum the upvotes.

## Notes / Additional Information
- Ensure the IP address of your hosting/local environment is whitelisted in MongoDB Atlas.
- API requests passing payload data should utilize `application/json` Content-Type schemas.
- Comprehensive request validation schema checks are active. Excluded or unauthorized payload properties will trigger a validation error dynamically.

## Author
**Sajjad Hossain**
