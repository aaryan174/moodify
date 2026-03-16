import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSong } from '../hooks/useSong';

const Navbar = () => {
// search bar funtionality yohoo
    const {handleSearchSong, searchSong, setSearchSong } = useSong();
    const [title, setTitle] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    function handleKeydown(e){
        if(e.key === "Enter") {
            handleSearchSong({ title });
        }
    }

    const location = useLocation();
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "dark";
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };

   

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <div className="logo-icon"></div>
                    Moodfiy
                </div>
                {/* Desktop nav links */}
                <ul className="navbar-nav">
                    <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/">Home</Link>
                    </li>
                    <li className="nav-item">Mood Detection</li>
                    <li className="nav-item">Library</li>
                    <li className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/upload">Upload</Link>
                    </li>
                </ul>
            </div>

            {/* Hamburger - visible on mobile only */}
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile nav dropdown */}
            {menuOpen && (
                <ul className="mobile-nav" onClick={() => setMenuOpen(false)}>
                    <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/">Home</Link>
                    </li>
                    <li className="nav-item">Mood Detection</li>
                    <li className="nav-item">Library</li>
                    <li className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/upload">Upload</Link>
                    </li>
                </ul>
            )}

            <div className="navbar-right">
                <div className="search-container">
                    <span className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeydown}
                        type="text"
                        className="search-input"
                        placeholder="Search vibes..."
                        style={title ? { paddingRight: '30px' } : {}}
                    />
                    {title && (
                        <span
                            onMouseDown={(e) => { e.preventDefault(); setTitle(""); setSearchSong([]); }}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary, #aaa)', fontSize: '16px', lineHeight: 1, userSelect: 'none', zIndex: 10 }}
                            title="Clear search"
                        >
                            ✕
                        </span>
                    )}
                    {searchSong && searchSong.length > 0 && (
                        <div className="search-results" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'var(--bg-card, #1e1e1e)', zIndex: 1000, borderRadius: '8px', marginTop: '8px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', maxHeight: '300px', overflowY: 'auto' }}>
                            {searchSong.map((song) => (
                                <div key={song._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>
                                    <img src={song.posterUrl} width="40" height="40" style={{ borderRadius: '4px', objectFit: 'cover' }} alt={song.title} />
                                    <p style={{ margin: 0, color: 'var(--text-primary, #fff)', fontSize: '14px', textAlign: 'left' }}>{song.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === "dark" ? (
                        // Sun icon for light mode
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    ) : (
                        // Moon icon for dark mode
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    )}
                </button>

                <div className="user-profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
