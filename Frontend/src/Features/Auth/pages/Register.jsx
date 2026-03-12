import React from 'react'
import '../style/register.css'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
     <div className="register-container">
            {/* Background Image Container */}
            <div className="register-background"></div>

            {/* Main Glassmorphism Card */}
            <div className="register-card">

                <div className="register-header">
                    <div className="register-logo">
                        <div className="register-logo-image-container">
                            <img src="/assets/logo.png" alt="Capybara Logo" className="register-logo-img" />
                        </div>
                    </div>
                    <h2 className="register-title">Join the Vibe</h2>
                    <p className="register-subtitle">Create an account to start listening.</p>
                </div>

                <form className="register-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="register-input-group">
                        <input type="text" placeholder="Username" className="register-input" required />
                        <span className="register-input-highlight"></span>
                    </div>

                    <div className="register-input-group">
                        <input type="email" placeholder="Email Address" className="register-input" required />
                        <span className="register-input-highlight"></span>
                    </div>

                    <div className="register-input-group">
                        <input type="password" placeholder="Password" className="register-input" required />
                        <span className="register-input-highlight"></span>
                    </div>

                    <button type="submit" className="register-submit-btn">
                        Sign Up
                    </button>
                </form>

                <div className="register-divider">
                    <span>or register with</span>
                </div>

                <div className="register-social-btns">
                    <button className="register-social-btn" aria-label="Google Register">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="register-social-icon" />
                    </button>
                    <button className="register-social-btn" aria-label="Apple Register">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="register-social-icon register-invert-icon" />
                    </button>
                </div>

                <div className="register-footer-text">
                    Already have an account? <Link to="/login"><strong>Log In</strong></Link> 
                </div>

            </div>
        </div>
  )
}

export default Register
