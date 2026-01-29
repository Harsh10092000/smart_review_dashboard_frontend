import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { DateFormat } from '../../components/Functions';
import Loader from '../../components/loader/Loader';
import {
    IconWorld, IconMapPin, IconBrandFacebook, IconBrandInstagram,
    IconBrandTwitter, IconBrandLinkedin, IconLink, IconPalette,
    IconRobot, IconLayoutNavbar, IconLayoutBottombar, IconUser, IconSettings,
    IconChartBar, IconShare
} from '@tabler/icons-react';

const ViewUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    import.meta.env.NODE_ENV === 'production'
                        ? import.meta.env.VITE_BACKEND_PROD + `/api/users/${id}`
                        : import.meta.env.VITE_BACKEND_DEV + `/api/users/${id}`
                );

                if (res.data) {
                    setUser(res.data.user);
                    setProfile(res.data.profile);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <Loader />;
    if (!user) return <div className="p-5 text-center">User not found</div>;

    // Safe Parsing Helper
    const safeParse = (data) => {
        try { return typeof data === 'string' ? JSON.parse(data) : data; } catch (e) { return {}; }
    };

    const theme = profile ? safeParse(profile.theme) : {};
    const promptConfig = profile ? safeParse(profile.prompt_config) : {};
    const headerConfig = profile ? safeParse(profile.header_config) : { links: [] };
    const footerConfig = profile ? safeParse(profile.footer_config) : { links: [], social: {} };
    const platforms = profile ? (Array.isArray(profile.platforms) ? profile.platforms : safeParse(profile.platforms)) : [];
    const social = footerConfig.social || {};

    const primaryColor = theme.primaryColor || '#2563eb';

    const tabs = [
        { id: 'overview', label: 'Overview & Contact', icon: <IconUser size={18} /> },
        { id: 'configuration', label: 'Branding & Menu', icon: <IconSettings size={18} /> },
        { id: 'ai', label: 'AI Configuration', icon: <IconRobot size={18} /> },
        { id: 'connections', label: 'Platforms & Social', icon: <IconShare size={18} /> }
    ];

    return (
        <div className="dashboard-main-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/allRegUsers" className="text-decoration-none text-muted small mb-1 d-block">
                        <i className="bi bi-arrow-left me-1"></i> Back to Users
                    </Link>
                    <div className="d-flex align-items-center gap-3">
                        <h2 className="fw-bold m-0 text-dark">User Profile</h2>
                        <span className={`badge rounded-pill px-3 py-2 ${user.is_active ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: 12 }}>
                            {user.is_active ? 'Active' : 'Blocked'}
                        </span>
                    </div>
                </div>
                {profile && (
                    <a href={
                        profile.subdomain
                            ? `https://${profile.subdomain}.bizease.com?id=${profile.qr_token || ''}`
                            : `http://localhost:3000/${profile.slug}`
                    } target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill fw-medium d-flex align-items-center gap-2">
                        <IconWorld size={18} /> View Public Page
                    </a>
                )}
            </div>

            {profile ? (
                <>
                    {/* Profile Summary Card */}
                    <div className="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden bg-white">
                        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row align-items-center align-items-md-center gap-4">
                            <div className="bg-light p-1 rounded-4 border" style={{ width: 100, height: 100, minWidth: 100 }}>
                                {profile.logo ? (
                                    <img src={profile.logo} alt="Logo" className="w-100 h-100 rounded-3" style={{ objectFit: 'contain' }} />
                                ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-white rounded-3 text-muted fw-bold small text-center p-2">No Logo</div>
                                )}
                            </div>
                            <div className="text-center text-md-start flex-grow-1">
                                <h2 className="fw-bold m-0 text-dark mb-1">{profile.business_name}</h2>
                                <div className="text-muted d-flex align-items-center justify-content-center justify-content-md-start gap-2 flex-wrap">
                                    <span className="badge bg-light text-dark border fw-normal">{profile.subdomain}.bizease.com</span>
                                    {profile.city && <span className="small text-muted"><IconMapPin size={14} className="me-1" />{profile.city}, {profile.state}</span>}
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <a href={`mailto:${user.email}`} className="btn btn-light border btn-sm rounded-pill px-3 fw-medium d-flex align-items-center gap-2"><IconUser size={16} /> Email</a>
                                <a href={`tel:${user.phone}`} className="btn btn-light border btn-sm rounded-pill px-3 fw-medium d-flex align-items-center gap-2"><IconShare size={16} /> Call</a>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-2">
                            <ul className="nav nav-pills nav-fill gap-2">
                                {tabs.map(tab => (
                                    <li className="nav-item" key={tab.id}>
                                        <button
                                            className={`nav-link d-flex align-items-center justify-content-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-muted bg-light'}`}
                                            onClick={() => setActiveTab(tab.id)}
                                            style={{ borderRadius: 12, fontWeight: 600, transition: 'all 0.2s', padding: '12px 20px' }}
                                        >
                                            {tab.icon} {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="card border-0 shadow-sm rounded-4 mb-5" style={{ minHeight: 400 }}>
                        <div className="card-body p-4 p-md-5">

                            {/* TAB 1: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="row g-5 fade show">
                                    <div className="col-md-6 border-end-md">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-primary-subtle text-primary p-2 rounded-3"><IconUser size={20} /></span>
                                            Owner & Account
                                        </h5>
                                        <div className="d-flex flex-column gap-4">
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Full Name</div>
                                                <div className="fw-bold text-dark fs-5">{user.name}</div>
                                            </div>
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Login Email</div>
                                                <div className="fw-medium text-dark">{user.email}</div>
                                            </div>
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Personal Phone</div>
                                                <div className="fw-medium text-dark">{user.phone || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Account Created</div>
                                                <div className="fw-medium text-dark">{DateFormat(user.created_at)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 ps-md-5">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-success-subtle text-success p-2 rounded-3"><IconMapPin size={20} /></span>
                                            Business Contact
                                        </h5>
                                        <div className="d-flex flex-column gap-4">
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Public Line</div>
                                                <div className="fw-medium text-dark">{profile.phone || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Support Email</div>
                                                <div className="fw-medium text-dark">{profile.email || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Address</div>
                                                <div className="fw-bold text-dark mb-1">{profile.address || '-'}</div>
                                                <div className="text-muted small">{profile.city}, {profile.state} {profile.pincode}</div>
                                            </div>
                                            <div>
                                                <div className="text-uppercase text-muted fw-bold small mb-1" style={{ fontSize: 11, letterSpacing: 0.5 }}>Links</div>
                                                <div className="d-flex flex-column gap-2 mt-2">
                                                    {profile.website && (
                                                        <a href={profile.website} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 text-decoration-none p-2 bg-light rounded hover-shadow-sm border border-transparent">
                                                            <IconWorld size={16} className="text-primary" /> <span className="text-dark small fw-medium text-truncate">{profile.website}</span>
                                                        </a>
                                                    )}
                                                    {profile.google_maps_link && (
                                                        <a href={profile.google_maps_link} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 text-decoration-none p-2 bg-light rounded hover-shadow-sm border border-transparent">
                                                            <IconMapPin size={16} className="text-danger" /> <span className="text-dark small fw-medium text-truncate">Google Maps Location</span>
                                                        </a>
                                                    )}
                                                    {!profile.website && !profile.google_maps_link && <span className="text-muted small fst-italic">No links added</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: CONFIGURATION */}
                            {activeTab === 'configuration' && (
                                <div className="row g-5 fade show">
                                    <div className="col-12">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-info-subtle text-info p-2 rounded-3"><IconLayoutNavbar size={20} /></span>
                                            Navigation Menu
                                        </h5>
                                        <div className="row g-4">
                                            <div className="col-lg-6">
                                                <div className="card h-100 border bg-light shadow-none">
                                                    <div className="card-header bg-transparent border-bottom fw-bold text-uppercase small py-3 px-3 text-muted">Header Links</div>
                                                    <div className="card-body p-0">
                                                        <div className="table-responsive">
                                                            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
                                                                <tbody className="bg-white">
                                                                    {headerConfig.links && headerConfig.links.length > 0 ? headerConfig.links.map((l, i) => (
                                                                        <tr key={i}>
                                                                            <td className="fw-bold text-dark px-3 py-3 w-25">{l.label}</td>
                                                                            <td className="text-muted py-3 px-3">
                                                                                <a href={l.url} className="text-decoration-none text-truncate d-block" style={{ maxWidth: 250 }} target="_blank" rel="noreferrer">{l.url}</a>
                                                                            </td>
                                                                        </tr>
                                                                    )) : <tr><td colSpan="2" className="text-center p-4 text-muted fst-italic">No header links configured</td></tr>}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="card h-100 border bg-light shadow-none">
                                                    <div className="card-header bg-transparent border-bottom fw-bold text-uppercase small py-3 px-3 text-muted">Footer Links</div>
                                                    <div className="card-body p-0">
                                                        <div className="table-responsive">
                                                            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
                                                                <tbody className="bg-white">
                                                                    {footerConfig.links && footerConfig.links.length > 0 ? footerConfig.links.map((l, i) => (
                                                                        <tr key={i}>
                                                                            <td className="fw-bold text-dark px-3 py-3 w-25">{l.label}</td>
                                                                            <td className="text-muted py-3 px-3">
                                                                                <a href={l.href || l.url} className="text-decoration-none text-truncate d-block" style={{ maxWidth: 250 }} target="_blank" rel="noreferrer">{l.href || l.url}</a>
                                                                            </td>
                                                                        </tr>
                                                                    )) : <tr><td colSpan="2" className="text-center p-4 text-muted fst-italic">No footer links configured</td></tr>}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-5">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-warning-subtle text-warning p-2 rounded-3"><IconPalette size={20} /></span>
                                            Footer Configuration
                                        </h5>
                                        <div className="p-4 bg-white border rounded-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="text-uppercase text-muted fw-bold small mb-2 d-block" style={{ fontSize: 11 }}>Footer Tagline</label>
                                                    <div className="text-dark fs-5 fst-italic serif border-start border-4 border-warning ps-3">
                                                        "{footerConfig.description || "No tagline configured"}"
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: AI INTELLIGENCE */}
                            {activeTab === 'ai' && (
                                <div className="row g-5 fade show">
                                    <div className="col-md-6 border-end-md">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-primary-subtle text-primary p-2 rounded-3"><IconRobot size={20} /></span>
                                            AI Context Variables
                                        </h5>
                                        <div className="d-flex flex-column gap-3">
                                            <div className="p-3 bg-light rounded-3 border border-transparent hover-border-primary transition-all">
                                                <label className="text-uppercase text-muted fw-bold small mb-2 d-block" style={{ fontSize: 11 }}>Business Owner Name</label>
                                                <div className="fw-medium text-dark">{promptConfig.ownerName || <span className="text-muted fst-italic">Not set</span>}</div>
                                            </div>
                                            <div className="p-3 bg-light rounded-3 border border-transparent hover-border-primary transition-all">
                                                <label className="text-uppercase text-muted fw-bold small mb-2 d-block" style={{ fontSize: 11 }}>Service / Niche</label>
                                                <div className="fw-medium text-dark">{promptConfig.serviceType || <span className="text-muted fst-italic">To be inferred from description</span>}</div>
                                            </div>
                                            <div className="p-3 bg-light rounded-3 border border-transparent hover-border-primary transition-all">
                                                <label className="text-uppercase text-muted fw-bold small mb-2 d-block" style={{ fontSize: 11 }}>Target Areas</label>
                                                <div className="fw-medium text-dark">{promptConfig.areas || <span className="text-muted fst-italic">Global / Not specified</span>}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 ps-md-5">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-success-subtle text-success p-2 rounded-3"><IconChartBar size={20} /></span>
                                            Business Context
                                        </h5>
                                        <div className="mb-4">
                                            <div className="text-uppercase text-muted fw-bold small mb-2" style={{ fontSize: 11 }}>Description</div>
                                            <div className="p-4 bg-light rounded-4 border fst-italic text-dark lh-lg position-relative">
                                                <span className="position-absolute top-0 start-0 ms-3 mt-1 text-muted opacity-25 display-3 fw-bold">"</span>
                                                {profile.description || "No description provided. The AI will generate generic responses."}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-uppercase text-muted fw-bold small mb-2" style={{ fontSize: 11 }}>SEO Keywords</div>
                                            <div className="p-3 bg-white border border-dashed rounded-3">
                                                {profile.keywords ? profile.keywords.split(',').map((k, i) => (
                                                    <span key={i} className="badge bg-light text-dark border me-2 mb-2 px-3 py-2 fw-normal">{k.trim()}</span>
                                                )) : <span className="text-muted small fst-italic">No specific keywords defined.</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: CONNECTIONS */}
                            {activeTab === 'connections' && (
                                <div className="row g-5 fade show">
                                    <div className="col-12">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-danger-subtle text-danger p-2 rounded-3"><IconWorld size={20} /></span>
                                            Connected Review Platforms
                                        </h5>
                                        <div className="row g-4">
                                            {Array.isArray(platforms) && platforms.length > 0 ? platforms.map((p, i) => (
                                                <div className="col-md-6 col-lg-4" key={i}>
                                                    <div className="p-3 border rounded-4 bg-white shadow-sm h-100 d-flex flex-column">
                                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                                            <span className="fw-bold text-dark">{p.name}</span>
                                                            <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                                                                <IconLink size={16} className="text-muted" />
                                                            </div>
                                                        </div>
                                                        <a href={p.url} className="text-primary text-decoration-none small text-break mt-auto" target="_blank" rel="noreferrer">
                                                            {p.url} <IconWorld size={12} className="ms-1" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )) : <div className="col-12"><div className="p-5 border border-dashed rounded-4 text-center text-muted">No review platforms connected yet.</div></div>}
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                            <span className="bg-info-subtle text-info p-2 rounded-3"><IconShare size={20} /></span>
                                            Social Media Profiles
                                        </h5>
                                        <div className="d-flex gap-3 flex-wrap">
                                            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="btn btn-outline-light text-dark border shadow-sm d-flex align-items-center gap-2 px-4 py-2 rounded-pill"><IconBrandFacebook size={20} className="text-primary" /> Facebook</a>}
                                            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="btn btn-outline-light text-dark border shadow-sm d-flex align-items-center gap-2 px-4 py-2 rounded-pill"><IconBrandInstagram size={20} className="text-danger" /> Instagram</a>}
                                            {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer" className="btn btn-outline-light text-dark border shadow-sm d-flex align-items-center gap-2 px-4 py-2 rounded-pill"><IconBrandTwitter size={20} className="text-info" /> Twitter</a>}
                                            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline-light text-dark border shadow-sm d-flex align-items-center gap-2 px-4 py-2 rounded-pill"><IconBrandLinkedin size={20} className="text-primary" /> LinkedIn</a>}

                                            {Object.values(social).every(v => !v) && <div className="p-4 border border-dashed rounded-4 w-100 text-center text-muted">No social media profiles linked.</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <div className="mb-3 text-muted"><IconUser size={48} stroke={1} /></div>
                    <h4 className="fw-bold">No Business Profile</h4>
                    <p className="text-muted">This user has not set up their business details yet.</p>
                </div>
            )}
        </div>
    );
};

export default ViewUser;
