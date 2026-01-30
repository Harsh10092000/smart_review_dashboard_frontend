import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context2/AuthContext";
import { IconTrash, IconBrandGoogle, IconBrandFacebook, IconBrandTripadvisor, IconPlus, IconStar, IconUpload, IconPhoto, IconBrandInstagram, IconBrandTwitter, IconBrandLinkedin, IconBrandYoutube, IconWorld } from "@tabler/icons-react";

const ACCENT = "#2563eb";

// Expanded Platform Options
const ALL_PLATFORM_OPTIONS = [
    { value: "google", label: "Google", icon: <IconBrandGoogle size={18} /> },
    { value: "facebook", label: "Facebook", icon: <IconBrandFacebook size={18} /> },
    { value: "instagram", label: "Instagram", icon: <IconBrandInstagram size={18} /> },
    { value: "trustpilot", label: "Trustpilot", icon: <IconStar size={18} /> },
    // { value: "tripadvisor", label: "TripAdvisor", icon: <IconBrandTripadvisor size={18} /> },
    // { value: "zomato", label: "Zomato", icon: <IconStar size={18} /> },
    { value: "youtube", label: "YouTube", icon: <IconBrandYoutube size={18} /> },
    { value: "ambitionbox", label: "AmbitionBox", icon: <IconStar size={18} /> },
    { value: "justdial", label: "Justdial", icon: <IconStar size={18} /> },
    // { value: "other", label: "Other", icon: <IconWorld size={18} /> }
];

// Expanded Business Types
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

