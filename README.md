# AI Thumbnail Generator (Created by adibhoyarekar)

This is an advanced web application that leverages a powerful AI engine to generate stunning, high-CTR YouTube thumbnails in seconds. Go from a simple idea, a single photo, or even multiple photos to a set of professional, ready-to-use thumbnails through a powerful and intuitive interface.

### Live Screenshots

| Main Interface | User Dashboard | Login Page |
| :---: | :---: | :---: |
| ![Main Interface](screenshots/screenshot-1.png) | ![User Dashboard](screenshots/screenshot-2.png) | ![Login Page](screenshots/screenshot-3.png) |

## Key Features

*   **✨ Multi-Image Composition:** Upload up to 4 separate images, and the AI intelligently cuts out the subjects and combines them into a single, cohesive scene based on your detailed prompt. Perfect for interviews, collaborations, or dynamic montages.
*   **✍️ Advanced Customization & Prompting:** Fine-tune your creation with controls for art style, text overlays, target audience, and language. Provide detailed prompts for maximum creative control.
*   **💡 AI-Powered Text Suggestions:** Automatically generate catchy, high-impact text ideas for your thumbnails based on your video's title and desired tone.
*   **🔄 Multiple Variations:** Receive at least 3 unique, high-quality thumbnail options for every request, giving you more creative choices.
*   **🔐 Full User Authentication:** A complete and secure login/signup system featuring:
    *   Email & Password login with a full Node.js/Express backend.
    *   Secure password hashing with `bcryptjs`.
    *   JSON Web Token (JWT) for session management.
    *   Social logins (Google & Facebook).
    *   Real-time password strength validation and visual feedback on the signup form.
    *   Optional profile photo uploads with an instant preview.
*   **👤 Personalized Dashboard:** Track your full creation history and save your favorite thumbnails—all saved securely in a server-side database.
*   **💎 Premium Feature Suite (Demo):**
    *   **Brand Kit:** Maintain brand consistency by saving logos, color palettes, and fonts.
    *   **Bulk Generator:** Upload a CSV of video titles to get text suggestions for all of them at once.
    *   **CTR Score Estimator:** Get an AI-powered prediction of your thumbnail's click-through-rate potential.

## Technology Stack

*   **Frontend:** React, TypeScript
*   **Backend:** Node.js, Express.js
*   **Database:** LowDB (file-based JSON database)
*   **Authentication:** JWT, bcryptjs
*   **Styling:** Tailwind CSS
*   **Generative AI:** An advanced AI engine for multi-modal image and text generation.
*   **State Management:** React Context API (for Authentication)
*   **Image Handling:** `react-image-crop` for a precise, client-side cropping experience.

## Full-Stack Local Setup and Installation

To run this project locally, you need to run both the backend server and the frontend client.

### 1. Backend Server Setup

```bash
# Navigate into the backend directory
cd backend

# Install backend dependencies
npm install

# Run the backend server (it will run on http://localhost:5000)
npm start
```

### 2. Frontend Client Setup

Open a **new terminal window** and navigate to the project's root directory.

```bash
# (In the root directory) Install frontend dependencies
npm install

# Create a .env file in the root directory for your API key
# Add your Generative AI API key to the file:
API_KEY=YOUR_GENERATIVE_AI_API_KEY

# Run the frontend development server (it will run on http://localhost:5173)
npm run dev
```

The application should now be fully running. You can access it at `http://localhost:5173`.
