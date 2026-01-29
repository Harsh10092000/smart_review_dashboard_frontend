import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ACCENT = "#2563eb";
const CARD_BG = "#fff";
const PAGE_BG = "linear-gradient(135deg, #f4f6fb 0%, #e3eafc 100%)";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const userType = searchParams.get("type") || "admin";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMsg("");
        setError("");

        try {
            const res = await axios.post(
                (import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV) + "/api/auth/reset-password",
                { token, password, userType }
            );
            setSuccess(true);
            setMsg(res.data.message || "Password reset successful!");

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
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
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <div style={{ fontWeight: 700, fontSize: 24, color: "#222", marginBottom: 12 }}>
                        Invalid Reset Link
                    </div>
                    <div style={{ color: "#666", marginBottom: 24 }}>
                        The password reset link is invalid or has expired.
                    </div>
                    <Link
                        to="/forgot-password"
                        style={{
                            color: ACCENT,
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

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
                <div style={{ fontWeight: 800, fontSize: 26, color: "#222", marginBottom: 6, textAlign: "center" }}>
                    Reset Password
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 24, textAlign: "center" }}>
                    Enter your new password below.
                </div>

                {msg && <div style={{ color: "#388e3c", marginBottom: 12, textAlign: "center" }}>{msg}</div>}
                {error && <div style={{ color: "#e53935", marginBottom: 12, textAlign: "center" }}>{error}</div>}

                {!success ? (
                    <form onSubmit={handleResetPassword}>
                        <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
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
                            onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                            onBlur={(e) => (e.target.style.borderBottom = `2px solid #e0e0e0`)}
                        />

                        <label style={{ fontWeight: 600, color: "#444", marginBottom: 6, display: "block" }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            onFocus={(e) => (e.target.style.borderBottom = `2px solid ${ACCENT}`)}
                            onBlur={(e) => (e.target.style.borderBottom = `2px solid #e0e0e0`)}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "0.95rem",
                                background: ACCENT,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 16,
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "#174ea6")}
                            onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                        <div style={{ color: "#333", fontSize: 16 }}>
                            Password reset successful!
                        </div>
                        <div style={{ color: "#666", fontSize: 14, marginTop: 8 }}>
                            Redirecting to login...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
