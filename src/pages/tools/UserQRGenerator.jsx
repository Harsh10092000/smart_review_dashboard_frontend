import React, { useState, useRef, useEffect, useContext } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context2/AuthContext';
import {
    IconDeviceFloppy,
    IconQrcode,
    IconExternalLink,
    IconPrinter,
    IconUpload,
    IconTrash,
    IconRefresh,
    IconCopy,
    IconCloudUpload,
    IconCheck,
    IconInfoCircle,
    IconBulb,
    IconSettings,
    IconDownload
} from '@tabler/icons-react';

const UserQRGenerator = () => {
    const { currentUser } = useContext(AuthContext);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // QR State
    const [url, setUrl] = useState('');
    const [size, setSize] = useState(1024);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [fgColor, setFgColor] = useState('#000000');
    const [logo, setLogo] = useState(null);
    const [logoSize, setLogoSize] = useState(60);
    const [level, setLevel] = useState('H');
    const [margin, setMargin] = useState(true);

    // Save State
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    const qrRef = useRef();
    const fileInputRef = useRef();

    const backendUrl = import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const profileRes = await axios.get(`${backendUrl}/api/profile/get`, { withCredentials: true });
            const profile = profileRes.data.profile;

            if (profile) {
                setBusinessProfile(profile);

                // Generate URL
                if (profile.subdomain && profile.qr_token) {
                    setUrl(`https://${profile.subdomain}.bizease.com?id=${profile.qr_token}`);
                } else if (profile.qr_token) {
                    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3000';
                    setUrl(`${websiteUrl}?id=${profile.qr_token}`);
                } else if (profile.slug) {
                    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3000';
                    setUrl(`${websiteUrl}?id=${profile.slug}`);
                }
            }

            // 2. Fetch QR Config
            const configRes = await axios.get(`${backendUrl}/api/marketing/qr`, { withCredentials: true });
            const conf = configRes.data.config;

            if (conf) {
                // Config exists - Apply it (including null logo if they removed it)
                if (conf.size) setSize(conf.size);
                if (conf.background_color) setBgColor(conf.background_color);
                if (conf.foreground_color) setFgColor(conf.foreground_color);

                // Important: Apply saved logo state, even if null (meaning user removed it)
                // If conf.logo_url is null, setLogo(null) will correctly remove it.
                setLogo(conf.logo_url);

                if (conf.logo_size) setLogoSize(conf.logo_size);
                if (conf.error_level) setLevel(conf.error_level);
            } else {
                // No Config exists (First time user) - Use defaults
                // Fallback: Use profile logo if available
                if (profile && profile.logo) {
                    setLogo(profile.logo);
                }
            }

        } catch (err) {
            console.error("Failed to load QR data:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveToDatabase = async () => {
        setSaving(true);
        setSaveStatus(null);
        try {
            const payload = {
                url, // Current dynamic URL
                size,
                background_color: bgColor,
                foreground_color: fgColor,
                logo_url: logo,
                logo_size: logoSize,
                error_level: level
            };

            await axios.post(`${backendUrl}/api/marketing/qr`, payload, { withCredentials: true });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err) {
            console.error("Failed to save QR config:", err);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadQR = (format) => {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);

            if (format === 'png') {
                const pngFile = canvas.toDataURL('image/png', 1.0);
                const downloadLink = document.createElement('a');
                downloadLink.download = `review_qr_${Date.now()}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            } else if (format === 'svg') {
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const svgUrl = URL.createObjectURL(svgBlob);
                const downloadLink = document.createElement('a');
                downloadLink.download = `review_qr_${Date.now()}.svg`;
                downloadLink.href = svgUrl;
                downloadLink.click();
            }
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };


    const resetSettings = () => {
        if (window.confirm('Reset all customizations to default?')) {
            setUrl('https://landmarkplots.com/share-feedback?utm_source=qr_code&utm_medium=offline&utm_campaign=feedback_campaign');
            setSize(1024);
            setBgColor('#ffffff');
            setFgColor('#000000');
            setLogo(null);
            setLogoSize(60);
            setLevel('H');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // No profile or no Slug
    if (!businessProfile || !businessProfile.slug) {
        return (
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
                        To generate a QR code for reviews, you need to complete your <strong>Business Profile</strong> first.
                    </p>
                    <Link
                        to="/user/business-profile"
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
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-main-wrapper p-0 overflow-visible" style={{ background: 'transparent', boxShadow: 'none' }}>
            <div className="container-fluid py-2">
                {/* Header Area */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3 bg-white p-3 shadow-sm rounded-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-primary-subtle rounded-3 text-primary">
                            <IconQrcode size={32} stroke={2.5} />
                        </div>
                        <div>
                            <h2 className="h4 mb-0 fw-bold text-dark">{businessProfile.businessName} QR Code</h2>
                            <p className="text-muted mb-0 small">Share this code to collect customer reviews</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className={`btn ${saveStatus === 'success' ? 'btn-success' : 'btn-dark'} d-flex align-items-center gap-2 px-4 rounded-pill fw-semibold`}
                            onClick={saveToDatabase}
                            disabled={saving}
                        >
                            {saving ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : saveStatus === 'success' ? (
                                <IconCheck size={18} />
                            ) : (
                                <IconCloudUpload size={18} />
                            )}
                            {saveStatus === 'success' ? 'Saved' : 'Save Config'}
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill" onClick={resetSettings}>
                            <IconRefresh size={18} /> Reset
                        </button>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Configuration & Export */}
                    <div className="col-lg-4">
                        <div className="bg-white shadow-sm p-4 h-100 rounded-4 border-0">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <IconSettings size={20} className="text-primary" /> Setup & Export
                            </h5>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Target URL (Auto-Generated)</label>
                                <div className="input-group mb-2 shadow-sm rounded-3 overflow-hidden">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-2 fs-6"
                                        value={url}
                                        readOnly // User cannot change this
                                    />
                                    <button className="btn btn-light border-0" onClick={() => navigator.clipboard.writeText(url)}>
                                        <IconCopy size={18} />
                                    </button>
                                </div>
                                <div className="d-flex align-items-center gap-1 text-primary small bg-primary-subtle p-2 rounded-3 border-0">
                                    <IconExternalLink size={14} />
                                    <a href={url} target="_blank" rel="noreferrer" className="text-primary text-decoration-none text-truncate d-inline-block" style={{ maxWidth: '220px' }}>{url}</a>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small text-uppercase">Background</label>
                                    <div className="d-flex align-items-center gap-2 p-2 border rounded-3 bg-light">
                                        <input type="color" className="form-control form-control-color border-0 p-0 rounded-circle" style={{ width: '24px', height: '24px' }} value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                                        <span className="small fw-bold text-uppercase">{bgColor}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small text-uppercase">QR Color</label>
                                    <div className="d-flex align-items-center gap-2 p-2 border rounded-3 bg-light">
                                        <input type="color" className="form-control form-control-color border-0 p-0 rounded-circle" style={{ width: '24px', height: '24px' }} value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                                        <span className="small fw-bold text-uppercase">{fgColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Central Logo (Optional)</label>
                                <div className="d-flex gap-3 align-items-center p-3 border rounded-3 bg-light shadow-sm">
                                    <div
                                        className="border-0 rounded-3 d-flex align-items-center justify-content-center bg-white overflow-hidden shadow-sm"
                                        style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {logo ? <img src={logo} alt="Logo" className="w-100 h-100 object-fit-contain p-1" /> : <IconUpload className="text-muted" />}
                                    </div>
                                    <div className="flex-grow-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="d-none"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                        />
                                        <button className="btn btn-sm btn-dark px-3 py-2 rounded-pill mb-1" onClick={() => fileInputRef.current.click()}>Upload Logo</button>
                                        {logo && <button className="btn btn-sm text-danger border-0 p-0 ms-2" onClick={() => setLogo(null)}><IconTrash size={18} /></button>}
                                        <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>Square PNG with transparency works best.</p>
                                    </div>
                                </div>
                                {logo && (
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="form-label small fw-bold">Size: {logoSize}px</label>
                                        </div>
                                        <input type="range" className="form-range custom-range" min="20" max="150" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} />
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Error Correction</label>
                                <select className="form-select border-0 bg-light py-2 rounded-3 shadow-sm" value={level} onChange={(e) => setLevel(e.target.value)}>
                                    <option value="L">Low (7% damaged-safe)</option>
                                    <option value="M">Medium (15% damaged-safe)</option>
                                    <option value="Q">Quartile (25% damaged-safe)</option>
                                    <option value="H">High (30% damaged-safe)</option>
                                </select>
                            </div>

                            <hr className="my-4 opacity-50" />

                            <div className="export-controls">
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <IconDownload size={18} className="text-success" /> Export QR Code
                                </h6>
                                <div className="row g-2 align-items-end mb-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-secondary small text-uppercase mb-2 d-block">Download Quality</label>
                                        <select className="form-select border-0 bg-light py-2 rounded-3 shadow-sm" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                                            <option value={512}>512px (Mobile / Web)</option>
                                            <option value={1024}>1024px (Standard Card)</option>
                                            <option value={2048}>2048px (Large Print)</option>
                                            <option value={4096}>4096px (Billboard / Flex)</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <button className="btn btn-lg btn-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 fs-6 py-2 shadow" onClick={() => downloadQR('png')}>
                                            <IconDeviceFloppy size={22} /> Download PNG
                                        </button>
                                    </div>
                                    <div className="col-12 mt-2 text-center">
                                        <button className="btn btn-sm btn-link text-dark text-decoration-none fw-semibold" onClick={() => downloadQR('svg')}>
                                            Export SVG Format
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: XXL Live Preview */}
                    <div className="col-lg-5">
                        <div className="bg-white shadow-sm h-100 rounded-4 border-0 d-flex flex-column overflow-hidden">
                            <div className="p-4 border-bottom border-light flex-grow-0">
                                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                    <IconPrinter size={20} className="text-primary" /> High Resolution Preview
                                </h5>
                            </div>

                            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 bg-light">
                                <div
                                    className="p-5 bg-white shadow-lg overflow-hidden"
                                    style={{
                                        borderRadius: '32px',
                                        transition: 'all 0.3s ease',
                                        maxWidth: '100%'
                                    }}
                                    ref={qrRef}
                                >
                                    <QRCodeSVG
                                        value={url}
                                        size={450}
                                        bgColor={bgColor}
                                        fgColor={fgColor}
                                        level={level}
                                        includeMargin={margin}
                                        imageSettings={logo ? {
                                            src: logo,
                                            x: undefined,
                                            y: undefined,
                                            height: logoSize,
                                            width: logoSize,
                                            excavate: true,
                                        } : undefined}
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-muted small fw-bold mb-1">LIVE PREVIEW (450x450)</p>
                                    <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2 border">
                                        Final Export: {size}x{size} px
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Instructions Sidebar (Cleaned up) */}
                    <div className="col-lg-3">
                        <div className="bg-white shadow-sm p-4 h-100 rounded-4 border-0">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom pb-3">
                                <IconInfoCircle size={20} className="text-secondary" /> Tips & Tricks
                            </h5>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className="p-1 bg-warning-subtle text-warning rounded-circle">
                                        <IconBulb size={14} />
                                    </span>
                                    <h6 className="mb-0 fw-bold small">Why this QR?</h6>
                                </div>
                                <p className="text-muted small mb-3">
                                    This QR code redirects users to your **Public Review Page**. It automatically detects if their session is expired or new.
                                </p>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                                    <IconCheck size={16} />
                                    <h6 className="mb-0 fw-bold small">Scan Safety</h6>
                                </div>
                                <p className="text-muted small mb-0">
                                    If you use a custom Logo, keep **Error Correction on High**.
                                </p>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-2 text-dark">
                                    <IconPrinter size={16} />
                                    <h6 className="mb-0 fw-bold small">Printing Guide</h6>
                                </div>
                                <ul className="text-muted small ps-3 mb-0 list-unstyled">
                                    <li className="mb-3 d-flex align-items-start gap-2">
                                        <span className="badge bg-light text-dark border">512px</span>
                                        <span>For Social Media & WhatsApp</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-start gap-2">
                                        <span className="badge bg-light text-dark border">1024px</span>
                                        <span>For Visiting Cards & Tables</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-start gap-2">
                                        <span className="badge bg-light text-dark border">2048px</span>
                                        <span>For Posters & Standees</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-range::-webkit-slider-runnable-track { background: #eef2f6; height: 6px; border-radius: 6px; }
                .custom-range::-webkit-slider-thumb { margin-top: -6px; height: 18px; width: 18px; background: #0d6efd; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .form-control:focus, .form-select:focus { border-color: #0d6efd20 !important; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1) !important; }
                .btn-dark { background-color: #1c252e; border-color: #1c252e; }
                .btn-dark:hover { background-color: #000; }
                .bg-primary-subtle { background-color: #e7f0ff !important; }
                .bg-warning-subtle { background-color: #fff9db !important; }
                .text-warning { color: #f59f00 !important; }
                .btn-primary { background-color: #0d6efd; border-color: #0d6efd; }
                .btn-primary:hover { background-color: #0b5ed7; }
                .shadow { box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25) !important; }
            `}</style>
        </div>
    );
};

export default UserQRGenerator;
