# AI Thumbnail Generator (Created by adibhoyarekar)

This is an advanced web application that leverages a powerful AI engine to generate stunning, high-CTR YouTube thumbnails in seconds. Go from a simple idea, a single photo, or even multiple photos to a set of professional, ready-to-use thumbnails through a powerful and intuitive interface.

## Key Features

*   **✨ Multi-Image Composition:** Upload up to 4 separate images, and the AI intelligently cuts out the subjects and combines them into a single, cohesive scene based on your detailed prompt. Perfect for interviews, collaborations, or dynamic montages.
*   **✍️ Advanced Customization & Prompting:** Fine-tune your creation with controls for art style, text overlays, target audience, and language. Provide detailed prompts for maximum creative control.
*   **💡 AI-Powered Text Suggestions:** Automatically generate catchy, high-impact text ideas for your thumbnails based on your video's title and desired tone.
*   **🔄 Multiple Variations:** Receive at least 3 unique, high-quality thumbnail options for every request, giving you more creative choices.
*   **🔐 Full User Authentication (Simulated):** A complete and secure login/signup system that runs entirely in the browser, using `localStorage` for persistence. Features include:
    *   Email & Password login.
    *   Social logins (Google & Facebook).
    *   Real-time password strength validation and visual feedback on the signup form.
    *   Optional profile photo uploads with an instant preview.
*   **👤 Personalized Dashboard:** Track your full creation history and save your favorite thumbnails—all saved securely in your browser.
*   **💎 Premium Feature Suite (Demo):**
    *   **Brand Kit:** Maintain brand consistency by saving logos, color palettes, and fonts.
    *   **Bulk Generator:** Upload a CSV of video titles to get text suggestions for all of them at once.
    *   **CTR Score Estimator:** Get an AI-powered prediction of your thumbnail's click-through-rate potential.

## Technology Stack

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Generative AI:** An advanced AI engine for multi-modal image and text generation.
*   **State Management & Auth:** React Context API with a simulated backend using `localStorage`.
*   **Image Handling:** `react-image-crop`

---

## Local Setup and Installation

This is a frontend-only project with a simulated backend.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-thumbnail-generator.git
    cd ai-thumbnail-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    In the root directory, create a `.env` file and add your Generative AI API key:
    ```
    VITE_API_KEY=YOUR_GENERATIVE_AI_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running, typically at `http://localhost:5173`.

---

## Deployment

Since this is now a static frontend application, you can easily deploy it to services like **Vercel**, **Netlify**, or **GitHub Pages**.

### Deploying to Vercel (Recommended)

1.  **Sign up** at [Vercel.com](https://vercel.com/).
2.  Create a **New Project** and import your GitHub repo.
3.  **Configuration:**
    *   Vercel will auto-detect the Vite framework. The default settings are correct.
4.  **Add Environment Variable:**
    *   Before deploying, go to the "Environment Variables" section.
    *   **Key:** `VITE_API_KEY` -> **Value:** Your Google Gemini API key.
5.  Click **Deploy**. Your site will be live in minutes!
