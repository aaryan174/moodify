import { createContext, useState } from "react";


 export const SongContext = createContext()

 export const SongContextProvider = ({children})=>{

    const [song, setSong] = useState({
  "url": "https://ik.imagekit.io/n5t2a9ryr/moodify/songs/Marjaaniya_2__DownloadMing.Com__Z0kg122Az.mp3",
  "posterUrl": "https://ik.imagekit.io/n5t2a9ryr/moodify/posters/Marjaaniya_2__DownloadMing.Com__HUz_BoPs_.jpeg",
  "title": "Marjaaniya 2 [DownloadMing.Com]",
  "mood": "happy"
    })
    const [searchSong, setSearchSong] = useState([])

    const [loading, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    return(
      <SongContext.Provider value={{song, setSong, loading, setLoading, searchSong, setSearchSong, isPlaying, setIsPlaying}}>
          {children}
      </SongContext.Provider>
    )

 }