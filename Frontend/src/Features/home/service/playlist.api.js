import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:8080"
      : "",
  withCredentials: true
});

export async function createPlaylist({ name }) {
  const res = await api.post('/api/playlists', { name });
  return res.data;
}

export async function getUserPlaylists() {
  const res = await api.get('/api/playlists');
  return res.data.playlists;
}

export async function addTrackToPlaylist({ playlistId, trackId }) {
  const res = await api.post(`/api/playlists/${playlistId}/tracks`, { trackId });
  return res.data;
}

export async function removeTrackFromPlaylist({ playlistId, trackId }) {
  const res = await api.delete(`/api/playlists/${playlistId}/tracks`, { data: { trackId } });
  return res.data;
}

export async function deletePlaylist({ playlistId }) {
  const res = await api.delete(`/api/playlists/${playlistId}`);
  return res.data;
}
