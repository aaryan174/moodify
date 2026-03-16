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
      // API returns { message, song }
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

  return { loading, song, handleSong, setSong, handleSearchSong, setSearchSong, searchSong, isPlaying, setIsPlaying };
};

