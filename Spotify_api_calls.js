const token = await getAccessToken();

const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
  headers: { Authorization: `Bearer ${token}` },
});

const topTracks = await response.json();
console.log(topTracks);
