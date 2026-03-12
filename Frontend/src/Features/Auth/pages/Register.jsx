import React, {useState} from 'react'
import '../style/register.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const {loading, handleRegister} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    async function handleSubmit(e) {
        e.preventDefault();
        await handleRegister({username, email, password})
        navigate("/")
    }



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
{/* yha se form ki starting  */}



                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-input-group">
                        <input
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)}
                         type="text" placeholder="Username" className="register-input" required />
                        <span className="register-input-highlight"></span>
                    </div>

                    <div className="register-input-group">
                        <input
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}
                        type="email" placeholder="Email Address" className="register-input" required />
                        <span className="register-input-highlight"></span>
                    </div>

                    <div className="register-input-group">
                        <input 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}
                        type="password" placeholder="Password" className="register-input" required />
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
