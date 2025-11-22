# Deploying to Vercel

This repo contains a static frontend (`index.html`) and an API endpoint implemented as a Node server. Vercel can host the static frontend directly and run the API as a serverless Function.

What I changed / added:
- Added a serverless function at `api/year.js` (Vercel-compatible)
- Updated `server.js` to read UiPath secrets from environment variables
- Added `.env.example` and `.gitignore` to avoid committing secrets

Required environment variables (set these in the Vercel dashboard for the project):

- `UIPATH_TOKEN` — your UiPath Personal Access Token
- `UIPATH_FOLDER_ID` — the UiPath folder ID
- `UIPATH_URL` — UiPath queue API URL (example provided in `.env.example`)
- `QUEUE_NAME` — optional (defaults to `YearRequest`)

Deploy options:

1) Git integration (recommended)
   - Push this repo to GitHub
   - Import the repo into Vercel (https://vercel.com/new)
   - In the Vercel Project Settings > Environment Variables, add the variables above
   - Vercel will detect a static site + `api/` directory and deploy automatically

2) Vercel CLI
   - Install: `npm i -g vercel`
   - Set environment variables in the Vercel project (or use `vercel env add`)
   - Run `vercel` from the project root to deploy

Local testing:

- Static site: open `index.html` in the browser
- API (serverless): you can test locally using the Vercel CLI (`vercel dev`) after adding a local `.env` file with values from `.env.example`.

Important security note:

- Remove any hard-coded secrets from committed files. I updated `server.js` to use environment variables — please ensure you remove the token from version control if it still exists elsewhere.
