import axios from "axios";

const api = axios.create({
    baseURL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "",
    withCredentials: true
})

export async function getSong({ mood }) {
    const res = await api.get("/api/songs?mood=" + mood)
    return res.data
}

export async function getAllSongs() {
    const res = await api.get("/api/songs/all")
    return res.data.songs
}

export async function searchSongs({title}) {
        const res = await api.get("/api/songs/search?title="+ title)
        return res.data
}

export async function getSongsByMood({ mood }) {
    const res = await api.get("/api/songs/mood?mood=" + mood)
    return res.data
}