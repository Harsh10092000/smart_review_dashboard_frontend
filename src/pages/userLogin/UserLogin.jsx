import { useState, useContext } from "react";
import { AuthContext } from "../../context2/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../index.css";

const ACCENT = "#2563eb";
const CARD_BG = "#fff";
const PAGE_BG = "linear-gradient(135deg, #f4f6fb 0%, #e3eafc 100%)";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setUser, setLoginError } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await axios.post(
                (import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV) + "/api/auth/login/user",
                { email, password },
                { withCredentials: true }
            );

            setUser(res.data.user);
            setIsLoading(false);

            // Redirect based on user role
            if (res.data.user.role === 'admin') {
                navigate("/allRegUsers"); // Admin dashboard
            } else {
                navigate("/user/qr-generator"); // User dashboard
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Login failed";
            setError(errorMsg);
            setLoginError(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: PAGE_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: CARD_BG,
                    borderRadius: 24,
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.13)",
                    padding: "2.7rem 2.5rem 2.2rem 2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1.5px solid #e0e0e0",
                }}
            >
                {/* Logo/Brand */}
                <div style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: ACCENT,
                    marginBottom: 8,
                    letterSpacing: -1
                }}>
                    Smart Review System
                </div>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#222", marginBottom: 6, textAlign: "center" }}>
                    User Login
                </div>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 28, textAlign: "center" }}>
                    Sign in to your account
                </div>

                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <div style={{ marginBottom: 22 }}>
                        <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem",
                                border: "none",
                                borderBottom: `2px solid #e0e0e0`,
                                fontSize: 16,
                                marginBottom: 22,
                                background: "transparent",
                                outline: "none",
                            }}
                            onFocus={e => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                            onBlur={e => (e.target.style.borderBottom = `2px solid #e0e0e0`)}
                        />
                        <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem",
                                border: "none",
                                borderBottom: `2px solid #e0e0e0`,
                                fontSize: 16,
                                background: "transparent",
                                outline: "none",
                            }}
                            onFocus={e => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                            onBlur={e => (e.target.style.borderBottom = `2px solid #e0e0e0`)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "0.95rem",
                            background: ACCENT,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 18,
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            marginBottom: 12,
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "#174ea6")}
                        onMouseOut={e => (e.currentTarget.style.background = ACCENT)}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                    {error && (
                        <div style={{ color: "#e53e3e", marginTop: 8, textAlign: "center", fontWeight: 500 }}>{error}</div>
                    )}
                </form>

                <div style={{ width: "100%", textAlign: "center", marginTop: 8 }}>
                    <Link to="/forgot-password" style={{ color: ACCENT, textDecoration: "none", fontWeight: 500, fontSize: 15 }}>
                        Forgot Password?
                    </Link>
                </div>

                <div style={{ width: "100%", textAlign: "center", marginTop: 20, color: "#666", fontSize: 15, marginBottom: 20 }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}>
                        Register
                    </Link>
                </div>
                <div style={{ width: "100%", textAlign: "center", fontSize: 13, color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: 20, marginTop: 10, lineHeight: 1.6 }}>
                    Powered by <a href="https://calinfo.in" target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700, textDecoration: "none" }}>calinfo.in</a>
                    <br />
                    All rights reserved <a href="https://bizease.com" target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700, textDecoration: "none" }}>bizease.com</a>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
