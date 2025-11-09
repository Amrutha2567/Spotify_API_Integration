🎵 Spotify API Integration

This project creates a backend endpoint /api/spotify that connects to the Spotify Web API to display:

Your Top 10 Tracks

Your Currently Playing Song

The Artists You Follow

Controls to Start or Stop playback

The endpoint returns JSON (no frontend UI required) and is deployed on your portfolio website at
👉 https://yatharthbansal.com/api/spotify

🚀 Features

Fetch Top 10 Spotify Tracks of the authenticated user

Display the Currently Playing Song

List all Followed Artists

Start or Stop a selected track

Output in clean, browser-friendly JSON

🧰 Tech Stack

Node.js / Express.js – API server

Spotify Web API – Data source

Vercel – Deployment platform

dotenv – Environment configuration

⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/amruthavanaparthi/spotify-api-integration.git
cd spotify-api-integration

2. Install Dependencies
npm install

3. Create a .env File

Add the following inside .env:

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token


⚠️ Do not commit .env to GitHub.

4. Start the Server Locally
npm run dev


Visit → http://localhost:3000/api/spotify

🌐 Deployment

Deploy to Vercel
 (recommended)

Add your environment variables in Vercel Dashboard → Settings → Environment Variables

Once deployed, your live endpoint will be available at:

https://your-portfolio-domain.com/api/spotify

🕒 Time Breakdown
Task	Duration
Spotify App Setup	30 mins
OAuth & Token Handling	1 hr 30 mins
API Endpoint Development	1 hr
Testing & Debugging	45 mins
Deployment	30 mins
Final Verification	15 mins
💡 Challenges Faced

The biggest challenge was implementing Spotify’s OAuth 2.0 flow — generating and refreshing tokens securely. Managing short-lived access tokens and ensuring smooth API calls required careful handling.

📄 License

This project is open-sourced under the MIT License.
