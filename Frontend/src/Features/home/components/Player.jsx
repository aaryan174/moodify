import React, { useEffect, useRef, useState } from 'react';
import './Player.css';
import { useSong } from '../hooks/useSong';

const Player = () => {
    const { loading, song } = useSong({ children: null });

    const currentSong = song || {
        title: 'Neon Dreams',
        artist: 'Cyber-Pulse',
        image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop',
        url: ''
    };

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const audioRef = useRef(null);

    useEffect(() => {
        // When song changes, reset and optionally autoplay
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        const audioEl = audioRef.current;
        if (audioEl && currentSong.url) {
            audioEl.load();
            audioEl.volume = volume;
        }
    }, [currentSong?.url, volume]);

    const togglePlayPause = () => {
        const audioEl = audioRef.current;
        if (!audioEl || !currentSong.url) return;

        if (isPlaying) {
            audioEl.pause();
            setIsPlaying(false);
        } else {
            audioEl
                .play()
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.error("Audio play failed", err);
                });
        }
    };

    const handleTimeUpdate = () => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        setCurrentTime(audioEl.currentTime || 0);
        setDuration(audioEl.duration || 0);
    };

    const handleLoadedMetadata = () => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        audioEl.volume = volume;
        setDuration(audioEl.duration || 0);
    };

    const handleSeek = (event) => {
        const barRect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - barRect.left;
        const percentage = Math.min(Math.max(clickX / barRect.width, 0), 1);
        const audioEl = audioRef.current;
        if (!audioEl || !duration) return;
        audioEl.currentTime = duration * percentage;
        setCurrentTime(audioEl.currentTime);
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");
        return `${m}:${s}`;
    };

    const trackTitle = currentSong.title;
    // Handle matching SongContext syntax (`posterUrl`) or fallback to `image`
    const trackImage = currentSong.posterUrl || currentSong.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop';
    const trackArtist = currentSong.artist || currentSong.mood || 'Unknown Artist';
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const volumePercent = Math.round(volume * 100);

    return (
        <div className="bottom-player">
            {/* Hidden audio element that actually plays the song */}
            {currentSong.url && (
                <audio
                    ref={audioRef}
                    src={currentSong.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                />
            )}
            <div className="player-left">
                <img src={trackImage} alt="Artwork" className="player-artwork" />
                <div className="player-track-info">
                    <h4>{trackTitle}</h4>
                    <p>{trackArtist}</p>
                </div>
                <button className="like-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
            </div>

            <div className="player-center">
                <div className="player-controls">
                    <button className="pm-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
                    </button>
                    <button className="pm-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                    </button>
                    <button className="pm-play" onClick={togglePlayPause} disabled={!currentSong.url}>
                        {loading ? (
                            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>{`.spinner{animation: spin 1s linear infinite;} @keyframes spin { 100% { transform: rotate(360deg); } }`}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" /><path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.7511A10.95,10.95,0,0,0,12,1.3Z" /></svg>
                        ) : isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        )}
                    </button>
                    <button className="pm-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                    </button>
                    <button className="pm-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                    </button>
                </div>
                <div className="player-timeline">
                    <span className="time-text">{formatTime(currentTime)}</span>
                    <div className="timeline-bar" onClick={handleSeek}>
                        <div className="timeline-filled" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="time-text">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="player-right">
                <button className="pr-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button className="pr-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
                <div className="volume-bar-container">
                    <div
                        className="volume-bar"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const pct = Math.min(Math.max(clickX / rect.width, 0), 1);
                            const audioEl = audioRef.current;
                            setVolume(pct);
                            if (audioEl) {
                                audioEl.volume = pct;
                            }
                        }}
                    >
                        <div className="volume-filled" style={{ width: `${volumePercent}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;