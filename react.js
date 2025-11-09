import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// 🔐 Refresh access token
async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });
  const data = await response.json();
  return data.access_token;
}

// 🟢 GET /spotify
app.get("/spotify", async (req, res) => {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  const [topTracks, nowPlaying, followedArtists] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/following?type=artist&limit=10", { headers }).then(r => r.json())
  ]);

  res.json({
    now_playing: nowPlaying?.item ? {
      track: nowPlaying.item.name,
      artist: nowPlaying.item.artists.map(a => a.name).join(", "),
      album: nowPlaying.item.album.name,
    } : "No song currently playing",
    top_tracks: topTracks.items.map(t => ({
      id: t.id,
      name: t.name,
      artist: t.artists.map(a => a.name).join(", "),
    })),
    followed_artists: followedArtists.artists.items.map(a => ({
      id: a.id,
      name: a.name,
    }))
  });
});

// ⏸️ Pause
app.put("/spotify/pause", async (req, res) => {
  const token = await getAccessToken();
  await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  res.json({ message: "Playback paused" });
});

// ▶️ Play a specific track
app.put("/spotify/play/:id", async (req, res) => {
  const token = await getAccessToken();
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [`spotify:track:${req.params.id}`] }),
  });
  res.json({ message: `Now playing track ${req.params.id}` });
});

app.listen(3000, () => console.log("Spotify API running on port 3000"));