const BusinessProfile = () => {
    const { currentUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [profile, setProfile] = useState({
        // Basic & Branding
        slug: "",
        businessName: "",
        logo: "",
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",

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

        // AI & Platforms (Section 2)
        businessType: "",
        languagePref: [], // Array for multiple selections
        description: "", // Generic context

        // New AI Fields
        serviceType: "", // e.g. "Fine Dining", "Luxury Homes"
        areas: "", // Comma separated string
        keywords: "", // Optional custom keywords for AI prompts

        platforms: [],

        // New: Subdomain & QR Token
        subdomain: "",
        qr_token: "",

        // New: Owner Name (for AI context)
        ownerNames: [], // Array of strings
    });

    const backendUrl = import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${backendUrl}/api/profile/get`,
                { withCredentials: true }
            );
            if (res.data.profile) {
                const p = res.data.profile;

                // Parse language CSV to Array
                let langArray = [];
                if (p.languagePref) {
                    langArray = p.languagePref.split(',').map(s => s.trim()).filter(Boolean);
                } else {
                    langArray = ["English"];
                }

                setProfile({
                    ...p,
                    primaryColor: p.theme?.primaryColor || "#2563eb",
                    secondaryColor: p.theme?.secondaryColor || "#1e40af",
                    headerConfig: p.headerConfig || { links: [] },
                    footerConfig: {
                        description: p.footerConfig?.description || "",
                        links: p.footerConfig?.links || [],
                        social: p.footerConfig?.social || { facebook: "", instagram: "", twitter: "", linkedin: "" }
                    },
                    platforms: p.platforms || [],
                    logo: p.logo || "",
                    // Provide defaults for new fields if missing
                    serviceType: p.promptConfig?.serviceType || "",
                    areas: p.promptConfig?.areas || "",
                    serviceType: p.promptConfig?.serviceType || "",
                    areas: p.promptConfig?.areas || "",
                    ownerNames: p.promptConfig?.ownerNames || (p.promptConfig?.ownerName ? [p.promptConfig.ownerName] : []), // Migration fallback
                    languagePref: langArray,
                    subdomain: p.subdomain || "",
                    qr_token: p.qr_token || ""
                });
            }
        } catch (err) {
            console.log("No existing profile found");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // --- LANGUAGE HANDLER ---
    const handleLanguageChange = (lang) => {
        setProfile(prev => {
            const current = prev.languagePref || [];
            if (current.includes(lang)) {
                return { ...prev, languagePref: current.filter(l => l !== lang) };
            } else {
                return { ...prev, languagePref: [...current, lang] };
            }
        });
    };

    // --- LOGO UPLOAD HANDLER ---
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("File size too large. Please upload an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // --- CONFIG HANDLERS ---

    const handleHeaderLinkChange = (index, field, value) => {
        const newLinks = [...profile.headerConfig.links];
        newLinks[index][field] = value;
        setProfile({ ...profile, headerConfig: { ...profile.headerConfig, links: newLinks } });
    };

    const addHeaderLink = () => {
        if (profile.headerConfig.links.length >= 4) return;
        setProfile({
            ...profile,
            headerConfig: {
                ...profile.headerConfig,
                links: [...profile.headerConfig.links, { label: "Link", url: "#" }]
            }
        });
    };

    const removeHeaderLink = (index) => {
        const newLinks = profile.headerConfig.links.filter((_, i) => i !== index);
        setProfile({ ...profile, headerConfig: { ...profile.headerConfig, links: newLinks } });
    };

    // Footer Handlers
    const handleFooterConfigChange = (field, value) => {
        setProfile({ ...profile, footerConfig: { ...profile.footerConfig, [field]: value } });
    };

    const handleFooterLinkChange = (index, field, value) => {
        const newLinks = [...profile.footerConfig.links];
        newLinks[index][field] = value;
        setProfile({ ...profile, footerConfig: { ...profile.footerConfig, links: newLinks } });
    };

    const addFooterLink = () => {
        if (profile.footerConfig.links.length >= 6) return;
        setProfile({
            ...profile,
            footerConfig: {
                ...profile.footerConfig,
                links: [...profile.footerConfig.links, { label: "Link", href: "#" }]
            }
        });
    };

    const removeFooterLink = (index) => {
        const newLinks = profile.footerConfig.links.filter((_, i) => i !== index);
        setProfile({ ...profile, footerConfig: { ...profile.footerConfig, links: newLinks } });
    };

    const handleSocialChange = (network, value) => {
        setProfile({
            ...profile,
            footerConfig: {
                ...profile.footerConfig,
                social: { ...profile.footerConfig.social, [network]: value }
            }
        });
    };

    // --- PLATFORM MANAGER ---

    // Get list of available platforms (exclude ones already added, unless "other")
    const getAvailablePlatforms = (currentIndex) => {
        const addedPlatforms = profile.platforms.map(p => p.name).filter(n => n !== "Other");
        // Allow the current row's selection to remain visible
        const currentSelection = profile.platforms[currentIndex]?.name;

        return ALL_PLATFORM_OPTIONS.filter(opt => {
            if (opt.value === "other") return true;
            // Show if not added OR if it's the current selection
            return !addedPlatforms.includes(opt.label) || opt.label === currentSelection;
        });
    };

    const handlePlatformChange = (index, field, value) => {
        const newPlatforms = [...profile.platforms];
        newPlatforms[index][field] = value;
        setProfile({ ...profile, platforms: newPlatforms });
    };

    const addPlatform = () => {
        setProfile({
            ...profile,
            platforms: [...profile.platforms, { name: "", url: "" }]
        });
    };

    const removePlatform = (index) => {
        const newPlatforms = profile.platforms.filter((_, i) => i !== index);
        setProfile({ ...profile, platforms: newPlatforms });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");
        setSuccess("");

        // VALIDATIONS
        if (profile.platforms.length === 0) {
            setError("At least 1 review platform is required.");
            setIsSaving(false);
            return;
        }

        const invalidPlatform = profile.platforms.find(p => !p.url || p.url.trim() === "");
        if (invalidPlatform) {
            setError(`URL is required for ${invalidPlatform.name}`);
            setIsSaving(false);
            return;
        }

        try {
            // Convert language array back to CSV string
            const langString = Array.isArray(profile.languagePref) ? profile.languagePref.join(", ") : "English";

            const payload = {
                ...profile,
                languagePref: langString,
                theme: {
                    primaryColor: profile.primaryColor,
                    secondaryColor: profile.secondaryColor
                },
                promptConfig: {
                    serviceType: profile.serviceType,
                    areas: profile.areas,
                    ownerNames: profile.ownerNames || [] // Save array
                }
            };

            const res = await axios.post(
                `${backendUrl}/api/profile/save`,
                payload,
                { withCredentials: true }
            );
            setSuccess("Profile saved successfully!");
            if (res.data.slug) {
                setProfile(prev => ({ ...prev, slug: res.data.slug }));
            }
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    // --- STYLES ---
    const labelStyle = {
        fontWeight: 600,
        color: "#334155",
        marginBottom: 8,
        display: "block",
        fontSize: 14
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 16px", // Increased padding
        border: "1px solid #e2e8f0",
        borderRadius: 10, // Slightly more rounded
        fontSize: 15, // Larger font
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
        borderRadius: 20, // More rounded card
        padding: 32,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        border: "1px solid #f1f5f9",
        marginBottom: 24
    };

    const logoPreviewStyle = {
        width: 120, // Slightly larger
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

    return (
        <div style={{ padding: "32px", width: "100%", maxWidth: 1200, margin: '0 auto', paddingBottom: 140 }}>
            {/* Page Title */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: '-0.8px' }}>
                    Business Settings
                </h1>
                <p style={{ color: "#64748b", fontSize: 16, marginTop: 4 }}>
                    Customize your public review page and AI generation behavior.
                </p>
            </div>

            {isLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading profile...</div>
            ) : (
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

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
                                            {profile.logo ? (
                                                <img src={profile.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                    <IconPhoto size={32} stroke={1.5} />
                                                    <span style={{ display: 'block', fontSize: 12, marginTop: 4, fontWeight: 500 }}>Upload Logo</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                                        </label>
                                        {profile.logo && (
                                            <button type="button" onClick={() => setProfile({ ...profile, logo: '' })} style={{ fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Remove Logo</button>
                                        )}
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Business Name</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={profile.businessName}
                                            onChange={handleChange}
                                            placeholder="Landmark Properties"
                                            style={{ ...inputStyle, fontWeight: 500 }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Custom Subdomain</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <input
                                                    type="text"
                                                    name="subdomain"
                                                    value={profile.subdomain || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
                                                        handleChange({ target: { name: 'subdomain', value: val } });
                                                        // Reset status on change
                                                        if (profile.subdomainStatus) {
                                                            setProfile(prev => ({ ...prev, subdomainStatus: null }));
                                                        }
                                                    }}
                                                    placeholder="my-business"
                                                    maxLength={63}
                                                    style={{ ...inputStyle, fontWeight: 500, flex: 1 }}
                                                />
                                                <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>.bizease.com</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    {profile.subdomain && (
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                if (!profile.subdomain) return;
                                                                try {
                                                                    const res = await axios.get(`${backendUrl}/api/profile/check-subdomain/${profile.subdomain}`, { withCredentials: true });
                                                                    setProfile(prev => ({
                                                                        ...prev,
                                                                        subdomainStatus: res.data.available ? 'available' : 'taken'
                                                                    }));
                                                                } catch (e) {
                                                                    console.error(e);
                                                                }
                                                            }}
                                                            style={{ fontSize: 12, padding: '4px 10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', color: '#475569', fontWeight: 600 }}
                                                        >
                                                            Check Availability
                                                        </button>
                                                    )}
                                                    {profile.subdomainStatus === 'available' && (
                                                        <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            Available
                                                        </span>
                                                    )}
                                                    {profile.subdomainStatus === 'taken' && (
                                                        <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            Taken
                                                        </span>
                                                    )}
                                                </div>
                                                {profile.subdomain && (
                                                    <div style={{ fontSize: 12, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: 6 }}>
                                                        <span style={{ fontWeight: 600 }}>Preview:</span> https://{profile.subdomain}.bizease.com
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Primary Color (Header)</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', padding: 8, borderRadius: 10, background: '#fff' }}>
                                            <input
                                                type="color"
                                                name="primaryColor"
                                                value={profile.primaryColor}
                                                onChange={handleChange}
                                                style={{ width: 44, height: 44, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 6 }}
                                            />
                                            <span style={{ fontSize: 15, color: '#475569', fontFamily: 'monospace', fontWeight: 600 }}>{profile.primaryColor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Secondary Color (Accents)</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e2e8f0', padding: 8, borderRadius: 10, background: '#fff' }}>
                                            <input
                                                type="color"
                                                name="secondaryColor"
                                                value={profile.secondaryColor}
                                                onChange={handleChange}
                                                style={{ width: 44, height: 44, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 6 }}
                                            />
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
                                    <button
                                        type="button"
                                        onClick={addHeaderLink}
                                        disabled={profile.headerConfig.links.length >= 4}
                                        style={{
                                            fontSize: 13,
                                            color: profile.headerConfig.links.length >= 4 ? '#94a3b8' : ACCENT,
                                            background: profile.headerConfig.links.length >= 4 ? '#f1f5f9' : '#eff6ff',
                                            padding: '8px 16px',
                                            borderRadius: 20,
                                            border: 'none',
                                            cursor: profile.headerConfig.links.length >= 4 ? 'not-allowed' : 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        + Add Link
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                    {profile.headerConfig.links.map((link, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 10 }}>
                                            <input value={link.label} onChange={(e) => handleHeaderLinkChange(idx, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, flex: '0 0 200px', padding: '8px 12px', fontSize: 14 }} />
                                            <input value={link.url} onChange={(e) => handleHeaderLinkChange(idx, 'url', e.target.value)} placeholder="URL (e.g., https://example.com/about)" style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: 14 }} />
                                            <button type="button" onClick={() => removeHeaderLink(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><IconTrash size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                                {profile.headerConfig.links.length === 0 && <div style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic', padding: 20, textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 12 }}>No custom header links added yet.</div>}
                            </div>

                            {/* Footer Config */}
                            <div style={{ paddingTop: 20 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 20 }}>Footer & Contact Configuration</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 24 }}>
                                    <div>
                                        <label style={labelStyle}>Footer Tagline</label>
                                        <textarea
                                            value={profile.footerConfig.description}
                                            onChange={(e) => handleFooterConfigChange('description', e.target.value)}
                                            placeholder="Short description about your business..."
                                            rows={3}
                                            style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
                                            maxLength={150}
                                        />
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

                                <div style={{ marginBottom: 32 }}>
                                    <label style={labelStyle}>Social Media Links</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <IconBrandFacebook size={22} color="#3b5998" />
                                            <input placeholder="Facebook URL" value={profile.footerConfig.social.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} style={inputStyle} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <IconBrandInstagram size={22} color="#e1306c" />
                                            <input placeholder="Instagram URL" value={profile.footerConfig.social.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} style={inputStyle} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <IconBrandTwitter size={22} color="#1da1f2" />
                                            <input placeholder="Twitter/X URL" value={profile.footerConfig.social.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} style={inputStyle} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <IconBrandLinkedin size={22} color="#0077b5" />
                                            <input placeholder="LinkedIn URL" value={profile.footerConfig.social.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} style={inputStyle} />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Links Dynamic */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <label style={{ ...labelStyle, marginBottom: 0 }}>
                                            Footer Menu Links <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>({profile.footerConfig.links.length}/6)</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addFooterLink}
                                            disabled={profile.footerConfig.links.length >= 6}
                                            style={{
                                                fontSize: 13,
                                                color: profile.footerConfig.links.length >= 6 ? '#94a3b8' : ACCENT,
                                                background: profile.footerConfig.links.length >= 6 ? '#f1f5f9' : '#eff6ff',
                                                padding: '8px 16px',
                                                borderRadius: 20,
                                                border: 'none',
                                                cursor: profile.footerConfig.links.length >= 6 ? 'not-allowed' : 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            + Add Footer Link
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                        {profile.footerConfig.links.map((link, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                                <input value={link.label} onChange={(e) => handleFooterLinkChange(idx, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, flex: '0 0 200px' }} />
                                                <input value={link.href} onChange={(e) => handleFooterLinkChange(idx, 'href', e.target.value)} placeholder="URL" style={{ ...inputStyle, flex: 1 }} />
                                                <button type="button" onClick={() => removeFooterLink(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><IconTrash size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ================= SECTION 2: AI Details ================= */}
                    <div>
                        <h2 style={headingStyle}>
                            <span style={{ background: '#f0f9ff', color: '#0ea5e9', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 16, fontWeight: 700 }}>2</span>
                            AI Prompt Constraints & Platforms
                        </h2>

                        <div style={cardStyle}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }}>

                                {/* AI Config */}
                                <div>
                                    <label style={{ ...labelStyle, fontSize: 16, color: '#1e293b', marginBottom: 6 }}>AI Context Configuration</label>
                                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                                        These settings train the AI to write more accurate, personalized, and relevant responses for your business.
                                    </p>

                                    <div style={{ display: 'grid', gap: 24, background: '#f8fafc', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>

                                        {/* Business Category */}
                                        <div>
                                            <label style={{ fontSize: 13, color: '#334155', marginBottom: 6, display: 'block', fontWeight: 600 }}>
                                                Business Category
                                            </label>
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                                                Select the category that best describes your industry. This sets the baseline tone for the AI.
                                            </p>
                                            <select
                                                name="businessType"
                                                value={
                                                    !profile.businessType
                                                        ? ""
                                                        : (BUSINESS_TYPES.some(t => t.value === profile.businessType) && profile.businessType !== 'other')
                                                            ? profile.businessType
                                                            : 'other'
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setProfile({ ...profile, businessType: val });
                                                }}
                                                style={inputStyle}
                                            >
                                                <option value="">Select Category...</option>
                                                {BUSINESS_TYPES.map(type => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>

                                            {/* Custom Business Type Input */}
                                            {((profile.businessType === 'other') || (profile.businessType && !BUSINESS_TYPES.some(t => t.value === profile.businessType))) && (
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Digital Marketing Agency, Boutique Hotel, Dental Clinic"
                                                    value={profile.businessType === 'other' ? '' : profile.businessType}
                                                    onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                                                    style={{ ...inputStyle, marginTop: 12, borderColor: '#3b82f6', background: '#eff6ff' }}
                                                />
                                            )}
                                        </div>

                                        {/* Key Team Members */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <label style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>Key Team Members / Owners</label>
                                                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                                    {(profile.ownerNames || []).length}/5
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                                                Add names of people often mentioned in reviews (e.g., Dr. Smith, Chef Mario). The AI will recognize them.
                                            </p>
                                            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                                <input
                                                    type="text"
                                                    id="newOwnerInput"
                                                    placeholder="e.g. Dr. Emily Carter"
                                                    style={{ ...inputStyle, flex: 1 }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = e.target.value.trim();
                                                            if (val && (!profile.ownerNames || profile.ownerNames.length < 5)) {
                                                                const current = profile.ownerNames || [];
                                                                if (!current.includes(val)) {
                                                                    setProfile({ ...profile, ownerNames: [...current, val] });
                                                                    e.target.value = '';
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const input = document.getElementById('newOwnerInput');
                                                        const val = input.value.trim();
                                                        if (val && (!profile.ownerNames || profile.ownerNames.length < 5)) {
                                                            const current = profile.ownerNames || [];
                                                            if (!current.includes(val)) {
                                                                setProfile({ ...profile, ownerNames: [...current, val] });
                                                                input.value = '';
                                                            }
                                                        }
                                                    }}
                                                    disabled={profile.ownerNames && profile.ownerNames.length >= 5}
                                                    style={{
                                                        background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 600, cursor: 'pointer',
                                                        opacity: profile.ownerNames && profile.ownerNames.length >= 5 ? 0.5 : 1
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {(profile.ownerNames || []).map((name, idx) => (
                                                    <div key={idx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: 20, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        {name}
                                                        <span
                                                            onClick={() => {
                                                                const newNames = profile.ownerNames.filter((_, i) => i !== idx);
                                                                setProfile({ ...profile, ownerNames: newNames });
                                                            }}
                                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.6, hover: { opacity: 1 } }}
                                                        >
                                                            <IconTrash size={14} />
                                                        </span>
                                                    </div>
                                                ))}
                                                {(!profile.ownerNames || profile.ownerNames.length === 0) && (
                                                    <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>No names added yet.</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Service Type / Niche */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <label style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>Primary Services & Niche</label>
                                                <span style={{ fontSize: 12, color: profile.serviceType?.length >= 1000 ? '#ef4444' : '#94a3b8' }}>
                                                    {profile.serviceType?.length || 0}/1000
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                                                List your main offerings. This ensures the AI highlights your specific strengths in responses.
                                            </p>
                                            <textarea
                                                name="serviceType"
                                                value={profile.serviceType}
                                                onChange={handleChange}
                                                placeholder="e.g. Fine Dining, Luxury Homes, Implant Dentistry, 24/7 Emergency Service"
                                                maxLength={1000}
                                                rows={3}
                                                style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
                                            />
                                        </div>

                                        {/* Areas */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <label style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>Target Locations & Neighborhoods</label>
                                                <span style={{ fontSize: 12, color: profile.areas?.length >= 1000 ? '#ef4444' : '#94a3b8' }}>
                                                    {profile.areas?.length || 0}/1000
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                                                Specify the areas you serve. The AI will mention these to boost local relevance.
                                            </p>
                                            <textarea
                                                name="areas"
                                                value={profile.areas}
                                                onChange={handleChange}
                                                placeholder="e.g. Downtown, Westside, Sector 45, Greater London, MG Road"
                                                maxLength={1000}
                                                rows={3}
                                                style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
                                            />
                                        </div>

                                        {/* Keywords (Optional) */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <label style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>Brand Voice & Focus Keywords (Optional)</label>
                                                <span style={{ fontSize: 12, color: profile.keywords?.length >= 1500 ? '#ef4444' : '#94a3b8' }}>
                                                    {profile.keywords?.length || 0}/1500
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                                                Words you want the AI to emphasize in generated responses. Helps align with your brand voice.
                                            </p>
                                            <textarea
                                                name="keywords"
                                                value={profile.keywords}
                                                onChange={handleChange}
                                                placeholder="e.g. Professional, Affordable, Family-owned, Trusted, Innovation, Customer-first"
                                                maxLength={1500}
                                                rows={4}
                                                style={{ ...inputStyle, resize: 'none' }}
                                            />
                                            <small style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                                                Comma-separated words to include in AI-generated reviews
                                            </small>
                                        </div>

                                        {/* Multi-Select Review Language */}
                                        <div>
                                            <label style={{ fontSize: 13, color: '#64748b', marginBottom: 8, display: 'block', fontWeight: 600 }}>Review Language(s)</label>
                                            <div style={checkboxContainerStyle}>
                                                {["English", "Hindi", "Hinglish"].map(lang => (
                                                    <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 15, color: '#334155', fontWeight: 500 }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={profile.languagePref && profile.languagePref.includes(lang)}
                                                            onChange={() => handleLanguageChange(lang)}
                                                            style={{ width: 18, height: 18, accentColor: ACCENT, cursor: 'pointer' }}
                                                        />
                                                        {lang}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <label style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Short Context / Description</label>
                                                <span style={{ fontSize: 12, color: profile.description?.length >= 500 ? '#ef4444' : '#94a3b8' }}>
                                                    {profile.description?.length || 0}/500
                                                </span>
                                            </div>
                                            <textarea
                                                name="description"
                                                value={profile.description}
                                                onChange={handleChange}
                                                placeholder="E.g. We are known for fast service and polite staff..."
                                                rows={6}
                                                maxLength={500}
                                                style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Platforms */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <label style={{ ...labelStyle, fontSize: 16, color: '#1e293b', marginBottom: 0 }}>Connected Platforms</label>
                                        <button type="button" onClick={addPlatform} style={{ fontSize: 14, color: '#fff', background: '#0f172a', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                            <IconPlus size={18} /> Add Platform
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gap: 20 }}>
                                        {profile.platforms.map((platform, index) => (
                                            <div key={index} style={{ border: '1px solid #e2e8f0', padding: 20, borderRadius: 16, display: 'flex', gap: 20, alignItems: 'center', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                                                <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                    <IconStar size={24} />
                                                </div>
                                                <div style={{ flex: 1, display: 'grid', gap: 12 }}>
                                                    <div style={{ display: 'flex', gap: 16 }}>
                                                        {/* Platform Select */}
                                                        <select
                                                            value={platform.name}
                                                            onChange={(e) => handlePlatformChange(index, "name", e.target.value)}
                                                            style={{ ...inputStyle, width: 180, padding: '10px 14px' }}
                                                        >
                                                            <option value="">Select...</option>
                                                            {getAvailablePlatforms(index).map(opt => (
                                                                <option key={opt.value} value={opt.label}>{opt.label}</option>
                                                            ))}
                                                        </select>

                                                        {/* URL Input */}
                                                        <input
                                                            type="text"
                                                            value={platform.url}
                                                            onChange={(e) => handlePlatformChange(index, "url", e.target.value)}
                                                            placeholder="Paste review link here (https://...)"
                                                            style={{ ...inputStyle, flex: 1 }}
                                                        />
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removePlatform(index)} style={{ border: 'none', color: '#94a3b8', background: 'none', cursor: 'pointer', padding: 10, transition: 'color 0.2s' }} title="Remove">
                                                    <IconTrash size={22} />
                                                </button>
                                            </div>
                                        ))}
                                        {profile.platforms.length === 0 && <div style={{ fontSize: 15, color: '#64748b', textAlign: 'center', padding: 40, background: '#f8fafc', borderRadius: 16, border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                            <IconWorld size={32} stroke={1.5} color="#94a3b8" />
                                            <span>No platforms connected. Add at least one to generate reviews.</span>
                                        </div>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* FLOATING ACTION BAR */}
                    <div style={{ position: 'sticky', bottom: 20, background: '#fff', padding: '16px 24px', borderRadius: 16, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {profile.slug && (
                                <div style={{ fontSize: 13, color: '#64748b', background: '#f1f5f9', padding: '6px 12px', borderRadius: 20 }}>
                                    <span style={{ fontWeight: 600, color: '#475569' }}>Unique Slug:</span> {profile.slug}
                                </div>
                            )}
                            {success && <span style={{ color: "#059669", fontWeight: 600, fontSize: 14, paddingLeft: 10 }}>{success}</span>}
                            {error && <span style={{ color: "#dc2626", fontWeight: 600, fontSize: 14, paddingLeft: 10 }}>{error}</span>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{
                                padding: "12px 32px",
                                background: isSaving ? '#94a3b8' : '#0f172a',
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 15,
                                border: "none",
                                borderRadius: 10,
                                cursor: isSaving ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                </form>
            )}
        </div>
    );
};

export default BusinessProfile;
