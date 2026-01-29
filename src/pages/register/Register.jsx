import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../index.css";

const ACCENT = "#2563eb";
const CARD_BG = "#fff";
const PAGE_BG = "linear-gradient(135deg, #f4f6fb 0%, #e3eafc 100%)";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(
                (import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV) + "/api/auth/register",
                { name, email, phone, password },
                { withCredentials: true }
            );

            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
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
                    maxWidth: 480,
                    background: CARD_BG,
                    borderRadius: 24,
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.13)",
                    padding: "2.4rem 2.2rem",
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
                    EasyReviews
                </div>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#222", marginBottom: 6, textAlign: "center" }}>
                    Create Account
                </div>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 24, textAlign: "center" }}>
                    Register to get started
                </div>

                {success ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                        <div style={{ color: "#388e3c", fontSize: 18, fontWeight: 600 }}>
                            Registration successful!
                        </div>
                        <div style={{ color: "#666", fontSize: 14, marginTop: 8 }}>
                            Redirecting to login...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderBottom: "2px solid #e0e0e0",
                                    fontSize: 16,
                                    background: "transparent",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #e0e0e0")}
                            />
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderBottom: "2px solid #e0e0e0",
                                    fontSize: 16,
                                    background: "transparent",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #e0e0e0")}
                            />
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Phone (Optional)</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderBottom: "2px solid #e0e0e0",
                                    fontSize: 16,
                                    background: "transparent",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #e0e0e0")}
                            />
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Password</label>
                            <input
                                type="password"
                                placeholder="Create a password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderBottom: "2px solid #e0e0e0",
                                    fontSize: 16,
                                    background: "transparent",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #e0e0e0")}
                            />
                        </div>

                        <div style={{ marginBottom: 22 }}>
                            <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "none",
                                    borderBottom: "2px solid #e0e0e0",
                                    fontSize: 16,
                                    background: "transparent",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #e0e0e0")}
                            />
                        </div>

                        {error && (
                            <div style={{ color: "#e53e3e", marginBottom: 16, textAlign: "center", fontWeight: 500 }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: "100%",
                                padding: "0.95rem",
                                background: ACCENT,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 17,
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                marginBottom: 16,
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "#174ea6")}
                            onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>

                        <div style={{ textAlign: "center", color: "#666", fontSize: 14 }}>
                            Already have an account?{" "}
                            <Link to="/user-login" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}>
                                Sign in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
