import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
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