import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { IconPrinter, IconAdjustments, IconX } from '@tabler/icons-react';
import './QRStand.css';

const QRStand = () => {
    const [businessProfile, setBusinessProfile] = useState(null);
    const [qrConfig, setQrConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const standRef = useRef(null);

    // Editable settings
    const [standSettings, setStandSettings] = useState({
        outerColor: '#0b2c66',
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

    // Generate QR URL - same logic as UserQRGenerator
    let qrUrl = websiteUrl;
    if (businessProfile?.subdomain && businessProfile?.qr_token) {
        qrUrl = `https://${businessProfile.subdomain}.bizease.com?id=${businessProfile.qr_token}`;
    } else if (businessProfile?.qr_token) {
        qrUrl = `${websiteUrl}?id=${businessProfile.qr_token}`;
    } else if (businessProfile?.slug) {
        qrUrl = `${websiteUrl}?id=${businessProfile.slug}`;
    }

    if (loading) return <div>Loading...</div>;
    if (!businessProfile) return <div>Please complete your business profile.</div>;

    return (
        <div className="qr-stand-page p-4">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 no-print">
                <h4 className="mb-0">
                    <span className="badge bg-info me-2">QR Stand</span>
                    Generator
                </h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handlePrint}>
                        <IconPrinter size={18} className="me-1" />
                        Print Stand
                    </button>
                </div>
            </div>

            {/* Stand Preview - New Design */}
            <div className="d-flex justify-content-center">
                <div ref={standRef} className="qr-wrapper" style={{ '--outer-color': standSettings.outerColor }}>
                    <div className="qr-card">

                        <div className="business">
                            <h3>{businessProfile.businessName || 'Your Business Name'}</h3>
                        </div>

                        <h3 class="scan">Scan to review <span>In less than <strong>5<svg class="highlight" width="205" height="17" viewBox="0 0 205 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.62599 4.60245C33.6378 2.24214 117.062 -0.161247 202.664 9.10766M2.95273 14.5959C19.8661 13.505 66.1001 11.6133 101.833 13.0647" stroke="currentcolor" stroke-width="4" stroke-linecap="round"></path>
                        </svg> </strong> SECONDS!</span></h3>


                        <div className="qr-box">
                            <div className="meter"><img src="/stand-card/revirew-meter.png" alt="meter" /></div>
                            {/* <img src="qr-code.png" alt="QR Code"/> */}
                            <div className="qr-code-wrapper">
                                <QRCodeSVG
                                    value={qrUrl}
                                    size={300}
                                    bgColor={qrConfig?.background_color || '#ffffff'}
                                    fgColor={qrConfig?.foreground_color || '#000000'}
                                    level={qrConfig?.error_level || 'H'}
                                    // style={{ borderRadius: '20px' }}
                                    imageSettings={qrConfig?.logo_url ? {
                                        src: qrConfig.logo_url,
                                        height: qrConfig.logo_size || 50,
                                        width: qrConfig.logo_size || 50,
                                        excavate: true
                                    } : undefined}
                                />
                            </div>
                        </div>

                        <h4 className="platform-app">Choose Your Preferred Review Platform</h4>

                        <div className="logos">
                            <span><img src="/stand-card/google.png" alt="google" /></span>
                            <span><img src="/stand-card/facebook.png" alt="facebook" /></span>
                            <span><img src="/stand-card/instagram.png" alt="Instagram" /></span>
                            <span><img src="/stand-card/youtube.png" alt="youtube" /></span>
                        </div>

                        <p class="trademarks">All Trademarks and Logos are owned by their respective holders.</p>

                        <p class="footer feather-bg">Grow Your Business with a Free Listing on <a href="#"> Bizease.com</a></p>

                        <div class="power-by">
                            <p>Powered By</p>
                            <div class="power-logo">
                                <img src="/stand-card/cal-logo.png" alt="CAL Info" width="100px" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRStand;
