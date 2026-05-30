import { useState, useEffect } from 'react';
import { getUserPlaylists, createPlaylist, addTrackToPlaylist, removeTrackFromPlaylist, deletePlaylist } from '../service/playlist.api';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const p = await getUserPlaylists();
      setPlaylists(p || []);
    } catch (e) {
      console.error('Failed to load playlists', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const create = async (name) => {
    const res = await createPlaylist({ name });
    await fetch();
    return res;
  };

  const addTrack = async (playlistId, trackId) => {
    const res = await addTrackToPlaylist({ playlistId, trackId });
    await fetch();
    return res;
  };

  const removeTrack = async (playlistId, trackId) => {
    const res = await removeTrackFromPlaylist({ playlistId, trackId });
    await fetch();
    return res;
  };

  const removePlaylist = async (playlistId) => {
    const res = await deletePlaylist({ playlistId });
    await fetch();
    return res;
  };

  return { playlists, loading, create, addTrack, removeTrack, removePlaylist, refresh: fetch };
}
