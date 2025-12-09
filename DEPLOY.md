# Deploying to Vercel

This project is built with **Vite** and **React**, making it easy to deploy on Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/)
- This code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Steps

1.  **Log in to Vercel** and go to your **Dashboard**.
2.  Click **"Add New..."** and select **"Project"**.
3.  **Import** the Git repository where you have pushed this code.
4.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it manually.
    - **Root Directory**: Leave as `./` (default).
    - **Build Command**: `vite build` (or `npm run build`).
    - **Output Directory**: `dist`.
5.  **Environment Variables**:
    - This project seems to use the Gemini API. You **must** set the environment variable for it to work.
    - Expand the **Environment Variables** section.
    - Add the following variable:
        - **Name**: `GEMINI_API_KEY`
        - **Value**: Your actual Gemini API key.
    > **Note**: The code (in `vite.config.ts`) expects `GEMINI_API_KEY`.
6.  Click **Deploy**.

## Post-Deployment

- Vercel will build your project and provide a live URL.
- If you need to update the API key later, go to the project **Settings > Environment Variables** on Vercel and trigger a redeploy.
