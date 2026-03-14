import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Player from '../components/Player';
import { useSong } from '../hooks/useSong';
import { getAllSongs } from '../service/song.api';
import FaceExpression from '../../Expression/Components/FaceExpression';

const Home = () => {
  // Try to use the hook, providing a fallback if context isn't wrapped yet
  let songData = { loading: false, song: null, handleSong: () => { } };
  try {
    songData = useSong({ children: null });
  } catch (e) {
    console.warn("SongContext not found, using mockup data");
  }

  const { loading, song, handleSong, setSong } = songData;
  const [mood, setMood] = useState('Happy');
  const [allSongs, setAllSongs] = useState([]);
  // const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const data = await getAllSongs();
        setAllSongs(data || []);
      } catch (error) {
        console.error("Failed to fetch all songs", error);
      }
    };
    fetchAllSongs();
  }, []);

  // Re-scan is now handled directly by the embedded FaceExpression component
  const onRescan = () => {};

  const handleExpressionDetected = (expression) => {
    console.log("[Home] Expression from scanner:", expression);
    if (!expression) return;

    const normalized = String(expression).toLowerCase();
    let moodKey = 'happy';

    if (normalized.includes('sad')) {
      moodKey = 'sad';
    } else if (normalized.includes('surprise') || normalized.includes('surprised')) {
      moodKey = 'surprised';
    } else if (normalized.includes('happy')) {
      moodKey = 'happy';
    }

    const label = moodKey.charAt(0).toUpperCase() + moodKey.slice(1);
    console.log("[Home] Mapped moodKey:", moodKey, "label:", label);
    setMood(label);
    handleSong({ mood: moodKey });
    // After mood-based song is loaded, auto-press the player play button
    setTimeout(() => {
      const btn = document.querySelector('.pm-play');
      if (btn) {
        btn.click();
      }
    }, 800);
  };

  const handleQueueClick = (track) => {
    console.log("[Home] Queue item clicked:", track);
    if (!track || !track.url) return;
    setSong(track);
    // Auto-play when a queue item is clicked
    setTimeout(() => {
      const btn = document.querySelector('.pm-play');
      if (btn) {
        btn.click();
      }
    }, 200);
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="main-content">
        {/* Hidden camera + detector (runs in background) */}
        <FaceExpression onClick={handleExpressionDetected} />
        {/* Mood Banner */}
        <section className="mood-banner">
          <div className="mood-banner-content">
            <div className="mood-image-wrapper">
              <span className="scanning-badge">● SCANNING</span>
              {/* Show static photo */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
                alt="User"
                className="mood-user-image"
              />
            </div>
            <div className="mood-info">
              <h2>Detected Mood: <span className="mood-highlight">{mood} 😊</span></h2>
              <p>AI Scan complete. We've curated a high-energy pulse for your current state.</p>
              <div className="mood-actions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    const btn = document.getElementById('face-detect-button');
                    if (btn) {
                      btn.click();
                    }
                  }}
                >
                  Detect Mood
                </button>
                <button className="btn-secondary">Adjust Manually</button>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Featured Player Section */}
          <section className="featured-player">
            <div className="featured-artwork">
              <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop" alt="Album Art" />
            </div>
            <div className="featured-details">
              <h1 className="featured-title">Neon Dreams</h1>
              <p className="featured-artist">Cyber-Pulse • Midnight City</p>

              <div className="audio-visualizer">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="visualizer-bar" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                ))}
              </div>

              <div className="player-progress">
                <div className="progress-bar">
                  <div className="progress-filled" style={{ width: '45%' }}></div>
                </div>
                <div className="progress-times">
                  <span>1:17</span>
                  <span>3:45</span>
                </div>
              </div>

              <div className="featured-controls">
                <button className="control-btn icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button className="control-btn play-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <button className="control-btn icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </section>

          {/* Mood Queue Sidebar */}
          <aside className="mood-queue">
            <div className="queue-header">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                Mood Queue
              </h3>
            </div>
            <div className="queue-list">
              {allSongs.length > 0 ? (
                allSongs.map(track => (
                  <div
                    key={track._id}
                    className="queue-item"
                    onClick={() => handleQueueClick(track)}
                  >
                    <img src={track.posterUrl} alt={track.title} className="queue-thumb" />
                    <div className="queue-item-info">
                      <h4>{track.title}</h4>
                      <p>{track.mood}</p>
                    </div>
                    <span className="queue-time">–</span>
                  </div>
                ))
              ) : (
                <p>No tracks uploaded yet. Go to Upload to add some!</p>
              )}
            </div>
          </aside>
        </div>

        {/* Recommendations */}
        <section className="recommendations-section">
          <div className="section-header">
            <h3>All Uploaded Tracks</h3>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="recommendations-grid">
            {allSongs.length > 0 ? allSongs.map(rec => (
              <div key={rec._id} className="rec-card">
                <div className="rec-image-container">
                  <img src={rec.posterUrl} alt={rec.title} className="rec-image" />
                </div>
                <h4>{rec.title}</h4>
                <p>{rec.mood}</p>
              </div>
            )) : <p>No tracks uploaded yet. Go to Upload to add some!</p>}
          </div>
        </section>
      </main>

      <Player />
    </div>
  );
};

export default Home;
