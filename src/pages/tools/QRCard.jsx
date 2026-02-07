import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { IconPrinter } from '@tabler/icons-react';
import './QRCard.css';

const QRCard = () => {
    const [businessProfile, setBusinessProfile] = useState(null);
    const [qrConfig, setQrConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const cardRef = useRef(null);

    const backendUrl = import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3000';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, qrRes] = await Promise.all([
                axios.get(`${backendUrl}/api/profile/get`, { withCredentials: true }),
                axios.get(`${backendUrl}/api/marketing/qr`, { withCredentials: true })
            ]);

            if (profileRes.data.profile) {
                setBusinessProfile(profileRes.data.profile);
            }
            if (qrRes.data.config) {
                setQrConfig(qrRes.data.config);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Generate QR URL - same logic as UserQRGenerator
    let qrUrl = websiteUrl;
    if (businessProfile?.subdomain && businessProfile?.qr_token) {
        qrUrl = `https://${businessProfile.subdomain}.bizease.com?id=${businessProfile.qr_token}`;
    } else if (businessProfile?.qr_token) {
        qrUrl = `${websiteUrl}?id=${businessProfile.qr_token}`;
    } else if (businessProfile?.slug) {
        qrUrl = `${websiteUrl}?id=${businessProfile.slug}`;
    }

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!businessProfile) return (
        <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: 24 }}>
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: 40,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #eee'
            }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📍</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#222' }}>
                    Setup Required
                </h2>
                <p style={{ color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
                    To generate a QR Card for reviews, you need to complete your <strong>Business Profile</strong> first.
                </p>
                <a
                    href="/user/business-profile"
                    style={{
                        display: 'inline-block',
                        padding: '12px 32px',
                        background: '#2563eb',
                        color: '#fff',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: 16
                    }}
                >
                    Complete Business Profile
                </a>
            </div>
        </div>
    );

    return (
        <div className="qr-card-page p-4">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 no-print">
                <h4 className="mb-0">
                    <span className="badge bg-success me-2">QR Card</span>
                    Generator
                </h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handlePrint}>
                        <IconPrinter size={18} className="me-1" />
                        Print Card
                    </button>
                </div>
            </div>

            {/* Card Preview */}
            <div className="d-flex justify-content-center">
                <div ref={cardRef} className="card-wrapper">
                    <div className="card-content">

                        <div className="business">
                            <h3>{businessProfile.businessName || 'Your Business Name'}</h3>
                        </div>

                        <h3 class="scan" style={{ fontSize: '46px' }}>Scan to review <span style={{ fontSize: '41px' }} >In less than <strong>5<svg class="highlight" width="205" height="17" viewBox="0 0 205 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.62599 4.60245C33.6378 2.24214 117.062 -0.161247 202.664 9.10766M2.95273 14.5959C19.8661 13.505 66.1001 11.6133 101.833 13.0647" stroke="currentcolor" stroke-width="4" stroke-linecap="round"></path>
                        </svg> </strong> SECONDS!</span></h3>


                        <div className="qr-box">
                            <div className="meter"><img src="/stand-card/revirew-meter.png" alt="meter" /></div>
                            <div className="qr-code-wrapper">
                                <QRCodeSVG
                                    value={qrUrl}
                                    size={305}
                                    bgColor={qrConfig?.background_color || '#ffffff'}
                                    fgColor={qrConfig?.foreground_color || '#000000'}
                                    level={qrConfig?.error_level || 'H'}
                                    imageSettings={qrConfig?.logo_url ? {
                                        src: qrConfig.logo_url,
                                        height: qrConfig.logo_size || 50,
                                        width: qrConfig.logo_size || 50,
                                        excavate: true
                                    } : undefined}
                                />
                            </div>
                        </div>

                        <h4 className="platform-app">SCAN & SHARE YOUR FEEDBACK!</h4>

                        <div className="logos">
                            {(businessProfile.platforms || []).map((platform, idx) => {
                                let iconSrc = "";
                                switch (platform.name.toLowerCase()) {
                                    case 'google': iconSrc = "/stand-card/google.png"; break;
                                    case 'facebook': iconSrc = "/stand-card/facebook.png"; break;
                                    case 'instagram': iconSrc = "/stand-card/instagram.png"; break;
                                    case 'trustpilot': iconSrc = "/stand-card/trust.png"; break;
                                    case 'youtube': iconSrc = "/stand-card/youtube.png"; break;
                                    case 'ambitionbox': iconSrc = "/stand-card/ambition-box.png"; break;
                                    case 'justdial': iconSrc = "/stand-card/justdial.png"; break;
                                    default: return null;
                                }
                                return (
                                    <span key={idx}>
                                        <img src={iconSrc} alt={platform.name} />
                                    </span>
                                );
                            })}
                        </div>

                        <p className="trademarks">All Trademarks and Logos are owned by their respective holders.</p>

                        <p className="footer feather-bg">Grow Your Business with a Free Listing on <a href="#">Bizease.com</a></p>

                        <div className="power-by">
                            <p>Powered By</p>
                            <div className="power-logo">
                                <img src="/stand-card/cal-logo.png" alt="CAL Info" width="100px" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCard;
