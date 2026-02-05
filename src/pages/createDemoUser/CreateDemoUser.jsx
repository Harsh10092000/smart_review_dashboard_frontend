import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    IconUserPlus,
    IconArrowLeft,
    IconCheck,
    IconTrash,
    IconPhoto,
    IconPlus,
    IconStar,
    IconWorld,
    IconBrandWhatsapp,
    IconBrandGoogle,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandYoutube
} from "@tabler/icons-react";
import KeywordChipInput from "../../components/KeywordChipInput";

const ACCENT = "#2563eb";

// Expanded Platform Options
const ALL_PLATFORM_OPTIONS = [
    { value: "google", label: "Google", icon: <IconBrandGoogle size={18} /> },
    { value: "facebook", label: "Facebook", icon: <IconBrandFacebook size={18} /> },
    { value: "instagram", label: "Instagram", icon: <IconBrandInstagram size={18} /> },
    { value: "trustpilot", label: "Trustpilot", icon: <IconStar size={18} /> },
    { value: "youtube", label: "YouTube", icon: <IconBrandYoutube size={18} /> },
    { value: "ambitionbox", label: "AmbitionBox", icon: <IconStar size={18} /> },
    { value: "justdial", label: "Justdial", icon: <IconStar size={18} /> },
];

const BUSINESS_TYPES = [
    { value: "real_estate", label: "Real Estate Agency" },
    { value: "restaurant", label: "Restaurant / Cafe" },
    { value: "retail", label: "Retail Store" },
    { value: "hotel", label: "Hotel / Hospitality" },
    { value: "healthcare", label: "Clinic / Hospital" },
    { value: "education", label: "School / Institute" },
    { value: "fitness", label: "Gym / Fitness Center" },
    { value: "salon", label: "Salon / Spa" },
    { value: "automotive", label: "Car Dealership / Service" },
    { value: "legal", label: "Law Firm" },
    { value: "finance", label: "Financial Services" },
    { value: "consulting", label: "Consultancy" },
    { value: "tech", label: "IT / Tech Services" },
    { value: "construction", label: "Construction / Interiors" },
    { value: "travel", label: "Travel Agency" },
    { value: "event", label: "Event Management" },
    { value: "cleaning", label: "Cleaning Services" },
    { value: "other", label: "Other" }
];

const CreateDemoUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [createdUser, setCreatedUser] = useState(null);

    const backendUrl = import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    // User Account Fields
    const [account, setAccount] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    // Business Profile Fields (Matching BusinessProfile.jsx state structure)
    const [profile, setProfile] = useState({
        businessName: "",
        businessType: "",
        logo: "",
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        subdomain: "",

        // Configs
        headerConfig: { links: [] },
        footerConfig: {
            description: "",
            links: [],
            social: { facebook: "", instagram: "", twitter: "", linkedin: "" }
        },

        // Contact
        address: "",
        phone: "",
        email: "",
        website: "",

        // AI Fields
        description: "",
        serviceType: "",
        areas: "",
        keywords: [], // Array for chip input
        languagePref: ["English"],
        ownerNames: [],

        // Platforms
        platforms: [],

        // WhatsApp
        whatsappNumber: "",
        whatsappMessage: "Hi! I just visited your business."
    });

    // --- STYLES (Exact copy from BusinessProfile.jsx) ---
    const labelStyle = {
        fontWeight: 600,
        color: "#334155",
        marginBottom: 8,
        display: "block",
        fontSize: 14
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        fontSize: 15,
        outline: "none",
        transition: "all 0.2s ease",
        background: "#fff",
        color: "#0f172a"
    };

    const checkboxContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: '#fff',
        padding: 16,
        borderRadius: 10,
        border: '1px solid #e2e8f0'
    };

    const headingStyle = {
        fontSize: 22,
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '2px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: 12
    };

    const cardStyle = {
        background: "#fff",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        border: "1px solid #f1f5f9",
        marginBottom: 24
    };

    const logoPreviewStyle = {
        width: 120,
        height: 120,
        borderRadius: 16,
        border: '2px dashed #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#f8fafc',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 0.2s'
    };

    // --- HANDLERS ---
    const handleAccountChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
    };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Deep merge handler for nested configs if needed, but simple one for now
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleLanguageChange = (lang) => {
        const current = profile.languagePref || [];
        if (current.includes(lang)) {
            setProfile({ ...profile, languagePref: current.filter(l => l !== lang) });
        } else {
            setProfile({ ...profile, languagePref: [...current, lang] });
        }
    };

    const handleFooterConfigChange = (field, value) => {
        setProfile({
            ...profile,
            footerConfig: { ...profile.footerConfig, [field]: value }
        });
    };

    const addHeaderLink = () => {
        if (profile.headerConfig.links.length < 4) {
            setProfile({
                ...profile,
                headerConfig: { ...profile.headerConfig, links: [...profile.headerConfig.links, { label: "", url: "" }] }
            });
        }
    };

    const handleHeaderLinkChange = (index, field, value) => {
        const newLinks = [...profile.headerConfig.links];
        newLinks[index][field] = value;
        setProfile({
            ...profile,
            headerConfig: { ...profile.headerConfig, links: newLinks }
        });
    };

    const removeHeaderLink = (index) => {
        const newLinks = profile.headerConfig.links.filter((_, i) => i !== index);
        setProfile({
            ...profile,
            headerConfig: { ...profile.headerConfig, links: newLinks }
        });
    };

    const addPlatform = () => {
        setProfile({ ...profile, platforms: [...profile.platforms, { name: "", url: "", enabled: true }] });
    };

    const handlePlatformChange = (index, field, value) => {
        const newPlatforms = [...profile.platforms];
        newPlatforms[index][field] = value;
        setProfile({ ...profile, platforms: newPlatforms });
    };

    const removePlatform = (index) => {
        const newPlatforms = profile.platforms.filter((_, i) => i !== index);
        setProfile({ ...profile, platforms: newPlatforms });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!account.name || !account.email || !account.password) {
            setError("Name, Email and Password are required");
            return;
        }
        if (!profile.businessName) {
            setError("Business Name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${backendUrl}/api/admin/createDemoUser`,
                { ...account, profile: profile },
                { withCredentials: true }
            );

            if (res.data.success) {
                setCreatedUser(res.data);
                setSuccess(true);
            } else {
                setError(res.data.message || "Failed to create demo user");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error creating demo user");
        } finally {
            setLoading(false);
        }
    };

    // Success View
    if (success && createdUser) {
        return (
            <div style={{ padding: "32px", width: "100%", maxWidth: 600, margin: '0 auto' }}>
                <div style={cardStyle}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: '#dcfce7', margin: '0 auto 20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <IconCheck size={40} color="#22c55e" />
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                            Demo User Created!
                        </h2>
                        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, textAlign: 'left', marginBottom: 24 }}>
                            <p style={{ marginBottom: 12 }}><strong>Email:</strong> {createdUser.credentials?.email}</p>
                            <p style={{ marginBottom: 12 }}><strong>Password:</strong> {createdUser.credentials?.password}</p>
                            <p style={{ marginBottom: 0 }}><strong>Business:</strong> {profile.businessName}</p>
                        </div>
                        <button onClick={() => navigate('/allRegUsers')} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                            Back to Users List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "32px", width: "100%", maxWidth: 1200, margin: '0 auto', paddingBottom: 140 }}>
            {/* Page Header */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <button
                        onClick={() => navigate('/allRegUsers')}
                        style={{
                            background: '#f1f5f9', border: 'none', borderRadius: 8,
                            padding: '8px 12px', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', gap: 6, fontSize: 14, color: '#64748b'
                        }}
                    >
                        <IconArrowLeft size={16} /> Back
                    </button>
                    <span style={{
                        background: '#fef3c7', color: '#92400e', padding: '4px 12px',
                        borderRadius: 20, fontSize: 12, fontWeight: 600
                    }}>
                        2 Day Trial
                    </span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: '-0.8px' }}>
                    Create Demo User
                </h1>
                <p style={{ color: "#64748b", fontSize: 16, marginTop: 4 }}>
                    Create a new user account with a pre-filled business profile.
                </p>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: 16, borderRadius: 10, marginBottom: 24 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

                {/* ================= USER ACCOUNT (New Card) ================= */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconUserPlus size={22} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>User Account Credentials</h3>
                            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Login details for the client</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Full Name *</label>
                            <input type="text" name="name" value={account.name} onChange={handleAccountChange} placeholder="John Doe" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address *</label>
                            <input type="email" name="email" value={account.email} onChange={handleAccountChange} placeholder="john@example.com" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone Number</label>
                            <input type="text" name="phone" value={account.phone} onChange={handleAccountChange} placeholder="+91 98765 43210" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Password *</label>
                            <input type="text" name="password" value={account.password} onChange={handleAccountChange} placeholder="demo123" style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* ================= WHATSAPP FLOATING BUTTON (From BusinessProfile) ================= */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconBrandWhatsapp size={22} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>WhatsApp Floating Button</h3>
                            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Appears on their public review page</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>WhatsApp Number</label>
                            <input type="text" name="whatsappNumber" value={profile.whatsappNumber} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Pre-filled Message</label>
                            <input type="text" name="whatsappMessage" value={profile.whatsappMessage} onChange={handleChange} placeholder="Hi! I visited your business..." style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* ================= SECTION 1: PAGE DETAILS ================= */}
                <div>
                    <h2 style={headingStyle}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 16, fontWeight: 700 }}>1</span>
                        Page Details & Branding
                    </h2>
                    <div style={cardStyle}>
                        {/* Branding Row */}
                        <div style={{ display: 'flex', gap: 40, marginBottom: 32, borderBottom: '1px solid #f1f5f9', paddingBottom: 32 }}>
                            {/* Logo */}
                            <div>
                                <label style={labelStyle}>Business Logo</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <label style={logoPreviewStyle}>
                                        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                            <IconPhoto size={32} stroke={1.5} />
                                            <span style={{ display: 'block', fontSize: 12, marginTop: 4, fontWeight: 500 }}>Upload Later</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            {/* Inputs */}
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Business Name</label>
                                    <input type="text" name="businessName" value={profile.businessName} onChange={handleChange} placeholder="Landmark Properties" style={{ ...inputStyle, fontWeight: 500 }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Custom Subdomain</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <input type="text" name="subdomain" value={profile.subdomain} onChange={handleChange} placeholder="my-business" style={{ ...inputStyle, fontWeight: 500, flex: 1 }} />
                                        <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>.bizease.com</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Primary Color (Header)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', padding: 8, borderRadius: 10, background: '#fff' }}>
                                        <input type="color" name="primaryColor" value={profile.primaryColor} onChange={handleChange} style={{ width: 44, height: 44, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 6 }} />
                                        <span style={{ fontSize: 15, color: '#475569', fontFamily: 'monospace', fontWeight: 600 }}>{profile.primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Secondary Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', padding: 8, borderRadius: 10, background: '#fff' }}>
                                        <input type="color" name="secondaryColor" value={profile.secondaryColor} onChange={handleChange} style={{ width: 44, height: 44, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 6 }} />
                                        <span style={{ fontSize: 15, color: '#475569', fontFamily: 'monospace', fontWeight: 600 }}>{profile.secondaryColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Header Config */}
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <label style={{ ...labelStyle, fontSize: 16, color: '#1e293b', marginBottom: 0 }}>
                                    Header Menu Links <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>({profile.headerConfig.links.length}/4)</span>
                                </label>
                                <button type="button" onClick={addHeaderLink} disabled={profile.headerConfig.links.length >= 4} style={{ fontSize: 13, color: profile.headerConfig.links.length >= 4 ? '#94a3b8' : ACCENT, background: profile.headerConfig.links.length >= 4 ? '#f1f5f9' : '#eff6ff', padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                    + Add Link
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                {profile.headerConfig.links.map((link, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 10 }}>
                                        <input value={link.label} onChange={(e) => handleHeaderLinkChange(idx, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, flex: '0 0 200px', padding: '8px 12px', fontSize: 14 }} />
                                        <input value={link.url} onChange={(e) => handleHeaderLinkChange(idx, 'url', e.target.value)} placeholder="URL" style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: 14 }} />
                                        <button type="button" onClick={() => removeHeaderLink(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><IconTrash size={18} /></button>
                                    </div>
                                ))}
                            </div>
                            {profile.headerConfig.links.length === 0 && <div style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic', padding: 20, textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 12 }}>No custom header links added yet.</div>}
                        </div>

                        {/* Footer Config */}
                        <div style={{ paddingTop: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 20 }}>Footer & Contact Configuration</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                <div>
                                    <label style={labelStyle}>Footer Tagline</label>
                                    <textarea value={profile.footerConfig.description} onChange={(e) => handleFooterConfigChange('description', e.target.value)} placeholder="Short description..." rows={3} style={{ ...inputStyle, resize: 'none' }} maxLength={150} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Contact Info</label>
                                    <div style={{ display: 'grid', gap: 12 }}>
                                        <input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone Number" style={inputStyle} />
                                        <input name="email" value={profile.email} onChange={handleChange} placeholder="Email Address" style={inputStyle} />
                                        <input name="address" value={profile.address} onChange={handleChange} placeholder="Short Address" style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= SECTION 2: AI & CONTEXT ================= */}
                <div>
                    <h2 style={headingStyle}>
                        <span style={{ background: '#fef3c7', color: '#d97706', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 16, fontWeight: 700 }}>2</span>
                        AI & Business Context
                    </h2>
                    <div style={cardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

                            {/* Business Category */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Business Category</label>
                                <select name="businessType" value={profile.businessType} onChange={handleChange} style={inputStyle}>
                                    <option value="">Select Category...</option>
                                    {BUSINESS_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Team Members */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Key Team Members / Owners</label>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                    <input type="text" id="newOwnerInput" placeholder="e.g. Dr. Emily Carter" style={{ ...inputStyle, flex: 1 }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim();
                                                if (val && !profile.ownerNames.includes(val)) {
                                                    setProfile({ ...profile, ownerNames: [...profile.ownerNames, val] });
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button type="button" onClick={() => {
                                        const input = document.getElementById('newOwnerInput');
                                        const val = input.value.trim();
                                        if (val && !profile.ownerNames.includes(val)) {
                                            setProfile({ ...profile, ownerNames: [...profile.ownerNames, val] });
                                            input.value = '';
                                        }
                                    }} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {profile.ownerNames.map((name, idx) => (
                                        <div key={idx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {name}
                                            <span onClick={() => {
                                                setProfile({ ...profile, ownerNames: profile.ownerNames.filter((_, i) => i !== idx) });
                                            }} style={{ cursor: 'pointer', opacity: 0.6 }}><IconTrash size={14} /></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Primary Services & Niche</label>
                                <textarea name="serviceType" value={profile.serviceType} onChange={handleChange} placeholder="e.g. Fine Dining, Luxury Homes..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Target Locations</label>
                                <textarea name="areas" value={profile.areas} onChange={handleChange} placeholder="e.g. Downtown, Westside..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
                            </div>

                            {/* Keywords Chip Input */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Brand Voice & Focus Keywords</label>
                                <KeywordChipInput
                                    value={profile.keywords}
                                    onChange={(keywords) => setProfile({ ...profile, keywords: keywords })}
                                    businessType={profile.businessType}
                                    businessName={profile.businessName}
                                    city={profile.address ? profile.address.split(',').pop().trim() : ''}
                                    serviceType={profile.serviceType}
                                    placeholder="Type keyword and press Enter..."
                                    maxKeywords={20}
                                />
                            </div>

                            {/* Languages */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Review Language(s)</label>
                                <div style={checkboxContainerStyle}>
                                    {["English", "Hindi", "Hinglish"].map(lang => (
                                        <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 15, color: '#334155', fontWeight: 500 }}>
                                            <input type="checkbox" checked={profile.languagePref.includes(lang)} onChange={() => handleLanguageChange(lang)} style={{ width: 18, height: 18, accentColor: ACCENT }} />
                                            {lang}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Short Context / Description</label>
                                <textarea name="description" value={profile.description} onChange={handleChange} placeholder="E.g. We are known for fast service..." rows={5} style={{ ...inputStyle, resize: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= PLATFORMS ================= */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <label style={{ ...labelStyle, fontSize: 16, color: '#1e293b', marginBottom: 0 }}>Connected Platforms</label>
                        <button type="button" onClick={addPlatform} style={{ fontSize: 14, color: '#fff', background: '#0f172a', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <IconPlus size={18} /> Add Platform
                        </button>
                    </div>
                    <div style={{ display: 'grid', gap: 20 }}>
                        {profile.platforms.map((platform, index) => (
                            <div key={index} style={{ border: '1px solid #e2e8f0', padding: 20, borderRadius: 16, display: 'flex', gap: 20, alignItems: 'center', background: '#fff' }}>
                                <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <IconStar size={24} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                                    <select value={platform.name} onChange={(e) => handlePlatformChange(index, "name", e.target.value)} style={{ ...inputStyle, width: 180 }}>
                                        <option value="">Select...</option>
                                        {ALL_PLATFORM_OPTIONS.map(opt => <option key={opt.value} value={opt.label}>{opt.label}</option>)}
                                    </select>
                                    <input type="text" value={platform.url} onChange={(e) => handlePlatformChange(index, "url", e.target.value)} placeholder="Review link..." style={{ ...inputStyle, flex: 1 }} />
                                </div>
                                <button type="button" onClick={() => removePlatform(index)} style={{ border: 'none', color: '#94a3b8', background: 'none' }}><IconTrash size={22} /></button>
                            </div>
                        ))}
                        {profile.platforms.length === 0 && <div style={{ fontSize: 15, color: '#64748b', textAlign: 'center', padding: 40, background: '#f8fafc', borderRadius: 16, border: '2px dashed #e2e8f0' }}>No platforms connected yet.</div>}
                    </div>
                </div>

                {/* ================= STICKY FOOTER ================= */}
                <div style={{ position: 'sticky', bottom: 20, background: '#fff', padding: '16px 24px', borderRadius: 16, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'flex-end', gap: 12, zIndex: 100, border: '1px solid #e2e8f0' }}>
                    <button type="button" onClick={() => navigate('/allRegUsers')} style={{ padding: "12px 24px", background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={loading} style={{ padding: "12px 32px", background: '#0f172a', color: "#fff", fontWeight: 600, fontSize: 15, border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer" }}>
                        {loading ? "Creating..." : "Create Demo User"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDemoUser;
