import React, { memo, useState, useEffect, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context2/AuthContext';

const ACCENT = "#2563eb";

const UserIndex = memo(() => {
    const { currentUser, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/user-login');
    };

    const navLinkStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        borderRadius: 8,
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 15,
        color: isActive ? "#fff" : "#555",
        background: isActive ? ACCENT : "transparent",
        transition: "all 0.2s",
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            {/* Header */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "#fff",
                borderBottom: "1px solid #eee",
                padding: "0 24px",
            }}>
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 64,
                }}>
                    {/* Logo */}
                    <div style={{ fontSize: 24, fontWeight: 800, color: ACCENT, letterSpacing: -1 }}>
                        Smart Review System
                    </div>

                    {/* Desktop Nav */}
                    <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <NavLink to="/user/qr-generator" style={navLinkStyle}>
                            <span>📱</span> QR Generator
                        </NavLink>
                        <NavLink to="/user/business-profile" style={navLinkStyle}>
                            <span>🏢</span> Business Profile
                        </NavLink>
                    </nav>

                    {/* User Menu */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ fontSize: 14, color: "#666" }}>
                            {currentUser?.name || currentUser?.email}
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "8px 16px",
                                background: "transparent",
                                border: "1.5px solid #ddd",
                                borderRadius: 6,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#666",
                                cursor: "pointer",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = "#999";
                                e.currentTarget.style.color = "#333";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = "#ddd";
                                e.currentTarget.style.color = "#666";
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                <Outlet />
            </main>
        </div>
    );
});

export default UserIndex;
