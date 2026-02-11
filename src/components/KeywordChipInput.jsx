import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IconX, IconSearch } from "@tabler/icons-react";

const KeywordChipInput = ({
    value = [],
    onChange,
    businessType = "other",
    businessName = "",
    city = "",
    serviceType = "",
    placeholder = "Type and press Enter or comma to add...",
    maxKeywords = 20
}) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState("");
    const editInputRef = useRef(null);

    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    const backendUrl = import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_BACKEND_PROD
        : import.meta.env.VITE_BACKEND_DEV;

    // Fetch suggestions from backend API
    const fetchSuggestions = async (query = "") => {
        try {
            const params = new URLSearchParams({
                q: query,
                businessType: businessType || 'other',
                businessName: businessName || '',
                city: city || '',
                serviceType: serviceType || ''
            });

            const res = await axios.get(
                `${backendUrl}/api/keywords/suggestions?${params.toString()}`,
                { withCredentials: true }
            );

            if (Array.isArray(res.data)) {
                // Filter out already selected keywords
                return res.data.filter(kw => !value.includes(kw));
            }
            return [];
        } catch (err) {
            console.error("Keyword fetch error:", err);
            return [];
        }
    };

    // Handle input change with debounced suggestions
    const handleInputChange = (e) => {
        const val = e.target.value;

        // Check for comma - add keyword immediately
        if (val.includes(',')) {
            const parts = val.split(',');
            const keyword = parts[0].trim();
            if (keyword && !value.includes(keyword.toLowerCase())) {
                addKeyword(keyword);
            }
            setInputValue(parts.slice(1).join(',').trim());
            return;
        }

        setInputValue(val);

        // Debounced suggestion fetch from API
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            const newSuggestions = await fetchSuggestions(val);
            setSuggestions(newSuggestions);
            setShowDropdown(true);
            setIsLoading(false);
        }, 200);
    };

    // Add a keyword
    const addKeyword = (keyword) => {
        const trimmed = keyword.trim().toLowerCase();
        if (trimmed && !value.includes(trimmed) && value.length < maxKeywords) {
            onChange([...value, trimmed]);
            setInputValue("");
            setShowDropdown(false);
        }
    };

    // Remove a keyword
    const removeKeyword = (index) => {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
    };

    // Handle keydown
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addKeyword(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            // Remove last keyword on backspace when input is empty
            removeKeyword(value.length - 1);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    // Handle focus - fetch suggestions from API
    const handleFocus = async () => {
        setIsLoading(true);
        const newSuggestions = await fetchSuggestions(inputValue);
        setSuggestions(newSuggestions);
        setShowDropdown(true);
        setIsLoading(false);
    };

    // Handle editing a chip
    const startEditing = (index) => {
        setEditingIndex(index);
        setEditValue(value[index]);
        setTimeout(() => editInputRef.current?.focus(), 0);
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const trimmed = editValue.trim();
            if (trimmed) {
                // Update specific index
                const newValue = [...value];
                newValue[editingIndex] = trimmed;
                onChange(newValue);
            } else {
                // Remove if empty
                removeKeyword(editingIndex);
            }
            setEditingIndex(null);
            setEditValue("");
        }
    };

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            setEditingIndex(null); // Cancel
        }
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Styles
    const containerStyle = {
        position: 'relative',
        width: '100%'
    };

    const inputContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: '10px 14px',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        background: '#fff',
        minHeight: 48,
        cursor: 'text',
        transition: 'border-color 0.2s'
    };

    const chipStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#e0f2fe',
        color: '#0369a1',
        padding: '4px 10px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 500
    };

    const removeButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.2s'
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        flex: 1,
        minWidth: 150,
        fontSize: 14,
        background: 'transparent',
        color: '#0f172a'
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        marginTop: 4,
        maxHeight: 240,
        overflowY: 'auto'
    };

    const suggestionItemStyle = {
        padding: '10px 14px',
        cursor: 'pointer',
        fontSize: 14,
        color: '#334155',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: 8
    };

    const helperTextStyle = {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 4
    };

    return (
        <div style={containerStyle}>
            <div
                style={inputContainerStyle}
                onClick={() => {
                    if (editingIndex === null) inputRef.current?.focus();
                }}
            >
                {value.map((keyword, index) => (
                    <div key={index} style={chipStyle}>
                        {editingIndex === index ? (
                            <input
                                ref={editInputRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={handleEditKeyDown}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: '#0369a1',
                                    width: `${Math.max(editValue.length * 8, 40)}px`,
                                    minWidth: 40
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEditing(index);
                                }}
                                style={{ cursor: 'text' }}
                                title="Click to edit"
                            >
                                {keyword}
                            </span>
                        )}
                        {editingIndex !== index && (
                            <span
                                style={removeButtonStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeKeyword(index);
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                            >
                                <IconX size={14} />
                            </span>
                        )}
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={value.length >= maxKeywords ? `Limit reached (${maxKeywords})` : (value.length === 0 ? placeholder : "Add more...")}
                    style={{ ...inputStyle, opacity: value.length >= maxKeywords ? 0.5 : 1 }}
                    disabled={editingIndex !== null || value.length >= maxKeywords}
                />
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <div ref={dropdownRef} style={dropdownStyle}>
                    <div style={{ padding: '8px 14px', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {isLoading ? 'Loading...' : (inputValue ? 'Suggestions' : `Popular for ${businessType || 'your business'}`)}
                    </div>
                    {suggestions.map((suggestion, idx) => (
                        <div
                            key={idx}
                            style={suggestionItemStyle}
                            onClick={() => addKeyword(suggestion)}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                        >
                            <IconSearch size={14} style={{ opacity: 0.4 }} />
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div style={helperTextStyle}>
                    Type & press <strong style={{ margin: '0 2px', color: '#64748b' }}>Enter</strong> to add • Click any chip to <strong style={{ margin: '0 2px', color: '#64748b' }}>Edit</strong> • Backspace to remove
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: value.length >= maxKeywords ? '#dc2626' : '#94a3b8' }}>
                    {value.length}/{maxKeywords} keywords {value.length >= maxKeywords ? '• Limit reached' : ''}
                </div>
            </div>
        </div>
    );
};

export default KeywordChipInput;
