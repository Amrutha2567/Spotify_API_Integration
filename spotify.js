import fetch from 'node-fetch';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks?limit=10";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  return response.json();
}

export default async function handler(req, res) {
  try {
    const { access_token } = await getAccessToken();

    const [topRes, nowRes] = await Promise.all([
      fetch(TOP_TRACKS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(NOW_PLAYING_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    const topTracks = await topRes.json();
    const nowPlaying = nowRes.status === 200 ? await nowRes.json() : null;

    return res.status(200).json({
      top_tracks: topTracks.items?.map(track => ({
        name: track.name,
        artist: track.artists.map(a => a.name).join(", "),
        url: track.external_urls.spotify,
      })),
      now_playing: nowPlaying
        ? {
            name: nowPlaying.item.name,
            artist: nowPlaying.item.artists.map(a => a.name).join(", "),
            url: nowPlaying.item.external_urls.spotify,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Spotify", details: err.message });
  }
}
