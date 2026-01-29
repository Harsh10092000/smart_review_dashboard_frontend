import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { IconDownload, IconPrinter, IconAdjustments, IconX } from '@tabler/icons-react';
import './QRCard.css';

const QRCard = () => {
    const [businessProfile, setBusinessProfile] = useState(null);
    const [qrConfig, setQrConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const cardRef = useRef(null);

    // Editable settings
    const [cardSettings, setCardSettings] = useState({
        primaryColor: '#029f65',
    });

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

    const qrUrl = businessProfile?.slug ? `${websiteUrl}?id=${businessProfile.slug}` : websiteUrl;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!businessProfile) {
        return (
            <div className="alert alert-warning m-4">
                <h5>Setup Required</h5>
                <p>Please complete your Business Profile first to generate a QR Card.</p>
            </div>
        );
    }

    return (
        <div className="qr-card-page p-4">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="mb-0">
                    <span className="badge bg-primary me-2">QR Card</span>
                    Review Card Generator
                </h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => setShowSettings(!showSettings)}>
                        <IconAdjustments size={18} className="me-1" />
                        Customize
                    </button>
                    <button className="btn btn-primary" onClick={handlePrint}>
                        <IconPrinter size={18} className="me-1" />
                        Print
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Customize Card</strong>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowSettings(false)}>
                            <IconX size={16} />
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Primary Color</label>
                                <input
                                    type="color"
                                    className="form-control form-control-color w-100"
                                    value={cardSettings.primaryColor}
                                    onChange={(e) => setCardSettings({ ...cardSettings, primaryColor: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Card Preview - EXACT HTML/CSS from template */}
            <div className="d-flex justify-content-center" style={{ overflowX: 'auto' }}>
                <div
                    ref={cardRef}
                    className="review-card"
                    style={{ '--property-primary': cardSettings.primaryColor }}
                >
                    {/* LEFT CONTENT */}
                    <div className="left">
                        <div className="brand">
                            {businessProfile.logo ? (
                                <img src={businessProfile.logo} alt="business-logo" />
                            ) : (
                                <strong>{businessProfile.businessName}</strong>
                            )}
                        </div>

                        <h1>Loved Our Service? Leave a Review!</h1>

                        <p className="sub">
                            It takes less than a minute<br />
                            <b>Help others by sharing your honest experience</b>
                        </p>

                        <div className="stars">★★★★★</div>

                        <h3>Choose Your Preferred Review Platform</h3>

                        <div className="platforms">
                            <div className="glass">
                                <img src="/assets/card/g-icon.png" alt="Google" />
                                <span>Google</span>
                            </div>
                            <div className="glass">
                                <img src="/assets/card/facebook.png" alt="Facebook" />
                                <span>Facebook</span>
                            </div>
                            <div className="glass">
                                <img src="/assets/card/jd-logo.png" alt="Justdial" />
                                <span>Justdial</span>
                            </div>
                            <div className="glass">
                                <img src="/assets/card/trust.png" alt="Trustpilot" />
                                <span>Trustpilot</span>
                            </div>
                        </div>

                        <div className="footer">
                            Grow Your Business with a <b>FREE Listing</b> by
                            <img src="/assets/card/biz-logo.png" alt="bizease" />
                        </div>

                        <div className="powered">
                            Powered by <img src="/assets/card/cal-logo.webp" alt="Calinfo" width="70px" />
                        </div>
                    </div>

                    {/* RIGHT QR */}
                    <div className="right">
                        <div className="qr-box">
                            <QRCodeSVG
                                value={qrUrl}
                                size={260}
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
                        <p className="scan">SCAN TO LEAVE A REVIEW</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .review-card, .review-card * { visibility: visible; }
                    .review-card { position: absolute; left: 0; top: 0; }
                }
            `}</style>
        </div>
    );
};

export default QRCard;
