import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Spotify token helper
async function getAccessToken() {
  const res = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
  }), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
      ).toString("base64")
    }
  });
  return res.data.access_token;
}

// GET /spotify endpoint
app.get("/spotify", async (req, res) => {
  try {
    const token = await getAccessToken();

    const [topTracks, nowPlaying, followedArtists] = await Promise.all([
      axios.get("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get("https://api.spotify.com/v1/me/following?type=artist&limit=10", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    res.json({
      top_10_tracks: topTracks.data.items.map(t => ({
        name: t.name,
        artist: t.artists.map(a => a.name).join(", "),
        uri: t.uri
      })),
      now_playing: nowPlaying.data?.item
        ? {
            name: nowPlaying.data.item.name,
            artist: nowPlaying.data.item.artists.map(a => a.name).join(", "),
            uri: nowPlaying.data.item.uri
          }
        : "Nothing is currently playing",
      followed_artists: followedArtists.data.artists.items.map(a => ({
        name: a.name,
        uri: a.uri
      }))
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch data from Spotify" });
  }
});

// Stop playback
app.post("/spotify/stop", async (req, res) => {
  try {
    const token = await getAccessToken();
    await axios.put("https://api.spotify.com/v1/me/player/pause", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json({ message: "Playback stopped" });
  } catch {
    res.status(500).json({ error: "Failed to stop playback" });
  }
});

// Play a top track by URI
app.post("/spotify/play", express.json(), async (req, res) => {
  try {
    const token = await getAccessToken();
    const { uri } = req.body;
    await axios.put("https://api.spotify.com/v1/me/player/play", { uris: [uri] }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json({ message: `Now playing: ${uri}` });
  } catch {
    res.status(500).json({ error: "Failed to start playback" });
  }
});

app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
