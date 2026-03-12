import { Link } from "react-router-dom"
import "../style/login.css"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Login = () => {

    const {loading, handleLogin} = useAuth()
    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        await handleLogin({email, password, username})
        navigate("/")
    }

  return (
         <div className="auth-container">
            <div className="auth-background"></div>
            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="logo-image-container">
                            <img src="/assets/logo.png" alt="Capybara Logo" className="logo-img" />
                        </div>
                    </div>
                    <h2 className="auth-title">Vibe In</h2>
                    <p className="auth-subtitle">Welcome back! Time to drop the beat.</p>
                </div>

{/* yha se form start hai */}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                         value={username}
                          onChange={(e)=> setUsername(e.target.value)}
                           type="text"
                            placeholder="Username"
                             className="auth-input"
                              required />
                        <span className="input-highlight"></span>
                    </div>

                    <div className="input-group">
                        <input
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)} 
                        type="password"
                         placeholder="Password"
                          className="auth-input"
                           required />
                        <span className="input-highlight"></span>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Log In
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-btns">
                    <button className="social-btn" aria-label="Google Login">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="social-icon" />
                    </button>
                    <button className="social-btn" aria-label="Apple Login">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="social-icon invert-icon" />
                    </button>
                </div>

                <div className="auth-footer-text">
                    Don't have an account? <Link to="/register"><strong>Sign Up</strong></Link> 
                </div>

            </div>
        </div>
  )
}

export default Login
