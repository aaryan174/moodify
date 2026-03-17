import { useContext } from "react";
import { getSong } from "../service/song.api";
import { searchSongs } from "../service/song.api";
import { SongContext } from "../Song.context";

export const useSong = () => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error("useSong must be used within a SongContextProvider");
  }

  const { song, setSong, loading, setLoading, searchSong, setSearchSong, isPlaying, setIsPlaying } = context;

  async function handleSong({ mood }) {
    try {
      setLoading(true);
      const data = await getSong({ mood });
      console.log("[useSong] getSong response for mood", mood, data);
      if (data && data.song) {
        console.log("[useSong] Setting song from API", data.song);
        setSong(data.song);
      } else {
        console.warn("[useSong] No song returned for mood", mood);
      }
    } catch (error) {
      console.error("Failed to fetch song", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch another random song for the same mood (Next Song button)
  async function handleNextSong({ mood }) {
    if (!mood) return;
    try {
      setLoading(true);
      const data = await getSong({ mood });
      if (data && data.song) {
        setSong(data.song);
        // Auto-play the next song
        setTimeout(() => {
          const btn = document.querySelector('.pm-play');
          if (btn) btn.click();
        }, 300);
      }
    } catch (error) {
      console.error("Failed to fetch next song", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchSong({ title }) {
    try {
      setLoading(true);
      const data = await searchSongs({ title });
      if (data && data.songs) {
        setSearchSong(data.songs);
      }
      console.log("search result:", data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, song, handleSong, handleNextSong, setSong, handleSearchSong, setSearchSong, searchSong, isPlaying, setIsPlaying };
};
