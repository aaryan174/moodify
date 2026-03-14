import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../home/components/Navbar';
import './UploadSong.css';

const UploadSong = () => {
    const [title, setTitle] = useState('');
    const [mood, setMood] = useState('happy');
    const [songFile, setSongFile] = useState(null);
    const [posterFile, setPosterFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!songFile || !posterFile || !title) {
            setMessage({ type: 'error', text: 'Please provide all required fields (Title, Song, Poster)' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('mood', mood);
        formData.append('song', songFile);
        formData.append('poster', posterFile);

        try {
            const response = await axios.post('http://localhost:8080/api/songs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setMessage({ type: 'success', text: 'Song uploaded successfully!' });
            // Reset form
            setTitle('');
            setMood('happy');
            setSongFile(null);
            setPosterFile(null);
            // reset file inputs visually
            document.getElementById('song-upload').value = '';
            document.getElementById('poster-upload').value = '';

        } catch (error) {
            console.error('Upload Error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to upload song. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <Navbar />

            <main className="upload-main">
                <div className="upload-card">
                    <div className="upload-header">
                        <h2>Upload Track</h2>
                        <p>Share your pulse with the world.</p>
                    </div>

                    {message.text && (
                        <div className={`message-banner ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form className="upload-form" onSubmit={handleSubmit}>

                        <div className="form-group box-hover">
                            <label htmlFor="title">Track Title</label>
                            <input
                                type="text"
                                id="title"
                                className="form-input"
                                placeholder="E.g., Neon Dreams"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group box-hover">
                            <label htmlFor="mood">Mood Category</label>
                            <div className="custom-select-wrapper">
                                <select
                                    id="mood"
                                    className="form-select"
                                    value={mood}
                                    onChange={(e) => setMood(e.target.value)}
                                >
                                    <option value="happy">Happy (High Energy)</option>
                                    <option value="sad">Sad (Mellow/Chill)</option>
                                    <option value="surprised">Surprised (Dynamic)</option>
                                </select>
                            </div>
                        </div>

                        <div className="file-groups-row">
                            <div className="form-group file-group box-hover">
                                <label>Audio File (.mp3)</label>
                                <div className="file-drop-area">
                                    <input
                                        type="file"
                                        id="song-upload"
                                        accept="audio/mp3,audio/mpeg"
                                        className="file-input"
                                        onChange={(e) => setSongFile(e.target.files[0])}
                                    />
                                    <span className="file-msg">
                                        {songFile ? songFile.name : 'Choose a file or drag it here'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group file-group box-hover">
                                <label>Cover Art (.jpeg, .png)</label>
                                <div className="file-drop-area">
                                    <input
                                        type="file"
                                        id="poster-upload"
                                        accept="image/jpeg,image/png,image/jpg"
                                        className="file-input"
                                        onChange={(e) => setPosterFile(e.target.files[0])}
                                    />
                                    <span className="file-msg">
                                        {posterFile ? posterFile.name : 'Choose an image'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary upload-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>{`.spinner{animation: spin 1s linear infinite;} @keyframes spin { 100% { transform: rotate(360deg); } }`}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" /><path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.7511A10.95,10.95,0,0,0,12,1.3Z" /></svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload Track'
                            )}
                        </button>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default UploadSong;
